import type { DiseaseNutritionGuidance } from '@/features/clinical-guidance/types';

export const INITIAL_DISEASE_NUTRITION: DiseaseNutritionGuidance[] = [
  {
    id: '88888888-0003-0000-0000-000000000001',
    conditionName: 'Gout & Hyperuricemia',
    category: 'Metabolic',
    recommendedFoods: [
      'Cherries and dark berries (anthocyanins)',
      'High-water vegetables (cucumber, zucchini, celery)',
      'Flaxseed and olive oil',
      'Alkalizing lemon water',
      'Abundant pure water (3+ liters daily)',
    ],
    restrictedFoods: [
      'Organ meats (liver, kidneys, sweetbreads)',
      'Shellfish and anchovies',
      'Red meats and game',
      'Beer and distilled spirits',
      'High-fructose corn syrup beverages',
      'Yeast extracts',
    ],
    lifestyleGuidelines: [
      'Maintain steady hydration throughout day and night',
      'Avoid rapid crash dieting which spikes serum uric acid',
      'Gentle non-weight bearing exercise (swimming)',
    ],
    homeopathicDietaryCautions:
      'Avoid raw onions, strong garlic, and coffee which antidote Colchicum and Ledum Palustre during acute gout flares.',
    associatedRemedies: [
      'Colchicum Autumnale',
      'Ledum Palustre',
      'Benzoicum Acidum',
      'Urtica Urens',
      'Lycopodium Clavatum',
    ],
  },
  {
    id: '88888888-0003-0000-0000-000000000002',
    conditionName: 'Hypertension & Cardiovascular Arteriosclerosis',
    category: 'Cardiovascular',
    recommendedFoods: [
      'Potassium-rich greens (spinach, Swiss chard)',
      'Garlic and aged garlic extract',
      'Beetroot juice (dietary nitrates)',
      'Oats and soluble fiber',
      'Pomegranate and berries',
      'Magnesium-rich pumpkin seeds',
    ],
    restrictedFoods: [
      'Excess dietary table salt / processed sodium',
      'Trans fats and deep-fried foods',
      'Excess black licorice (glycyrrhizin)',
      'Energy drinks and high-caffeine beverages',
      'Cured deli meats',
    ],
    lifestyleGuidelines: [
      'Brisk daily 30-minute walking',
      'Regular diaphragmatic breathing and vagal tone meditation',
      'Maintain consistent 7-8 hour sleep schedule',
    ],
    homeopathicDietaryCautions:
      'Do not consume camphorated preparations, strong mint tea, or excessive tobacco while taking Crataegus, Glonoinum, or Lachesis.',
    associatedRemedies: [
      'Crataegus Oxyacantha',
      'Glonoinum',
      'Lachesis Muta',
      'Baryta Carbonica',
      'Aurum Metallicum',
    ],
  },
  {
    id: '88888888-0003-0000-0000-000000000003',
    conditionName: 'Renal Calculi (Nephrolithiasis)',
    category: 'Renal',
    recommendedFoods: [
      'Barley water (traditional renal demulcent)',
      'Lemon and lime juice (natural urinary citrates)',
      'Pomegranate juice',
      'Watermelon and cucumber',
      'Distilled and low-mineral spring water',
    ],
    restrictedFoods: [
      'Excess high-oxalate foods (spinach, rhubarb, beet greens, cocoa)',
      'Heavy animal protein loads',
      'Excess refined table salt',
      'High-dose synthetic vitamin C (>1000mg) in oxalate form',
      'Dark colas with phosphoric acid',
    ],
    lifestyleGuidelines: [
      'Drink water before retiring to prevent nocturnal concentrated urine',
      'Filter drinking water in hard-water geographic regions',
    ],
    homeopathicDietaryCautions:
      'Avoid vinegar and strong pickles which can aggravate urinary tracts under Berberis Vulgaris, Lycopodium, and Sarsaparilla.',
    associatedRemedies: [
      'Berberis Vulgaris',
      'Sarsaparilla',
      'Lycopodium Clavatum',
      'Ocimum Canum',
      'Cantharis',
    ],
  },
  {
    id: '88888888-0003-0000-0000-000000000004',
    conditionName: 'Peptic Ulcer Disease & GERD',
    category: 'Gastrointestinal',
    recommendedFoods: [
      'Cabbage juice (glutamine and S-methylmethionine)',
      'Steamed oats and soothing porridge',
      'Ripe bananas and papayas',
      'Bone broth and collagen',
      'Chamomile and deglycyrrhizinated licorice tea',
    ],
    restrictedFoods: [
      'Raw hot chili and pepper sauces',
      'Fried and greasy fast foods',
      'Caffeine, black tea, and colas',
      'Alcohol and spirits',
      'Acidic citrus on empty stomach',
      'Smoking and NSAIDs',
    ],
    lifestyleGuidelines: [
      'Eat small, frequent meals; never overfill stomach',
      'Do not recline within 3 hours after evening meal',
      'Elevate head of bed by 15 cm',
    ],
    homeopathicDietaryCautions:
      'Strictly avoid coffee and peppermint which directly antidote Nux Vomica and Argentum Nitricum.',
    associatedRemedies: [
      'Nux Vomica',
      'Argentum Nitricum',
      'Hydrastis Canadensis',
      'Anacardium Orientale',
      'Phosphorus',
    ],
  },
  {
    id: '88888888-0003-0000-0000-000000000005',
    conditionName: 'Bronchial Asthma & Allergic Rhinitis',
    category: 'Respiratory',
    recommendedFoods: [
      'Warm ginger and turmeric infusions',
      'Quercetin-rich foods (red apples, capers)',
      'Omega-3 fatty fish (salmon, sardines)',
      'Warm vegetable broths',
      'Honey (local raw) for pollen desensitization',
    ],
    restrictedFoods: [
      'Ice-cold water and chilled refrigerated desserts',
      'Sulfited dried fruits and wines',
      'Excess dairy products (which increase viscous mucus)',
      'Artificial food dyes (tartrazine)',
      'High-histamine aged cheeses',
    ],
    lifestyleGuidelines: [
      'Protect chest and neck against cold, damp drafts',
      'Use HEPA air purifiers in sleeping chambers',
      'Avoid damp basements and mold exposure',
    ],
    homeopathicDietaryCautions:
      'Avoid inhaling camphor, eucalyptus chest rubs, or menthol vaporizers which promptly antidote Arsenicum, Dulcamara, and Natrum Sulph.',
    associatedRemedies: [
      'Arsenicum Album',
      'Natrum Sulphuricum',
      'Blatta Orientalis',
      'Ipecacuanha',
      'Medorrhinum',
    ],
  },
];
