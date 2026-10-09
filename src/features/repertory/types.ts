/**
 * Core Domain TypeScript Types for Repertory & Repertorization Engine
 */

export type RemedyKingdom = 'Plant' | 'Mineral' | 'Animal' | 'Nosode' | 'Sarcode' | 'Imponderabilia';
export type ThermalState = 'Chilly' | 'Hot' | 'Ambithermal';
export type MiasmType = 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Multi-miasmatic';

export type RepertoryCategory =
  | 'Master General & Classical'
  | 'Clinical & General Practice'
  | 'Regional & Organ Therapeutics'
  | 'Sensations, Causation & Modalities'
  | 'Modern & Thematic Systems';

export interface RepertoryCatalogItem {
  id: string;
  code: string;
  title: string;
  author: string;
  editionYear: number;
  category: RepertoryCategory;
  description: string;
  isDefault?: boolean;
  rubricCount?: number;
}

export interface Chapter {
  id: string;
  name: string;
  displayOrder: number;
  icon: string;
  repertoryId?: string;
  description?: string;
  rubricCount?: number;
}

export interface Remedy {
  id: string;
  abbreviation: string;
  fullName: string;
  commonName: string;
  kingdom: RemedyKingdom;
  thermal: ThermalState;
  miasm: MiasmType;
  isPolychrest: boolean;
  shortKeynotes: string;
}

export interface RubricRemedyEntry {
  remedyId: string;
  abbreviation: string;
  grade: 1 | 2 | 3 | 4;
}

export interface Rubric {
  id: string;
  chapterId: string;
  chapterName: string;
  repertoryId?: string;
  parentId?: string | null;
  path: string;
  fullPath: string;
  depth: number;
  remedyCount: number;
  crossReferences?: string[];
  childrenCount?: number;
  entries: RubricRemedyEntry[];
}

export type MergeStrategy = 'max_grade' | 'sum_grades' | 'average';

export interface CombinedRubric extends Rubric {
  isCombined: true;
  sourceRubricIds: string[];
  mergeStrategy: MergeStrategy;
}

export interface ActiveCaseRubric {
  rubricId: string;
  fullPath: string;
  chapterName: string;
  weight: 1 | 2 | 3 | 4 | 5;
  isEliminating: boolean;
  isCombined?: boolean;
  sourceRubricIds?: string[];
  mergeStrategy?: MergeStrategy;
}

export type ScoringModel = 'coverage_first' | 'weighted_sum';

export interface FilterCriteria {
  thermals: ThermalState[];
  miasms: MiasmType[];
  kingdoms: RemedyKingdom[];
}

export interface RepertorizationResultItem {
  remedy: Remedy;
  coverageCount: number;
  totalScore: number;
  grades: Record<string, number>; // rubricId -> grade (1..4)
}

export interface RepertorizationComputeOutput {
  rankedRemedies: RepertorizationResultItem[];
  benchmarkMs: number;
  totalEvaluated: number;
  qualifyingCount: number;
}

export interface PolarSymptomPair {
  id: string;
  polarCode: string;
  name: string;
  category: string;
  positiveLabel: string;
  oppositeLabel: string;
  positiveRubricPath: string;
  oppositeRubricPath: string;
  clinicalNotes?: string;
  positiveRubricId?: string;
  oppositeRubricId?: string;
}

export interface PolarityRemedyResult {
  remedy: Remedy;
  polarCount: number;
  polarScore: number;
  contraindicationCount: number;
  contraindicationScore: number;
  polarityDifference: number; // polarScore - contraindicationScore
  isContraindicated: boolean;
  contraindicationWarnings: string[];
  matchedPairs: Array<{
    pairName: string;
    positiveLabel: string;
    positiveGrade: number;
    oppositeLabel: string;
    oppositeGrade: number;
  }>;
}

export interface PolarityAnalysisComputeOutput {
  rankedRemedies: PolarityRemedyResult[];
  evaluatedPairCount: number;
  benchmarkMs: number;
}
