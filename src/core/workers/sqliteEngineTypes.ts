import type { RemedyKingdom, ThermalState, MiasmType, Rubric } from '@/features/repertory/types';
import type { RemedyMonograph } from '@/features/materia-medica/types';

export interface SqliteWorkerMessage {
  id?: number;
  type:
    | 'INIT_DATABASE'
    | 'SEARCH_RUBRICS'
    | 'GET_RUBRICS_BY_IDS'
    | 'GET_RUBRIC_CHILDREN'
    | 'GET_CHAPTERS'
    | 'GET_REPERTORIES'
    | 'EXECUTE_REPERTORIZATION'
    | 'EXECUTE_POLARITY_ANALYSIS'
    | 'SEARCH_MATERIA_MEDICA'
    | 'GET_MONOGRAPH'
    | 'GET_STATUS';
  payload?: unknown;
}

export interface GetChaptersPayload {
  repertoryId?: string;
  searchQuery?: string;
}

export interface SqliteWorkerResponse {
  id?: number;
  type: 'PROGRESS' | 'RESPONSE' | 'ERROR';
  status?: 'downloading' | 'decompressing' | 'mounting' | 'ready';
  progressPercent?: number;
  data?: unknown;
  error?: string;
}

export interface RubricSqlRow {
  id: string;
  chapter_id: string;
  chapter_name: string;
  repertory_id: string;
  parent_id: string | null;
  path: string;
  full_path: string;
  depth: number;
  remedy_count: number;
  cross_references: string | null;
}

export interface RubricEntrySqlRow {
  remedy_id: string;
  abbreviation: string;
  grade: number;
}

export interface RepertoryEntryRemedySqlRow {
  rubric_id: string;
  remedy_id: string;
  grade: number;
  abbreviation: string;
  full_name: string;
  common_name: string;
  kingdom: RemedyKingdom;
  thermal: ThermalState;
  miasm: MiasmType;
  is_polychrest: number;
  short_keynotes: string;
}

export interface MonographSqlRow {
  id: string;
  remedy_id: string;
  book_id: string;
  abbreviation: string;
  full_name: string;
  book_title: string;
  mind: string;
  physical_generals: string;
  keynotes: string;
  modalities_agg: string;
  modalities_amel: string;
  organ_affinities: string;
  clinical_indications: string;
  comparisons: string;
}

export function mapRubricRow(row: RubricSqlRow): Rubric {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    chapterName: row.chapter_name,
    repertoryId: row.repertory_id,
    parentId: row.parent_id,
    path: row.path,
    fullPath: row.full_path,
    depth: Number(row.depth),
    remedyCount: Number(row.remedy_count),
    crossReferences: row.cross_references ? (JSON.parse(row.cross_references) as string[]) : [],
    entries: [],
  };
}

export function mapMonographRow(row: MonographSqlRow): RemedyMonograph {
  return {
    id: row.id,
    remedyId: row.remedy_id,
    bookId: row.book_id,
    abbreviation: row.abbreviation,
    fullName: row.full_name,
    bookTitle: row.book_title,
    mind: row.mind,
    physicalGenerals: row.physical_generals,
    keynotes: row.keynotes,
    modalitiesAgg: row.modalities_agg ? row.modalities_agg.split('; ') : [],
    modalitiesAmel: row.modalities_amel ? row.modalities_amel.split('; ') : [],
    organAffinities: row.organ_affinities ? row.organ_affinities.split('; ') : [],
    clinicalIndications: row.clinical_indications ? row.clinical_indications.split('; ') : [],
    comparisons: row.comparisons,
  };
}

