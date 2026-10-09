import type { MateriaMedicaBook } from './types';

/**
 * The 6 canonical classical master reference text codes in clinical priority order:
 * 1. Boericke (Pocket Manual)
 * 2. Kent (Lectures on Materia Medica)
 * 3. H.C. Allen (Keynotes and Characteristics)
 * 4. Clarke (Dictionary of Practical Materia Medica)
 * 5. Hahnemann (The Chronic Diseases / Materia Medica Pura)
 * 6. Boger (Synoptic Key of the Materia Medica)
 */
export const CANONICAL_QUICK_BOOK_CODES: readonly string[] = [
  'BOERICKE_MM',
  'KENT_LECTURES',
  'ALLEN_KEYNOTES',
  'CLARKE_DICT',
  'HAHN_CHRONIC_5',
  'BOGER_SYNOPTIC',
];

const HAHNEMANN_FALLBACK_CODES = ['HAHN_CHRONIC_5', 'HAHN_MMP_1', 'HAHN_CHRONIC_1', 'HAHN_MMP_2'];

/**
 * Returns a curated list of 6 distinct reference books for rapid author switching.
 * Instead of taking the first 6 alphabetical entries, prioritizes distinct classical masters.
 */
export function getQuickReferenceBooks(books: MateriaMedicaBook[]): MateriaMedicaBook[] {
  if (!books || books.length === 0) return [];

  const selected: MateriaMedicaBook[] = [];
  const selectedCodes = new Set<string>();

  for (const code of CANONICAL_QUICK_BOOK_CODES) {
    let match = books.find((b) => b.code === code);
    if (!match && code === 'HAHN_CHRONIC_5') {
      match = books.find((b) => HAHNEMANN_FALLBACK_CODES.includes(b.code));
    }
    if (match && !selectedCodes.has(match.code)) {
      selected.push(match);
      selectedCodes.add(match.code);
    }
  }

  // If some canonical books are not present, backfill up to 6 distinct authors
  if (selected.length < 6) {
    for (const b of books) {
      if (!selectedCodes.has(b.code)) {
        selected.push(b);
        selectedCodes.add(b.code);
        if (selected.length === 6) break;
      }
    }
  }

  return selected;
}

/**
 * Formats a clean, distinctive pill label for a reference book pill.
 * Guaranteed never to produce ambiguous article prefixes like "The (Allen)".
 * Follows the pattern: [Title Keyword] ([Author])
 */
export function getBookPillLabel(book: MateriaMedicaBook): string {
  // Canonical master text overrides
  switch (book.code) {
    case 'BOERICKE_MM':
      return 'Pocket (Boericke)';
    case 'KENT_LECTURES':
      return 'Lectures (Kent)';
    case 'ALLEN_KEYNOTES':
      return 'Keynotes (Allen)';
    case 'CLARKE_DICT':
      return 'Dictionary (Clarke)';
    case 'HAHN_CHRONIC_5':
      return 'Chronic (Hahnemann)';
    case 'HAHN_MMP_1':
      return 'MMP (Hahnemann)';
    case 'BOGER_SYNOPTIC':
      return 'Synoptic (Boger)';
    case 'FARRINGTON_CLINICAL':
      return 'Clinical (Farrington)';
    case 'NASH_LEADERS':
      return 'Leaders (Nash)';
    default:
      break;
  }

  // Disambiguate author
  const authorClean = (book.author || '').replace(/^Dr\.\s*|^Baron\s*/i, '').trim();
  const nameParts = authorClean.split(/\s+/);
  const lastName = nameParts[nameParts.length - 1] || 'Author';

  let authorLabel = lastName;
  if (lastName.toLowerCase() === 'allen') {
    if (authorClean.toLowerCase().includes('timothy')) {
      authorLabel = 'T.F. Allen';
    } else if (authorClean.toLowerCase().includes('henry')) {
      authorLabel = 'H.C. Allen';
    }
  }

  // Strip leading articles from title ("The ", "A ", "An ")
  const cleanTitle = (book.title || '')
    .replace(/^(the|a|an)\s+/i, '')
    .trim();

  // Extract first meaningful keyword from title
  const titleKeyword = cleanTitle.split(/[\s—–:-]+/)[0] || 'Book';

  return `${titleKeyword} (${authorLabel})`;
}
