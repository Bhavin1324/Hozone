import type { Remedy } from '@/features/repertory/types';
import type {
  CrossTextSearchMatch,
  CrossTextSearchMode,
  CrossTextSearchResult,
  CrossTextSearchSection,
  RemedyMonograph,
  RemedySearchFrequency,
} from '@/features/materia-medica/types';

export interface CrossTextSearchOptions {
  bookIds?: string[];
  remedyIds?: string[];
  sections?: CrossTextSearchSection[];
  mode?: CrossTextSearchMode;
}

const ALL_SECTIONS: CrossTextSearchSection[] = [
  'keynotes',
  'mind',
  'physicals',
  'modalitiesAgg',
  'modalitiesAmel',
  'organAffinities',
  'clinicalIndications',
  'comparisons',
];

/**
 * Executes high-performance multi-book Materia Medica cross-text search with
 * occurrence frequency ranking and contextual snippet extraction.
 */
export function searchCrossTextMateriaMedica(
  query: string,
  monographs: RemedyMonograph[],
  remedies: Remedy[] = [],
  options: CrossTextSearchOptions = {}
): CrossTextSearchResult {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return {
      query: '',
      totalHits: 0,
      frequencyRanking: [],
      matches: [],
    };
  }

  const mode = options.mode || 'all';
  const filterBooks = options.bookIds && options.bookIds.length > 0 ? new Set(options.bookIds) : null;
  const filterRemedies = options.remedyIds && options.remedyIds.length > 0 ? new Set(options.remedyIds) : null;
  const filterSections = options.sections && options.sections.length > 0 ? new Set(options.sections) : null;

  const tokens = cleanQuery.split(/\s+/).filter((t) => t.length > 0);
  const remedyMap = new Map<string, Remedy>(remedies.map((r) => [r.id, r]));

  const matches: CrossTextSearchMatch[] = [];

  for (const mono of monographs) {
    if (filterBooks && !filterBooks.has(mono.bookId)) continue;
    if (filterRemedies && !filterRemedies.has(mono.remedyId)) continue;

    const sectionsToCheck: Array<{ section: CrossTextSearchSection; text: string }> = [
      { section: 'keynotes', text: mono.keynotes || '' },
      { section: 'mind', text: mono.mind || '' },
      { section: 'physicals', text: mono.physicalGenerals || '' },
      { section: 'modalitiesAgg', text: (mono.modalitiesAgg || []).join('; ') },
      { section: 'modalitiesAmel', text: (mono.modalitiesAmel || []).join('; ') },
      { section: 'organAffinities', text: (mono.organAffinities || []).join(', ') },
      { section: 'clinicalIndications', text: (mono.clinicalIndications || []).join(', ') },
      { section: 'comparisons', text: mono.comparisons || '' },
    ];

    for (const { section, text } of sectionsToCheck) {
      if (filterSections && !filterSections.has(section)) continue;
      if (!text.trim()) continue;

      const lowerText = text.toLowerCase();
      let isMatch = false;
      const matchedTokens: string[] = [];

      if (mode === 'phrase') {
        if (lowerText.includes(cleanQuery)) {
          isMatch = true;
          matchedTokens.push(cleanQuery);
        }
      } else if (mode === 'all') {
        isMatch = tokens.length > 0 && tokens.every((token) => lowerText.includes(token));
        if (isMatch) matchedTokens.push(...tokens);
      } else {
        // 'any'
        for (const token of tokens) {
          if (lowerText.includes(token)) {
            isMatch = true;
            matchedTokens.push(token);
          }
        }
      }

      if (isMatch) {
        const snippet = generateContextSnippet(text, matchedTokens);
        matches.push({
          monographId: mono.id,
          remedyId: mono.remedyId,
          remedyAbbr: mono.abbreviation,
          remedyFullName: mono.fullName,
          bookId: mono.bookId,
          bookTitle: mono.bookTitle,
          bookCode: mono.bookId,
          section,
          snippet,
          matchedTerms: matchedTokens,
        });
      }
    }
  }

  // Aggregate Remedy occurrence frequency ranking
  const frequencyMap = new Map<
    string,
    {
      remedyAbbr: string;
      remedyFullName: string;
      books: Set<string>;
      sections: Set<CrossTextSearchSection>;
      count: number;
    }
  >();

  for (const match of matches) {
    let entry = frequencyMap.get(match.remedyId);
    if (!entry) {
      entry = {
        remedyAbbr: match.remedyAbbr,
        remedyFullName: match.remedyFullName,
        books: new Set(),
        sections: new Set(),
        count: 0,
      };
      frequencyMap.set(match.remedyId, entry);
    }
    entry.count += 1;
    entry.books.add(match.bookId);
    entry.sections.add(match.section);
  }

  const frequencyRanking: RemedySearchFrequency[] = Array.from(frequencyMap.entries())
    .map(([remedyId, entry]) => ({
      remedyId,
      remedyAbbr: entry.remedyAbbr,
      remedyFullName: entry.remedyFullName,
      kingdom: remedyMap.get(remedyId)?.kingdom,
      totalHits: entry.count,
      booksCount: entry.books.size,
      matchedSections: Array.from(entry.sections),
    }))
    .sort((a, b) => b.totalHits - a.totalHits || a.remedyFullName.localeCompare(b.remedyFullName));

  return {
    query,
    totalHits: matches.length,
    frequencyRanking,
    matches,
  };
}

/**
 * Extracts concise context snippet with surrounding clinical phrase boundary.
 */
export function generateContextSnippet(text: string, terms: string[], radius = 55): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  let firstIdx = -1;

  for (const t of terms) {
    const idx = lower.indexOf(t.toLowerCase());
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }

  if (firstIdx === -1) {
    return text.length > radius * 2 ? `${text.slice(0, radius * 2)}...` : text;
  }

  const start = Math.max(0, firstIdx - radius);
  const end = Math.min(text.length, firstIdx + radius + 30);

  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `...${snippet}`;
  if (end < text.length) snippet = `${snippet}...`;

  return snippet;
}

export { ALL_SECTIONS };
