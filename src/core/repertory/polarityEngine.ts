import type {
  ActiveCaseRubric,
  PolarSymptomPair,
  PolarityAnalysisComputeOutput,
  PolarityRemedyResult,
  Remedy,
  Rubric,
} from '@/features/repertory/types';

export interface ComputePolarityPayload {
  activeRubrics: ActiveCaseRubric[];
  polarPairs: PolarSymptomPair[];
  allRubrics: Rubric[];
  candidateRemedies: Remedy[];
}

/**
 * Normalizes rubric path string for fuzzy matching across repertories.
 */
function normalizePath(p: string): string {
  return p
    .toLowerCase()
    .replace(/[>;&,-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Boenninghausen Polarity Analysis (Dr. Heiner Frei Method).
 * Calculates Polarity Difference (PD = Polar Score - Contraindication Score)
 * and flags remedies with strong contradictory modalities.
 */
export function executePolarityAnalysis(
  payload: ComputePolarityPayload
): PolarityAnalysisComputeOutput {
  const start = performance.now();
  const { activeRubrics, polarPairs, allRubrics, candidateRemedies } = payload;

  if (activeRubrics.length === 0 || polarPairs.length === 0) {
    return {
      rankedRemedies: [],
      evaluatedPairCount: 0,
      benchmarkMs: Number((performance.now() - start).toFixed(2)),
    };
  }

  // Pre-index all rubrics by normalized path and by ID
  const rubricMapById = new Map<string, Rubric>();
  const rubricMapByPath = new Map<string, Rubric>();

  for (const r of allRubrics) {
    rubricMapById.set(r.id, r);
    rubricMapByPath.set(normalizePath(r.fullPath), r);
    rubricMapByPath.set(normalizePath(r.path), r);
  }

  // Identify which polar pairs are active in the patient's case
  interface ActivePolarPairMatch {
    pair: PolarSymptomPair;
    indicatedRubric: Rubric;
    contraindicatedRubric?: Rubric;
    indicatedLabel: string;
    oppositeLabel: string;
  }

  const activePairMatches: ActivePolarPairMatch[] = [];

  for (const active of activeRubrics) {
    const normActive = normalizePath(active.fullPath);

    for (const pair of polarPairs) {
      const normPos = normalizePath(pair.positiveRubricPath);
      const normOpp = normalizePath(pair.oppositeRubricPath);

      // Check if patient has the positive pole
      if (normActive.includes(normPos) || normPos.includes(normActive)) {
        const indicatedRubric = rubricMapById.get(active.rubricId) || rubricMapByPath.get(normPos);
        const contraindicatedRubric = rubricMapByPath.get(normOpp);

        if (indicatedRubric) {
          activePairMatches.push({
            pair,
            indicatedRubric,
            contraindicatedRubric,
            indicatedLabel: pair.positiveLabel,
            oppositeLabel: pair.oppositeLabel,
          });
        }
      }
      // Check if patient has the opposite pole
      else if (normActive.includes(normOpp) || normOpp.includes(normActive)) {
        const indicatedRubric = rubricMapById.get(active.rubricId) || rubricMapByPath.get(normOpp);
        const contraindicatedRubric = rubricMapByPath.get(normPos);

        if (indicatedRubric) {
          activePairMatches.push({
            pair,
            indicatedRubric,
            contraindicatedRubric,
            indicatedLabel: pair.oppositeLabel,
            oppositeLabel: pair.positiveLabel,
          });
        }
      }
    }
  }

  // Remove duplicate pair matches
  const uniqueMatches: ActivePolarPairMatch[] = [];
  const seenPairs = new Set<string>();
  for (const m of activePairMatches) {
    if (!seenPairs.has(m.pair.id)) {
      seenPairs.add(m.pair.id);
      uniqueMatches.push(m);
    }
  }

  const results: PolarityRemedyResult[] = [];

  for (const remedy of candidateRemedies) {
    let polarCount = 0;
    let polarScore = 0;
    let contraindicationCount = 0;
    let contraindicationScore = 0;
    const warnings: string[] = [];
    const matchedPairs: PolarityRemedyResult['matchedPairs'] = [];

    for (const match of uniqueMatches) {
      const posEntry = match.indicatedRubric.entries.find((e) => e.remedyId === remedy.id);
      const oppEntry = match.contraindicatedRubric?.entries.find((e) => e.remedyId === remedy.id);

      const positiveGrade = posEntry ? posEntry.grade : 0;
      const oppositeGrade = oppEntry ? oppEntry.grade : 0;

      if (positiveGrade > 0) {
        polarCount += 1;
        polarScore += positiveGrade;
      }

      if (oppositeGrade > 0) {
        contraindicationCount += 1;
        contraindicationScore += oppositeGrade;

        if (oppositeGrade >= 3) {
          warnings.push(
            `Contraindicated in ${match.pair.category}: Patient is ${match.indicatedLabel}, but remedy is strongly ${match.oppositeLabel} (grade ${oppositeGrade})`
          );
        }
      }

      if (positiveGrade > 0 || oppositeGrade > 0) {
        matchedPairs.push({
          pairName: match.pair.name,
          positiveLabel: match.indicatedLabel,
          positiveGrade,
          oppositeLabel: match.oppositeLabel,
          oppositeGrade,
        });
      }
    }

    const polarityDifference = polarScore - contraindicationScore;
    const isContraindicated = contraindicationScore >= 3 || polarityDifference < 0;

    // Only include remedies that have at least some polar relevance
    if (polarCount > 0 || contraindicationCount > 0) {
      results.push({
        remedy,
        polarCount,
        polarScore,
        contraindicationCount,
        contraindicationScore,
        polarityDifference,
        isContraindicated,
        contraindicationWarnings: warnings,
        matchedPairs,
      });
    }
  }

  // Sort: non-contraindicated first, then by Polarity Difference descending, then polarScore descending
  results.sort((a, b) => {
    if (a.isContraindicated !== b.isContraindicated) {
      return a.isContraindicated ? 1 : -1;
    }
    if (b.polarityDifference !== a.polarityDifference) {
      return b.polarityDifference - a.polarityDifference;
    }
    if (b.polarScore !== a.polarScore) {
      return b.polarScore - a.polarScore;
    }
    return a.remedy.abbreviation.localeCompare(b.remedy.abbreviation);
  });

  const benchmarkMs = Number((performance.now() - start).toFixed(2));

  return {
    rankedRemedies: results,
    evaluatedPairCount: uniqueMatches.length,
    benchmarkMs,
  };
}
