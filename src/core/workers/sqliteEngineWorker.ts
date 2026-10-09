import initSqlJs, { type Database } from 'sql.js';
import type {
  ActiveCaseRubric,
  Chapter,
  CombinedRubric,
  FilterCriteria,
  RepertorizationComputeOutput,
  RepertorizationResultItem,
  Rubric,
  Remedy,
  ScoringModel,
} from '@/features/repertory/types';
import type { RemedyMonograph } from '@/features/materia-medica/types';
import {
  type SqliteWorkerMessage,
  type SqliteWorkerResponse,
  type GetChaptersPayload,
  type RubricSqlRow,
  type RubricEntrySqlRow,
  type RepertoryEntryRemedySqlRow,
  type MonographSqlRow,
  mapRubricRow,
  mapMonographRow,
} from './sqliteEngineTypes';
import { loadOrDownloadDatabase, WASM_URL } from './sqliteLoader';

export type { SqliteWorkerMessage, SqliteWorkerResponse };

let db: Database | null = null;
let isInitializing = false;
let isReady = false;

function sendProgress(
  status: 'downloading' | 'decompressing' | 'mounting' | 'ready',
  progressPercent: number
): void {
  self.postMessage({
    type: 'PROGRESS',
    status,
    progressPercent,
  } as SqliteWorkerResponse);
}

async function initializeDatabase(): Promise<void> {
  if (isReady || isInitializing) return;
  isInitializing = true;

  try {
    const rawBuffer = await loadOrDownloadDatabase(sendProgress);
    sendProgress('mounting', 95);

    const SQL = await initSqlJs({
      locateFile: () => WASM_URL,
    });

    db = new SQL.Database(new Uint8Array(rawBuffer));
    isReady = true;
    isInitializing = false;

    sendProgress('ready', 100);
  } catch (err: unknown) {
    console.error('[SqliteEngineWorker] Failed to initialize database:', err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    isInitializing = false;
    self.postMessage({
      type: 'ERROR',
      error: errorMsg || 'Failed to initialize SQLite WebAssembly database',
    } as SqliteWorkerResponse);
  }
}

function handleSearchRubrics(payload: {
  query?: string;
  chapterId?: string;
  repertoryId?: string;
  limit?: number;
  offset?: number;
}): Rubric[] {
  if (!db) return [];

  const query = (payload.query || '').trim();
  const chapterId = payload.chapterId || null;
  const repertoryId = payload.repertoryId || null;
  const limit = payload.limit || (chapterId && !query ? 100 : 50);
  const offset = payload.offset || 0;

  const sql = `
    SELECT r.id, r.chapter_id, c.name as chapter_name, r.repertory_id, r.parent_id,
           r.path, r.full_path, r.depth, r.remedy_count, r.cross_references
    FROM rubrics r
    JOIN chapters c ON c.id = r.chapter_id
    WHERE (:chapterId IS NULL OR r.chapter_id = :chapterId)
      AND (
        :repertoryId IS NULL
        OR r.repertory_id = :repertoryId
        OR (NOT EXISTS (SELECT 1 FROM rubrics WHERE repertory_id = :repertoryId) AND r.repertory_id = 'rep-kent')
      )
      AND (:query = '' OR r.full_path LIKE :pattern OR r.path LIKE :pattern)
    ORDER BY r.depth ASC, r.full_path ASC
    LIMIT :limit OFFSET :offset;
  `;

  const stmt = db.prepare(sql);
  stmt.bind({
    ':chapterId': chapterId,
    ':repertoryId': repertoryId,
    ':query': query,
    ':pattern': `%${query}%`,
    ':limit': limit,
    ':offset': offset,
  });

  const rubrics: Rubric[] = [];
  while (stmt.step()) {
    rubrics.push(mapRubricRow(stmt.getAsObject() as unknown as RubricSqlRow));
  }
  stmt.free();

  attachRubricEntries(rubrics);
  return rubrics;
}

function attachRubricEntries(rubrics: Rubric[]): void {
  if (!db || rubrics.length === 0) return;
  const placeholders = rubrics.map(() => '?').join(',');
  const stmt = db.prepare(`
    SELECT re.rubric_id, re.remedy_id, rem.abbreviation, re.grade
    FROM rubric_entries re
    JOIN remedies rem ON rem.id = re.remedy_id
    WHERE re.rubric_id IN (${placeholders})
    ORDER BY re.grade DESC, rem.abbreviation ASC;
  `);
  stmt.bind(rubrics.map((r) => r.id));
  const rubMap = new Map<string, Rubric>();
  for (const r of rubrics) {
    r.entries = [];
    rubMap.set(r.id, r);
  }
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as RubricEntrySqlRow & { rubric_id: string };
    const rub = rubMap.get(row.rubric_id);
    if (rub) {
      rub.entries.push({
        remedyId: row.remedy_id,
        abbreviation: row.abbreviation,
        grade: Number(row.grade) as 1 | 2 | 3 | 4,
      });
    }
  }
  stmt.free();
}

function handleGetRubricChildren(parentId: string): Rubric[] {
  if (!db) return [];
  const stmt = db.prepare(`
    SELECT r.id, r.chapter_id, c.name as chapter_name, r.repertory_id, r.parent_id,
           r.path, r.full_path, r.depth, r.remedy_count, r.cross_references
    FROM rubrics r
    JOIN chapters c ON c.id = r.chapter_id
    WHERE r.parent_id = :parentId
    ORDER BY r.full_path ASC;
  `);
  stmt.bind({ ':parentId': parentId });

  const rubrics: Rubric[] = [];
  while (stmt.step()) {
    rubrics.push(mapRubricRow(stmt.getAsObject() as unknown as RubricSqlRow));
  }
  stmt.free();
  attachRubricEntries(rubrics);
  return rubrics;
}

function handleGetChapters(repertoryId?: string, searchQuery?: string): Chapter[] {
  if (!db) return [];
  const cleanQuery = (searchQuery || '').trim();

  // If a search query is active, count matching rubrics per chapter (Homepath Zomeo parity)
  const sql = cleanQuery
    ? `
      SELECT c.id, c.repertory_id, c.name, c.display_order, c.icon,
             COUNT(r.id) as rubric_count
      FROM chapters c
      LEFT JOIN rubrics r ON r.chapter_id = c.id
        AND (
          :repertoryId IS NULL
          OR r.repertory_id = :repertoryId
          OR (NOT EXISTS (SELECT 1 FROM rubrics WHERE repertory_id = :repertoryId) AND r.repertory_id = 'rep-kent')
        )
        AND (r.full_path LIKE :pattern OR r.path LIKE :pattern)
      WHERE (:repertoryId IS NULL OR c.repertory_id = :repertoryId OR c.repertory_id = 'rep-kent')
      GROUP BY c.id
      ORDER BY c.display_order ASC;
    `
    : `
      SELECT id, repertory_id, name, display_order, icon, rubric_count
      FROM chapters
      WHERE (:repertoryId IS NULL OR repertory_id = :repertoryId OR repertory_id = 'rep-kent')
      ORDER BY display_order ASC;
    `;

  const stmt = db.prepare(sql);
  if (cleanQuery) {
    stmt.bind({
      ':repertoryId': repertoryId || null,
      ':pattern': `%${cleanQuery}%`,
    });
  } else {
    stmt.bind({ ':repertoryId': repertoryId || null });
  }

  const chapters: Chapter[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as {
      id: string;
      repertory_id: string;
      name: string;
      display_order: number;
      icon: string;
      rubric_count: number;
    };
    chapters.push({
      id: row.id,
      repertoryId: row.repertory_id,
      name: row.name,
      displayOrder: Number(row.display_order),
      icon: row.icon,
      rubricCount: Number(row.rubric_count),
    });
  }
  stmt.free();
  return chapters;
}

function handleGetRubricsByIds(rubricIds: string[]): Rubric[] {
  if (!db || rubricIds.length === 0) return [];
  const placeholders = rubricIds.map(() => '?').join(',');
  const sql = `
    SELECT r.id, r.chapter_id, c.name as chapter_name, r.repertory_id, r.parent_id,
           r.path, r.full_path, r.depth, r.remedy_count, r.cross_references
    FROM rubrics r
    JOIN chapters c ON c.id = r.chapter_id
    WHERE r.id IN (${placeholders});
  `;
  const stmt = db.prepare(sql);
  stmt.bind(rubricIds);
  const rubrics: Rubric[] = [];
  while (stmt.step()) {
    rubrics.push(mapRubricRow(stmt.getAsObject() as unknown as RubricSqlRow));
  }
  stmt.free();
  attachRubricEntries(rubrics);
  return rubrics;
}

function handleExecuteRepertorization(payload: {
  activeRubrics: ActiveCaseRubric[];
  filters: FilterCriteria;
  scoringModel: ScoringModel;
  combinedRubrics?: CombinedRubric[];
}): RepertorizationComputeOutput {
  const start = performance.now();
  if (!db || !payload.activeRubrics || payload.activeRubrics.length === 0) {
    return {
      rankedRemedies: [],
      benchmarkMs: Number((performance.now() - start).toFixed(2)),
      totalEvaluated: 0,
      qualifyingCount: 0,
    };
  }

  const rubricIds = payload.activeRubrics.map((r) => r.rubricId);
  const weightMap = new Map<string, number>();
  const eliminatingIds = new Set<string>();

  for (const ar of payload.activeRubrics) {
    weightMap.set(ar.rubricId, ar.weight || 1);
    if (ar.isEliminating) eliminatingIds.add(ar.rubricId);
  }

  const placeholders = rubricIds.map(() => '?').join(',');
  const sql = `
    SELECT re.rubric_id, re.remedy_id, re.grade,
           rem.abbreviation, rem.full_name, rem.common_name,
           rem.kingdom, rem.thermal, rem.miasm, rem.is_polychrest, rem.short_keynotes
    FROM rubric_entries re
    JOIN remedies rem ON rem.id = re.remedy_id
    WHERE re.rubric_id IN (${placeholders})
  `;

  const stmt = db.prepare(sql);
  stmt.bind(rubricIds);

  const remedyMap = new Map<
    string,
    {
      remedy: Remedy;
      coverageCount: number;
      totalScore: number;
      grades: Record<string, number>;
    }
  >();

  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as RepertoryEntryRemedySqlRow;
    const remedyId = row.remedy_id;

    if (!remedyMap.has(remedyId)) {
      remedyMap.set(remedyId, {
        remedy: {
          id: row.remedy_id,
          abbreviation: row.abbreviation,
          fullName: row.full_name,
          commonName: row.common_name,
          kingdom: row.kingdom,
          thermal: row.thermal,
          miasm: row.miasm,
          isPolychrest: Boolean(row.is_polychrest),
          shortKeynotes: row.short_keynotes,
        },
        coverageCount: 0,
        totalScore: 0,
        grades: {},
      });
    }

    const item = remedyMap.get(remedyId)!;
    const grade = Number(row.grade);
    const weight = weightMap.get(row.rubric_id) || 1;

    item.grades[row.rubric_id] = grade;
    item.coverageCount += 1;
    item.totalScore += grade * weight;
  }
  stmt.free();

  // Merge synthetic entries from combined rubrics
  if (payload.combinedRubrics && payload.combinedRubrics.length > 0) {
    for (const comb of payload.combinedRubrics) {
      const weight = weightMap.get(comb.id) || 1;
      for (const entry of comb.entries) {
        const item = remedyMap.get(entry.remedyId);
        if (item) {
          item.grades[comb.id] = entry.grade;
          item.coverageCount += 1;
          item.totalScore += entry.grade * weight;
        }
      }
    }
  }

  const { filters, scoringModel } = payload;
  const filteredResults: RepertorizationResultItem[] = [];

  for (const item of remedyMap.values()) {
    const rem = item.remedy;
    if (filters.thermals.length > 0 && !filters.thermals.includes(rem.thermal)) continue;
    if (filters.miasms.length > 0 && !filters.miasms.includes(rem.miasm)) continue;
    if (filters.kingdoms.length > 0 && !filters.kingdoms.includes(rem.kingdom)) continue;

    if (eliminatingIds.size > 0) {
      let missingEliminating = false;
      for (const elimId of eliminatingIds) {
        if (!item.grades[elimId]) {
          missingEliminating = true;
          break;
        }
      }
      if (missingEliminating) continue;
    }

    filteredResults.push({
      remedy: rem,
      coverageCount: item.coverageCount,
      totalScore: item.totalScore,
      grades: item.grades,
    });
  }

  filteredResults.sort((a, b) => {
    if (scoringModel === 'coverage_first') {
      if (b.coverageCount !== a.coverageCount) return b.coverageCount - a.coverageCount;
      return b.totalScore - a.totalScore;
    }
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.coverageCount - a.coverageCount;
  });

  return {
    rankedRemedies: filteredResults,
    benchmarkMs: Number((performance.now() - start).toFixed(2)),
    totalEvaluated: remedyMap.size,
    qualifyingCount: filteredResults.length,
  };
}

function handleGetMonograph(remedyId: string, bookId?: string): RemedyMonograph | undefined {
  if (!db) return undefined;
  const sql = `
    SELECT * FROM monographs
    WHERE remedy_id = :remedyId
      AND (:bookId IS NULL OR book_id = :bookId)
    ORDER BY CASE WHEN book_id = 'book-boericke' THEN 0 ELSE 1 END
    LIMIT 1;
  `;
  const stmt = db.prepare(sql);
  stmt.bind({ ':remedyId': remedyId, ':bookId': bookId || null });

  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as MonographSqlRow;
    stmt.free();
    return mapMonographRow(row);
  }
  stmt.free();
  return undefined;
}

// Global Worker Message Dispatcher
self.onmessage = async (event: MessageEvent<SqliteWorkerMessage>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'INIT_DATABASE': {
        await initializeDatabase();
        if (id !== undefined) {
          self.postMessage({ type: 'RESPONSE', id, data: { isReady: true } });
        }
        break;
      }
      case 'GET_STATUS': {
        self.postMessage({ type: 'RESPONSE', id, data: { isReady } });
        break;
      }
      case 'GET_CHAPTERS': {
        const p = payload as GetChaptersPayload | undefined;
        const chapters = handleGetChapters(p?.repertoryId, p?.searchQuery);
        self.postMessage({ type: 'RESPONSE', id, data: chapters });
        break;
      }
      case 'GET_RUBRICS_BY_IDS': {
        const rubrics = handleGetRubricsByIds((payload as { rubricIds: string[] }).rubricIds);
        self.postMessage({ type: 'RESPONSE', id, data: rubrics });
        break;
      }
      case 'SEARCH_RUBRICS': {
        const rubrics = handleSearchRubrics(payload as Parameters<typeof handleSearchRubrics>[0]);
        self.postMessage({ type: 'RESPONSE', id, data: rubrics });
        break;
      }
      case 'GET_RUBRIC_CHILDREN': {
        const children = handleGetRubricChildren((payload as { parentId: string }).parentId);
        self.postMessage({ type: 'RESPONSE', id, data: children });
        break;
      }
      case 'EXECUTE_REPERTORIZATION': {
        const output = handleExecuteRepertorization(payload as Parameters<typeof handleExecuteRepertorization>[0]);
        self.postMessage({ type: 'RESPONSE', id, data: output });
        break;
      }
      case 'GET_MONOGRAPH': {
        const p = payload as { remedyId: string; bookId?: string };
        const mono = handleGetMonograph(p.remedyId, p.bookId);
        self.postMessage({ type: 'RESPONSE', id, data: mono });
        break;
      }
      default:
        throw new Error(`Unknown worker message type: ${type}`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    self.postMessage({
      type: 'RESPONSE',
      id,
      error: errorMsg || 'Worker execution error',
    });
  }
};
