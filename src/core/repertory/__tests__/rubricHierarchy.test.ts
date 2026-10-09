import { describe, it, expect } from 'vitest';
import type { Rubric } from '@/features/repertory/types';
import rubricsCatalog from '@/core/storage/data/rubricsCatalog.json';

describe('Hierarchical Rubric Engine (Phase C)', () => {
  const rubrics = rubricsCatalog as Rubric[];

  it('contains multi-tiered rubrics with depth levels 1, 2, and 3', () => {
    const depths = new Set(rubrics.map((r) => r.depth));
    expect(depths.has(1)).toBe(true);
    expect(depths.has(2)).toBe(true);
    expect(depths.has(3)).toBe(true);
  });

  it('correctly maps parent-child relationships for clinical symptoms', () => {
    const parentRubric = rubrics.find((r) => r.id === 'rub-mind-anxiety');
    expect(parentRubric).toBeDefined();
    expect(parentRubric?.parentId).toBeFalsy();

    const childRubric = rubrics.find((r) => r.id === 'rub-mind-anx-anticipation');
    expect(childRubric).toBeDefined();
    expect(childRubric?.parentId).toBe('rub-mind-anxiety');

    const deepChild = rubrics.find((r) => r.id === 'rub-mind-anx-health-relatives');
    expect(deepChild).toBeDefined();
    expect(deepChild?.parentId).toBe('rub-mind-anx-health');
  });

  it('embeds authentic "See Also" cross-references for clinical navigation', () => {
    const healthAnx = rubrics.find((r) => r.id === 'rub-mind-anx-health');
    expect(healthAnx?.crossReferences).toBeDefined();
    expect(healthAnx?.crossReferences?.length).toBeGreaterThan(0);
    expect(healthAnx?.crossReferences).toContain('FEAR > disease, of');
  });

  it('provides graded remedies covering polychrests and rare remedies', () => {
    const photophobia = rubrics.find((r) => r.id === 'rub-eye-photophobia');
    expect(photophobia).toBeDefined();
    expect(photophobia?.entries.length).toBeGreaterThan(0);

    const bellGrade = photophobia?.entries.find((e) => e.abbreviation === 'Bell.');
    expect(bellGrade?.grade).toBe(4);
  });
});
