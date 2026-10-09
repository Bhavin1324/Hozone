import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDb,
  getLocalRepertories,
  getLocalRepertoriesByCategory,
  getLocalChapters,
  searchLocalRubrics,
  getLocalRubricChildren,
} from '../indexedDb';

describe('43+ Repertories & Hierarchical Rubric Catalog Storage (Phase C)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  it('hydrates >= 43 authoritative repertories into IndexedDB storage', async () => {
    const repertories = await getLocalRepertories();
    expect(repertories.length).toBeGreaterThanOrEqual(43);

    const kent = repertories.find((r) => r.code === 'KENT_CORE');
    expect(kent).toBeDefined();
    expect(kent?.isDefault).toBe(true);

    const complete = repertories.find((r) => r.code === 'COMPLETE_2024');
    expect(complete).toBeDefined();
    expect(complete?.title).toContain('Complete Repertory 2024');
  });

  it('retrieves repertories accurately by clinical category', async () => {
    const masterReps = await getLocalRepertoriesByCategory('Master General & Classical');
    expect(masterReps.length).toBeGreaterThanOrEqual(8);

    const clinicalReps = await getLocalRepertoriesByCategory('Clinical & General Practice');
    expect(clinicalReps.length).toBeGreaterThanOrEqual(10);

    const regionalReps = await getLocalRepertoriesByCategory('Regional & Organ Therapeutics');
    expect(regionalReps.length).toBeGreaterThanOrEqual(12);

    const sensationsReps = await getLocalRepertoriesByCategory('Sensations, Causation & Modalities');
    expect(sensationsReps.length).toBeGreaterThanOrEqual(7);

    const modernReps = await getLocalRepertoriesByCategory('Modern & Thematic Systems');
    expect(modernReps.length).toBeGreaterThanOrEqual(6);
  });

  it('hydrates and orders the complete 37 classical chapters', async () => {
    const chapters = await getLocalChapters();
    expect(chapters.length).toBeGreaterThanOrEqual(37);

    // Verify ordering by displayOrder
    for (let i = 0; i < chapters.length - 1; i++) {
      expect(chapters[i].displayOrder).toBeLessThanOrEqual(chapters[i + 1].displayOrder);
    }

    const mind = chapters.find((c) => c.id === 'chap-mind');
    expect(mind).toBeDefined();
    expect(mind?.displayOrder).toBe(1);

    const gen = chapters.find((c) => c.id === 'chap-generalities');
    expect(gen).toBeDefined();
    expect(gen?.displayOrder).toBe(37);
  });

  it('queries child sub-rubrics using parentId hierarchy index', async () => {
    const children = await getLocalRubricChildren('rub-mind-anxiety');
    expect(children.length).toBeGreaterThanOrEqual(2);

    const anticipation = children.find((c) => c.id === 'rub-mind-anx-anticipation');
    expect(anticipation).toBeDefined();
    expect(anticipation?.parentId).toBe('rub-mind-anxiety');
  });

  it('searches rubrics across chapter and symptom terms', async () => {
    const results = await searchLocalRubrics('photophobia');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].fullPath).toContain('PHOTOPHOBIA');
  });
});
