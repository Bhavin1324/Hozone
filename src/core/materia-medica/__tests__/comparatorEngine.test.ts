import { describe, it, expect } from 'vitest';
import {
  buildDifferentialComparison,
  detectModalityContrasts,
} from '../comparatorEngine';
import type {
  RemedyComparisonSlot,
  RemedyRelationship,
  RemedyMonograph,
} from '@/features/materia-medica/types';
import type { Remedy, ThermalState, RemedyKingdom } from '@/features/repertory/types';

// Mock test fixtures
const createMockRemedy = (
  id: string,
  abbr: string,
  name: string,
  thermal: ThermalState = 'Chilly',
  kingdom: RemedyKingdom = 'Mineral'
): Remedy => ({
  id,
  abbreviation: abbr,
  fullName: name,
  commonName: name,
  kingdom,
  thermal,
  miasm: 'Psora',
  isPolychrest: true,
  shortKeynotes: 'Clinical keynote',
});

const createMockMonograph = (
  remedyId: string,
  abbr: string,
  name: string,
  agg: string[] = [],
  amel: string[] = [],
  affinities: string[] = []
): RemedyMonograph => ({
  id: `mono-${remedyId}`,
  remedyId,
  abbreviation: abbr,
  fullName: name,
  bookId: 'book-boericke',
  bookTitle: 'Boericke Materia Medica',
  mind: 'Mental characteristics',
  physicalGenerals: 'Physical generals',
  keynotes: 'Characteristic keynotes',
  modalitiesAgg: agg,
  modalitiesAmel: amel,
  organAffinities: affinities,
});

describe('Comparator Engine — Multi-Remedy Differential Analysis', () => {
  const sulphRemedy = createMockRemedy('rem-sulph', 'Sulph.', 'Sulphur', 'Hot', 'Mineral');
  const calcRemedy = createMockRemedy('rem-calc', 'Calc.', 'Calcarea Carbonica', 'Chilly', 'Mineral');
  const lycRemedy = createMockRemedy('rem-lyc', 'Lyc.', 'Lycopodium Clavatum', 'Chilly', 'Plant');
  const phosRemedy = createMockRemedy('rem-phos', 'Phos.', 'Phosphorus', 'Chilly', 'Mineral');
  const nuxRemedy = createMockRemedy('rem-nux-v', 'Nux-v.', 'Nux Vomica', 'Chilly', 'Plant');

  const sulphMono = createMockMonograph(
    'rem-sulph',
    'Sulph.',
    'Sulphur',
    ['Warmth of bed', 'Washing', 'Rest'],
    ['Motion', 'Dry weather'],
    ['Skin', 'Venous system', 'Gastrointestinal tract']
  );

  const calcMono = createMockMonograph(
    'rem-calc',
    'Calc.',
    'Calcarea Carbonica',
    ['Cold damp air', 'Physical exertion'],
    ['Dry weather', 'Resting quietly'],
    ['Glands', 'Bones and cartilage', 'Venous system']
  );

  const lycMono = createMockMonograph(
    'rem-lyc',
    'Lyc.',
    'Lycopodium Clavatum',
    ['Cold food', '4 to 8 PM', 'Rest'],
    ['Warm drinks', 'Motion'],
    ['Gastrointestinal tract', 'Liver', 'Skin']
  );

  const phosMono = createMockMonograph(
    'rem-phos',
    'Phos.',
    'Phosphorus',
    ['Lying on left side', 'Cold weather'],
    ['Cold food and drinks', 'Sleep'],
    ['Blood vessels', 'Nervous system', 'Lungs']
  );

  const nuxMono = createMockMonograph(
    'rem-nux-v',
    'Nux-v.',
    'Nux Vomica',
    ['Cold open air', 'Mental exertion'],
    ['Warmth', 'Rest'],
    ['Nervous system', 'Gastrointestinal tract', 'Liver']
  );

  const complementRel1: RemedyRelationship = {
    id: 'rel-1',
    primaryRemedyId: 'rem-sulph',
    relatedRemedyId: 'rem-calc',
    relatedAbbr: 'Calc.',
    relatedFullName: 'Calcarea Carbonica',
    type: 'complement',
    notes: 'Sulphur is followed well by Calcarea in chronic psora.',
  };

  const complementRel2: RemedyRelationship = {
    id: 'rel-2',
    primaryRemedyId: 'rem-calc',
    relatedRemedyId: 'rem-lyc',
    relatedAbbr: 'Lyc.',
    relatedFullName: 'Lycopodium Clavatum',
    type: 'complement',
    notes: 'Calcarea is followed well by Lycopodium.',
  };

  const inimicalRel: RemedyRelationship = {
    id: 'rel-phos-nux',
    primaryRemedyId: 'rem-phos',
    relatedRemedyId: 'rem-nux-v',
    relatedAbbr: 'Nux-v.',
    relatedFullName: 'Nux Vomica',
    type: 'inimical',
    notes: 'Phosphorus and Nux vomica are inimical in nervous and paralytic affections.',
  };

  describe('Relationship Analysis & Inimical Flagging', () => {
    it('detects inimical incompatibility between candidate remedies', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: phosRemedy, monograph: phosMono, relationships: [inimicalRel] },
        { remedy: nuxRemedy, monograph: nuxMono, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);

      expect(result.inimicalConflicts).toHaveLength(1);
      expect(result.inimicalConflicts[0].remedyA).toBe('Phos.');
      expect(result.inimicalConflicts[0].remedyB).toBe('Nux-v.');
      expect(result.inimicalConflicts[0].notes).toContain('inimical');
      expect(result.complementaryLinks).toHaveLength(0);
    });

    it('detects complementary synergies between related pairs', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [complementRel1] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);

      expect(result.inimicalConflicts).toHaveLength(0);
      expect(result.complementaryLinks).toHaveLength(1);
      expect(result.complementaryLinks[0].remedyA).toBe('Sulph.');
      expect(result.complementaryLinks[0].remedyB).toBe('Calc.');
      expect(result.complementaryLinks[0].notes).toContain('Calcarea');
    });

    it('identifies multiple complementary links in a 3-remedy cycle', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [complementRel1] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [complementRel2] },
        { remedy: lycRemedy, monograph: lycMono, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);

      expect(result.complementaryLinks).toHaveLength(2);
      expect(result.complementaryLinks.some((l) => l.remedyA === 'Sulph.' && l.remedyB === 'Calc.')).toBe(true);
      expect(result.complementaryLinks.some((l) => l.remedyA === 'Calc.' && l.remedyB === 'Lyc.')).toBe(true);
    });
  });

  describe('Shared Organ Affinities Detection', () => {
    it('computes intersecting organ affinities across selected remedies', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [] },
        { remedy: lycRemedy, monograph: lycMono, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);

      // Sulph & Calc share "Venous system"
      // Sulph & Lyc share "Skin", "Gastrointestinal tract"
      expect(result.sharedAffinities).toContain('Venous System');
      expect(result.sharedAffinities).toContain('Skin');
      expect(result.sharedAffinities).toContain('Gastrointestinal Tract');
    });

    it('returns empty shared affinities if fewer than 2 remedies have monographs', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [] },
        { remedy: calcRemedy, monograph: undefined, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);
      expect(result.sharedAffinities).toEqual([]);
    });
  });

  describe('Modality Contrasts Analysis', () => {
    it('differentiates thermal polarities correctly', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [] },
      ];

      const contrasts = detectModalityContrasts(slots);
      const thermalFactor = contrasts.find((c) => c.factor === 'Thermal Sensitivity');

      expect(thermalFactor).toBeDefined();
      expect(thermalFactor?.descriptions['Sulph.']).toBe('Hot');
      expect(thermalFactor?.descriptions['Calc.']).toBe('Chilly');
    });

    it('differentiates motion vs rest modalities', () => {
      // Sulph: Agg rest, Amel motion -> '> Motion (Better moving)'
      // Calc: Agg physical exertion -> '< Motion (Must rest)' or neutral depending on match
      // Lyc: Agg rest, Amel motion -> '> Motion (Better moving)'
      // Nux: Agg open air, Amel rest -> '< Motion (Must rest)' (as Nux doesn't have agg motion, check logic)
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [] },
        { remedy: lycRemedy, monograph: lycMono, relationships: [] },
      ];

      const contrasts = detectModalityContrasts(slots);
      const motionFactor = contrasts.find((c) => c.factor === 'Motion vs. Rest');

      expect(motionFactor).toBeDefined();
      expect(motionFactor?.descriptions['Sulph.']).toBe('> Motion (Better moving)');
      expect(motionFactor?.descriptions['Lyc.']).toBe('> Motion (Better moving)');
    });

    it('differentiates cold drink / application responses', () => {
      // Phos has cold in agg (Cold weather) and amel (Cold food and drinks)
      // -> 'Agg by cold air / Amel by cold drinks'
      const slots: RemedyComparisonSlot[] = [
        { remedy: phosRemedy, monograph: phosMono, relationships: [] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [] },
      ];

      const contrasts = detectModalityContrasts(slots);
      const coldFactor = contrasts.find((c) => c.factor === 'Cold Applications / Drinks');

      expect(coldFactor).toBeDefined();
      expect(coldFactor?.descriptions['Phos.']).toBe('Agg by cold air / Amel by cold drinks');
      expect(coldFactor?.descriptions['Calc.']).toBe('< Cold (Aggravated)');
    });
  });

  describe('Edge Cases and Stability', () => {
    it('handles empty comparison slots without error', () => {
      const result = buildDifferentialComparison([]);
      expect(result.slots).toEqual([]);
      expect(result.inimicalConflicts).toEqual([]);
      expect(result.complementaryLinks).toEqual([]);
      expect(result.sharedAffinities).toEqual([]);

      const contrasts = detectModalityContrasts([]);
      expect(contrasts.length).toBeGreaterThan(0);
      expect(Object.keys(contrasts[0].descriptions)).toHaveLength(0);
    });

    it('handles a single comparison slot gracefully', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [complementRel1] },
      ];

      const result = buildDifferentialComparison(slots);
      expect(result.inimicalConflicts).toHaveLength(0);
      expect(result.complementaryLinks).toHaveLength(0);
      expect(result.sharedAffinities).toHaveLength(0);
    });

    it('handles up to 4 maximum remedies simultaneously', () => {
      const slots: RemedyComparisonSlot[] = [
        { remedy: sulphRemedy, monograph: sulphMono, relationships: [complementRel1] },
        { remedy: calcRemedy, monograph: calcMono, relationships: [complementRel2] },
        { remedy: phosRemedy, monograph: phosMono, relationships: [inimicalRel] },
        { remedy: nuxRemedy, monograph: nuxMono, relationships: [] },
      ];

      const result = buildDifferentialComparison(slots);
      expect(result.slots).toHaveLength(4);
      expect(result.inimicalConflicts).toHaveLength(1);
      expect(result.inimicalConflicts[0].remedyA).toBe('Phos.');
      expect(result.inimicalConflicts[0].remedyB).toBe('Nux-v.');
      expect(result.complementaryLinks).toHaveLength(1);
      expect(result.complementaryLinks[0].remedyA).toBe('Sulph.');
      expect(result.complementaryLinks[0].remedyB).toBe('Calc.');

      const contrasts = detectModalityContrasts(slots);
      expect(Object.keys(contrasts[0].descriptions)).toHaveLength(4);
    });
  });
});
