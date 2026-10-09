import { getDb } from './indexedDb';
import { hydrateRemediesCatalog } from './indexedDbHydration';
import { sqliteClient } from '../workers/sqliteDatabaseClient';
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

export async function getLocalChapters(
  repertoryId?: string,
  searchQuery?: string
): Promise<Chapter[]> {
  if (sqliteClient.isReady()) {
    try {
      const live = await sqliteClient.getChapters(repertoryId, searchQuery);
      if (live.length > 0) return live;
    } catch (err) {
      console.warn('[getLocalChapters] SQLite query failed, falling back to IndexedDB:', err);
    }
  }
  const db = await getDb();
  const list = await db.getAllFromIndex('chapters', 'byOrder');
  const sorted = list.sort((a, b) => a.displayOrder - b.displayOrder);
  let filtered = sorted;
  if (repertoryId && repertoryId !== 'rep-kent') {
    const scoped = sorted.filter((c) => !c.repertoryId || c.repertoryId === repertoryId);
    if (scoped.length > 0) filtered = scoped;
  }

  const cleanQuery = (searchQuery || '').trim();
  if (!cleanQuery) return filtered;

  try {
    const rubrics = await db.getAll('rubrics');
    const q = cleanQuery.toLowerCase();
    const hitsMap = new Map<string, number>();
    for (const r of rubrics) {
      if (
        r.fullPath.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q)
      ) {
        hitsMap.set(r.chapterId, (hitsMap.get(r.chapterId) || 0) + 1);
      }
    }
    return filtered.map((c) => ({
      ...c,
      rubricCount: hitsMap.get(c.id) || 0,
    }));
  } catch {
    return filtered;
  }
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
  if (sqliteClient.isReady()) {
    try {
      const res = await sqliteClient.getRubricChildren(parentId);
      if (res && res.length > 0) return res;
    } catch (err) {
      console.warn('[getLocalRubricChildren] SQLite query failed, falling back to IndexedDB:', err);
    }
  }

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
  chapterId?: string,
  repertoryId?: string
): Promise<Rubric[]> {
  if (sqliteClient.isReady()) {
    try {
      return await sqliteClient.searchRubrics(query, chapterId, repertoryId);
    } catch (err) {
      console.warn('[searchLocalRubrics] SQLite query failed, falling back to IndexedDB:', err);
    }
  }

  const db = await getDb();
  let rubrics: Rubric[];

  if (chapterId) {
    rubrics = await db.getAllFromIndex('rubrics', 'byChapter', chapterId);
  } else {
    rubrics = await db.getAll('rubrics');
  }

  if (repertoryId && repertoryId !== 'rep-kent') {
    const scoped = rubrics.filter((r) => r.repertoryId === repertoryId);
    if (scoped.length > 0) {
      rubrics = scoped;
    }
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

export async function getRubricsByIds(rubricIds: string[]): Promise<Rubric[]> {
  if (rubricIds.length === 0) return [];
  if (sqliteClient.isReady()) {
    try {
      const results = await sqliteClient.getRubricsByIds(rubricIds);
      if (results.length > 0) return results;
    } catch (err) {
      console.warn('[getRubricsByIds] SQLite query failed, falling back to IndexedDB:', err);
    }
  }

  const db = await getDb();
  const list: Rubric[] = [];
  for (const id of rubricIds) {
    const r = await db.get('rubrics', id);
    if (r) list.push(r);
  }
  return list;
}

