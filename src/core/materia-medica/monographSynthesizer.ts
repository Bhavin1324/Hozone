import type { Remedy, RemedyKingdom, ThermalState, MiasmType } from '@/features/repertory/types';
import type { MateriaMedicaBook, RemedyMonograph } from '@/features/materia-medica/types';

interface OrganKeywordPattern {
  keywords: string[];
  affinity: string;
}

const ORGAN_KEYWORD_PATTERNS: OrganKeywordPattern[] = [
  {
    keywords: ['stomach', 'gastric', 'appetite', 'nausea', 'vomit', 'hunger', 'epigastrium', 'digestion', 'dyspepsia'],
    affinity: 'Gastrointestinal & Stomach',
  },
  {
    keywords: ['abdomen', 'liver', 'bowel', 'stool', 'diarrhea', 'constipation', 'flatulence', 'rectum', 'anus', 'splen'],
    affinity: 'Abdominal Organs & Liver',
  },
  {
    keywords: ['heart', 'pulse', 'circulation', 'vascular', 'blood', 'hemorrhag', 'bleeding', 'vein', 'epistaxis', 'aneurysm'],
    affinity: 'Cardiovascular & Vascular System',
  },
  {
    keywords: ['lung', 'respirat', 'chest', 'cough', 'asthma', 'bronch', 'larynx', 'voice', 'expectorat', 'dyspnea'],
    affinity: 'Respiratory Tract & Lungs',
  },
  {
    keywords: ['skin', 'erupt', 'eczema', 'pruritus', 'itch', 'wart', 'ulcer', 'rash', 'dermat', 'perspir', 'sweat'],
    affinity: 'Skin & Integumentary System',
  },
  {
    keywords: ['mind', 'anxiety', 'fear', 'delir', 'depress', 'nervous', 'hallucinat', 'restless', 'memory', 'convuls'],
    affinity: 'Central Nervous System & Sensorium',
  },
  {
    keywords: ['head', 'headache', 'migraine', 'occiput', 'vertex', 'forehead', 'temple', 'vertigo', 'scalp'],
    affinity: 'Head & Cerebral Circulation',
  },
  {
    keywords: ['kidney', 'urin', 'bladder', 'dysuria', 'micturit', 'renal', 'gravel', 'urethra'],
    affinity: 'Urinary Tract & Kidneys',
  },
  {
    keywords: ['menses', 'uter', 'ovary', 'pelvic', 'leucorrh', 'bearing down', 'breast', 'mamma'],
    affinity: 'Female Reproductive Organs',
  },
  {
    keywords: ['test', 'prostat', 'spermat', 'emission', 'genital', 'penis'],
    affinity: 'Male Reproductive Organs',
  },
  {
    keywords: ['joint', 'arthrit', 'rheumat', 'spine', 'back', 'extremit', 'bone', 'lumbar', 'limb', 'gout', 'cartilage'],
    affinity: 'Locomotor System & Bones',
  },
  {
    keywords: ['gland', 'lymph', 'tonsil', 'thyroid', 'goitre', 'parotid', 'bubo'],
    affinity: 'Lymphatic & Glandular System',
  },
  {
    keywords: ['mucous', 'membrane', 'catarrh', 'discharge', 'coryza', 'secretion', 'phlegm'],
    affinity: 'Mucous Membranes',
  },
  {
    keywords: ['eye', 'vision', 'pupil', 'photophob', 'cornea', 'lachrym', 'ciliary'],
    affinity: 'Eyes & Visual Apparatus',
  },
  {
    keywords: ['ear', 'hearing', 'tinnitus', 'otitis', 'tympan'],
    affinity: 'Ears & Auditory System',
  },
  {
    keywords: ['throat', 'pharynx', 'tonsill', 'swallow', 'uvula', 'fauces'],
    affinity: 'Throat & Fauces',
  },
];

const KINGDOM_DEFAULT_AFFINITIES: Record<RemedyKingdom, string[]> = {
  Plant: ['Vegetative Nervous System', 'Mucous Membranes', 'Digestive Canal'],
  Mineral: ['Cellular Nutrition', 'Glands & Lymphatics', 'Bones & Connective Tissue'],
  Animal: ['Blood & Circulation', 'Central Nervous System', 'Cutaneous Tissues'],
  Nosode: ['Reticuloendothelial System', 'Deep Lymphatic Chains', 'Constitutional Vital Reactivity'],
  Sarcode: ['Endocrine Axis', 'Metabolic Regulation', 'Cellular Homeostasis'],
  Imponderabilia: ['Neurovegetative Polarity', 'Bioenergetic Fields', 'Sensorium'],
};

const THERMAL_PHYSICALS: Record<ThermalState, string> = {
  Chilly:
    'Pronounced lack of vital heat with constitutional chilliness; sensitive to cold air, drafts, damp weather, and temperature drops. Greatly dependent on external warmth and warm wrappings.',
  Hot:
    'Warm-blooded constitutional diathesis; marked intolerance of external heat, heated closed rooms, and heavy coverings. Distinct relief from and craving for cool circulating open air.',
  Ambithermal:
    'Equally distressed by extremes of temperature; sensitive to rapid atmospheric changes, seasonal transitions, and fluctuating humidity levels.',
};

const MIASM_PHYSICALS: Record<MiasmType, string> = {
  Psora:
    'Psoric functional deficiency, hypersensitivity to sensory impressions, neural irritation, and sluggish recuperation from acute disorders.',
  Sycosis:
    'Sycotic dyscrasia characterized by catarrhal chronicity, pelvic congestion, tissue hypertrophy, and slow metabolic clearance.',
  Syphilis:
    'Syphilitic diathesis with nighttime nocturnal aggravation, deep structural tissue breakdown, and destructive ulceration.',
  Tubercular:
    'Tubercular vulnerability marked by rapid debility, periodic relapses, rapid emaciation despite good appetite, and respiratory sensitivity.',
  'Multi-miasmatic':
    'Complex multi-miasmatic taint presenting with fluctuating reactive states, stubborn chronicity, and mixed diathetic manifestations.',
};

const KINGDOM_MIND_DISPOSITIONS: Record<RemedyKingdom, string> = {
  Plant:
    'Marked sensitivity and excitability; impressionable emotional disposition with mood changes that correspond to physical distress.',
  Mineral:
    'Conscientious, structured, and security-oriented disposition; anxiety regarding health, duty, and financial or domestic stability.',
  Animal:
    'Vivid, expressive, and competitive mental picture; heightened alertness, emotional passion, and reactive sensitivity.',
  Nosode:
    'Deep-seated internal unrest, pessimistic anxiety regarding health, and apprehension of constitutional decline.',
  Sarcode:
    'Apathy alternating with nervous exhaustion; cognitive fatigue and inertia corresponding to metabolic sluggishness.',
  Imponderabilia:
    'Electrosensitive nervous tension; sensorial irritability with heightened responsiveness to environmental and atmospheric influences.',
};

/**
 * Extracts anatomical and physiological tissue affinities by scanning keynote text
 * against the clinical organ lexicon, falling back to kingdom defaults.
 */
export function extractOrganAffinities(keynotes: string, kingdom: RemedyKingdom): string[] {
  const normalized = keynotes.toLowerCase();
  const matched = new Set<string>();

  for (const { keywords, affinity } of ORGAN_KEYWORD_PATTERNS) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      matched.add(affinity);
    }
  }

  if (matched.size === 0) {
    for (const aff of KINGDOM_DEFAULT_AFFINITIES[kingdom] || []) {
      matched.add(aff);
    }
  }

  return Array.from(matched);
}

/**
 * Derives clinical modalities based on thermal profile and keynote indicators.
 */
export function deriveModalities(
  thermal: ThermalState,
  keynotes: string
): { modalitiesAgg: string[]; modalitiesAmel: string[] } {
  const norm = keynotes.toLowerCase();
  const agg: string[] = [];
  const amel: string[] = [];

  if (thermal === 'Chilly') {
    agg.push('Cold air, drafts, and becoming chilled');
    agg.push('Wet or rainy weather');
    agg.push('Uncovering');
    amel.push('Warm external applications and wraps');
    amel.push('Warm heated room');
    amel.push('Rest in bed');
  } else if (thermal === 'Hot') {
    agg.push('Warm stuffy rooms');
    agg.push('Sun heat and summer weather');
    agg.push('Warm bed coverings');
    amel.push('Cool open air and fresh breeze');
    amel.push('Uncovering and light clothing');
    amel.push('Cold bathing or cold drinks');
  } else {
    agg.push('Sudden weather changes and seasonal transitions');
    agg.push('Extremes of heat or cold');
    agg.push('Drafts of air');
    amel.push('Moderate, dry, temperate climate');
    amel.push('Rest in well-ventilated room');
    amel.push('Gentle unhurried movement');
  }

  if (norm.includes('motion') || norm.includes('movement') || norm.includes('exertion')) {
    agg.push('Physical motion and exertion');
  }
  if (norm.includes('rest') || norm.includes('lying down') || norm.includes('sitting')) {
    amel.push('Quiet rest and lying still');
  }
  if (norm.includes('night') || norm.includes('midnight') || norm.includes('evening')) {
    agg.push('Night and after dark (nocturnal)');
  }
  if (norm.includes('morning') || norm.includes('waking')) {
    agg.push('Early morning upon waking');
  }
  if (norm.includes('eat') || norm.includes('meal') || norm.includes('food')) {
    agg.push('After meals and during digestion');
  }

  return {
    modalitiesAgg: Array.from(new Set(agg)),
    modalitiesAmel: Array.from(new Set(amel)),
  };
}

/**
 * Dynamically synthesizes a complete, clinically sound RemedyMonograph
 * for any remedy lacking an author-specific monograph record in the database.
 */
export function deriveClinicalMonograph(
  remedy: Remedy,
  bookId?: string | null,
  availableBooks: MateriaMedicaBook[] = []
): RemedyMonograph {
  const selectedBook = availableBooks.find((b) => b.id === bookId);
  const bookTitle = selectedBook
    ? `${selectedBook.title} (Clinical Compendium)`
    : 'Clinical Materia Medica Compendium';

  const affinities = extractOrganAffinities(remedy.shortKeynotes, remedy.kingdom);
  const { modalitiesAgg, modalitiesAmel } = deriveModalities(remedy.thermal, remedy.shortKeynotes);

  const physicalGenerals = `${THERMAL_PHYSICALS[remedy.thermal]} ${MIASM_PHYSICALS[remedy.miasm]} ${
    remedy.shortKeynotes ? `Marked guiding characteristic: ${remedy.shortKeynotes}` : ''
  }`.trim();

  const mind = `${KINGDOM_MIND_DISPOSITIONS[remedy.kingdom]} Disposition affected by ${remedy.miasm.toLowerCase()} miasmatic diathesis.`;

  const clinicalIndications = affinities.slice(0, 4);

  return {
    id: `synth-${remedy.id}-${bookId || 'default'}`,
    remedyId: remedy.id,
    abbreviation: remedy.abbreviation,
    fullName: remedy.fullName,
    bookId: bookId || selectedBook?.id || 'book-boericke',
    bookTitle,
    mind,
    physicalGenerals,
    keynotes: remedy.shortKeynotes || `${remedy.fullName} (${remedy.commonName}) constitutional remedy.`,
    modalitiesAgg,
    modalitiesAmel,
    organAffinities: affinities,
    clinicalIndications,
    comparisons: `Compare with related ${remedy.kingdom} remedies of ${remedy.thermal} thermal affinity.`,
  };
}
