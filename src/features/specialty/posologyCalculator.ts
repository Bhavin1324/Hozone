import type {
  VeterinarySpecies,
  PosologyCalculationResult,
} from './types';

export const calculatePosology = (
  species: VeterinarySpecies,
  weightKg: number,
  acuity: 'Hyper-acute' | 'Sub-acute' | 'Chronic'
): PosologyCalculationResult => {
  // Potency Range
  let recommendedPotencyRange = '30C to 200C';
  let frequency = 'TID (3 times daily) for 3-5 days';
  if (acuity === 'Hyper-acute') {
    recommendedPotencyRange = '200C to 1M';
    frequency = 'Every 15-30 minutes for 3-4 doses until response, then taper';
  } else if (acuity === 'Chronic') {
    recommendedPotencyRange = '30C (single dose) or LM 0/1 to LM 0/3 daily';
    frequency = 'Once weekly (centisimal) or once daily succussed (LM potency)';
  }

  // Pellets / Volume & Dilution
  let recommendedPelletCount = '2-3 #30 sugar pellets';
  let dilutionInstructions = 'Dissolve pellets in 50ml distilled water; succuss 10 times before each dose.';
  let administrationMethod = 'Trans-mucosal (oral syringe onto gums or inner cheek)';
  let specialPrecautions = 'Ensure mouth is free of food residue. Do not touch pellets with bare fingers.';

  switch (species) {
    case 'Feline':
      recommendedPelletCount = '1-2 pellets (or 0.5ml water solution)';
      dilutionInstructions = 'Dissolve 2 pellets in 30ml pure spring water. NEVER use alcohol-based liquid potencies.';
      administrationMethod = 'Oral syringe side of mouth onto gums; alternatively drop onto paw for licking.';
      specialPrecautions = 'STRICT CONTRAINDICATION: Felines cannot metabolize ethyl alcohol or phenolic preservatives.';
      break;

    case 'Canine':
      if (weightKg > 30) {
        recommendedPelletCount = '3-4 #30 pellets';
      } else {
        recommendedPelletCount = '2 pellets';
      }
      dilutionInstructions = 'Dissolve in 60ml water. Administer 1-2ml via syringe directly inside the flews (cheek fold).';
      administrationMethod = 'Trans-mucosal inside upper lip flap. Direct ingestion by tongue is equally effective.';
      specialPrecautions = 'Avoid administering within 20 minutes before or after dog food feeding.';
      break;

    case 'Equine':
      recommendedPelletCount = '4-6 pellets (or 5ml water solution)';
      dilutionInstructions = 'Dissolve in 100ml drinking water; shake vigorously. Draw 5-10ml in catheter syringe.';
      administrationMethod = 'Squirt onto inner lip mucous membrane or directly into water bucket (herd/stable dose).';
      specialPrecautions = 'Large body weight does not require massive pellet mass; energetic stimulus is identical.';
      break;

    case 'Bovine':
      recommendedPelletCount = '6-8 pellets or 10ml stock solution';
      dilutionInstructions = 'Dissolve 10 pellets in 500ml water for trough/bucket dosing, or 10ml oral drench.';
      administrationMethod = 'Oral drenching gun or added to fresh water trough.';
      specialPrecautions = 'For acute mastitis, dose immediately after milking to minimize teat pressure.';
      break;

    case 'Avian':
      recommendedPelletCount = '1 pellet dissolved in full water cup';
      dilutionInstructions = 'Dissolve 1 single pellet in 100ml bird drinking cup, or 1 drop placed on beak commissure.';
      administrationMethod = 'Beak commissure droplet using micropipette, or fresh daily drinking water dispenser.';
      specialPrecautions = 'Avoid force-feeding liquid into beak to prevent fatal tracheal aspiration.';
      break;
  }

  return {
    species,
    weightKg,
    acuity,
    recommendedPelletCount,
    recommendedPotencyRange,
    dilutionInstructions,
    administrationMethod,
    frequency,
    specialPrecautions,
  };
};
