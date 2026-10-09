export type RemedyKingdom = 'Plant' | 'Mineral' | 'Animal' | 'Nosode' | 'Sarcode' | 'Imponderabilia';
export type ThermalState = 'Chilly' | 'Hot' | 'Ambithermal';
export type MiasmType = 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Multi-miasmatic';

export interface RawRemedy {
  abbreviation: string;
  fullName: string;
  commonName: string;
  kingdom: RemedyKingdom;
  thermal: ThermalState;
  miasm: MiasmType;
  isPolychrest: boolean;
  shortKeynotes: string;
}

export interface RemedyRelationshipDefinition {
  primaryAbbr: string;
  relatedAbbr: string;
  type: 'antidote' | 'complement' | 'inimical' | 'follows_well' | 'collateral';
  notes: string;
}

export type BookCategory =
  | 'Classical Foundations'
  | 'Clinical & Guiding Keynotes'
  | 'Encyclopedias & Dictionaries'
  | 'Philosophical & Constitutional Lectures'
  | 'Specialty & Regional Therapeutics'
  | 'Modern & Thematic Systems';

export interface RawBook {
  code: string;
  title: string;
  author: string;
  editionYear: number;
  category: BookCategory;
  description: string;
}

export interface RawMonograph {
  remedyAbbr: string;
  bookCode: string;
  mind: string;
  physicalGenerals: string;
  keynotes: string;
  modalitiesAgg: string[];
  modalitiesAmel: string[];
  organAffinities: string[];
  clinicalIndications?: string[];
  comparisons?: string;
}
