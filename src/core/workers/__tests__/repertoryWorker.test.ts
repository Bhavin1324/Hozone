import { describe, it, expect } from 'vitest';
import { executeRepertorization } from '../repertoryWorker';
import { INITIAL_REMEDIES, INITIAL_RUBRICS } from '@/core/storage/initialData';
import type {
  ActiveCaseRubric,
  FilterCriteria,
  Remedy,
  Rubric,
} from '@/features/repertory/types';

describe('Repertory Compute Engine (executeRepertorization)', () => {
  const defaultFilters: FilterCriteria = {
    thermals: [],
    miasms: [],
    kingdoms: [],
  };

  it('handles empty active rubrics gracefully', () => {
    const result = executeRepertorization({
      activeRubrics: [],
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });

    expect(result.rankedRemedies).toHaveLength(0);
    expect(result.qualifyingCount).toBe(0);
    expect(result.totalEvaluated).toBe(INITIAL_REMEDIES.length);
  });

  it('correctly ranks remedies under Coverage-First (Kent) model', () => {
    // Rubric 1: Lyc(3), Phos(2), Ars(2), Sil(3), Med(2)
    // Rubric 2: Phos(4), Bell(3), Calc(3), Puls(2), Acon(2)
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-anx-anticip',
        fullPath: 'MIND > ANXIETY > anticipation, from',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
      {
        rubricId: 'rub-m-fear-dark',
        fullPath: 'MIND > FEAR > dark, of the',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
    ];

    const result = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });

    // Phos covers BOTH rubrics (grade 2 in anx, grade 4 in fear -> coverage 2, score 6)
    const topRemedy = result.rankedRemedies[0];
    expect(topRemedy.remedy.abbreviation).toBe('Phos.');
    expect(topRemedy.coverageCount).toBe(2);
    expect(topRemedy.totalScore).toBe(6);
    expect(topRemedy.grades['rub-m-anx-anticip']).toBe(2);
    expect(topRemedy.grades['rub-m-fear-dark']).toBe(4);
  });

  it('correctly ranks remedies under Weighted-Sum model when total score outweighs coverage count', () => {
    const customRemedies: Remedy[] = [
      {
        id: 'rem-high-single',
        abbreviation: 'High.',
        fullName: 'High Single Remedy',
        commonName: 'High',
        kingdom: 'Plant',
        thermal: 'Hot',
        miasm: 'Psora',
        isPolychrest: false,
        shortKeynotes: 'Keynotes',
      },
      {
        id: 'rem-low-double',
        abbreviation: 'Double.',
        fullName: 'Double Low Remedy',
        commonName: 'Double',
        kingdom: 'Mineral',
        thermal: 'Chilly',
        miasm: 'Psora',
        isPolychrest: false,
        shortKeynotes: 'Keynotes',
      },
    ];

    const customRubrics: Rubric[] = [
      {
        id: 'rub-1',
        chapterId: 'chap-1',
        chapterName: 'Mind',
        path: 'Rubric 1',
        fullPath: 'MIND > Rubric 1',
        depth: 1,
        remedyCount: 2,
        entries: [
          { remedyId: 'rem-high-single', abbreviation: 'High.', grade: 4 },
          { remedyId: 'rem-low-double', abbreviation: 'Double.', grade: 1 },
        ],
      },
      {
        id: 'rub-2',
        chapterId: 'chap-1',
        chapterName: 'Mind',
        path: 'Rubric 2',
        fullPath: 'MIND > Rubric 2',
        depth: 1,
        remedyCount: 1,
        entries: [
          { remedyId: 'rem-low-double', abbreviation: 'Double.', grade: 1 },
        ],
      },
    ];

    const activeRubrics: ActiveCaseRubric[] = [
      { rubricId: 'rub-1', fullPath: 'MIND > Rubric 1', chapterName: 'Mind', weight: 1, isEliminating: false },
      { rubricId: 'rub-2', fullPath: 'MIND > Rubric 2', chapterName: 'Mind', weight: 1, isEliminating: false },
    ];

    // Under coverage_first: Double (coverage 2/2, score 2) beats High (coverage 1/2, score 4)
    const coverageResult = executeRepertorization({
      activeRubrics,
      allRubrics: customRubrics,
      allRemedies: customRemedies,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });
    expect(coverageResult.rankedRemedies[0].remedy.abbreviation).toBe('Double.');

    // Under weighted_sum: High (score 4) beats Double (score 2)
    const sumResult = executeRepertorization({
      activeRubrics,
      allRubrics: customRubrics,
      allRemedies: customRemedies,
      filters: defaultFilters,
      scoringModel: 'weighted_sum',
    });
    expect(sumResult.rankedRemedies[0].remedy.abbreviation).toBe('High.');
  });

  it('applies rubric weight multipliers correctly', () => {
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-anx-anticip', // Lyc has grade 3
        fullPath: 'MIND > ANXIETY > anticipation, from',
        chapterName: 'Mind',
        weight: 3, // Multiplier x3
        isEliminating: false,
      },
    ];

    const result = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });

    const lyc = result.rankedRemedies.find((r) => r.remedy.abbreviation === 'Lyc.');
    expect(lyc).toBeDefined();
    expect(lyc!.grades['rub-m-anx-anticip']).toBe(3);
    expect(lyc!.totalScore).toBe(9); // grade 3 * weight 3 = 9
  });

  it('strictly excludes remedies that do not cover eliminating rubrics', () => {
    // Rubric 1 has: Lyc(3), Phos(2), Ars(2), Sil(3), Med(2)
    // Rubric 2 has: Phos(4), Bell(3), Calc(3), Puls(2), Acon(2)
    // If Rubric 1 is marked as ELIMINATING, Bell, Calc, Puls, Acon must be discarded!
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-anx-anticip',
        fullPath: 'MIND > ANXIETY > anticipation, from',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: true, // Eliminating
      },
      {
        rubricId: 'rub-m-fear-dark',
        fullPath: 'MIND > FEAR > dark, of the',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
    ];

    const result = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });

    // Every qualifying remedy MUST have a grade in rub-m-anx-anticip
    for (const item of result.rankedRemedies) {
      expect(item.grades['rub-m-anx-anticip']).toBeGreaterThan(0);
    }

    // Belladonna only covers fear-dark, NOT anx-anticip, so it must be excluded
    const bell = result.rankedRemedies.find((r) => r.remedy.abbreviation === 'Bell.');
    expect(bell).toBeUndefined();
  });

  it('filters candidate remedies by Thermal state', () => {
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-g-heat-flushes', // Sulph(4)[Hot], Sep(3)[Chilly], Lach(3)[Hot], Calc(2)[Chilly], Puls(2)[Hot]
        fullPath: 'GENERALITIES > HEAT > flushes of heat',
        chapterName: 'Generalities',
        weight: 1,
        isEliminating: false,
      },
    ];

    const chillyResult = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: { ...defaultFilters, thermals: ['Chilly'] },
      scoringModel: 'coverage_first',
    });

    for (const r of chillyResult.rankedRemedies) {
      expect(r.remedy.thermal).toBe('Chilly');
    }

    const hotResult = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: { ...defaultFilters, thermals: ['Hot'] },
      scoringModel: 'coverage_first',
    });

    for (const r of hotResult.rankedRemedies) {
      expect(r.remedy.thermal).toBe('Hot');
    }
  });

  it('filters candidate remedies by Miasm', () => {
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-weep-easily', // Puls(4)[Sycosis], Sep(3)[Sycosis], Nat-m(3)[Sycosis], Calc(2)[Psora], Lyc(2)[Psora], Sil(2)[Psora]
        fullPath: 'MIND > WEEPING > easily, tearful mood',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
    ];

    const sycosisResult = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: { ...defaultFilters, miasms: ['Sycosis'] },
      scoringModel: 'coverage_first',
    });

    for (const r of sycosisResult.rankedRemedies) {
      expect(r.remedy.miasm).toBe('Sycosis');
    }
    expect(sycosisResult.rankedRemedies.some((r) => r.remedy.abbreviation === 'Puls.')).toBe(true);
  });

  it('filters candidate remedies by Kingdom classification', () => {
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-anx-anticip', // Lyc(3)[Plant], Phos(2)[Mineral], Ars(2)[Mineral], Sil(3)[Mineral], Med(2)[Nosode]
        fullPath: 'MIND > ANXIETY > anticipation, from',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
    ];

    const mineralResult = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: { ...defaultFilters, kingdoms: ['Mineral'] },
      scoringModel: 'coverage_first',
    });

    for (const r of mineralResult.rankedRemedies) {
      expect(r.remedy.kingdom).toBe('Mineral');
    }
  });

  it('handles multi-criteria combined filtering', () => {
    // Thermal Hot + Miasm Sycosis + Kingdom Plant should isolate Pulsatilla
    const activeRubrics: ActiveCaseRubric[] = [
      {
        rubricId: 'rub-m-weep-easily',
        fullPath: 'MIND > WEEPING > easily, tearful mood',
        chapterName: 'Mind',
        weight: 1,
        isEliminating: false,
      },
    ];

    const combinedResult = executeRepertorization({
      activeRubrics,
      allRubrics: INITIAL_RUBRICS,
      allRemedies: INITIAL_REMEDIES,
      filters: {
        thermals: ['Hot'],
        miasms: ['Sycosis'],
        kingdoms: ['Plant'],
      },
      scoringModel: 'coverage_first',
    });

    expect(combinedResult.rankedRemedies).toHaveLength(1);
    expect(combinedResult.rankedRemedies[0].remedy.abbreviation).toBe('Puls.');
  });

  it('stress test: scores 100 rubrics across 500 candidate remedies within benchmark threshold', () => {
    // Generate synthetic dataset of 500 remedies and 100 rubrics
    const syntheticRemedies: Remedy[] = Array.from({ length: 500 }, (_, i) => ({
      id: `synth-rem-${i}`,
      abbreviation: `Rem${i}`,
      fullName: `Synthetic Remedy ${i}`,
      commonName: `Common ${i}`,
      kingdom: i % 3 === 0 ? 'Plant' : i % 3 === 1 ? 'Mineral' : 'Animal',
      thermal: i % 2 === 0 ? 'Hot' : 'Chilly',
      miasm: 'Psora',
      isPolychrest: i < 50,
      shortKeynotes: 'Keynotes',
    }));

    const syntheticRubrics: Rubric[] = Array.from({ length: 100 }, (_, i) => ({
      id: `synth-rub-${i}`,
      chapterId: 'chap-synthetic',
      chapterName: 'Generalities',
      path: `SYMPTOM > rubric_${i}`,
      fullPath: `GENERALITIES > SYMPTOM > rubric_${i}`,
      depth: 2,
      remedyCount: 20,
      entries: Array.from({ length: 20 }, (_, j) => ({
        remedyId: `synth-rem-${(i * 5 + j) % 500}`,
        abbreviation: `Rem${(i * 5 + j) % 500}`,
        grade: ((j % 4) + 1) as 1 | 2 | 3 | 4,
      })),
    }));

    const activeRubrics: ActiveCaseRubric[] = syntheticRubrics.slice(0, 15).map((r, i) => ({
      rubricId: r.id,
      fullPath: r.fullPath,
      chapterName: r.chapterName,
      weight: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      isEliminating: i === 0, // First one is eliminating
    }));

    const start = performance.now();
    const result = executeRepertorization({
      activeRubrics,
      allRubrics: syntheticRubrics,
      allRemedies: syntheticRemedies,
      filters: defaultFilters,
      scoringModel: 'coverage_first',
    });
    const totalDuration = performance.now() - start;

    expect(result.rankedRemedies.length).toBeGreaterThan(0);
    // Computation benchmark should finish in under 25ms
    expect(totalDuration).toBeLessThan(25);
  });
});
