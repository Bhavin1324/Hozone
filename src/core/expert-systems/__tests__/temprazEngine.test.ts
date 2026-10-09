import { describe, it, expect } from 'vitest';
import { calculateTemperamentBlend } from '../temprazEngine';
import { INITIAL_TEMPERAMENTS } from '@/core/storage/expertSystemsData';

describe('Tempraz Expert Engine (Dr. Parinaz Humranwala)', () => {
  const profiles = INITIAL_TEMPERAMENTS;

  describe('Pure Temperament Dominance', () => {
    it('scores 100% Sanguine when only Sanguine traits are selected', () => {
      const selected = [
        'Optimistic and enthusiastic',
        'Socially outgoing',
        'Expressive facial movements',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('sanguine');
      expect(result.percentages.sanguine).toBe(100);
      expect(result.percentages.choleric).toBe(0);
      expect(result.recommendedRemedies).toContain('Pulsatilla');
      expect(result.recommendedRemedies).toContain('Phosphorus');
    });

    it('scores 100% Choleric when only Choleric traits are selected', () => {
      const selected = [
        'Impatient and irritable',
        'Highly ambitious and competitive',
        'Argumentative when challenged',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('choleric');
      expect(result.percentages.choleric).toBe(100);
      expect(result.recommendedRemedies).toContain('Nux Vomica');
      expect(result.recommendedRemedies).toContain('Bryonia Alba');
    });

    it('scores 100% Melancholic when only Melancholic traits are selected', () => {
      const selected = [
        'Introspective and reserved',
        'Dwells on past disappointments',
        'Conscientious about trifles',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('melancholic');
      expect(result.percentages.melancholic).toBe(100);
      expect(result.recommendedRemedies).toContain('Natrum Muriaticum');
    });

    it('scores 100% Phlegmatic when only Phlegmatic traits are selected', () => {
      const selected = [
        'Calm and unhurried',
        'Sluggish reaction time',
        'Averse to physical exertion',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('phlegmatic');
      expect(result.percentages.phlegmatic).toBe(100);
      expect(result.recommendedRemedies).toContain('Calcarea Carbonica');
    });

    it('scores 100% Nervous when only Nervous traits are selected', () => {
      const selected = [
        'Highly excitable and reactive',
        'Trembling from anticipation',
        'Hypersensitive to noise and light',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('nervous');
      expect(result.percentages.nervous).toBe(100);
      expect(result.recommendedRemedies).toContain('Arsenicum Album');
    });
  });

  describe('Mixed Constitutional Blends & Multi-Temperament Scores', () => {
    it('calculates accurate blend percentages and secondary temperament for a 60/40 mix', () => {
      const selected = [
        // 3 Choleric traits
        'Impatient and irritable',
        'Highly ambitious and competitive',
        'Obstinate',
        // 2 Sanguine traits
        'Optimistic and enthusiastic',
        'Socially outgoing',
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.dominantTemperament).toBe('choleric');
      expect(result.secondaryTemperament).toBe('sanguine');
      expect(result.percentages.choleric).toBe(60);
      expect(result.percentages.sanguine).toBe(40);

      // Verify remedies include both dominant and secondary
      expect(result.recommendedRemedies).toContain('Nux Vomica');
      expect(result.recommendedRemedies).toContain('Pulsatilla');
    });

    it('handles 3-way temperament mix cleanly', () => {
      const selected = [
        'Impatient and irritable', // Choleric
        'Optimistic and enthusiastic', // Sanguine
        'Calm and unhurried', // Phlegmatic
      ];
      const result = calculateTemperamentBlend(selected, profiles);

      expect(result.scores.choleric).toBe(1);
      expect(result.scores.sanguine).toBe(1);
      expect(result.scores.phlegmatic).toBe(1);
      expect(result.scores.melancholic).toBe(0);
      expect(result.scores.nervous).toBe(0);
      expect(result.percentages.choleric).toBe(33);
      expect(result.percentages.sanguine).toBe(33);
      expect(result.percentages.phlegmatic).toBe(33);
    });
  });

  describe('Edge Cases and Stability', () => {
    it('handles zero selected traits without division by zero', () => {
      const result = calculateTemperamentBlend([], profiles);

      expect(result.percentages.sanguine).toBe(0);
      expect(result.percentages.choleric).toBe(0);
      expect(result.secondaryTemperament).toBeUndefined();
    });

    it('ignores non-existent traits without error', () => {
      const result = calculateTemperamentBlend(
        ['Random unrelated string', 'Nonexistent trait xyz'],
        profiles
      );

      expect(result.scores.sanguine).toBe(0);
      expect(result.scores.choleric).toBe(0);
    });
  });
});
