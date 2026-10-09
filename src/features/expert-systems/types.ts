/**
 * Domain TypeScript Types for Clinical Decision & Expert Systems
 * (Vijayakar Acute Flowchart, Tempraz Temperaments, Sehgal Mind-Rubrics, Scholten Elements)
 */

// 1. Vijayakar Acute Expert System Types
export type ThirstType = 'Thirsty' | 'Thirstless';
export type ThermalType = 'Hot' | 'Chilly';
export type ActivityType = 'Restless' | 'Dull';

export type EmbryologicalLayer = 'Ectoderm' | 'Endoderm' | 'Mesoderm';

export interface SymptomHistoryEntry {
  complaint: string;
  layer: EmbryologicalLayer; // Ectoderm (Skin/Nerves) -> Mesoderm (Joints/Muscles/Cardio) -> Endoderm (Lungs/GI)
  isCurrent: boolean;
}

export type HeringDirection = 'Cure_Progressing' | 'Suppression_Warning' | 'Neutral';

export interface HeringEvaluation {
  direction: HeringDirection;
  message: string;
  depthScoreChange: number;
}

export interface AcuteDecisionNode {
  id: string;
  nodeKey: string;
  thirst: ThirstType;
  thermal: ThermalType;
  activity: ActivityType;
  primaryRemedy: string;
  remedyAbbreviation: string;
  differentialRemedies: string[];
  clinicalIndications: string;
  keynoteModalities: string[];
}

export interface VijayakarAcuteResult {
  node?: AcuteDecisionNode;
  candidateRemedies: Array<{
    name: string;
    abbreviation: string;
    isPrimary: boolean;
  }>;
  heringEvaluation?: HeringEvaluation;
}

// 2. Tempraz Expert System Types
export type TemperamentType =
  | 'sanguine'
  | 'melancholic'
  | 'choleric'
  | 'phlegmatic'
  | 'nervous';

export interface TemperamentProfile {
  id: string;
  temperament: TemperamentType;
  displayName: string;
  description: string;
  keyBehavioralTraits: string[];
  leadingRemedies: string[];
  miasmAffinity: string;
  physicalAppearance: string;
}

export interface TemprazScoreResult {
  scores: Record<TemperamentType, number>;
  percentages: Record<TemperamentType, number>;
  dominantTemperament: TemperamentType;
  secondaryTemperament?: TemperamentType;
  recommendedRemedies: string[];
}

// 3. Sehgal Expert System Types
export interface SehgalScript {
  id: string;
  patientPhrase: string;
  keywords: string[];
  rubricChapter: string;
  rubricPath: string;
  rubricFullPath: string;
  topRemedies: string[];
  clinicalNotes?: string;
  matchScore?: number;
}

export interface SehgalTranslationResult {
  query: string;
  matchedScripts: SehgalScript[];
  bestMatch?: SehgalScript;
}

// 4. Scholten Element Theory Types
export interface ScholtenElement {
  id: string;
  elementSymbol: string;
  elementName: string;
  atomicNumber: number;
  series: number; // 1 to 7
  seriesName: string;
  stage: number; // 1 to 18
  stageTheme: string;
  homeopathicRemedyName: string;
  coreDelusion: string;
}

export interface ScholtenSeriesInfo {
  series: number;
  name: string;
  theme: string;
}

export interface ScholtenStageInfo {
  stage: number;
  theme: string;
}

// 5. Kent's 12 Prognostic Observations Types
export type AggravationDuration =
  | 'none'
  | 'short_strong'
  | 'long_severe'
  | 'prolonged_decline';

export type AmeliorationPattern =
  | 'rapid_permanent'
  | 'slow_steady'
  | 'first_then_worse'
  | 'short_relief'
  | 'relief_symptoms_not_patient'
  | 'none';

export type SymptomEvolution =
  | 'old_symptoms_return'
  | 'new_symptoms_appear'
  | 'wrong_direction_suppression'
  | 'prover_response'
  | 'normal_progression';

export interface KentObservationInput {
  aggravationDuration: AggravationDuration;
  ameliorationPattern: AmeliorationPattern;
  symptomEvolution: SymptomEvolution;
  isIdiosyncraticProver?: boolean;
}

export type KentPrognosisCategory =
  | 'Curable_Ideal'
  | 'Curable_Borderline'
  | 'Incurable_Destructive'
  | 'Superficial_Palliative'
  | 'Wrong_Remedy'
  | 'Suppression_Danger'
  | 'Prover_Sensitive';

export type HeringComplianceStatus =
  | 'Strictly_Compliant'
  | 'Non_Compliant_Suppression'
  | 'Irrelevant'
  | 'Pending';

export interface KentObservationRule {
  id: string;
  observationNumber: number;
  title: string;
  shortDescription: string;
  clinicalSignificance: string;
  category: KentPrognosisCategory;
  heringCompliance: HeringComplianceStatus;
  physicianAction: string;
  repetitionWarning: string;
}

export interface KentPrognosisEvaluation {
  matchedObservation: KentObservationRule;
  confidenceScore: number;
  clinicalSummary: string;
  recommendedAction: string;
  contraindicatedActions: string[];
}

