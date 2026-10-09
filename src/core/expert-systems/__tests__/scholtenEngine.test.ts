import { describe, it, expect } from 'vitest';
import {
  findScholtenElement,
  getSeriesElements,
  getStageElements,
  describeAxisCoordinates,
} from '../scholtenEngine';
import { INITIAL_SCHOLTEN_ELEMENTS } from '@/core/storage/expertSystemsData';

describe('Scholten Element Theory Engine (Periodic Table Analysis)', () => {
  const elements = INITIAL_SCHOLTEN_ELEMENTS;

  describe('Coordinate Lookups (Series 1-7 × Stages 1-18)', () => {
    it('locates Natrum at Series 3 (Silica) Stage 1', () => {
      const el = findScholtenElement(elements, 3, 1);
      expect(el).toBeDefined();
      expect(el?.elementSymbol).toBe('Na');
      expect(el?.homeopathicRemedyName).toBe('Natrum Muriaticum');
      expect(el?.seriesName).toContain('Silica');
    });

    it('locates Calcarea Carbonica at Series 4 (Iron) Stage 2', () => {
      const el = findScholtenElement(elements, 4, 2);
      expect(el).toBeDefined();
      expect(el?.elementSymbol).toBe('Ca');
      expect(el?.homeopathicRemedyName).toBe('Calcarea Carbonica');
      expect(el?.seriesName).toContain('Iron');
    });

    it('locates Ferrum at Series 4 (Iron) Stage 10', () => {
      const el = findScholtenElement(elements, 4, 10);
      expect(el).toBeDefined();
      expect(el?.elementSymbol).toBe('Fe');
      expect(el?.homeopathicRemedyName).toBe('Ferrum Metallicum');
    });

    it('locates Arsenicum Album at Series 4 (Iron) Stage 15', () => {
      const el = findScholtenElement(elements, 4, 15);
      expect(el).toBeDefined();
      expect(el?.elementSymbol).toBe('As');
      expect(el?.homeopathicRemedyName).toBe('Arsenicum Album');
    });

    it('locates Aurum Metallicum at Series 6 (Gold) Stage 11', () => {
      const el = findScholtenElement(elements, 6, 11);
      expect(el).toBeDefined();
      expect(el?.elementSymbol).toBe('Au');
      expect(el?.homeopathicRemedyName).toBe('Aurum Metallicum');
      expect(el?.seriesName).toContain('Gold');
    });
  });

  describe('Series and Stage Traversal', () => {
    it('retrieves all elements along Series 3 (Silica / Relationship row)', () => {
      const silicaRow = getSeriesElements(elements, 3);
      expect(silicaRow.length).toBeGreaterThanOrEqual(4);
      // Verify sorted ascending by stage
      for (let i = 0; i < silicaRow.length - 1; i++) {
        expect(silicaRow[i].stage).toBeLessThanOrEqual(silicaRow[i + 1].stage);
      }
      expect(silicaRow.some((el) => el.elementSymbol === 'Na')).toBe(true);
      expect(silicaRow.some((el) => el.elementSymbol === 'P')).toBe(true);
    });

    it('retrieves all elements along Stage 10 (Peak Success / Independence)', () => {
      const stage10Col = getStageElements(elements, 10);
      expect(stage10Col.length).toBeGreaterThanOrEqual(2);
      expect(stage10Col.some((el) => el.elementSymbol === 'Si')).toBe(true);
      expect(stage10Col.some((el) => el.elementSymbol === 'Fe')).toBe(true);
    });
  });

  describe('Axis Coordinate Synthesis & Out-of-Bounds Handling', () => {
    it('synthesizes clinical theme combining Series and Stage descriptions', () => {
      const synthesis = describeAxisCoordinates(4, 10);
      expect(synthesis.seriesTitle).toContain('Iron Series');
      expect(synthesis.stageTitle).toContain('Stage 10');
      expect(synthesis.clinicalSynthesis).toContain('Work, duty');
      expect(synthesis.clinicalSynthesis).toContain('Peak Success');
    });

    it('returns undefined for invalid Series (< 1 or > 7)', () => {
      expect(findScholtenElement(elements, 0, 5)).toBeUndefined();
      expect(findScholtenElement(elements, 8, 5)).toBeUndefined();
    });

    it('returns undefined for invalid Stage (< 1 or > 18)', () => {
      expect(findScholtenElement(elements, 3, 0)).toBeUndefined();
      expect(findScholtenElement(elements, 3, 19)).toBeUndefined();
    });
  });
});
