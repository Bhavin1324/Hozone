import type { ScholtenElement } from '@/features/expert-systems/types';
import {
  SCHOLTEN_SERIES_METADATA,
  SCHOLTEN_STAGES_METADATA,
} from '@/core/storage/expertSystemsData';

/**
 * Looks up mineral remedies based on Jan Scholten's Element Theory (Series 1-7 × Stages 1-18).
 */
export function findScholtenElement(
  elements: ScholtenElement[],
  series: number,
  stage: number
): ScholtenElement | undefined {
  if (series < 1 || series > 7 || stage < 1 || stage > 18) {
    return undefined;
  }
  return elements.find((el) => el.series === series && el.stage === stage);
}

/**
 * Retrieves all elements mapped along a single Series (horizontal row).
 */
export function getSeriesElements(
  elements: ScholtenElement[],
  series: number
): ScholtenElement[] {
  return elements
    .filter((el) => el.series === series)
    .sort((a, b) => a.stage - b.stage);
}

/**
 * Retrieves all elements mapped along a single Stage (vertical column).
 */
export function getStageElements(
  elements: ScholtenElement[],
  stage: number
): ScholtenElement[] {
  return elements
    .filter((el) => el.stage === stage)
    .sort((a, b) => a.series - b.series);
}

/**
 * Synthesizes the core psychological theme at the intersection of Series and Stage.
 */
export function describeAxisCoordinates(
  series: number,
  stage: number
): {
  seriesTitle: string;
  stageTitle: string;
  clinicalSynthesis: string;
} {
  const seriesInfo = SCHOLTEN_SERIES_METADATA.find((s) => s.series === series);
  const stageInfo = SCHOLTEN_STAGES_METADATA.find((st) => st.stage === stage);

  const seriesTitle = seriesInfo ? seriesInfo.name : `Series ${series}`;
  const stageTitle = stageInfo ? `Stage ${stage} (${stageInfo.theme})` : `Stage ${stage}`;

  const clinicalSynthesis = seriesInfo && stageInfo
    ? `The patient's core conflict centers around ${seriesInfo.theme}, manifested at the developmental phase of ${stageInfo.theme}.`
    : 'Coordinate intersection pending element alignment.';

  return {
    seriesTitle,
    stageTitle,
    clinicalSynthesis,
  };
}
