import { describe, it, expect } from 'vitest';
import { translatePatientNarration } from '../sehgalEngine';
import { INITIAL_SEHGAL_SCRIPTS } from '@/core/storage/expertSystemsData';

describe('Sehgal Mind-Rubric Engine (Revolutionized Homeopathy)', () => {
  const scripts = INITIAL_SEHGAL_SCRIPTS;

  describe('Colloquial Narrative Translation & Keyword Matching', () => {
    it('translates floating sensation statement to floating delusion rubric', () => {
      const query = 'I feel completely light, as if floating in the air';
      const result = translatePatientNarration(query, scripts);

      expect(result.matchedScripts.length).toBeGreaterThan(0);
      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.rubricPath).toBe('DELUSION > floating in air');
      expect(result.bestMatch?.topRemedies).toContain('Asar.');
      expect(result.bestMatch?.topRemedies).toContain('Bell.');
    });

    it('translates obsessive checking behavior to fastidious / conscience rubric', () => {
      const query = 'I keep checking the lock and the stove over and over again';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.rubricPath).toBe('FASTIDIOUS > conscience, of');
      expect(result.bestMatch?.topRemedies).toContain('Ars.');
      expect(result.bestMatch?.topRemedies).toContain('Nux-v.');
    });

    it('translates desire for isolation to quiet desires rubric', () => {
      const query = 'I just want everyone to leave me alone in peace and quiet';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch?.rubricPath).toContain('QUIET > wants to be');
      expect(result.bestMatch?.topRemedies).toContain('Bry.');
    });

    it('translates fear of poverty statement to fear poverty rubric', () => {
      const query = 'I am afraid I will lose my job and end up with no money';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch?.rubricPath).toBe('FEAR > poverty, of');
      expect(result.bestMatch?.topRemedies).toContain('Calc.');
    });

    it('translates laughing at serious matters', () => {
      const query = 'I smile and laugh even when explaining how terrible my illness is';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch?.rubricPath).toContain('LAUGHING > serious matters');
    });

    it('translates feeling of being observed / watched', () => {
      const query = 'I feel like everybody is watching me and judging my every move';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch?.rubricPath).toContain('DELUSION > watched');
    });

    it('translates distortion of time passing too slowly', () => {
      const query = 'I feel so hurried inside that time seems to pass too slowly';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch?.rubricPath).toContain('TIME > slowly, passes too');
      expect(result.bestMatch?.topRemedies).toContain('Med.');
    });
  });

  describe('Robustness and Edge Cases', () => {
    it('handles uppercase input and noisy punctuation cleanly', () => {
      const query = '!!! I JUST WANT TO BE LEFT ALONE, IN PEACE AND QUIET !!!';
      const result = translatePatientNarration(query, scripts);

      expect(result.bestMatch).toBeDefined();
      expect(result.bestMatch?.rubricPath).toContain('QUIET');
    });

    it('returns empty results for empty or whitespace query', () => {
      const emptyResult = translatePatientNarration('   ', scripts);
      expect(emptyResult.matchedScripts).toHaveLength(0);
      expect(emptyResult.bestMatch).toBeUndefined();
    });

    it('returns empty results when query has zero conceptual relevance', () => {
      const result = translatePatientNarration('xyz987quantumsuperconducting123', scripts);
      expect(result.matchedScripts).toHaveLength(0);
      expect(result.bestMatch).toBeUndefined();
    });
  });
});
