import type { RawBook } from './types';
import { getBooksClassical } from './lexiconBooksClassical';
import { getBooksModern } from './lexiconBooksModern';

/**
 * Combines classical foundations, keynotes, encyclopedias, lectures,
 * regional specialties, and modern thematic systems into the comprehensive
 * 132-volume Homeopathic Materia Medica Library catalog.
 */
export function getCompleteBooksCatalog(): RawBook[] {
  const classical = getBooksClassical();
  const modern = getBooksModern();
  const combined = [...classical, ...modern];

  const codeSet = new Set<string>();
  const deduplicated: RawBook[] = [];

  for (const book of combined) {
    if (!codeSet.has(book.code)) {
      codeSet.add(book.code);
      deduplicated.push(book);
    } else {
      console.warn(`[BooksLexicon] Duplicate book code skipped: ${book.code}`);
    }
  }

  return deduplicated;
}
