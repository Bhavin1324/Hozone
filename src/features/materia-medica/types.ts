import type { Remedy } from '@/features/repertory/types';

export interface MateriaMedicaBook {
  id: string;
  code: string;
  title: string;
  author: string;
  editionYear: number;
  description: string;
  category?: string;
}

export type RelationshipType =
  | 'antidote'
  | 'complement'
  | 'inimical'
  | 'follows_well'
  | 'collateral';

export interface RemedyRelationship {
  id: string;
  primaryRemedyId: string;
  relatedRemedyId: string;
  relatedAbbr: string;
  relatedFullName: string;
  type: RelationshipType;
  notes?: string;
}

export interface RemedyMonograph {
  id: string;
  remedyId: string;
  abbreviation: string;
  fullName: string;
  bookId: string;
  bookTitle: string;
  mind: string;
  physicalGenerals: string;
  keynotes: string;
  modalitiesAgg: string[];
  modalitiesAmel: string[];
  organAffinities: string[];
  clinicalIndications?: string[];
  comparisons?: string;
}

export type ComparisonSection =
  | 'keynotes'
  | 'mind'
  | 'physicals'
  | 'modalities'
  | 'affinities'
  | 'relationships';

export interface RemedyComparisonSlot {
  remedy: Remedy;
  monograph?: RemedyMonograph | undefined;
  relationships: RemedyRelationship[];
}

export interface InimicalConflict {
  remedyA: string;
  remedyB: string;
  notes: string;
}

export interface DifferentialComparisonResult {
  slots: RemedyComparisonSlot[];
  inimicalConflicts: InimicalConflict[];
  complementaryLinks: Array<{ remedyA: string; remedyB: string; notes: string }>;
  sharedAffinities: string[];
}

// ==========================================
// Cross-Text Multi-Book Search Types
// ==========================================

export type CrossTextSearchMode = 'all' | 'any' | 'phrase';

export type CrossTextSearchSection =
  | 'keynotes'
  | 'mind'
  | 'physicals'
  | 'modalitiesAgg'
  | 'modalitiesAmel'
  | 'organAffinities'
  | 'clinicalIndications'
  | 'comparisons';

export interface CrossTextSearchMatch {
  monographId: string;
  remedyId: string;
  remedyAbbr: string;
  remedyFullName: string;
  bookId: string;
  bookTitle: string;
  bookCode: string;
  section: CrossTextSearchSection;
  snippet: string;
  matchedTerms: string[];
}

export interface RemedySearchFrequency {
  remedyId: string;
  remedyAbbr: string;
  remedyFullName: string;
  totalHits: number;
  booksCount: number;
  matchedSections: CrossTextSearchSection[];
}

export interface CrossTextSearchResult {
  query: string;
  totalHits: number;
  frequencyRanking: RemedySearchFrequency[];
  matches: CrossTextSearchMatch[];
}

