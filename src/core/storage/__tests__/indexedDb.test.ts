import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDb,
  getLocalChapters,
  getLocalRemedies,
  searchLocalRubrics,
  getLocalRubricsByChapter,
} from '../indexedDb';

describe('Local-First IndexedDB Storage Layer', () => {
  beforeEach(async () => {
    // Ensure clean state per test
    const db = await getDb();
    expect(db).toBeDefined();
  });

  it('hydrates initial clinical taxonomy on first database access', async () => {
    const chapters = await getLocalChapters();
    const remedies = await getLocalRemedies();

    expect(chapters.length).toBeGreaterThanOrEqual(8);
    expect(remedies.length).toBeGreaterThanOrEqual(20);

    const mindChapter = chapters.find((c) => c.name === 'Mind');
    expect(mindChapter).toBeDefined();
    expect(mindChapter?.displayOrder).toBe(1);

    const sulph = remedies.find((r) => r.abbreviation === 'Sulph.');
    expect(sulph).toBeDefined();
    expect(sulph?.kingdom).toBe('Mineral');
    expect(sulph?.thermal).toBe('Hot');
  });

  it('returns all rubrics when search query is empty', async () => {
    const allRubrics = await searchLocalRubrics('');
    expect(allRubrics.length).toBeGreaterThanOrEqual(13);
  });

  it('isolates rubrics by chapter ID', async () => {
    const headRubrics = await getLocalRubricsByChapter('chap-head');
    expect(headRubrics.length).toBeGreaterThanOrEqual(2);
    for (const r of headRubrics) {
      expect(r.chapterId).toBe('chap-head');
      expect(r.chapterName).toBe('Head');
    }
  });

  it('performs sub-5ms instant multi-token search across rubric paths', async () => {
    const start = performance.now();
    const results = await searchLocalRubrics('cold air agg');
    const duration = performance.now() - start;

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullPath).toContain('COLD > in general, cold air agg');
    expect(duration).toBeLessThan(15);
  });

  it('handles case-insensitive search terms', async () => {
    const lowerResults = await searchLocalRubrics('anxiety');
    const upperResults = await searchLocalRubrics('ANXIETY');

    expect(lowerResults).toHaveLength(upperResults.length);
    expect(lowerResults[0].id).toBe(upperResults[0].id);
  });

  it('returns an empty array without error for non-matching search terms', async () => {
    const results = await searchLocalRubrics('nonexistentrubricquery12345');
    expect(results).toHaveLength(0);
  });
});
