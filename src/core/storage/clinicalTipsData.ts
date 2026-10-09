import type { ClinicalTip } from '@/features/clinical-guidance/types';

export const INITIAL_CLINICAL_TIPS: ClinicalTip[] = [
  {
    id: '88888888-0001-0000-0000-000000000001',
    remedyName: 'Aconitum Napellus',
    author: 'Dr. William Boericke',
    clinicalCondition: 'Acute Inflammatory Fevers & Croup',
    organSystem: 'Respiratory',
    tipContent:
      'Aconite is only indicated at the absolute onset of inflammatory fever before exudation or localization begins. Once localized exudates or plastic infiltration occur, Aconite ceases to be of service; switch to Bryonia, Hepar Sulph, or Mercurius.',
    verificationLevel: 'clinical_pearl',
    tags: ['acute', 'fever', 'restlessness', 'respiratory'],
  },
  {
    id: '88888888-0002-0000-0000-000000000002',
    remedyName: 'Bryonia Alba',
    author: 'Dr. J.T. Kent',
    clinicalCondition: 'Pleurisy & Splitting Headaches',
    organSystem: 'Respiratory',
    tipContent:
      'The characteristic headache of Bryonia is relieved by pressure and firm bandaging, but aggravated by the slightest motion of the eyeballs or coughing. In pleurisy, the patient invariably lies on the painful affected side to immobilize the intercostal movement.',
    verificationLevel: 'keynote_clue',
    tags: ['pleurisy', 'pressure_amel', 'motion_agg', 'headache'],
  },
  {
    id: '88888888-0003-0000-0000-000000000003',
    remedyName: 'Arsenicum Album',
    author: 'Dr. E.B. Nash',
    clinicalCondition: 'Asthmatic Paroxysms & Nocturnal Gastritis',
    organSystem: 'Respiratory',
    tipContent:
      'Arsenicum asthma occurs with intense anguish, fear of death, and suffocating attacks between 1 AM and 3 AM. The patient cannot lie down and must sit bent forward, yet insists on sipping warm water frequently.',
    verificationLevel: 'verified',
    tags: ['asthma', 'periodic', 'warmth_amel', 'midnight_agg'],
  },
  {
    id: '88888888-0004-0000-0000-000000000004',
    remedyName: 'Silicea Terra',
    author: 'Dr. J.H. Clarke',
    clinicalCondition: 'Suppuration & Foreign Body Expulsion',
    organSystem: 'Dermatology',
    tipContent:
      'Silicea ripens abscesses and promotes the swift expulsion of foreign bodies (splinters, fishbones, needles) from soft tissues. CAUTION: Avoid high potencies of Silicea in patients with encapsulated pulmonary tubercles or surgical implants.',
    verificationLevel: 'frequent_confirmation',
    tags: ['abscess', 'foreign_body', 'suppuration', 'tissues'],
  },
  {
    id: '88888888-0005-0000-0000-000000000005',
    remedyName: 'Lachesis Muta',
    author: 'Dr. C.M. Boger',
    clinicalCondition: 'Septic Throats & Climacteric Flushing',
    organSystem: 'Cardiovascular',
    tipContent:
      'The symptom of left-sided pathology spreading to the right, combined with extreme intolerance to anything tight touching the throat or collar, is unfailing. Aggravation after sleep is the sovereign modality.',
    verificationLevel: 'keynote_clue',
    tags: ['left_sided', 'sleep_agg', 'constriction', 'septic'],
  },
  {
    id: '88888888-0006-0000-0000-000000000006',
    remedyName: 'Lycopodium Clavatum',
    author: 'Dr. M.L. Tyler',
    clinicalCondition: 'Flatulent Dyspepsia & Right Renal Colic',
    organSystem: 'Gastrointestinal',
    tipContent:
      'A single mouthful fills the patient up to the throat with excessive intestinal rumbling and distension. Pains typically begin on the right side and travel left, with regular afternoon aggravations from 4 PM to 8 PM.',
    verificationLevel: 'verified',
    tags: ['flatulence', 'right_sided', 'afternoon_agg', 'dyspepsia'],
  },
  {
    id: '88888888-0007-0000-0000-000000000007',
    remedyName: 'Nux Vomica',
    author: 'Dr. J.C. Burnett',
    clinicalCondition: 'Gastrointestinal Spasms & Sedentary Dyspepsia',
    organSystem: 'Gastrointestinal',
    tipContent:
      'Frequent ineffectual urge to stool and urinate; passing small quantities provides brief relief. Highly impatient, hypersensitive to noise, light, and cold draft. Sovereign antidote to over-drugging and coffee excess.',
    verificationLevel: 'frequent_confirmation',
    tags: ['spasm', 'ineffectual_urging', 'chilly', 'antidote'],
  },
  {
    id: '88888888-0008-0000-0000-000000000008',
    remedyName: 'Phosphorus',
    author: 'Dr. J.T. Kent',
    clinicalCondition: 'Hemoptysis & Destructive Lung Pathology',
    organSystem: 'Respiratory',
    tipContent:
      'Craves ice-cold drinks and food which are ejected as soon as they become warm in the stomach. Oppressive tightness across the chest; patient cannot lie on the left side without dyspnea and palpitating anxiety.',
    verificationLevel: 'clinical_pearl',
    tags: ['hemorrhage', 'cold_craving', 'left_side_agg', 'chest_tightness'],
  },
  {
    id: '88888888-0009-0000-0000-000000000009',
    remedyName: 'Pulsatilla Pratensis',
    author: 'Dr. William Boericke',
    clinicalCondition: 'Catarrhal Otitis & Wandering Arthritis',
    organSystem: 'Musculoskeletal',
    tipContent:
      'Symptoms ever-changing and wandering rapidly from joint to joint. Absolute thirstlessness even with high fever or dry mouth. Marked relief from slow movement in cool, open fresh air; aggravated in a warm stuffy room.',
    verificationLevel: 'verified',
    tags: ['wandering_pains', 'thirstless', 'open_air_amel', 'mild'],
  },
  {
    id: '88888888-0010-0000-0000-000000000010',
    remedyName: 'Rhus Toxicodendron',
    author: 'Dr. E.B. Nash',
    clinicalCondition: 'Rheumatic Strains & Joint Stiffness',
    organSystem: 'Musculoskeletal',
    tipContent:
      'Pains and stiffness markedly worse on first beginning to move, but gradually improving with continued gentle motion. Aggravated before storms, in damp rainy weather, and relieved by hot bathing and dry heat.',
    verificationLevel: 'keynote_clue',
    tags: ['rest_agg', 'motion_amel', 'damp_agg', 'rheumatism'],
  },
  {
    id: '88888888-0011-0000-0000-000000000011',
    remedyName: 'Belladonna',
    author: 'Dr. C.M. Boger',
    clinicalCondition: 'Violent Throbbing Congestions',
    organSystem: 'Nervous System',
    tipContent:
      'Sudden onset, sudden cessation. Intense redness, radiating burning heat, and throbbing carotids. Aggravated by light, noise, touch, or jarring of the bed; pupils widely dilated with glassy eyes.',
    verificationLevel: 'clinical_pearl',
    tags: ['sudden', 'throbbing', 'heat', 'jarring_agg'],
  },
  {
    id: '88888888-0012-0000-0000-000000000012',
    remedyName: 'Spigelia Anthelmia',
    author: 'Dr. J.H. Clarke',
    clinicalCondition: 'Left Trigeminal Neuralgia & Pericarditis',
    organSystem: 'Nervous System',
    tipContent:
      'Severe ciliary and supraorbital neuralgia strictly limited to the left side, following the sun from sunrise, peaking at noon, and declining at sunset. Heart palpitations shake the entire chest wall and are audible.',
    verificationLevel: 'keynote_clue',
    tags: ['neuralgia', 'left_eye', 'sun_agg', 'pericarditis'],
  },
];
