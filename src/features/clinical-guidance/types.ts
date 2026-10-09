/**
 * Clinical Evidence & Practice Guidance Domain Types
 * Module 4 — Clinical Intelligence & Bedside Companion
 */

export type ClinicalGuidanceTab = 'tips' | 'cases' | 'nutrition' | 'tinctures';

export type VerificationLevel =
  | 'clinical_pearl'
  | 'verified'
  | 'frequent_confirmation'
  | 'keynote_clue';

export type OrganSystem =
  | 'All'
  | 'Respiratory'
  | 'Cardiovascular'
  | 'Gastrointestinal'
  | 'Nervous System'
  | 'Musculoskeletal'
  | 'Dermatology'
  | 'Genitourinary'
  | 'Pediatrics';

export interface ClinicalTip {
  id: string;
  remedyId?: string;
  remedyName: string;
  author: string;
  clinicalCondition: string;
  organSystem: string;
  tipContent: string;
  verificationLevel: VerificationLevel;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalTipFilter {
  searchQuery?: string;
  author?: string | null;
  organSystem?: string | null;
  remedyName?: string | null;
  verificationLevel?: VerificationLevel | null;
}

export interface CuredCase {
  id: string;
  title: string;
  author: string;
  patientAgeGroup: string;
  clinicalDiagnosis: string;
  organSystem: string;
  initialSymptoms: string;
  symptomTotality: string[];
  remedyPrescribed: string;
  potencyAndDosage: string;
  keyPrescribingClue: string;
  outcomeAndTimeline: string;
  kentObservationNum?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CuredCaseFilter {
  searchQuery?: string;
  author?: string | null;
  diagnosis?: string | null;
  remedyName?: string | null;
  organSystem?: string | null;
}

export type NutritionCategory =
  | 'All'
  | 'Metabolic'
  | 'Cardiovascular'
  | 'Renal'
  | 'Gastrointestinal'
  | 'Respiratory'
  | 'Dermatological'
  | 'Autoimmune';

export interface DiseaseNutritionGuidance {
  id: string;
  conditionName: string;
  category: string;
  recommendedFoods: string[];
  restrictedFoods: string[];
  lifestyleGuidelines: string[];
  homeopathicDietaryCautions: string;
  associatedRemedies: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DiseaseNutritionFilter {
  searchQuery?: string;
  category?: string | null;
}

export interface MotherTincture {
  id: string;
  remedyName: string;
  commonName: string;
  organAffinities: string[];
  clinicalIndications: string[];
  internalDosage: string;
  externalApplication?: string | null;
  pharmacologicalActions: string;
  cautionsAndContraindications: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotherTinctureFilter {
  searchQuery?: string;
  organAffinity?: string | null;
}
