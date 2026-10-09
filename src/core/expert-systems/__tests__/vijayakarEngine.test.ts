import { describe, it, expect } from 'vitest';
import {
  resolveAcutePrescription,
  evaluateHeringTrajectory,
} from '../vijayakarEngine';
import { INITIAL_ACUTE_NODES } from '@/core/storage/expertSystemsData';

describe('Vijayakar Acute Expert Engine (Predictive Homeopathy)', () => {
  const nodes = INITIAL_ACUTE_NODES;

  describe('Acute Decision Triad Permutations (Thirst × Thermal × Activity)', () => {
    it('resolves Hot + Thirsty + Restless -> Aconitum Napellus', () => {
      const result = resolveAcutePrescription(nodes, 'Thirsty', 'Hot', 'Restless');
      expect(result.node).toBeDefined();
      expect(result.node?.nodeKey).toBe('hot_thirsty_restless');
      expect(result.candidateRemedies[0].name).toBe('Aconitum Napellus');
      expect(result.candidateRemedies[0].abbreviation).toBe('Acon.');
      expect(result.candidateRemedies[0].isPrimary).toBe(true);
      expect(result.candidateRemedies.length).toBeGreaterThan(1);
    });

    it('resolves Hot + Thirsty + Dull -> Bryonia Alba', () => {
      const result = resolveAcutePrescription(nodes, 'Thirsty', 'Hot', 'Dull');
      expect(result.node?.nodeKey).toBe('hot_thirsty_dull');
      expect(result.candidateRemedies[0].name).toBe('Bryonia Alba');
      expect(result.candidateRemedies[0].abbreviation).toBe('Bry.');
    });

    it('resolves Hot + Thirstless + Restless -> Apis Mellifica', () => {
      const result = resolveAcutePrescription(nodes, 'Thirstless', 'Hot', 'Restless');
      expect(result.node?.nodeKey).toBe('hot_thirstless_restless');
      expect(result.candidateRemedies[0].name).toBe('Apis Mellifica');
    });

    it('resolves Hot + Thirstless + Dull -> Pulsatilla Pratensis', () => {
      const result = resolveAcutePrescription(nodes, 'Thirstless', 'Hot', 'Dull');
      expect(result.node?.nodeKey).toBe('hot_thirstless_dull');
      expect(result.candidateRemedies[0].name).toBe('Pulsatilla Pratensis');
    });

    it('resolves Chilly + Thirsty + Restless -> Arsenicum Album', () => {
      const result = resolveAcutePrescription(nodes, 'Thirsty', 'Chilly', 'Restless');
      expect(result.node?.nodeKey).toBe('chilly_thirsty_restless');
      expect(result.candidateRemedies[0].name).toBe('Arsenicum Album');
      expect(result.candidateRemedies[0].abbreviation).toBe('Ars.');
    });

    it('resolves Chilly + Thirsty + Dull -> Eupatorium Perfoliatum', () => {
      const result = resolveAcutePrescription(nodes, 'Thirsty', 'Chilly', 'Dull');
      expect(result.node?.nodeKey).toBe('chilly_thirsty_dull');
      expect(result.candidateRemedies[0].name).toBe('Eupatorium Perfoliatum');
    });

    it('resolves Chilly + Thirstless + Restless -> Rhus Toxicodendron', () => {
      const result = resolveAcutePrescription(nodes, 'Thirstless', 'Chilly', 'Restless');
      expect(result.node?.nodeKey).toBe('chilly_thirstless_restless');
      expect(result.candidateRemedies[0].name).toBe('Rhus Toxicodendron');
    });

    it('resolves Chilly + Thirstless + Dull -> Gelsemium Sempervirens', () => {
      const result = resolveAcutePrescription(nodes, 'Thirstless', 'Chilly', 'Dull');
      expect(result.node?.nodeKey).toBe('chilly_thirstless_dull');
      expect(result.candidateRemedies[0].name).toBe('Gelsemium Sempervirens');
    });

    it('returns empty candidate remedies when nodes array is empty', () => {
      const emptyResult = resolveAcutePrescription([], 'Thirsty', 'Hot', 'Restless');
      expect(emptyResult.node).toBeUndefined();
      expect(emptyResult.candidateRemedies).toHaveLength(0);
    });
  });

  describe("Hering's Law of Cure & Embryological Suppression Evaluation", () => {
    it('detects severe suppression when pathology moves from Ectoderm to Endoderm', () => {
      // Skin eczema suppressed to bronchial asthma
      const evaluation = evaluateHeringTrajectory('Ectoderm', 'Endoderm');
      expect(evaluation.direction).toBe('Suppression_Warning');
      expect(evaluation.depthScoreChange).toBe(2);
      expect(evaluation.message).toContain('Suppression Warning');
      expect(evaluation.message).toContain('inward');
    });

    it('detects suppression when pathology moves from Ectoderm to Mesoderm', () => {
      // Urticaria suppressed to arthritic joint effusion
      const evaluation = evaluateHeringTrajectory('Ectoderm', 'Mesoderm');
      expect(evaluation.direction).toBe('Suppression_Warning');
      expect(evaluation.depthScoreChange).toBe(1);
    });

    it('confirms cure progression when pathology moves from Endoderm out to Ectoderm', () => {
      // Asthmatic dyspnea clearing with reappearance of benign skin eruption
      const evaluation = evaluateHeringTrajectory('Endoderm', 'Ectoderm');
      expect(evaluation.direction).toBe('Cure_Progressing');
      expect(evaluation.depthScoreChange).toBe(-2);
      expect(evaluation.message).toContain('Hering');
      expect(evaluation.message).toContain('within outward');
    });

    it('confirms cure progression when pathology moves from Mesoderm out to Ectoderm', () => {
      // Joint stiffness clearing to superficial itching
      const evaluation = evaluateHeringTrajectory('Mesoderm', 'Ectoderm');
      expect(evaluation.direction).toBe('Cure_Progressing');
      expect(evaluation.depthScoreChange).toBe(-1);
    });

    it('returns Neutral when symptoms remain on the same embryological plane', () => {
      const evaluation = evaluateHeringTrajectory('Mesoderm', 'Mesoderm');
      expect(evaluation.direction).toBe('Neutral');
      expect(evaluation.depthScoreChange).toBe(0);
      expect(evaluation.message).toContain('Stable Layer');
    });
  });
});
