import { getDb } from './indexedDb';
import { hydrateRemediesCatalog } from './indexedDbHydration';
import type {
  Chapter,
  Remedy,
  RemedyKingdom,
  ThermalState,
  MiasmType,
  Rubric,
  RepertoryCatalogItem,
} from '@/features/repertory/types';

export interface RemedyFilterParams {
  query?: string;
  kingdom?: RemedyKingdom;
  thermal?: ThermalState;
  miasm?: MiasmType;
  isPolychrest?: boolean;
  limit?: number;
  offset?: number;
}

export async function getLocalRepertories(): Promise<RepertoryCatalogItem[]> {
  const db = await getDb();
  if (db.objectStoreNames.contains('repertories')) {
    return db.getAll('repertories');
  }
  return [];
}

export async function getLocalRepertoriesByCategory(
  category: string
): Promise<RepertoryCatalogItem[]> {
  const db = await getDb();
  if (db.objectStoreNames.contains('repertories')) {
    return db.getAllFromIndex('repertories', 'byCategory', category);
  }
  return [];
}

export async function getLocalChapters(): Promise<Chapter[]> {
  const db = await getDb();
  const list = await db.getAllFromIndex('chapters', 'byOrder');
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getLocalRemedies(): Promise<Remedy[]> {
  const db = await getDb();
  await hydrateRemediesCatalog(db);
  return db.getAll('remedies');
}

/**
 * High-performance search and filtering across the full 3,400+ remedy catalog in IndexedDB.
 */
export async function searchLocalRemedies(
  params: RemedyFilterParams = {}
): Promise<Remedy[]> {
  const db = await getDb();
  await hydrateRemediesCatalog(db);
  let remedies: Remedy[];

  if (params.kingdom) {
    remedies = await db.getAllFromIndex('remedies', 'byKingdom', params.kingdom);
  } else {
    remedies = await db.getAll('remedies');
  }

  let filtered = remedies;

  if (params.thermal) {
    filtered = filtered.filter((r) => r.thermal === params.thermal);
  }

  if (params.miasm) {
    filtered = filtered.filter((r) => r.miasm === params.miasm);
  }

  if (params.isPolychrest !== undefined) {
    filtered = filtered.filter((r) => r.isPolychrest === params.isPolychrest);
  }

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.abbreviation.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        (r.commonName && r.commonName.toLowerCase().includes(q))
    );
  }

  const offset = params.offset || 0;
  const limit = params.limit !== undefined ? params.limit : filtered.length;

  return filtered.slice(offset, offset + limit);
}

export async function getLocalRubricsByChapter(chapterId: string): Promise<Rubric[]> {
  const db = await getDb();
  return db.getAllFromIndex('rubrics', 'byChapter', chapterId);
}

export async function getLocalRubricChildren(parentId: string): Promise<Rubric[]> {
  const db = await getDb();
  try {
    return await db.getAllFromIndex('rubrics', 'byParent', parentId);
  } catch {
    const all = await db.getAll('rubrics');
    return all.filter((r) => r.parentId === parentId);
  }
}

export async function searchLocalRubrics(
  query: string,
  chapterId?: string
): Promise<Rubric[]> {
  const db = await getDb();
  let rubrics: Rubric[];

  if (chapterId) {
    rubrics = await db.getAllFromIndex('rubrics', 'byChapter', chapterId);
  } else {
    rubrics = await db.getAll('rubrics');
  }

  if (!query.trim()) {
    return rubrics;
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  return rubrics.filter((r) => {
    const target = `${r.chapterName} ${r.path} ${r.fullPath}`.toLowerCase();
    return terms.every((term) => target.includes(term));
  });
}
