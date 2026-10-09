import type {
  ActiveCaseRubric,
  FilterCriteria,
  Remedy,
  RepertorizationComputeOutput,
  RepertorizationResultItem,
  Rubric,
  ScoringModel,
} from '@/features/repertory/types';

export interface ComputePayload {
  activeRubrics: ActiveCaseRubric[];
  allRubrics: Rubric[];
  allRemedies: Remedy[];
  filters: FilterCriteria;
  scoringModel: ScoringModel;
}

export function executeRepertorization(
  payload: ComputePayload
): RepertorizationComputeOutput {
  const start = performance.now();
  const { activeRubrics, allRubrics, allRemedies, filters, scoringModel } = payload;

  if (activeRubrics.length === 0) {
    return {
      rankedRemedies: [],
      benchmarkMs: Math.round(performance.now() - start),
      totalEvaluated: allRemedies.length,
      qualifyingCount: 0,
    };
  }

  // Pre-index rubrics map for O(1) entry lookups
  const rubricMap = new Map<string, Rubric>();
  for (const r of allRubrics) {
    rubricMap.set(r.id, r);
  }

  // Filter candidate remedies by thermal, miasm, kingdom
  const candidateRemedies = allRemedies.filter((rem) => {
    if (filters.thermals.length > 0 && !filters.thermals.includes(rem.thermal)) {
      return false;
    }
    if (filters.miasms.length > 0 && !filters.miasms.includes(rem.miasm)) {
      return false;
    }
    if (filters.kingdoms.length > 0 && !filters.kingdoms.includes(rem.kingdom)) {
      return false;
    }
    return true;
  });

  const results: RepertorizationResultItem[] = [];

  for (const remedy of candidateRemedies) {
    let coversAllEliminating = true;
    let coverageCount = 0;
    let totalScore = 0;
    const grades: Record<string, number> = {};

    for (const active of activeRubrics) {
      const fullRubric = rubricMap.get(active.rubricId);
      if (!fullRubric) continue;

      const entry = fullRubric.entries.find((e) => e.remedyId === remedy.id);
      if (entry && entry.grade > 0) {
        grades[active.rubricId] = entry.grade;
        coverageCount += 1;
        totalScore += entry.grade * (active.weight || 1);
      } else {
        if (active.isEliminating) {
          coversAllEliminating = false;
          break;
        }
      }
    }

    if (!coversAllEliminating) {
      continue;
    }

    // Only include remedies that cover at least 1 rubric
    if (coverageCount > 0) {
      results.push({
        remedy,
        coverageCount,
        totalScore,
        grades,
      });
    }
  }

  // Sort based on chosen clinical model
  results.sort((a, b) => {
    if (scoringModel === 'coverage_first') {
      if (b.coverageCount !== a.coverageCount) {
        return b.coverageCount - a.coverageCount;
      }
      return b.totalScore - a.totalScore;
    }
    // weighted_sum
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.coverageCount - a.coverageCount;
  });

  const benchmarkMs = Number((performance.now() - start).toFixed(2));

  return {
    rankedRemedies: results,
    benchmarkMs,
    totalEvaluated: allRemedies.length,
    qualifyingCount: results.length,
  };
}

// Web Worker Global Message Handler
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  self.onmessage = (event: MessageEvent<ComputePayload>) => {
    const output = executeRepertorization(event.data);
    self.postMessage(output);
  };
}
