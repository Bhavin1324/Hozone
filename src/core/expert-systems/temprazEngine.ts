import type {
  TemperamentProfile,
  TemperamentType,
  TemprazScoreResult,
} from '@/features/expert-systems/types';

const ALL_TEMPERAMENTS: TemperamentType[] = [
  'sanguine',
  'melancholic',
  'choleric',
  'phlegmatic',
  'nervous',
];

/**
 * Calculates temperament scores, percentage distribution, and constitutional similimum recommendations
 * based on Dr. Parinaz Humranwala's Tempraz methodology.
 */
export function calculateTemperamentBlend(
  selectedTraitKeys: string[],
  profiles: TemperamentProfile[]
): TemprazScoreResult {
  const scores: Record<TemperamentType, number> = {
    sanguine: 0,
    melancholic: 0,
    choleric: 0,
    phlegmatic: 0,
    nervous: 0,
  };

  // Tally selected traits for each temperament
  for (const profile of profiles) {
    for (const trait of profile.keyBehavioralTraits) {
      if (selectedTraitKeys.includes(trait)) {
        scores[profile.temperament] += 1;
      }
    }
  }

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);

  // Compute percentages
  const percentages: Record<TemperamentType, number> = {
    sanguine: 0,
    melancholic: 0,
    choleric: 0,
    phlegmatic: 0,
    nervous: 0,
  };

  if (totalScore > 0) {
    for (const t of ALL_TEMPERAMENTS) {
      percentages[t] = Math.round((scores[t] / totalScore) * 100);
    }
  }

  // Sort temperaments by score descending
  const sorted = [...ALL_TEMPERAMENTS].sort((a, b) => scores[b] - scores[a]);
  const dominantTemperament = sorted[0];
  const secondaryTemperament =
    scores[sorted[1]] > 0 && scores[sorted[1]] !== scores[dominantTemperament]
      ? sorted[1]
      : sorted[1] && scores[sorted[1]] > 0
        ? sorted[1]
        : undefined;

  // Retrieve recommended remedies
  const dominantProfile = profiles.find((p) => p.temperament === dominantTemperament);
  const secondaryProfile = secondaryTemperament
    ? profiles.find((p) => p.temperament === secondaryTemperament)
    : undefined;

  const remediesSet = new Set<string>();
  if (dominantProfile) {
    dominantProfile.leadingRemedies.forEach((r) => remediesSet.add(r));
  }
  if (secondaryProfile) {
    // Add top 2 remedies from secondary temperament for constitutional blending
    secondaryProfile.leadingRemedies.slice(0, 2).forEach((r) => remediesSet.add(r));
  }

  return {
    scores,
    percentages,
    dominantTemperament,
    secondaryTemperament,
    recommendedRemedies: Array.from(remediesSet),
  };
}
