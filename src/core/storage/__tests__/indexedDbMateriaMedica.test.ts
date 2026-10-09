import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDb,
  getLocalBooks,
  getLocalMonograph,
  getLocalMonographs,
  getLocalMonographsByRemedy,
  getLocalRelationships,
  searchMateriaMedica,
} from '../indexedDb';

describe('Local-First IndexedDB Materia Medica Storage', () => {
  beforeEach(async () => {
    // Ensure DB connection is primed
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe('Reference Books & Multi-Book Support', () => {
    it('retrieves all classical reference books including Allen and Clarke and expanded 132-volume library', async () => {
      const books = await getLocalBooks();
      expect(books.length).toBeGreaterThanOrEqual(132);
      const codes = books.map((b) => b.code);
      expect(codes).toContain('BOERICKE_MM');
      expect(codes).toContain('KENT_LECTURES');
      expect(codes).toContain('ALLEN_KEYNOTES');
      expect(codes).toContain('CLARKE_DICT');
      expect(codes).toContain('HAHN_MMP_1');
      expect(codes).toContain('BOGER_SYNOPTIC');
    });

    it('filters books by clinical category', async () => {
      const classical = await getLocalBooks('Classical Foundations');
      expect(classical.length).toBeGreaterThan(0);
      expect(classical.every((b) => b.category === 'Classical Foundations')).toBe(true);

      const keynotes = await getLocalBooks('Clinical & Guiding Keynotes');
      expect(keynotes.length).toBeGreaterThan(0);
      expect(keynotes.every((b) => b.category === 'Clinical & Guiding Keynotes')).toBe(true);
    });

    it('retrieves distinct monographs for same remedy across different books', async () => {
      const boerickeMono = await getLocalMonograph('rem-sulph', 'book-boericke');
      const allenMono = await getLocalMonograph('rem-sulph', 'book-allen');

      expect(boerickeMono).toBeDefined();
      expect(boerickeMono?.bookTitle).toContain('Boericke');

      expect(allenMono).toBeDefined();
      expect(allenMono?.bookTitle).toContain('Allen');
      expect(allenMono?.comparisons).toContain('Compare: Calc. and Lyc.');
    });

    it('retrieves all monographs for a remedy across all available books including classical authors', async () => {
      const allSulph = await getLocalMonographsByRemedy('rem-sulph');
      expect(allSulph.length).toBeGreaterThanOrEqual(3);
      expect(allSulph.map((m) => m.bookId)).toContain('book-boericke');
      expect(allSulph.map((m) => m.bookId)).toContain('book-allen');
      expect(allSulph.some((m) => m.bookTitle.includes('Chronic Diseases'))).toBe(true);
    });
  });

  describe('Monograph Retrieval', () => {
    it('retrieves detailed monograph for a given remedy ID', async () => {
      const sulphMono = await getLocalMonograph('rem-sulph');

      expect(sulphMono).toBeDefined();
      expect(sulphMono?.abbreviation).toBe('Sulph.');
      expect(sulphMono?.fullName).toBe('Sulphur');
      expect(sulphMono?.keynotes).toContain('11 AM');
      expect(sulphMono?.mind.toLowerCase()).toContain('ragged philosopher');
      expect(sulphMono?.physicalGenerals).toContain('Burning heat');
      expect(sulphMono?.modalitiesAgg).toContain('Warmth of bed');
      expect(sulphMono?.organAffinities.some((a) => a.includes('Skin'))).toBe(true);
    });

    it('returns undefined when querying non-existent remedy ID', async () => {
      const nonExistent = await getLocalMonograph('rem-non-existent-999');
      expect(nonExistent).toBeUndefined();
    });

    it('batch retrieves multiple monographs for comparative workspace', async () => {
      const ids = ['rem-sulph', 'rem-calc', 'rem-lyc'];
      const monographs = await getLocalMonographs(ids);

      expect(monographs).toHaveLength(3);
      const abbrs = monographs.map((m) => m.abbreviation);
      expect(abbrs).toContain('Sulph.');
      expect(abbrs).toContain('Calc.');
      expect(abbrs).toContain('Lyc.');
    });

    it('skips invalid IDs during batch retrieval without throwing', async () => {
      const ids = ['rem-sulph', 'rem-fake-id-123', 'rem-calc'];
      const monographs = await getLocalMonographs(ids);

      expect(monographs).toHaveLength(2);
      const abbrs = monographs.map((m) => m.abbreviation);
      expect(abbrs).toContain('Sulph.');
      expect(abbrs).toContain('Calc.');
    });
  });

  describe('Clinical Relationships Network', () => {
    it('retrieves relationships where remedy is the primary subject', async () => {
      const relationships = await getLocalRelationships('rem-sulph');

      expect(relationships.length).toBeGreaterThan(0);
      const complement = relationships.find(
        (r) => r.type === 'complement' && (r.relatedAbbr === 'Calc.' || r.relatedAbbr === 'Lyc.')
      );
      expect(complement).toBeDefined();
    });

    it('retrieves inverse relationships where remedy is the related target', async () => {
      // Belladonna has rel-7 (Rhus-t -> Bell. as inimical) and rel-4 (Bell. -> Calc.)
      const relationships = await getLocalRelationships('rem-bell');

      expect(relationships.length).toBeGreaterThan(0);
      const inimicalWithRhus = relationships.find(
        (r) => r.type === 'inimical' && (r.primaryRemedyId === 'rem-rhus-t' || r.relatedRemedyId === 'rem-rhus-t')
      );
      expect(inimicalWithRhus).toBeDefined();
    });

    it('deduplicates relationships returned in graph query', async () => {
      const relationships = await getLocalRelationships('rem-calc');
      const ids = relationships.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('Full-Text Materia Medica Search', () => {
    it('returns all monographs when search string is empty', async () => {
      const all = await searchMateriaMedica('');
      expect(all.length).toBeGreaterThanOrEqual(6);
    });

    it('locates remedy monographs by symptom keynote keywords', async () => {
      const results = await searchMateriaMedica('boiled eggs');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].abbreviation).toBe('Calc.');
    });

    it('locates remedy monographs by modalities', async () => {
      const results = await searchMateriaMedica('warmth of bed');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((m) => m.abbreviation === 'Sulph.')).toBe(true);
    });

    it('performs multi-token search across mind and physicals', async () => {
      const results = await searchMateriaMedica('ragged philosopher');
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.every((m) => m.abbreviation === 'Sulph.')).toBe(true);
    });

    it('returns empty array when query does not match any remedy monograph', async () => {
      const results = await searchMateriaMedica('xyznonexistentphrases999');
      expect(results).toHaveLength(0);
    });
  });
});

