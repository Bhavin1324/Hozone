import { describe, it, expect } from 'vitest';
import { getQuickReferenceBooks, getBookPillLabel } from '../utils';
import type { MateriaMedicaBook } from '../types';

describe('Materia Medica Reference Text Utils', () => {
  const MOCK_BOOKS: MateriaMedicaBook[] = [
    {
      id: 'book-allen-encyc-1',
      code: 'ALLEN_ENCYC_1',
      title: 'The Encyclopedia of Pure Materia Medica — Vol. 1',
      author: 'Dr. Timothy Field Allen',
      editionYear: 1874,
      category: 'Encyclopedias & Dictionaries',
      description: 'Encyclopedia vol 1',
    },
    {
      id: 'book-allen-fevers',
      code: 'ALLEN_FEVERS',
      title: 'The Therapeutics of Fevers',
      author: 'Dr. Henry C. Allen',
      editionYear: 1884,
      category: 'Clinical & Guiding Keynotes',
      description: 'Fevers therapeutics',
    },
    {
      id: 'book-allen',
      code: 'ALLEN_KEYNOTES',
      title: 'Keynotes and Characteristics with Comparisons',
      author: 'Dr. Henry C. Allen',
      editionYear: 1898,
      category: 'Clinical & Guiding Keynotes',
      description: 'Keynotes',
    },
    {
      id: 'book-boericke',
      code: 'BOERICKE_MM',
      title: 'Pocket Manual of Homeopathic Materia Medica',
      author: 'Dr. William Boericke',
      editionYear: 1927,
      category: 'Clinical & Guiding Keynotes',
      description: 'Pocket manual',
    },
    {
      id: 'book-boger-synoptic',
      code: 'BOGER_SYNOPTIC',
      title: 'A Synoptic Key of the Materia Medica',
      author: 'Dr. Cyrus Maxwell Boger',
      editionYear: 1915,
      category: 'Clinical & Guiding Keynotes',
      description: 'Synoptic key',
    },
    {
      id: 'book-clarke',
      code: 'CLARKE_DICT',
      title: 'A Dictionary of Practical Materia Medica',
      author: 'Dr. John Henry Clarke',
      editionYear: 1902,
      category: 'Encyclopedias & Dictionaries',
      description: 'Dictionary',
    },
    {
      id: 'book-hahn-chronic-5',
      code: 'HAHN_CHRONIC_5',
      title: 'The Chronic Diseases — Antipsoric Remedies Vol. 5',
      author: 'Dr. Samuel Hahnemann',
      editionYear: 1839,
      category: 'Classical Foundations',
      description: 'Chronic diseases',
    },
    {
      id: 'book-kent',
      code: 'KENT_LECTURES',
      title: 'Lectures on Homeopathic Materia Medica',
      author: 'Dr. James Tyler Kent',
      editionYear: 1905,
      category: 'Philosophical & Constitutional Lectures',
      description: 'Lectures',
    },
  ];

  describe('getQuickReferenceBooks', () => {
    it('returns empty array when books input is empty', () => {
      expect(getQuickReferenceBooks([])).toEqual([]);
    });

    it('prioritizes distinct classical masters instead of alphabetical ID slice', () => {
      const quick = getQuickReferenceBooks(MOCK_BOOKS);
      expect(quick).toHaveLength(6);

      const codes = quick.map((b) => b.code);
      expect(codes).toEqual([
        'BOERICKE_MM',
        'KENT_LECTURES',
        'ALLEN_KEYNOTES',
        'CLARKE_DICT',
        'HAHN_CHRONIC_5',
        'BOGER_SYNOPTIC',
      ]);

      // Ensure it does not include alphabetical Allen duplicates
      expect(codes).not.toContain('ALLEN_ENCYC_1');
      expect(codes).not.toContain('ALLEN_FEVERS');
    });

    it('falls back to alternate Hahnemann volume if HAHN_CHRONIC_5 is absent', () => {
      const booksWithoutChronic5 = MOCK_BOOKS.filter((b) => b.code !== 'HAHN_CHRONIC_5').concat([
        {
          id: 'book-hahn-mmp-1',
          code: 'HAHN_MMP_1',
          title: 'Materia Medica Pura — Volume 1',
          author: 'Dr. Samuel Hahnemann',
          editionYear: 1811,
          category: 'Classical Foundations',
          description: 'MMP 1',
        },
      ]);

      const quick = getQuickReferenceBooks(booksWithoutChronic5);
      const codes = quick.map((b) => b.code);
      expect(codes).toContain('HAHN_MMP_1');
    });
  });

  describe('getBookPillLabel', () => {
    it('returns canonical author-title badges for classical master codes', () => {
      const boericke = MOCK_BOOKS.find((b) => b.code === 'BOERICKE_MM')!;
      const kent = MOCK_BOOKS.find((b) => b.code === 'KENT_LECTURES')!;
      const allen = MOCK_BOOKS.find((b) => b.code === 'ALLEN_KEYNOTES')!;
      const clarke = MOCK_BOOKS.find((b) => b.code === 'CLARKE_DICT')!;
      const hahnemann = MOCK_BOOKS.find((b) => b.code === 'HAHN_CHRONIC_5')!;
      const boger = MOCK_BOOKS.find((b) => b.code === 'BOGER_SYNOPTIC')!;

      expect(getBookPillLabel(boericke)).toBe('Pocket (Boericke)');
      expect(getBookPillLabel(kent)).toBe('Lectures (Kent)');
      expect(getBookPillLabel(allen)).toBe('Keynotes (Allen)');
      expect(getBookPillLabel(clarke)).toBe('Dictionary (Clarke)');
      expect(getBookPillLabel(hahnemann)).toBe('Chronic (Hahnemann)');
      expect(getBookPillLabel(boger)).toBe('Synoptic (Boger)');
    });

    it('matches /Keynotes.*Allen/i regex for backwards test compatibility', () => {
      const allen = MOCK_BOOKS.find((b) => b.code === 'ALLEN_KEYNOTES')!;
      expect(getBookPillLabel(allen)).toMatch(/Keynotes.*Allen/i);
    });

    it('never produces "The (" prefix for books starting with definite articles', () => {
      const fevers = MOCK_BOOKS.find((b) => b.code === 'ALLEN_FEVERS')!;
      const encyc = MOCK_BOOKS.find((b) => b.code === 'ALLEN_ENCYC_1')!;

      const feversLabel = getBookPillLabel(fevers);
      const encycLabel = getBookPillLabel(encyc);

      expect(feversLabel.startsWith('The (')).toBe(false);
      expect(encycLabel.startsWith('The (')).toBe(false);
      expect(feversLabel).toBe('Therapeutics (H.C. Allen)');
      expect(encycLabel).toBe('Encyclopedia (T.F. Allen)');
    });

    it('disambiguates between Dr. Henry C. Allen and Dr. Timothy Field Allen', () => {
      const hcAllen = MOCK_BOOKS.find((b) => b.code === 'ALLEN_FEVERS')!;
      const tfAllen = MOCK_BOOKS.find((b) => b.code === 'ALLEN_ENCYC_1')!;

      expect(getBookPillLabel(hcAllen)).toContain('H.C. Allen');
      expect(getBookPillLabel(tfAllen)).toContain('T.F. Allen');
    });
  });
});
