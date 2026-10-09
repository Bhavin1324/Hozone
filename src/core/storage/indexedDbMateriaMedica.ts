import { getDb } from './indexedDb';
import { sqliteClient } from '../workers/sqliteDatabaseClient';
import type {
  MateriaMedicaBook,
  RemedyMonograph,
  RemedyRelationship,
} from '@/features/materia-medica/types';

export async function getLocalBooks(category?: string): Promise<MateriaMedicaBook[]> {
  const db = await getDb();
  const all = await db.getAll('books');
  if (!category) return all;
  return all.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
}

export async function getLocalMonograph(
  remedyId: string,
  bookId?: string
): Promise<RemedyMonograph | undefined> {
  if (sqliteClient.isReady()) {
    try {
      const mono = await sqliteClient.getMonograph(remedyId, bookId);
      if (mono) return mono;
    } catch (err) {
      console.warn('[getLocalMonograph] SQLite query failed, falling back to IndexedDB:', err);
    }
  }

  const db = await getDb();
  if (bookId) {
    return db.getFromIndex('monographs', 'byRemedyAndBook', [remedyId, bookId]);
  }
  const allForRemedy = await db.getAllFromIndex('monographs', 'byRemedy', remedyId);
  if (allForRemedy.length === 0) return undefined;
  return allForRemedy.find((m) => m.bookId === 'book-boericke') || allForRemedy[0];
}

export async function getLocalMonographsByRemedy(remedyId: string): Promise<RemedyMonograph[]> {
  const db = await getDb();
  return db.getAllFromIndex('monographs', 'byRemedy', remedyId);
}

export async function getLocalMonographs(
  remedyIds: string[],
  bookId?: string
): Promise<RemedyMonograph[]> {
  const db = await getDb();
  const results: RemedyMonograph[] = [];
  for (const id of remedyIds) {
    const item = bookId
      ? await db.getFromIndex('monographs', 'byRemedyAndBook', [id, bookId])
      : await db.getFromIndex('monographs', 'byRemedy', id);
    if (item) results.push(item);
  }
  return results;
}

export async function getAllLocalMonographs(): Promise<RemedyMonograph[]> {
  const db = await getDb();
  return db.getAll('monographs');
}

export async function getLocalRelationships(remedyId: string): Promise<RemedyRelationship[]> {
  const db = await getDb();
  const direct = await db.getAllFromIndex('relationships', 'byPrimary', remedyId);
  const inverse = await db.getAllFromIndex('relationships', 'byRelated', remedyId);

  const map = new Map<string, RemedyRelationship>();
  for (const r of [...direct, ...inverse]) {
    map.set(r.id, r);
  }
  return Array.from(map.values());
}

export async function searchMateriaMedica(query: string): Promise<RemedyMonograph[]> {
  const db = await getDb();
  const allMonographs = await db.getAll('monographs');

  if (!query.trim()) {
    return allMonographs;
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  return allMonographs.filter((m) => {
    const haystack = `${m.abbreviation} ${m.fullName} ${m.keynotes} ${m.mind} ${m.physicalGenerals} ${m.modalitiesAgg.join(' ')} ${m.modalitiesAmel.join(' ')} ${m.comparisons || ''} ${(m.clinicalIndications || []).join(' ')}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
