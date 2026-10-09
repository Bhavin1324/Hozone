import { RUBRICS_PART_1, type RawRubricNode } from './lexiconRubricsPart1';
import { RUBRICS_PART_2 } from './lexiconRubricsPart2';

export type { RawRubricNode };

export function getCompleteHierarchicalRubricsList(): RawRubricNode[] {
  return [...RUBRICS_PART_1, ...RUBRICS_PART_2];
}
