import type {
  SehgalScript,
  SehgalTranslationResult,
} from '@/features/expert-systems/types';

/**
 * Translates patient colloquial narration into classical Mind rubrics
 * using the Sehgal method (Revolutionized Homeopathy).
 */
export function translatePatientNarration(
  query: string,
  scripts: SehgalScript[]
): SehgalTranslationResult {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return {
      query,
      matchedScripts: [],
      bestMatch: undefined,
    };
  }

  // Tokenize query words (stripping punctuation)
  const tokens = normalizedQuery
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scoredScripts = scripts
    .map((script) => {
      let score = 0;
      const lowerPhrase = script.patientPhrase.toLowerCase();

      // Exact phrase match gives maximum score
      if (lowerPhrase.includes(normalizedQuery) || normalizedQuery.includes(lowerPhrase)) {
        score += 15;
      }

      // Keyword matches
      for (const kw of script.keywords) {
        const lowerKw = kw.toLowerCase();
        if (tokens.some((token) => token.includes(lowerKw) || lowerKw.includes(token))) {
          score += 4;
        }
      }

      // Rubric path matches
      const lowerPath = script.rubricFullPath.toLowerCase();
      for (const token of tokens) {
        if (lowerPath.includes(token)) {
          score += 2;
        }
      }

      return {
        ...script,
        matchScore: score,
      };
    })
    .filter((s) => (s.matchScore ?? 0) > 0)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  return {
    query,
    matchedScripts: scoredScripts,
    bestMatch: scoredScripts.length > 0 ? scoredScripts[0] : undefined,
  };
}
