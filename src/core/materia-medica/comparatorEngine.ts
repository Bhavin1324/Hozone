import type {
  DifferentialComparisonResult,
  InimicalConflict,
  RemedyComparisonSlot,
  RemedyRelationship,
} from '@/features/materia-medica/types';

/**
 * Traverses relationships across all selected comparison slots to identify
 * clinical conflicts (inimicals), complementary cycles, and shared organ affinities.
 */
export function buildDifferentialComparison(
  slots: RemedyComparisonSlot[]
): DifferentialComparisonResult {
  const inimicalConflicts: InimicalConflict[] = [];
  const complementaryLinks: Array<{ remedyA: string; remedyB: string; notes: string }> = [];

  // Flatten and index all relationships across slots
  const relationshipMap = new Map<string, RemedyRelationship>();
  for (const slot of slots) {
    for (const rel of slot.relationships) {
      relationshipMap.set(rel.id, rel);
    }
  }

  // Cross-examine every pair of selected remedies
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const slotA = slots[i];
      const slotB = slots[j];

      // Check relationships between slotA and slotB
      for (const rel of relationshipMap.values()) {
        const matchesPair =
          (rel.primaryRemedyId === slotA.remedy.id && rel.relatedRemedyId === slotB.remedy.id) ||
          (rel.primaryRemedyId === slotB.remedy.id && rel.relatedRemedyId === slotA.remedy.id);

        if (matchesPair) {
          if (rel.type === 'inimical') {
            inimicalConflicts.push({
              remedyA: slotA.remedy.abbreviation,
              remedyB: slotB.remedy.abbreviation,
              notes: rel.notes || 'Inimical relationship: these remedies should not follow each other.',
            });
          } else if (rel.type === 'complement') {
            complementaryLinks.push({
              remedyA: slotA.remedy.abbreviation,
              remedyB: slotB.remedy.abbreviation,
              notes: rel.notes || 'Complementary relationship: clinical synergistic action.',
            });
          }
        }
      }
    }
  }

  // Calculate shared organ affinities across selected monographs
  const sharedAffinities = calculateSharedAffinities(slots);

  return {
    slots,
    inimicalConflicts,
    complementaryLinks,
    sharedAffinities,
  };
}

/**
 * Finds anatomical and physiological tissue affinity intersections.
 */
function calculateSharedAffinities(slots: RemedyComparisonSlot[]): string[] {
  const monographs = slots.map((s) => s.monograph).filter(Boolean);
  if (monographs.length < 2) return [];

  const counts = new Map<string, number>();

  for (const mono of monographs) {
    if (!mono) continue;
    const normalized = mono.organAffinities.map((a) => a.toLowerCase().trim());
    const unique = new Set(normalized);

    for (const aff of unique) {
      counts.set(aff, (counts.get(aff) || 0) + 1);
    }
  }

  const shared: string[] = [];
  for (const [aff, count] of counts.entries()) {
    if (count >= 2) {
      shared.push(capitalizeWords(aff));
    }
  }

  return shared;
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Contrasting modalities detection: Identifies contrasting modalities
 * between candidate remedies (e.g. warmth vs cold, motion vs rest).
 */
export function detectModalityContrasts(slots: RemedyComparisonSlot[]): Array<{
  factor: string;
  descriptions: Record<string, string>;
}> {
  const factors = [
    { name: 'Thermal Sensitivity', check: (s: RemedyComparisonSlot) => s.remedy.thermal },
    {
      name: 'Cold Applications / Drinks',
      check: (s: RemedyComparisonSlot) => {
        const agg = s.monograph?.modalitiesAgg.some((m) => m.toLowerCase().includes('cold'));
        const amel = s.monograph?.modalitiesAmel.some((m) => m.toLowerCase().includes('cold'));
        if (agg && amel) return 'Agg by cold air / Amel by cold drinks';
        if (agg) return '< Cold (Aggravated)';
        if (amel) return '> Cold (Ameliorated)';
        return 'Neutral / Not marked';
      },
    },
    {
      name: 'Motion vs. Rest',
      check: (s: RemedyComparisonSlot) => {
        const aggMotion = s.monograph?.modalitiesAgg.some((m) => m.toLowerCase().includes('motion'));
        const amelMotion = s.monograph?.modalitiesAmel.some((m) => m.toLowerCase().includes('motion'));
        if (aggMotion) return '< Motion (Must rest)';
        if (amelMotion) return '> Motion (Better moving)';
        return 'Neutral';
      },
    },
  ];

  return factors.map((f) => {
    const descriptions: Record<string, string> = {};
    for (const slot of slots) {
      descriptions[slot.remedy.abbreviation] = f.check(slot);
    }
    return {
      factor: f.name,
      descriptions,
    };
  });
}
