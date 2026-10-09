import type {
  KentObservationInput,
  KentObservationRule,
  KentPrognosisEvaluation,
} from '@/features/expert-systems/types';
import { INITIAL_KENT_OBSERVATIONS } from '../storage/kentObservationsData';

/**
 * Pure computational engine implementing Dr. James Tyler Kent's 12 Prognostic Observations
 * (Lectures on Homeopathic Philosophy, Lectures XXXV-XXXVII).
 * Evaluates follow-up responses and derives Hering's law compliance and physician action directives.
 */
export function evaluateKentPrognosis(
  input: KentObservationInput,
  rules: KentObservationRule[] = INITIAL_KENT_OBSERVATIONS
): KentPrognosisEvaluation {
  const ruleMap = new Map<number, KentObservationRule>(
    rules.map((r) => [r.observationNumber, r])
  );

  let targetNumber = 3; // Default to Ideal Curative Response
  const confidence = 0.95;

  // 1. Specialized Prover Sensitivity (Obs 8 & 9)
  if (input.isIdiosyncraticProver) {
    targetNumber = 8;
  } else if (input.symptomEvolution === 'prover_response') {
    targetNumber = 9;
  }
  // 2. Dangerous Suppression (Obs 12)
  else if (input.symptomEvolution === 'wrong_direction_suppression') {
    targetNumber = 12;
  }
  // 3. Reappearance of Old Symptoms - Hering's Law (Obs 11)
  else if (input.symptomEvolution === 'old_symptoms_return') {
    targetNumber = 11;
  }
  // 4. New Symptoms Appeared - Wrong Remedy (Obs 10)
  else if (input.symptomEvolution === 'new_symptoms_appear') {
    targetNumber = 10;
  }
  // 5. Prolonged Aggravation & Vital Decline (Obs 1)
  else if (input.aggravationDuration === 'prolonged_decline') {
    targetNumber = 1;
  }
  // 6. Full Symptom Relief with Declining Patient (Obs 7)
  else if (input.ameliorationPattern === 'relief_symptoms_not_patient') {
    targetNumber = 7;
  }
  // 7. Amelioration First, Followed by Severe Aggravation (Obs 5)
  else if (input.ameliorationPattern === 'first_then_worse') {
    targetNumber = 5;
  }
  // 8. Too Short Relief of Symptoms (Obs 6)
  else if (input.ameliorationPattern === 'short_relief') {
    targetNumber = 6;
  }
  // 9. Long Aggravation with Slow Improvement (Obs 2)
  else if (
    input.aggravationDuration === 'long_severe' ||
    (input.aggravationDuration !== 'none' && input.ameliorationPattern === 'slow_steady')
  ) {
    targetNumber = 2;
  }
  // 10. Recovery Without Any Aggravation (Obs 4)
  else if (
    input.aggravationDuration === 'none' &&
    input.ameliorationPattern === 'rapid_permanent'
  ) {
    targetNumber = 4;
  }
  // 11. Quick, Short Aggravation Followed by Rapid Recovery (Obs 3)
  else if (
    input.aggravationDuration === 'short_strong' ||
    input.ameliorationPattern === 'rapid_permanent'
  ) {
    targetNumber = 3;
  }

  const matched = ruleMap.get(targetNumber) || rules[2];

  const { recommendedAction, contraindicatedActions } = deriveActionDirectives(targetNumber);

  const clinicalSummary = `Observation ${matched.observationNumber}: ${matched.title}. Classification: ${matched.category.replace('_', ' ')}. Hering's Law Status: ${matched.heringCompliance.replace('_', ' ')}.`;

  return {
    matchedObservation: matched,
    confidenceScore: confidence,
    clinicalSummary,
    recommendedAction,
    contraindicatedActions,
  };
}

function deriveActionDirectives(observationNumber: number): {
  recommendedAction: string;
  contraindicatedActions: string[];
} {
  switch (observationNumber) {
    case 1:
      return {
        recommendedAction: 'ANTIDOTE IMMEDIATELY & PALLIATE: Vital force is collapsing from overly deep medicinal impression. Switch to mild low potency remedies.',
        contraindicatedActions: [
          'NEVER repeat the same high potency remedy',
          'Do not wait passively while vital signs deteriorate',
        ],
      };
    case 2:
      return {
        recommendedAction: 'WAIT AND WATCH WITH PATIENCE: Vitality is rallying slowly after a prolonged struggle in borderline curable pathology. Administer placebo (Sac-lac).',
        contraindicatedActions: [
          'DO NOT change or repeat the remedy while slow progress continues',
          'Do not mistake slow recovery for non-action',
        ],
      };
    case 3:
      return {
        recommendedAction: 'ABSOLUTE NON-INTERFERENCE: Highest ideal curative response! The similimum has acted centrally. Give placebo and allow the curative wave to unfold.',
        contraindicatedActions: [
          'NEVER repeat medicine while patient continues to improve',
          'Do not antidote the preliminary brief aggravation',
        ],
      };
    case 4:
      return {
        recommendedAction: 'DISCONTINUE MEDICATION: Curative action complete without physiological disturbance. Patient has returned to equilibrium.',
        contraindicatedActions: [
          'No repetition required',
          'Do not prescribe second remedy without clear symptom indication',
        ],
      };
    case 5:
      return {
        recommendedAction: 'RE-CASE THE PATIENT: Remedy acted merely as a superficial palliative. Take a fresh case totality to find the deep constitutional similimum.',
        contraindicatedActions: [
          'Do not repeat the superficial remedy',
          'Do not increase potency of a partial remedy',
        ],
      };
    case 6:
      return {
        recommendedAction: 'INVESTIGATE OBSTACLES TO CURE: Explore mechanical factors, toxic exposures, or gross tissue pathology maintaining the complaint.',
        contraindicatedActions: [
          'Do not increase potencies aggressively without clearing obstacles',
        ],
      };
    case 7:
      return {
        recommendedAction: 'GUARDED PROGNOSIS & PALLIATIVE COMFORT: Latent organ destruction. Prescribe gentle organ-supportive remedies and preserve vitality.',
        contraindicatedActions: [
          'Avoid violent deep-acting high potency polychrests',
        ],
      };
    case 8:
      return {
        recommendedAction: 'USE WATER DILUTION OR OLFACTION: Hyper-sensitive patient. Administer single dose dissolved in multiple water glasses or by olfaction.',
        contraindicatedActions: [
          'Do not administer repeated dry globules',
        ],
      };
    case 9:
      return {
        recommendedAction: 'RECORD PROVING MODALITIES: Healthy prover response. Note symptoms for Materia Medica inclusion.',
        contraindicatedActions: [
          'Do not mistake normal proving for natural disease',
        ],
      };
    case 10:
      return {
        recommendedAction: 'DISCONTINUE & ANTIDOTE IF SEVERE: Wrong remedy was prescribed; new drug symptoms are appearing. Allow remedy to wear off and re-case.',
        contraindicatedActions: [
          'CRITICAL: Halt the current prescription immediately',
          'Do not give further doses of the wrong medicine',
        ],
      };
    case 11:
      return {
        recommendedAction: 'REJOICE AND DO NOT TOUCH: Classical verification of Hering’s Law of Cure! Disease is leaving in reverse chronological order. Administer placebo only.',
        contraindicatedActions: [
          'GOLDEN RULE: Never treat or antidote the reappearing old symptoms',
          'Do not repeat the remedy during this curative phase',
        ],
      };
    case 12:
      return {
        recommendedAction: 'ANTIDOTE IMMEDIATELY: Dangerous disease suppression! Pathology is moving inward into vital internal organs. Antidote at once to return pathology to the periphery.',
        contraindicatedActions: [
          'EMERGENCY: Do not delay antidoting',
          'Never continue the suppressing prescription',
        ],
      };
    default:
      return {
        recommendedAction: 'OBSERVE CLOSELY: Monitor vital indicators and follow Hering’s law direction.',
        contraindicatedActions: ['Do not repeat without clear indications'],
      };
  }
}
