import type { CuredCase } from '@/features/clinical-guidance/types';

export const INITIAL_CURED_CASES: CuredCase[] = [
  {
    id: '88888888-0002-0000-0000-000000000001',
    title: 'Acute Pleuritic Stitch Cured with Bryonia',
    author: 'Dr. Samuel Hahnemann',
    patientAgeGroup: 'Adult (42yo Female, Washerwoman)',
    clinicalDiagnosis: 'Acute Pleurisy with Dry Stitching Cough',
    organSystem: 'Respiratory',
    initialSymptoms:
      'Severe sharp stitching pains in the right side of the chest; every inspiration and cough induces acute agony. Extreme irritability, tongue thickly coated white, intense thirst for large quantities of cold water at long intervals.',
    symptomTotality: [
      'Chest - Pain - Stitching - Inspiration agg',
      'Chest - Pain - Stitching - Coughing agg',
      'Mind - Irritability - Pain during',
      'Stomach - Thirst - Large quantities - Long intervals',
      'Generalities - Motion agg',
    ],
    remedyPrescribed: 'Bryonia Alba',
    potencyAndDosage: '30C single dose, followed by rest',
    keyPrescribingClue:
      'Pain strictly aggravated by the slightest breath or movement, and ameliorated by firm pressure against the affected side.',
    outcomeAndTimeline:
      'Within 4 hours the stitches softened. Patient slept peacefully through the night. Complete resolution of pleural friction rub within 48 hours without effusion.',
    kentObservationNum: 3,
  },
  {
    id: '88888888-0002-0000-0000-000000000002',
    title: 'Chronic Severe Bronchial Asthma Unlocked by Sycotic History',
    author: 'Dr. J.T. Kent',
    patientAgeGroup: 'Adult (38yo Male)',
    clinicalDiagnosis: 'Intractable Bronchial Asthma with Nocturnal Suffocation',
    organSystem: 'Respiratory',
    initialSymptoms:
      'Debilitating asthma for 7 years. Suffocation awakens him at 3 AM. Must sit bent forward at the window gasping for breath. History of suppressed gonorrhea 8 years prior. Craves sour foods and ice.',
    symptomTotality: [
      'Respiration - Asthmatic - Midnight after - 3 h',
      'Respiration - Asthmatic - Sitting bent forward amel',
      'Stomach - Desires - Sour',
      'Mind - Time passes too slowly',
      'Generalities - Damp weather agg',
    ],
    remedyPrescribed: 'Medorrhinum',
    potencyAndDosage: '1M single dose dry on tongue',
    keyPrescribingClue:
      'Relief of asthmatic dyspnea only when lying prone (face downward) or in the knee-chest posture.',
    outcomeAndTimeline:
      "A brief 12-hour aggravation followed by clear chest breathing. At day 14, an old urethral discharge reappeared for 4 days (Hering's law) and vanished. Patient remained free of asthma for 5 years.",
    kentObservationNum: 4,
  },
  {
    id: '88888888-0002-0000-0000-000000000003',
    title: 'Violent Left-Sided Trigeminal Neuralgia Cured by Spigelia',
    author: 'Dr. E.B. Nash',
    patientAgeGroup: 'Adult (50yo Female)',
    clinicalDiagnosis: 'Left Trigeminal & Supraorbital Neuralgia',
    organSystem: 'Nervous System',
    initialSymptoms:
      'Intolerable burning, jerking, and tearing pains radiating from the left eye back into the occiput. Attacks begin at sunrise, reach intolerable agony at midday, and subside at sunset. Left eye intensely red and watery.',
    symptomTotality: [
      'Head - Pain - Neuralgic - Left sided',
      'Eye - Pain - Extending backward to occiput',
      'Head - Pain - Sun - Rising to setting of',
      'Generalities - Noise agg',
      'Generalities - Touch agg',
    ],
    remedyPrescribed: 'Spigelia Anthelmia',
    potencyAndDosage: '200C single dose in water',
    keyPrescribingClue:
      'The strict concordance of the neuralgic cycle with the course of the sun, radiating exclusively on the left side of the face.',
    outcomeAndTimeline:
      'Pain did not return the following morning. Slight soreness of scalp persisted for 24 hours, followed by permanent cure.',
    kentObservationNum: 3,
  },
  {
    id: '88888888-0002-0000-0000-000000000004',
    title: 'Recurrent Nephrolithiasis with Radiating Ureteric Spasm',
    author: 'Dr. N.M. Choudhuri',
    patientAgeGroup: 'Elderly (64yo Male)',
    clinicalDiagnosis: 'Right Renal Colic with Nephrolithiasis',
    organSystem: 'Genitourinary',
    initialSymptoms:
      'Excruciating bubbling, cutting, and stitching pains in the right renal region radiating down the ureter into the bladder, testicle, and anterior thigh. Urine turbid with copious reddish-brick dust sediment.',
    symptomTotality: [
      'Kidneys - Pain - Stitching - Extending to bladder',
      'Kidneys - Pain - Stitching - Extending to thigh',
      'Kidneys - Bubbling sensation',
      'Urine - Sediment - Red',
      'Generalities - Jar agg',
    ],
    remedyPrescribed: 'Berberis Vulgaris',
    potencyAndDosage: '30C every 2 hours for 3 doses',
    keyPrescribingClue:
      'Characteristic bubbling sensation in the lumbar region with pain radiating outward and downward along the ureter into the thigh.',
    outcomeAndTimeline:
      'Pain subsided completely within 3 hours. On the second morning, passed a 4mm smooth calculus with minimal discomfort.',
    kentObservationNum: 3,
  },
  {
    id: '88888888-0002-0000-0000-000000000005',
    title: 'Chronic Suppurative Otitis Media with Mastoid Tenderness',
    author: 'Dr. H.A. Roberts',
    patientAgeGroup: 'Child (8yo Boy)',
    clinicalDiagnosis: 'Chronic Suppurative Otitis Media with Fistula',
    organSystem: 'Dermatology',
    initialSymptoms:
      'Offensive, yellow, purulent discharge from left ear of 14 months duration following scarlet fever. Mastoid tender to touch; periosteal thickening. Child extremely chilly, head sweats profusely during sleep, feet foul-smelling.',
    symptomTotality: [
      'Ear - Discharge - Purulent - Offensive',
      'Ear - Pain - Mastoid process',
      'Perspiration - Head - Sleep during',
      'Generalities - Cold air agg',
      'Generalities - Chilly',
    ],
    remedyPrescribed: 'Silicea Terra',
    potencyAndDosage: '200C, one dose weekly for 3 weeks',
    keyPrescribingClue:
      'Extreme lack of vital heat, profuse sour nocturnal head sweat, and chronic fistulous tendency.',
    outcomeAndTimeline:
      'Discharge increased slightly for 2 days, then turned watery and ceased completely. Mastoid tenderness vanished and tympanic membrane scarred closed.',
    kentObservationNum: 2,
  },
  {
    id: '88888888-0002-0000-0000-000000000006',
    title: 'Severe Right Lower Lobe Lobar Pneumonia',
    author: 'Dr. J.T. Kent',
    patientAgeGroup: 'Adult (29yo Male)',
    clinicalDiagnosis: 'Right Lobar Pneumonia (Stage of Hepatization)',
    organSystem: 'Respiratory',
    initialSymptoms:
      'High fever (104.2 F), pulse rapid and soft. Rusty, prune-juice sputum with violent panting respiration. Tight, suffocative constriction of the chest; patient cannot lie on the left side.',
    symptomTotality: [
      'Chest - Hepatization of lungs - Right',
      'Chest - Pain - Constriction',
      'Expectoration - Rust-colored',
      'Stomach - Desires - Cold drinks',
      'Generalities - Lying on left side agg',
    ],
    remedyPrescribed: 'Phosphorus',
    potencyAndDosage: '10M single dose',
    keyPrescribingClue:
      'Intense craving for ice-cold water, which causes nausea when warm in the stomach; right lower lobe consolidation with left lateral decubitus aggravation.',
    outcomeAndTimeline:
      'Prompt crisis perspiration occurred 8 hours post-dose. Temperature dropped to 99.5 F. Full resolution of consolidation confirmed on day 7.',
    kentObservationNum: 3,
  },
];
