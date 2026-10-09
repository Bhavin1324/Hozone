import type { MotherTincture } from '@/features/clinical-guidance/types';

export const INITIAL_MOTHER_TINCTURES: MotherTincture[] = [
  {
    id: '88888888-0004-0000-0000-000000000001',
    remedyName: 'Arnica Montana Q',
    commonName: "Leopard's Bane",
    organAffinities: [
      'Capillary Blood Vessels',
      'Muscular Tissue',
      'Periosteum',
      'Venous Circulation',
    ],
    clinicalIndications: [
      'Mechanical trauma and contusions',
      'Ecchymosis and extravasated blood',
      'Muscular soreness from over-exertion',
      'Pre- and post-surgical tissue healing',
    ],
    internalDosage:
      '3 to 5 drops in 2 tablespoons of warm water, twice daily after severe muscular strain.',
    externalApplication:
      'Lotion: 1 teaspoon tincture to 100ml distilled water for unbroken contusions. CAUTION: NEVER apply to broken skin or open wounds as it induces severe erysipelatous dermatitis.',
    pharmacologicalActions:
      'Stimulates capillary reabsorption of extravasated blood; relieves muscular soreness.',
    cautionsAndContraindications:
      'Contraindicated on open broken skin, abraded cuts, or in persons with Arnica hypersensitivity.',
  },
  {
    id: '88888888-0004-0000-0000-000000000002',
    remedyName: 'Calendula Officinalis Q',
    commonName: 'Marigold',
    organAffinities: [
      'Skin & Epithelial Tissue',
      'Subcutaneous Connective Tissue',
      'Surgical Wounds',
    ],
    clinicalIndications: [
      'Lacerated wounds with loss of substance',
      'Post-extraction dental sockets',
      'Superficial burns and scalds',
      'Bedsores and diabetic ulcers',
    ],
    internalDosage:
      '10 drops in 1/4th cup water, 3 times daily in septic lacerations or post-operative trauma.',
    externalApplication:
      'Topical: 1 part tincture to 4 parts boiled sterile water as compress or dressing. Remarkable antiseptic that prevents suppuration and accelerates scar-free healing.',
    pharmacologicalActions:
      'Remarkable physiological healing stimulant; promotes healthy granulation without disfiguring keloid.',
    cautionsAndContraindications:
      'Completely safe and non-irritating to open flesh.',
  },
  {
    id: '88888888-0004-0000-0000-000000000003',
    remedyName: 'Echinacea Angustifolia Q',
    commonName: 'Purple Coneflower',
    organAffinities: [
      'Blood & Immune System',
      'Lymphatic Vessels',
      'Skin & Connective Tissues',
    ],
    clinicalIndications: [
      'Systemic blood poisoning and septicemia',
      'Recurrent boils, carbuncles, and furuncles',
      'Insect and spider stings',
      'Low typhoid states and gangrene',
    ],
    internalDosage:
      '10 to 20 drops in warm water every 2 to 4 hours in acute sepsis; 10 drops twice daily for chronic furunculosis.',
    externalApplication:
      'Compress: 20 drops in 1/2 cup sterile water applied locally to foul ulcers, carbuncles, and venomous bites.',
    pharmacologicalActions:
      'Stimulates phagocytosis and inhibits hyaluronidase enzyme, acting as a profound natural systemic antiseptic.',
    cautionsAndContraindications:
      'Safe; produces harmless tingling and numbness on the tongue when fresh.',
  },
  {
    id: '88888888-0004-0000-0000-000000000004',
    remedyName: 'Crataegus Oxyacantha Q',
    commonName: 'Hawthorn Berries',
    organAffinities: [
      'Myocardium & Coronary Arteries',
      'Vascular Endothelium',
      'Cardiac Muscle',
    ],
    clinicalIndications: [
      'Chronic heart failure (NYHA I-II)',
      'Arteriosclerosis and senile heart weakness',
      'Hypertension with tachycardia',
      'Dyspnea on slight exertion in cardiac patients',
    ],
    internalDosage:
      '10 to 15 drops in half glass of water, 3 times daily continuously for 4 to 8 weeks.',
    externalApplication: 'Internal use only.',
    pharmacologicalActions:
      'Acts as a physiological cardiac tonic, dilating coronary arteries, improving myocardial oxygenation without cumulative digitalis toxicity.',
    cautionsAndContraindications:
      'Safe and gentle; does not cause drug dependency.',
  },
  {
    id: '88888888-0004-0000-0000-000000000005',
    remedyName: 'Cantharis Q',
    commonName: 'Spanish Fly',
    organAffinities: [
      'Urinary Tract & Bladder Mucosa',
      'Skin (Epidermis)',
      'Serous Membranes',
    ],
    clinicalIndications: [
      'Superficial burns and scalds before vesication',
      'Acute burning cystitis with cutting strangury',
      'Vesicular eruptions with burning agony',
    ],
    internalDosage: '2 to 5 drops in water every 2 hours in acute cystitis.',
    externalApplication:
      'Topical: 10 drops in 100ml water applied immediately with gauze to fresh burns prevents blistering and relieves burning agony instantly.',
    pharmacologicalActions:
      'Controls intense vesication, erythema, and mucosal tenesmus.',
    cautionsAndContraindications:
      'Avoid large doses internally which irritate renal glomeruli.',
  },
  {
    id: '88888888-0004-0000-0000-000000000006',
    remedyName: 'Hypericum Perforatum Q',
    commonName: "St. John's Wort",
    organAffinities: [
      'Peripheral Nerves & Nerve Terminals',
      'Spinal Cord',
      'Coccyx & Nailbeds',
    ],
    clinicalIndications: [
      'Crushed fingers, toes, and nailbeds',
      'Injuries to parts rich in sentient nerves',
      'Coccydynia from falls on back',
      'Puncture wounds from nails and needles',
    ],
    internalDosage:
      '5 to 10 drops in warm water 3 times daily for traumatic neuritis.',
    externalApplication:
      'Lotion: 1 part tincture to 5 parts water applied as compress to lacerated fingertips or painful nerve stumps.',
    pharmacologicalActions:
      'Specific nerve restorative; prevents tetanus in lacerated puncture wounds.',
    cautionsAndContraindications:
      'Avoid prolonged intense sunlight exposure during high-dose systemic intake.',
  },
  {
    id: '88888888-0004-0000-0000-000000000007',
    remedyName: 'Berberis Vulgaris Q',
    commonName: 'Barberry',
    organAffinities: [
      'Renal Pelvis & Ureters',
      'Liver & Gallbladder',
      'Lumbar Musculature',
    ],
    clinicalIndications: [
      'Acute nephrolithiasis with radiating lumbar pain',
      'Biliary colic with jaundice',
      'Rheumatic stiffness with uric acid diathesis',
    ],
    internalDosage:
      '10 to 15 drops in warm water 3 times daily; in acute renal colic, every 30 minutes in hot water.',
    externalApplication: 'Internal use only.',
    pharmacologicalActions:
      'Relaxes ureteric and biliary smooth muscle, promotes renal clearance of urates and micro-calculi.',
    cautionsAndContraindications:
      'Discontinue once calculus passes or colic subsides.',
  },
  {
    id: '88888888-0004-0000-0000-000000000008',
    remedyName: 'Plantago Major Q',
    commonName: 'Plantain',
    organAffinities: [
      'Dental Nerves',
      'Periodontal Tissue',
      'Auditory Canal',
    ],
    clinicalIndications: [
      'Excruciating toothache with sensitive dentin',
      'Pyorrhea and spongy, bleeding gums',
      'Otalgia associated with dental neuralgia',
    ],
    internalDosage: '5 to 10 drops in water 3 times daily.',
    externalApplication:
      'Topical: Apply pure tincture on cotton pledget directly into carious dental cavity; instant relief of severe toothache.',
    pharmacologicalActions:
      'Natural local analgesic and astringent for periodontal mucosa.',
    cautionsAndContraindications:
      'Topical application should not replace permanent dental restoration.',
  },
  {
    id: '88888888-0004-0000-0000-000000000009',
    remedyName: 'Hamamelis Virginiana Q',
    commonName: 'Witch Hazel',
    organAffinities: [
      'Venous Wall',
      'Capillary Plexus',
      'Rectal Veins',
    ],
    clinicalIndications: [
      'Bleeding hemorrhoids with soreness and heaviness',
      'Varicose veins and venous stasis ulcers',
      'Passive dark venous hemorrhages',
    ],
    internalDosage: '5 to 10 drops in water 3 times daily.',
    externalApplication:
      'Compress: 1 part tincture to 5 parts water applied locally to painful hemorrhoids or varices.',
    pharmacologicalActions:
      'Potent venous astringent and vasoconstrictor.',
    cautionsAndContraindications: 'Non-toxic and gentle.',
  },
  {
    id: '88888888-0004-0000-0000-000000000010',
    remedyName: 'Passiflora Incarnata Q',
    commonName: 'Passion Flower',
    organAffinities: [
      'Central Nervous System',
      'Cerebral Cortex',
      'Cardiac Rhythm',
    ],
    clinicalIndications: [
      'Insomnia due to worry and mental overwork',
      'Nocturnal restlessness in infants and elderly',
      'Mild convulsive spasms and hysteria',
    ],
    internalDosage:
      '20 to 30 drops in warm water before retiring; repeat in 1 hour if required.',
    externalApplication: 'Internal use only.',
    pharmacologicalActions:
      'Non-narcotic sedative that promotes natural, physiological restorative sleep without morning grogginess.',
    cautionsAndContraindications:
      'Avoid combining with pharmaceutical sedatives without dosage monitoring.',
  },
];
