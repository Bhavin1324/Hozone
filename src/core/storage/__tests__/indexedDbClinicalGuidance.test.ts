import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../indexedDb';
import {
  getLocalClinicalTips,
  getLocalCuredCases,
  getLocalDiseaseNutrition,
  getLocalMotherTinctures,
} from '../indexedDbClinicalGuidance';

describe('Local-First IndexedDB Clinical Guidance Storage (v7)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe('Clinical Tips Store', () => {
    it('retrieves all seeded clinical tips', async () => {
      const tips = await getLocalClinicalTips();
      expect(tips.length).toBeGreaterThanOrEqual(12);
      expect(tips.some((t) => t.remedyName === 'Bryonia Alba')).toBe(true);
      expect(tips.some((t) => t.remedyName === 'Aconitum Napellus')).toBe(true);
    });

    it('filters clinical tips by organ system', async () => {
      const respTips = await getLocalClinicalTips({ organSystem: 'Respiratory' });
      expect(respTips.length).toBeGreaterThanOrEqual(3);
      expect(respTips.every((t) => t.organSystem === 'Respiratory')).toBe(true);
    });

    it('filters clinical tips by keyword query', async () => {
      const results = await getLocalClinicalTips({ searchQuery: 'pleurisy' });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].remedyName).toBe('Bryonia Alba');
    });
  });

  describe('Cured Cases Archive Store', () => {
    it('retrieves all seeded cured cases', async () => {
      const cases = await getLocalCuredCases();
      expect(cases.length).toBeGreaterThanOrEqual(6);
      expect(cases.some((c) => c.remedyPrescribed === 'Medorrhinum')).toBe(true);
    });

    it('filters cured cases by organ system and keyword', async () => {
      const respCases = await getLocalCuredCases({
        organSystem: 'Respiratory',
        searchQuery: 'asthma',
      });
      expect(respCases.length).toBeGreaterThanOrEqual(1);
      expect(respCases[0].remedyPrescribed).toBe('Medorrhinum');
      expect(respCases[0].symptomTotality.length).toBeGreaterThan(0);
    });
  });

  describe('Disease Nutrition Store', () => {
    it('retrieves all seeded disease nutrition protocols', async () => {
      const nutrition = await getLocalDiseaseNutrition();
      expect(nutrition.length).toBeGreaterThanOrEqual(5);
      expect(nutrition.some((n) => n.conditionName.includes('Gout'))).toBe(true);
    });

    it('filters disease nutrition by category and query', async () => {
      const renal = await getLocalDiseaseNutrition({
        category: 'Renal',
        searchQuery: 'calculi',
      });
      expect(renal.length).toBe(1);
      expect(renal[0].homeopathicDietaryCautions).toContain('vinegar');
    });
  });

  describe('Mother Tinctures Store', () => {
    it('retrieves all seeded mother tincture monographs', async () => {
      const tinctures = await getLocalMotherTinctures();
      expect(tinctures.length).toBeGreaterThanOrEqual(10);
      expect(tinctures.some((t) => t.remedyName === 'Arnica Montana Q')).toBe(true);
      expect(tinctures.some((t) => t.remedyName === 'Berberis Vulgaris Q')).toBe(true);
    });

    it('filters mother tinctures by organ affinity and search query', async () => {
      const renalTinc = await getLocalMotherTinctures({
        organAffinity: 'Renal Pelvis & Ureters',
        searchQuery: 'calculi',
      });
      expect(renalTinc.length).toBeGreaterThanOrEqual(1);
      expect(renalTinc[0].remedyName).toBe('Berberis Vulgaris Q');
    });
  });
});
