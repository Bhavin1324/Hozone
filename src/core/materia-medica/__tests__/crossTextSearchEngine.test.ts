import { describe, it, expect } from 'vitest';
import {
  searchCrossTextMateriaMedica,
  generateContextSnippet,
} from '../crossTextSearchEngine';
import type { RemedyMonograph } from '@/features/materia-medica/types';

const MOCK_MONOGRAPHS: RemedyMonograph[] = [
  {
    id: 'm1',
    remedyId: 'rem-ars',
    abbreviation: 'Ars.',
    fullName: 'Arsenicum Album',
    bookId: 'book-boericke',
    bookTitle: 'Boericke Materia Medica',
    mind: 'Restlessness, anguish, fear of death.',
    physicalGenerals: 'Burning pains like coals of fire, relieved by heat.',
    keynotes: 'Midnight aggravation. Sips water.',
    modalitiesAgg: ['Cold drinks', 'Midnight'],
    modalitiesAmel: ['Heat', 'Warm drinks'],
    organAffinities: ['Gastrointestinal tract', 'Skin'],
  },
  {
    id: 'm2',
    remedyId: 'rem-ars',
    abbreviation: 'Ars.',
    fullName: 'Arsenicum Album',
    bookId: 'book-allen',
    bookTitle: 'Allen Keynotes',
    mind: 'Anguish and restlessness, fastidious.',
    physicalGenerals: 'Burning pains like hot needles; parts burn like fire, relieved by heat.',
    keynotes: 'Cannot bear smell of food. Rapid prostration.',
    modalitiesAgg: ['Cold open air'],
    modalitiesAmel: ['Warm wraps', 'Warm drinks'],
    organAffinities: ['Heart', 'Mucous membranes'],
    clinicalIndications: ['Asthma', 'Psoriasis'],
    comparisons: 'Compare: Secale in burning pains; Secale wants cold, Ars. wants heat.',
  },
  {
    id: 'm3',
    remedyId: 'rem-sulph',
    abbreviation: 'Sulph.',
    fullName: 'Sulphur',
    bookId: 'book-boericke',
    bookTitle: 'Boericke Materia Medica',
    mind: 'Philosophical, ragged philosopher.',
    physicalGenerals: 'Burning heat in vertex, palms, and soles. Puts feet out of bed.',
    keynotes: '11 AM hunger. Redness of orifices.',
    modalitiesAgg: ['Warmth of bed', 'Standing'],
    modalitiesAmel: ['Open air'],
    organAffinities: ['Skin', 'Venous system'],
  },
  {
    id: 'm4',
    remedyId: 'rem-puls',
    abbreviation: 'Puls.',
    fullName: 'Pulsatilla Pratensis',
    bookId: 'book-boericke',
    bookTitle: 'Boericke Materia Medica',
    mind: 'Gentle, mild, yielding disposition. Weeps easily.',
    physicalGenerals: 'Thirstless. Wandering shifting pains.',
    keynotes: 'Wants open cool air. Aversion to fats.',
    modalitiesAgg: ['Warm room', 'Rich food'],
    modalitiesAmel: ['Cool open air', 'Consolation'],
    organAffinities: ['Mucous membranes', 'Veins'],
  },
];

describe('CrossTextSearchEngine', () => {
  it('returns empty results for empty or blank search query', () => {
    const res = searchCrossTextMateriaMedica('', MOCK_MONOGRAPHS);
    expect(res.totalHits).toBe(0);
    expect(res.matches).toHaveLength(0);
    expect(res.frequencyRanking).toHaveLength(0);
  });

  it('performs AND search matching across all tokens by default', () => {
    const res = searchCrossTextMateriaMedica('burning heat', MOCK_MONOGRAPHS);
    expect(res.totalHits).toBeGreaterThan(0);
    // Both Ars. (burning ... heat) and Sulph. (burning heat) match
    const remedies = res.matches.map((m) => m.remedyAbbr);
    expect(remedies).toContain('Ars.');
    expect(remedies).toContain('Sulph.');
    expect(remedies).not.toContain('Puls.');
  });

  it('performs exact phrase search when mode is phrase', () => {
    const res = searchCrossTextMateriaMedica('coals of fire', MOCK_MONOGRAPHS, [], {
      mode: 'phrase',
    });
    expect(res.totalHits).toBe(1);
    expect(res.matches[0].remedyAbbr).toBe('Ars.');
    expect(res.matches[0].bookTitle).toBe('Boericke Materia Medica');
  });

  it('performs OR search matching when mode is any', () => {
    const res = searchCrossTextMateriaMedica('philosophical thirstless', MOCK_MONOGRAPHS, [], {
      mode: 'any',
    });
    const remedies = res.frequencyRanking.map((r) => r.remedyAbbr);
    expect(remedies).toContain('Sulph.');
    expect(remedies).toContain('Puls.');
  });

  it('filters results by specific book IDs', () => {
    const res = searchCrossTextMateriaMedica('burning', MOCK_MONOGRAPHS, [], {
      bookIds: ['book-allen'],
    });
    expect(res.totalHits).toBeGreaterThan(0);
    expect(res.matches.every((m) => m.bookId === 'book-allen')).toBe(true);
  });

  it('filters results by specific sections (e.g. only Mind)', () => {
    const res = searchCrossTextMateriaMedica('restlessness', MOCK_MONOGRAPHS, [], {
      sections: ['mind'],
    });
    expect(res.totalHits).toBeGreaterThan(0);
    expect(res.matches.every((m) => m.section === 'mind')).toBe(true);
  });

  it('ranks remedies by descending hit frequency across multi-book provings', () => {
    const res = searchCrossTextMateriaMedica('burning', MOCK_MONOGRAPHS);
    expect(res.frequencyRanking.length).toBeGreaterThan(0);
    // Arsenicum matches in both Boericke and Allen (multiple sections)
    expect(res.frequencyRanking[0].remedyAbbr).toBe('Ars.');
    expect(res.frequencyRanking[0].booksCount).toBe(2);
  });

  it('extracts contextual snippet with ellipsis for long text', () => {
    const snippet = generateContextSnippet(
      'Deep anxiety and prostration followed by rapid midnight agitation and thirst.',
      ['midnight'],
      15
    );
    expect(snippet).toContain('midnight');
    expect(snippet.startsWith('...')).toBe(true);
  });
});
