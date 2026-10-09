import type {
  AcuteDecisionNode,
  EmbryologicalLayer,
  HeringEvaluation,
  ThirstType,
  ThermalType,
  ActivityType,
  VijayakarAcuteResult,
} from '@/features/expert-systems/types';

/**
 * Embryological depth hierarchy according to Predictive Homeopathy (Dr. Prafull Vijayakar):
 * Ectoderm (Level 1: Skin / Superficial nerves)
 * Mesoderm (Level 2: Connective tissue, joints, muscles, cardiovascular)
 * Endoderm (Level 3: Deep mucous membranes, respiratory, GI tract, liver)
 */
const LAYER_DEPTH: Record<EmbryologicalLayer, number> = {
  Ectoderm: 1,
  Mesoderm: 2,
  Endoderm: 3,
};

/**
 * Resolves acute decision branch from the triad of Thirst, Thermal, and Activity.
 */
export function resolveAcutePrescription(
  nodes: AcuteDecisionNode[],
  thirst: ThirstType,
  thermal: ThermalType,
  activity: ActivityType,
  suppressionEvaluation?: HeringEvaluation
): VijayakarAcuteResult {
  const targetKey = `${thermal.toLowerCase()}_${thirst.toLowerCase()}_${activity.toLowerCase()}`;
  const matchedNode = nodes.find((n) => n.nodeKey === targetKey);

  if (!matchedNode) {
    return {
      candidateRemedies: [],
      heringEvaluation: suppressionEvaluation,
    };
  }

  const candidateRemedies: Array<{
    name: string;
    abbreviation: string;
    isPrimary: boolean;
  }> = [
    {
      name: matchedNode.primaryRemedy,
      abbreviation: matchedNode.remedyAbbreviation,
      isPrimary: true,
    },
  ];

  for (const diff of matchedNode.differentialRemedies) {
    candidateRemedies.push({
      name: diff,
      abbreviation: `${diff.slice(0, 4)}.`,
      isPrimary: false,
    });
  }

  return {
    node: matchedNode,
    candidateRemedies,
    heringEvaluation: suppressionEvaluation,
  };
}

/**
 * Evaluates disease trajectory according to Hering's Law of Cure and Embryological Axis.
 */
export function evaluateHeringTrajectory(
  previousLayer: EmbryologicalLayer,
  currentLayer: EmbryologicalLayer
): HeringEvaluation {
  const prevDepth = LAYER_DEPTH[previousLayer];
  const currDepth = LAYER_DEPTH[currentLayer];
  const depthDiff = currDepth - prevDepth;

  if (depthDiff > 0) {
    return {
      direction: 'Suppression_Warning',
      message: `Suppression Warning: Disease has progressed inward from ${previousLayer} (Level ${prevDepth}) to deeper ${currentLayer} (Level ${currDepth}). In Predictive Homeopathy, inward movement indicates suppressed pathology.`,
      depthScoreChange: depthDiff,
    };
  }

  if (depthDiff < 0) {
    return {
      direction: 'Cure_Progressing',
      message: `Cure Progressing: Pathology is traveling from deeper ${previousLayer} (Level ${prevDepth}) outward toward superficial ${currentLayer} (Level ${currDepth}), strictly adhering to Hering's Law of Cure (from within outward).`,
      depthScoreChange: depthDiff,
    };
  }

  return {
    direction: 'Neutral',
    message: `Stable Layer: Symptoms remain localized within the ${currentLayer} embryological tissue layer without inward progression.`,
    depthScoreChange: 0,
  };
}
