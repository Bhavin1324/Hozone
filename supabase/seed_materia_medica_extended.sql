-- ==============================================================================
-- HOZONE CLINICAL DATABASE: EXTENDED MATERIA MEDICA SEED (ALLEN & CLARKE)
-- Script: seed_materia_medica_extended.sql
-- ==============================================================================

-- 1. SEED CLASSICAL REFERENCE BOOKS (ALLEN & CLARKE)
INSERT INTO public.books (id, code, title, author, edition_year, description)
VALUES
  (
    '44444444-0003-0000-0000-000000000003',
    'ALLEN_KEYNOTES',
    'Keynotes and Characteristics with Comparisons',
    'Dr. Henry C. Allen',
    1898,
    'Essential guiding symptoms, constitutional characteristics, and remedy comparisons for daily homeopathic prescribing.'
  ),
  (
    '44444444-0004-0000-0000-000000000004',
    'CLARKE_DICT',
    'A Dictionary of Practical Materia Medica',
    'Dr. John Henry Clarke',
    1902,
    'Comprehensive 3-volume clinical dictionary detailing clinical indications, characteristics, and relationships.'
  )
ON CONFLICT (code) DO NOTHING;

-- 2. SEED EXTENDED MONOGRAPHS: DR. H.C. ALLEN KEYNOTES
INSERT INTO public.remedy_monographs (
  id, remedy_id, book_id, mind, physical_generals, keynotes,
  modalities_agg, modalities_amel, organ_affinities, clinical_indications, comparisons
)
VALUES
  (
    '66666666-0001-0000-0000-000000000001',
    '33333333-0008-0000-0000-000000000008', -- Ars.
    '44444444-0003-0000-0000-000000000003', -- Allen
    'Great anguish and restlessness, changes place continually. Fear of death, thinks it useless to take medicine. Fastidious order.',
    'Burning pains like hot needles or coals; parts burn like fire, yet relieved by hot applications. Rapid and pronounced prostration.',
    'Cannot bear the smell or sight of food. Midnight aggravation (1 to 2 AM). Thirst for small quantities of water at frequent intervals.',
    ARRAY['After midnight (1-2 AM)', 'Cold drinks and cold food', 'Cold open air', 'Lying on affected side'],
    ARRAY['Heat and warm wraps', 'Warm drinks', 'Head elevated in bed', 'Motion'],
    ARRAY['Mucous membranes', 'Gastrointestinal canal', 'Heart and vascular system', 'Skin'],
    ARRAY['Asthma', 'Gastric ulcers', 'Psoriasis', 'Septic fevers', 'Exhaustion'],
    'Compare: Acon., Bell., Bry. in fever; Rhus-t. in restlessness; Secale has burning but wants cold, while Ars. burns and wants heat.'
  ),
  (
    '66666666-0002-0000-0000-000000000002',
    '33333333-0001-0000-0000-000000000001', -- Sulph.
    '44444444-0003-0000-0000-000000000003', -- Allen
    'Ragged philosopher; dirty, untidy people with aversion to being washed. Selfish, irritable, and opinionated.',
    'Standing is the worst position for Sulphur patients; cannot stand, must sit or lie down. Burning heat of soles; sticks feet out from under covers.',
    'Weak empty gone sensation in stomach at about 11 AM; cannot wait for lunch. Bright redness of all orifices (lips, nostrils, anus).',
    ARRAY['Warmth of bed', 'Washing or bathing', 'Standing still', '11 AM hunger', 'Suppressed eruptions'],
    ARRAY['Dry warm weather', 'Lying on right side', 'Gentle walking in open air'],
    ARRAY['Skin and integument', 'Venous system', 'Gastrointestinal tract', 'Abdominal organs'],
    ARRAY['Chronic eczema', 'Hemorrhoids', 'Relapsing fevers', 'Suppressed skin eruptions'],
    'Compare: Calc. and Lyc. follow Sulphur well. Psorinum resembles Sulphur in chronic psoric taint but is more chilly.'
  ),
  (
    '66666666-0003-0000-0000-000000000003',
    '33333333-0005-0000-0000-000000000005', -- Phos.
    '44444444-0003-0000-0000-000000000003', -- Allen
    'Fearful, dreads solitude, darkness, and thunderstorms. Sensitive to light, noise, and atmospheric electricity. Clairvoyant and impressionable.',
    'Tall, slender persons disposed to stoop. Hemorrhagic diathesis; small wounds bleed profusely. Burning between shoulder-blades.',
    'Longs for cold food and ice cream; cold water is relished, but as soon as it becomes warm in the stomach, it is thrown up.',
    ARRAY['Twilight and dusk', 'Thunderstorms', 'Lying on left side or flat on back', 'Cold air'],
    ARRAY['Sleep and short naps', 'Eating cold food', 'Dark quiet room', 'Right side'],
    ARRAY['Respiratory organs and lungs', 'Circulation and blood', 'Spinal cord and nerves', 'Bones'],
    ARRAY['Pneumonia', 'Purpura', 'Hoarseness and laryngitis', 'Gastric ulcers'],
    'Compare: Arsenicum, Bryonia, Lycopodium. Incompatible with Causticum.'
  ),
  (
    '66666666-0004-0000-0000-000000000004',
    '33333333-0006-0000-0000-000000000006', -- Puls.
    '44444444-0003-0000-0000-000000000003', -- Allen
    'Mild, gentle, timid, yielding disposition; weeps at anything, whether joyful or sad. Highly affectionate and craves consolation.',
    'Thirstlessness with almost all complaints. Wandering, shifting pains fly rapidly from one part to another. Bland, yellowish-green thick discharges.',
    'Wants open air; cannot breathe in warm close room, even though chilly. Bad taste in mouth on waking, especially after fatty rich food.',
    ARRAY['Warm close room', 'Fatty and rich foods', 'Evening', 'Lying on painless side'],
    ARRAY['Cool open air', 'Gentle continuous motion', 'Cold applications', 'Consolation'],
    ARRAY['Mucous membranes', 'Venous circulation', 'Synovial joints', 'Female reproductive organs'],
    ARRAY['Amenorrhea', 'Otitis media', 'Varicose veins', 'Dyspepsia from pastries'],
    'Compare: Cyclamen, Kali sulphuricum, Sepia. Silicea is chronic complement to Pulsatilla.'
  ),
  (
    '66666666-0005-0000-0000-000000000005',
    '33333333-0010-0000-0000-000000000010', -- Nux-v.
    '44444444-0003-0000-0000-000000000003', -- Allen
    'Very irritable, sensitive to all impressions (noise, odors, light). Zealous, ambitious temperament, fiery and passionate.',
    'Thin, irritable, choleric persons with sedentary habits. Oversensitive to cold air and draft. Tendency to cramps and spastic contractions.',
    'Frequent ineffectual urging to stool; passes little at a time and feels relieved for a few minutes. Awakens at 3 AM and worries over business.',
    ARRAY['Early morning (3 to 4 AM)', 'Cold open air', 'Mental exertion', 'Stimulants, coffee, alcohol'],
    ARRAY['Evening rest', 'Damp wet weather', 'Free evacuation of bowels', 'Covering head warmly'],
    ARRAY['Gastrointestinal tract', 'Nervous system', 'Liver and portal circulation', 'Spine'],
    ARRAY['Gastritis', 'Constipation with urging', 'Migraine', 'Insomnia from overwork'],
    'Compare: Ignatia, Chamomilla, Colocynthis. Inimical with Zincum.'
  )
ON CONFLICT (remedy_id, book_id) DO NOTHING;

-- 3. SEED EXTENDED MONOGRAPHS: DR. J.H. CLARKE DICTIONARY
INSERT INTO public.remedy_monographs (
  id, remedy_id, book_id, mind, physical_generals, keynotes,
  modalities_agg, modalities_amel, organ_affinities, clinical_indications, comparisons
)
VALUES
  (
    '66666666-0006-0000-0000-000000000006',
    '33333333-0008-0000-0000-000000000008', -- Ars.
    '44444444-0004-0000-0000-000000000004', -- Clarke
    'Anxiety of conscience as if guilty of crime. Fear of solitude, spectres, and incurable sickness. Extreme orderliness and cleanliness.',
    'Intense coldness of body with internal burning heat. Dropsical swellings with thirst. Emaciation and rapid failure of muscular strength.',
    'Periodicity in complaints every fourteen days or yearly. Burning discharges thin, offensive, and excoriating to surrounding skin.',
    ARRAY['1 to 2 AM and PM', 'Cold drafts', 'Cold bathing', 'Drinking ice water'],
    ARRAY['Warm applications', 'Elevating head', 'Heat of stove', 'Hot tea or broth'],
    ARRAY['Epithelial tissues', 'Heart and pericardium', 'Kidneys', 'Blood composition'],
    ARRAY['Angina pectoris', 'Coryza acrid', 'Dysentery', 'Epithelioma', 'Gastralgia', 'Pleurisy', 'Typhoid fever'],
    'Antidoted by: Camphora, China, Ferrum, Hepar, Nux vomica, Sambucus. Clarke notes Arsenicum is pre-eminent in malignant ulcerations and influenza.'
  ),
  (
    '66666666-0007-0000-0000-000000000007',
    '33333333-0003-0000-0000-000000000003', -- Lyc.
    '44444444-0004-0000-0000-000000000004', -- Clarke
    'Melancholy, irritable, morose before public appearance. Dread of men yet fears being left alone in house. Fault-finding and domineering.',
    'Upper body emaciated while lower limbs and abdomen dropsical. Fan-like flapping motion of the wings of the nose in respiratory crises.',
    'Excessive accumulation of flatulence in abdomen; rolling rumbling gases after eating. Aggravation typically 4 PM to 8 PM.',
    ARRAY['4 PM to 8 PM', 'Right side of body', 'Cold drinks and cold foods', 'Pressure of clothes on waist'],
    ARRAY['Warm food and warm drinks', 'Passing flatus and eructation', 'Motion in cool open air', 'Uncovering head'],
    ARRAY['Urinary organs (red sand)', 'Portal system and liver', 'Right lung and pleura', 'Throat'],
    ARRAY['Aneurysm', 'Calculus renal', 'Cirrhosis of liver', 'Flatulent dyspepsia', 'Pneumonia right lung', 'Tinea capitis'],
    'Follows well after: Calcarea, Lachesis, Sulphur. Clarke notes Lycopodium is indispensable in chronic urinary affections with red brick-dust sediment.'
  ),
  (
    '66666666-0008-0000-0000-000000000008',
    '33333333-0012-0000-0000-000000000012', -- Bry.
    '44444444-0004-0000-0000-000000000004', -- Clarke
    'Delirium talks constantly of business; wants to go home even when in own room. Irritable and easily angered; wishes to be quiet.',
    'Great dryness of all mucous membranes from mouth to rectum. Stools large, dry, hard as if burnt. Extreme thirst for large draughts at long intervals.',
    'Sharp, stitching, tearing pains aggravated by the slightest bodily movement. Marked relief from lying on the painful side and firm bandaging.',
    ARRAY['Least bodily motion', 'Deep inspiration and coughing', 'Warm room', 'Morning rising'],
    ARRAY['Absolute quiet rest', 'Lying on painful side', 'Firm pressure', 'Cold applications'],
    ARRAY['Serous membranes (pleura, peritoneum, meninges)', 'Synovial joints', 'Digestive tract', 'Muscles'],
    ARRAY['Appendicitis', 'Bronchitis', 'Constipation', 'Lumbago', 'Peritonitis', 'Pleurisy', 'Rheumatic fever'],
    'Complementary to: Rhus tox. and Alumina. Antidoted by: Aconitum, Camphora, Chamomilla, Coffea, Nux vomica.'
  ),
  (
    '66666666-0009-0000-0000-000000000009',
    '33333333-0013-0000-0000-000000000013', -- Acon.
    '44444444-0004-0000-0000-000000000004', -- Clarke
    'Great fear, agony, and anxiety of mind. Predicts the day and hour of death. Inconsolable restlessness with tossing about in bed.',
    'Sudden violent acute congestions from exposure to dry cold winds. Burning dry fever heat without perspiration. Bounding full hard pulse.',
    'Intense unquenchable thirst for cold water; everything tastes bitter except water. Red face becomes deathly pale on sitting up.',
    ARRAY['Dry cold wind exposure', 'Evening and night', 'Warm room', 'Rising from recumbent posture'],
    ARRAY['Open air', 'Rest', 'Profuse warm perspiration'],
    ARRAY['Cardiovascular system', 'Arterial capillaries', 'Nervous system', 'Serous membranes'],
    ARRAY['Acute fever', 'Croup', 'Hemoptysis', 'Neuralgia', 'Peritonitis acute', 'Panic attacks', 'Tachycardia'],
    'Complementary to: Coffea, Sulphur. Clarke notes Aconite is the acute sheet anchor of homeopathic practice.'
  )
ON CONFLICT (remedy_id, book_id) DO NOTHING;

-- 4. EXTENDED CLINICAL RELATIONSHIPS
INSERT INTO public.remedy_relationships (primary_remedy_id, related_remedy_id, relationship_type, notes)
VALUES
  ('33333333-0013-0000-0000-000000000013', '33333333-0012-0000-0000-000000000012', 'follows_well', 'Bryonia follows Aconitum well in inflammatory serous exudations.'),
  ('33333333-0013-0000-0000-000000000013', '33333333-0001-0000-0000-000000000001', 'complement', 'Sulphur is the chronic complement to Aconitum in unresolved acute inflammatory states.'),
  ('33333333-0012-0000-0000-000000000012', '33333333-0014-0000-0000-000000000014', 'complement', 'Bryonia and Rhus tox. are complementary modalities: Bryonia worse motion, Rhus worse rest.'),
  ('33333333-0005-0000-0000-000000000005', '33333333-0008-0000-0000-000000000008', 'follows_well', 'Arsenicum follows Phosphorus well in deep chest and digestive prostration.'),
  ('33333333-0010-0000-0000-000000000010', '33333333-0001-0000-0000-000000000001', 'follows_well', 'Sulphur follows Nux vomica when liver and bowel symptoms stagnate.')
ON CONFLICT DO NOTHING;
