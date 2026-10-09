import type {
  CombinedRubric,
  MergeStrategy,
  Rubric,
  RubricRemedyEntry,
} from '@/features/repertory/types';

export interface MergeRubricsOptions {
  strategy?: MergeStrategy;
  customTitle?: string;
}

/**
 * Synthesizes 2 or more classical rubrics into a single unified clinical rubric.
 * Prevents double-counting when a patient exhibits overlapping expressions of the same symptom.
 */
export function mergeRubrics(
  rubrics: Rubric[],
  options: MergeRubricsOptions = {}
): CombinedRubric {
  if (rubrics.length === 0) {
    throw new Error('Cannot merge an empty rubric list');
  }

  const strategy: MergeStrategy = options.strategy || 'max_grade';

  if (rubrics.length === 1) {
    return {
      ...rubrics[0],
      isCombined: true,
      sourceRubricIds: [rubrics[0].id],
      mergeStrategy: strategy,
    };
  }

  const sourceRubricIds = rubrics.map((r) => r.id);
  const sortedIds = [...sourceRubricIds].sort();
  const combinedId = `comb-${sortedIds.join('__')}`;

  // Index entries by remedyId to apply merge strategy
  const remedyGradeMap = new Map<
    string,
    { abbreviation: string; grades: number[] }
  >();

  for (const rubric of rubrics) {
    for (const entry of rubric.entries) {
      const existing = remedyGradeMap.get(entry.remedyId);
      if (existing) {
        existing.grades.push(entry.grade);
      } else {
        remedyGradeMap.set(entry.remedyId, {
          abbreviation: entry.abbreviation,
          grades: [entry.grade],
        });
      }
    }
  }

  const mergedEntries: RubricRemedyEntry[] = [];

  for (const [remedyId, { abbreviation, grades }] of remedyGradeMap.entries()) {
    let resolvedGrade: 1 | 2 | 3 | 4 = 1;

    switch (strategy) {
      case 'max_grade': {
        const maxVal = Math.max(...grades);
        resolvedGrade = (Math.min(4, Math.max(1, maxVal)) as 1 | 2 | 3 | 4);
        break;
      }
      case 'sum_grades': {
        const sumVal = grades.reduce((acc, g) => acc + g, 0);
        resolvedGrade = (Math.min(4, Math.max(1, sumVal)) as 1 | 2 | 3 | 4);
        break;
      }
      case 'average': {
        const avgVal = Math.round(grades.reduce((acc, g) => acc + g, 0) / grades.length);
        resolvedGrade = (Math.min(4, Math.max(1, avgVal)) as 1 | 2 | 3 | 4);
        break;
      }
    }

    mergedEntries.push({
      remedyId,
      abbreviation,
      grade: resolvedGrade,
    });
  }

  // Sort entries descending by grade, then alphabetically
  mergedEntries.sort((a, b) => {
    if (b.grade !== a.grade) {
      return b.grade - a.grade;
    }
    return a.abbreviation.localeCompare(b.abbreviation);
  });

  const primaryChapter = rubrics[0].chapterName || 'General';
  const customOrAutoTitle =
    options.customTitle ||
    `[Combined: ${rubrics.length} Rubrics] ${rubrics.map((r) => r.path).join(' + ')}`;

  return {
    id: combinedId,
    chapterId: rubrics[0].chapterId,
    chapterName: primaryChapter,
    path: `[Combined: ${rubrics.length} Rubrics]`,
    fullPath: customOrAutoTitle,
    depth: 1,
    remedyCount: mergedEntries.length,
    entries: mergedEntries,
    isCombined: true,
    sourceRubricIds,
    mergeStrategy: strategy,
  };
}
