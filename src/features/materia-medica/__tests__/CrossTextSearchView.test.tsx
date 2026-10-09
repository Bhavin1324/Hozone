import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CrossTextSearchView } from '../components/CrossTextSearchView';
import type {
  CrossTextSearchResult,
  MateriaMedicaBook,
} from '../types';

const MOCK_BOOKS: MateriaMedicaBook[] = [
  {
    id: 'book-boericke',
    code: 'BOERICKE_MM',
    title: 'Pocket Manual of Homeopathic Materia Medica',
    author: 'Dr. William Boericke',
    editionYear: 1927,
    description: 'Concise compendium',
  },
  {
    id: 'book-allen',
    code: 'ALLEN_KEYNOTES',
    title: 'Keynotes and Characteristics with Comparisons',
    author: 'Dr. Henry C. Allen',
    editionYear: 1898,
    description: 'Guiding symptoms',
  },
];

const MOCK_SEARCH_RESULT: CrossTextSearchResult = {
  query: 'burning heat',
  totalHits: 2,
  frequencyRanking: [
    {
      remedyId: 'rem-ars',
      remedyAbbr: 'Ars.',
      remedyFullName: 'Arsenicum Album',
      totalHits: 2,
      booksCount: 2,
      matchedSections: ['physicals', 'keynotes'],
    },
  ],
  matches: [
    {
      monographId: 'm1',
      remedyId: 'rem-ars',
      remedyAbbr: 'Ars.',
      remedyFullName: 'Arsenicum Album',
      bookId: 'book-allen',
      bookTitle: 'Allen Keynotes',
      bookCode: 'ALLEN_KEYNOTES',
      section: 'physicals',
      snippet: '...Burning pains like hot needles; parts burn like fire...',
      matchedTerms: ['burning', 'heat'],
    },
    {
      monographId: 'm2',
      remedyId: 'rem-ars',
      remedyAbbr: 'Ars.',
      remedyFullName: 'Arsenicum Album',
      bookId: 'book-boericke',
      bookTitle: 'Boericke Materia Medica',
      bookCode: 'BOERICKE_MM',
      section: 'keynotes',
      snippet: '...Burning discharges thin, offensive, relieved by heat...',
      matchedTerms: ['burning', 'heat'],
    },
  ],
};

describe('CrossTextSearchView Component', () => {
  it('renders search input and triggers query changes', () => {
    const handleQueryChange = vi.fn();
    render(
      <CrossTextSearchView
        searchResult={MOCK_SEARCH_RESULT}
        books={MOCK_BOOKS}
        query="burning"
        onQueryChange={handleQueryChange}
        matchMode="all"
        onMatchModeChange={vi.fn()}
        selectedBookFilters={[]}
        onToggleBookFilter={vi.fn()}
        selectedSectionFilters={[]}
        onToggleSectionFilter={vi.fn()}
        onResetFilters={vi.fn()}
        selectedRemedyIds={[]}
        onAddToCompare={vi.fn()}
        onOpenInReader={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Search symptom, modality/i);
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: 'restlessness' } });
    expect(handleQueryChange).toHaveBeenCalledWith('restlessness');
  });

  it('renders book filter chips and handles selection toggles', () => {
    const handleToggleBook = vi.fn();
    render(
      <CrossTextSearchView
        searchResult={MOCK_SEARCH_RESULT}
        books={MOCK_BOOKS}
        query=""
        onQueryChange={vi.fn()}
        matchMode="all"
        onMatchModeChange={vi.fn()}
        selectedBookFilters={['book-allen']}
        onToggleBookFilter={handleToggleBook}
        selectedSectionFilters={[]}
        onToggleSectionFilter={vi.fn()}
        onResetFilters={vi.fn()}
        selectedRemedyIds={[]}
        onAddToCompare={vi.fn()}
        onOpenInReader={vi.fn()}
      />
    );

    const allenBtn = screen.getByText(/Keynotes.*Allen/i);
    expect(allenBtn).toBeDefined();

    fireEvent.click(allenBtn);
    expect(handleToggleBook).toHaveBeenCalledWith('book-allen');
  });

  it('renders remedy frequency ranking cards with hit counts', () => {
    const handleAddToCompare = vi.fn();
    render(
      <CrossTextSearchView
        searchResult={MOCK_SEARCH_RESULT}
        books={MOCK_BOOKS}
        query="burning"
        onQueryChange={vi.fn()}
        matchMode="all"
        onMatchModeChange={vi.fn()}
        selectedBookFilters={[]}
        onToggleBookFilter={vi.fn()}
        selectedSectionFilters={[]}
        onToggleSectionFilter={vi.fn()}
        onResetFilters={vi.fn()}
        selectedRemedyIds={[]}
        onAddToCompare={handleAddToCompare}
        onOpenInReader={vi.fn()}
      />
    );

    expect(screen.getByText('Remedy Frequency Ranking')).toBeDefined();
    expect(screen.getByText('2 hits')).toBeDefined();

    const compareBtn = screen.getAllByRole('button', { name: /compare/i })[0];
    fireEvent.click(compareBtn);
    expect(handleAddToCompare).toHaveBeenCalledWith('rem-ars');
  });

  it('handles navigation into Monograph Reader from citation hits', () => {
    const handleOpenInReader = vi.fn();
    render(
      <CrossTextSearchView
        searchResult={MOCK_SEARCH_RESULT}
        books={MOCK_BOOKS}
        query="burning"
        onQueryChange={vi.fn()}
        matchMode="all"
        onMatchModeChange={vi.fn()}
        selectedBookFilters={[]}
        onToggleBookFilter={vi.fn()}
        selectedSectionFilters={[]}
        onToggleSectionFilter={vi.fn()}
        onResetFilters={vi.fn()}
        selectedRemedyIds={[]}
        onAddToCompare={vi.fn()}
        onOpenInReader={handleOpenInReader}
      />
    );

    const readButtons = screen.getAllByRole('button', { name: /read monograph/i });
    expect(readButtons.length).toBe(2);

    fireEvent.click(readButtons[0]);
    expect(handleOpenInReader).toHaveBeenCalledWith('rem-ars', 'book-allen');
  });
});
