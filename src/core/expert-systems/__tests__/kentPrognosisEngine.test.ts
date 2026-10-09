import { describe, it, expect } from 'vitest';
import { evaluateKentPrognosis } from '../kentPrognosisEngine';

describe('KentPrognosisEngine (12 Classical Observations)', () => {
  it('identifies Observation 3: ideal curative reaction (quick aggravation then rapid recovery)', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'short_strong',
      ameliorationPattern: 'rapid_permanent',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(3);
    expect(res.matchedObservation.category).toBe('Curable_Ideal');
    expect(res.matchedObservation.heringCompliance).toBe('Strictly_Compliant');
    expect(res.recommendedAction).toContain('ABSOLUTE NON-INTERFERENCE');
    expect(res.contraindicatedActions).toContain('NEVER repeat medicine while patient continues to improve');
  });

  it('identifies Observation 11: old symptoms return according to Hering’s Law of Cure', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'slow_steady',
      symptomEvolution: 'old_symptoms_return',
    });

    expect(res.matchedObservation.observationNumber).toBe(11);
    expect(res.matchedObservation.category).toBe('Curable_Ideal');
    expect(res.matchedObservation.heringCompliance).toBe('Strictly_Compliant');
    expect(res.recommendedAction).toContain('REJOICE AND DO NOT TOUCH');
    expect(res.contraindicatedActions[0]).toContain('Never treat or antidote');
  });

  it('identifies Observation 12: dangerous disease suppression with inward movement', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'none',
      symptomEvolution: 'wrong_direction_suppression',
    });

    expect(res.matchedObservation.observationNumber).toBe(12);
    expect(res.matchedObservation.category).toBe('Suppression_Danger');
    expect(res.matchedObservation.heringCompliance).toBe('Non_Compliant_Suppression');
    expect(res.recommendedAction).toContain('ANTIDOTE IMMEDIATELY');
    expect(res.contraindicatedActions).toContain('EMERGENCY: Do not delay antidoting');
  });

  it('identifies Observation 10: new symptoms appear indicating incorrect prescription', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'none',
      symptomEvolution: 'new_symptoms_appear',
    });

    expect(res.matchedObservation.observationNumber).toBe(10);
    expect(res.matchedObservation.category).toBe('Wrong_Remedy');
    expect(res.recommendedAction).toContain('DISCONTINUE & ANTIDOTE IF SEVERE');
  });

  it('identifies Observation 1: prolonged aggravation and final decline (incurable)', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'prolonged_decline',
      ameliorationPattern: 'none',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(1);
    expect(res.matchedObservation.category).toBe('Incurable_Destructive');
    expect(res.recommendedAction).toContain('ANTIDOTE IMMEDIATELY & PALLIATE');
  });

  it('identifies Observation 2: long aggravation with slow recovery (borderline curable)', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'long_severe',
      ameliorationPattern: 'slow_steady',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(2);
    expect(res.matchedObservation.category).toBe('Curable_Borderline');
    expect(res.recommendedAction).toContain('WAIT AND WATCH WITH PATIENCE');
  });

  it('identifies Observation 4: recovery without aggravation (acute curable)', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'rapid_permanent',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(4);
    expect(res.matchedObservation.category).toBe('Curable_Ideal');
    expect(res.recommendedAction).toContain('DISCONTINUE MEDICATION');
  });

  it('identifies Observation 5: amelioration first, aggravation afterward (superficial palliative)', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'first_then_worse',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(5);
    expect(res.matchedObservation.category).toBe('Superficial_Palliative');
    expect(res.recommendedAction).toContain('RE-CASE THE PATIENT');
  });

  it('identifies Observation 7: full amelioration of symptoms, no relief of patient', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'relief_symptoms_not_patient',
      symptomEvolution: 'normal_progression',
    });

    expect(res.matchedObservation.observationNumber).toBe(7);
    expect(res.matchedObservation.category).toBe('Incurable_Destructive');
    expect(res.recommendedAction).toContain('GUARDED PROGNOSIS');
  });

  it('identifies Observation 8: idiosyncratic hyper-sensitive prover', () => {
    const res = evaluateKentPrognosis({
      aggravationDuration: 'none',
      ameliorationPattern: 'none',
      symptomEvolution: 'normal_progression',
      isIdiosyncraticProver: true,
    });

    expect(res.matchedObservation.observationNumber).toBe(8);
    expect(res.matchedObservation.category).toBe('Prover_Sensitive');
    expect(res.recommendedAction).toContain('USE WATER DILUTION OR OLFACTION');
  });
});
