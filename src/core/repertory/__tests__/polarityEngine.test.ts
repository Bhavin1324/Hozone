import { describe, it, expect } from 'vitest';
import { executePolarityAnalysis } from '../polarityEngine';
import type {
  ActiveCaseRubric,
  PolarSymptomPair,
  Remedy,
  Rubric,
} from '@/features/repertory/types';

describe('Boenninghausen Polarity Analysis Engine (executePolarityAnalysis)', () => {
  const polarPair: PolarSymptomPair = {
    id: 'pair-thermal',
    polarCode: 'POLAR_THERMAL_COLD_WARM',
    name: 'Thermal Sensitivity',
    category: 'Thermal',
    positiveLabel: '< Cold air',
    oppositeLabel: '< Warm room',
    positiveRubricPath: 'GENERALITIES > COLD > agg',
    oppositeRubricPath: 'GENERALITIES > WARMTH > agg',
  };

  const rubricColdAgg: Rubric = {
    id: 'rub-cold-agg',
    chapterId: 'chap-generalities',
    chapterName: 'Generalities',
    path: 'COLD > agg',
    fullPath: 'GENERALITIES > COLD > agg',
    depth: 2,
    remedyCount: 2,
    entries: [
      { remedyId: 'rem-ars', abbreviation: 'Ars.', grade: 4 }, // Chilly: grade 4 in cold agg
      { remedyId: 'rem-puls', abbreviation: 'Puls.', grade: 1 }, // Warm: grade 1 in cold agg
    ],
  };

  const rubricWarmthAgg: Rubric = {
    id: 'rub-warmth-agg',
    chapterId: 'chap-generalities',
    chapterName: 'Generalities',
    path: 'WARMTH > agg',
    fullPath: 'GENERALITIES > WARMTH > agg',
    depth: 2,
    remedyCount: 2,
    entries: [
      { remedyId: 'rem-puls', abbreviation: 'Puls.', grade: 4 }, // Warm: grade 4 in warmth agg (contraindication!)
    ],
  };

  const remedies: Remedy[] = [
    {
      id: 'rem-ars',
      abbreviation: 'Ars.',
      fullName: 'Arsenicum Album',
      commonName: 'White Oxide of Arsenic',
      kingdom: 'Mineral',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Prostration, burning pains relieved by heat, death anxiety.',
    },
    {
      id: 'rem-puls',
      abbreviation: 'Puls.',
      fullName: 'Pulsatilla Pratensis',
      commonName: 'Wind Flower',
      kingdom: 'Plant',
      thermal: 'Hot',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Changeable symptoms, weeping, better open air, thirstless.',
    },
  ];

  it('computes positive Polarity Difference (PD) for indicated remedy', () => {
    // Patient has: < Cold agg
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-cold-agg',
        fullPath: 'GENERALITIES > COLD > agg',
        chapterName: 'Generalities',
        weight: 1,
        isEliminating: false,
      },
    ];

    const output = executePolarityAnalysis({
      activeRubrics,
      polarPairs: [polarPair],
      allRubrics: [rubricColdAgg, rubricWarmthAgg],
      candidateRemedies: remedies,
    });

    expect(output.evaluatedPairCount).toBe(1);
    expect(output.rankedRemedies.length).toBeGreaterThan(0);

    const ars = output.rankedRemedies.find((r) => r.remedy.id === 'rem-ars');
    expect(ars).toBeDefined();
    expect(ars?.polarScore).toBe(4);
    expect(ars?.contraindicationScore).toBe(0);
    expect(ars?.polarityDifference).toBe(4); // 4 - 0 = +4
    expect(ars?.isContraindicated).toBe(false);
  });

  it('flags contraindications and negative PD for contrary remedies', () => {
    // Patient has: < Cold agg
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-cold-agg',
        fullPath: 'GENERALITIES > COLD > agg',
        chapterName: 'Generalities',
        weight: 1,
        isEliminating: false,
      },
    ];

    const output = executePolarityAnalysis({
      activeRubrics,
      polarPairs: [polarPair],
      allRubrics: [rubricColdAgg, rubricWarmthAgg],
      candidateRemedies: remedies,
    });

    const puls = output.rankedRemedies.find((r) => r.remedy.id === 'rem-puls');
    expect(puls).toBeDefined();
    expect(puls?.polarScore).toBe(1);
    expect(puls?.contraindicationScore).toBe(4);
    expect(puls?.polarityDifference).toBe(-3); // 1 - 4 = -3
    expect(puls?.isContraindicated).toBe(true);
    expect(puls?.contraindicationWarnings.length).toBeGreaterThan(0);
  });

  it('ranks non-contraindicated remedies above contraindicated remedies', () => {
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-cold-agg',
        fullPath: 'GENERALITIES > COLD > agg',
        chapterName: 'Generalities',
        weight: 1,
        isEliminating: false,
      },
    ];

    const output = executePolarityAnalysis({
      activeRubrics,
      polarPairs: [polarPair],
      allRubrics: [rubricColdAgg, rubricWarmthAgg],
      candidateRemedies: remedies,
    });

    expect(output.rankedRemedies[0].remedy.id).toBe('rem-ars');
    expect(output.rankedRemedies[0].isContraindicated).toBe(false);
  });

  it('handles empty active rubrics gracefully', () => {
    const output = executePolarityAnalysis({
      activeRubrics: [],
      polarPairs: [polarPair],
      allRubrics: [rubricColdAgg, rubricWarmthAgg],
      candidateRemedies: remedies,
    });

    expect(output.rankedRemedies).toEqual([]);
    expect(output.evaluatedPairCount).toBe(0);
  });
});
