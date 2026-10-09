import { describe, it, expect } from 'vitest';
import { mergeRubrics } from '../rubricMerger';
import type { Rubric } from '@/features/repertory/types';

describe('Synthetic Rubric Combining Engine (mergeRubrics)', () => {
  const rubricA: Rubric = {
    id: 'rub-headache-cold',
    chapterId: 'chap-head',
    chapterName: 'Head',
    path: 'PAIN > cold air agg',
    fullPath: 'HEAD > PAIN > cold air agg',
    depth: 2,
    remedyCount: 3,
    entries: [
      { remedyId: 'rem-bell', abbreviation: 'Bell.', grade: 3 },
      { remedyId: 'rem-bry', abbreviation: 'Bry.', grade: 2 },
      { remedyId: 'rem-ars', abbreviation: 'Ars.', grade: 4 },
    ],
  };

  const rubricB: Rubric = {
    id: 'rub-headache-winter',
    chapterId: 'chap-head',
    chapterName: 'Head',
    path: 'PAIN > winter in',
    fullPath: 'HEAD > PAIN > winter in',
    depth: 2,
    remedyCount: 3,
    entries: [
      { remedyId: 'rem-bry', abbreviation: 'Bry.', grade: 4 },
      { remedyId: 'rem-ars', abbreviation: 'Ars.', grade: 2 },
      { remedyId: 'rem-sulph', abbreviation: 'Sulph.', grade: 1 },
    ],
  };

  it('merges multiple rubrics using default max_grade strategy', () => {
    const combined = mergeRubrics([rubricA, rubricB]);

    expect(combined.isCombined).toBe(true);
    expect(combined.mergeStrategy).toBe('max_grade');
    expect(combined.sourceRubricIds).toEqual(['rub-headache-cold', 'rub-headache-winter']);
    expect(combined.remedyCount).toBe(4); // Bry, Ars, Bell, Sulph

    // Bryonia: grade 2 in A, grade 4 in B -> max = 4
    const bryEntry = combined.entries.find((e) => e.remedyId === 'rem-bry');
    expect(bryEntry?.grade).toBe(4);

    // Arsenicum: grade 4 in A, grade 2 in B -> max = 4
    const arsEntry = combined.entries.find((e) => e.remedyId === 'rem-ars');
    expect(arsEntry?.grade).toBe(4);

    // Belladonna: only in A -> grade = 3
    const bellEntry = combined.entries.find((e) => e.remedyId === 'rem-bell');
    expect(bellEntry?.grade).toBe(3);

    // Sulphur: only in B -> grade = 1
    const sulphEntry = combined.entries.find((e) => e.remedyId === 'rem-sulph');
    expect(sulphEntry?.grade).toBe(1);
  });

  it('merges multiple rubrics using sum_grades strategy', () => {
    const combined = mergeRubrics([rubricA, rubricB], { strategy: 'sum_grades' });

    expect(combined.mergeStrategy).toBe('sum_grades');

    // Bryonia: 2 + 4 = 6 -> capped at 4
    const bryEntry = combined.entries.find((e) => e.remedyId === 'rem-bry');
    expect(bryEntry?.grade).toBe(4);

    // Sulphur: 1 -> 1
    const sulphEntry = combined.entries.find((e) => e.remedyId === 'rem-sulph');
    expect(sulphEntry?.grade).toBe(1);
  });

  it('merges multiple rubrics using average strategy', () => {
    const combined = mergeRubrics([rubricA, rubricB], { strategy: 'average' });

    expect(combined.mergeStrategy).toBe('average');

    // Bryonia: (2 + 4) / 2 = 3
    const bryEntry = combined.entries.find((e) => e.remedyId === 'rem-bry');
    expect(bryEntry?.grade).toBe(3);

    // Arsenicum: (4 + 2) / 2 = 3
    const arsEntry = combined.entries.find((e) => e.remedyId === 'rem-ars');
    expect(arsEntry?.grade).toBe(3);
  });

  it('handles single rubric pass-through gracefully', () => {
    const combined = mergeRubrics([rubricA]);

    expect(combined.isCombined).toBe(true);
    expect(combined.id).toBe(rubricA.id);
    expect(combined.remedyCount).toBe(3);
  });

  it('throws an error if attempting to merge an empty rubric array', () => {
    expect(() => mergeRubrics([])).toThrow('Cannot merge an empty rubric list');
  });

  it('supports custom synthetic title', () => {
    const combined = mergeRubrics([rubricA, rubricB], {
      customTitle: 'Headache from Cold Exposure (Combined Clinical Symptom)',
    });

    expect(combined.fullPath).toBe('Headache from Cold Exposure (Combined Clinical Symptom)');
  });
});
