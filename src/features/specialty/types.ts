export type SpecialtyCategory =
  | 'Clinical'
  | 'Pediatric'
  | 'Card/Key'
  | 'Pocket Book'
  | 'Veterinary';

export type VeterinarySpecies = 'Canine' | 'Feline' | 'Equine' | 'Bovine' | 'Avian';

export interface SpecialtyRemedyEntry {
  remedy: string;
  abbr: string;
  grade: 1 | 2 | 3 | 4;
}

export interface SpecialtyRepertory {
  id: string;
  code: string;
  name: string;
  author: string;
  year?: number;
  description: string;
  totalRubrics: number;
  category: SpecialtyCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpecialtyRubric {
  id: string;
  repertoryCode: string;
  section: string;
  rubricPath: string;
  remedies: SpecialtyRemedyEntry[];
  clinicalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VeterinarySpeciesGuidance {
  id: string;
  species: VeterinarySpecies;
  physiologicalCharacteristics: string;
  commonAcuteConditions: string[];
  posologyGuidance: string;
  contraindications?: string;
  administrationMethod: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VeterinaryCase {
  id: string;
  species: VeterinarySpecies;
  breedAgeGender: string;
  chiefComplaint: string;
  rubricsUsed: string[];
  remedyPrescribed: string;
  potency: string;
  outcomeNotes: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PosologyCalculationResult {
  species: VeterinarySpecies;
  weightKg: number;
  acuity: 'Hyper-acute' | 'Sub-acute' | 'Chronic';
  recommendedPelletCount: string;
  recommendedPotencyRange: string;
  dilutionInstructions: string;
  administrationMethod: string;
  frequency: string;
  specialPrecautions: string;
}
