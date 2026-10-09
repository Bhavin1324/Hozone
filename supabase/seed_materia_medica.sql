-- ==============================================================================
-- HOZONE CLINICAL DATABASE: MATERIA MEDICA SEED DATA
-- Script: seed_materia_medica.sql
-- ==============================================================================

-- 1. REFERENCE BOOKS
INSERT INTO public.books (id, code, title, author, edition_year, description)
VALUES
  (
    '44444444-0001-0000-0000-000000000001',
    'BOERICKE_MM',
    'Pocket Manual of Homeopathic Materia Medica',
    'Dr. William Boericke',
    1927,
    'Standard concise clinical materia medica containing keynotes and clinical affinities.'
  ),
  (
    '44444444-0002-0000-0000-000000000002',
    'KENT_LECTURES',
    'Lectures on Homeopathic Materia Medica',
    'Dr. James Tyler Kent',
    1905,
    'In-depth constitutional pictures, mental states, and philosophical remedy comparisons.'
  )
ON CONFLICT (code) DO NOTHING;

-- 2. VERIFIED REMEDY RELATIONSHIPS SEED
-- Complements
INSERT INTO public.remedy_relationships (primary_remedy_id, related_remedy_id, relationship_type, notes)
VALUES
  ('33333333-0001-0000-0000-000000000001', '33333333-0002-0000-0000-000000000002', 'complement', 'Sulphur is followed well by Calcarea in psoric chronic states.'),
  ('33333333-0002-0000-0000-000000000002', '33333333-0003-0000-0000-000000000003', 'complement', 'Calcarea is followed well by Lycopodium (Sulphur-Calcarea-Lycopodium cycle).'),
  ('33333333-0011-0000-0000-000000000011', '33333333-0002-0000-0000-000000000002', 'complement', 'Belladonna is acute complement to Calcarea carbonica.'),
  ('33333333-0006-0000-0000-000000000006', '33333333-0015-0000-0000-000000000015', 'complement', 'Silicea is chronic complement to Pulsatilla.')
ON CONFLICT DO NOTHING;

-- Inimicals / Incompatible
INSERT INTO public.remedy_relationships (primary_remedy_id, related_remedy_id, relationship_type, notes)
VALUES
  ('33333333-0014-0000-0000-000000000014', '33333333-0011-0000-0000-000000000011', 'inimical', 'Rhus toxicodendron should not follow or be given concurrently with Apis or incompatible erysipelas remedies.'),
  ('33333333-0005-0000-0000-000000000005', '33333333-0010-0000-0000-000000000010', 'inimical', 'Phosphorus and Causticum are inimical; Nux vomica incompatible follow-up in specific nervous states.')
ON CONFLICT DO NOTHING;

-- Antidotes
INSERT INTO public.remedy_relationships (primary_remedy_id, related_remedy_id, relationship_type, notes)
VALUES
  ('33333333-0010-0000-0000-000000000010', '33333333-0008-0000-0000-000000000008', 'antidote', 'Nux vomica antidotes ill effects of Arsenicum and many aromatic vegetals.'),
  ('33333333-0006-0000-0000-000000000006', '33333333-0011-0000-0000-000000000011', 'antidote', 'Pulsatilla antidotes Belladonna acute congestion states.')
ON CONFLICT DO NOTHING;

-- 3. REMEDY MONOGRAPHS SEED
INSERT INTO public.remedy_monographs (
  remedy_id, book_id, mind, physical_generals, keynotes, modalities_agg, modalities_amel, organ_affinities
)
VALUES
  (
    '33333333-0001-0000-0000-000000000001',
    '44444444-0001-0000-0000-000000000001',
    'Philosophical, speculative, ragged philosopher. Selfish, irritable, critical of others. Laziness and procrastination.',
    'Burning heat in vertex, palms, and soles. Puts feet out of bed at night. Standing is the most uncomfortable position.',
    'Empty gone feeling in epigastrium at 11 AM. Orifices are red (lips, nostrils, anus). Aversion to bathing and washing.',
    ARRAY['Warmth of bed', 'Washing and bathing', 'Standing still', '11 AM hunger', 'Rest'],
    ARRAY['Dry warm weather', 'Lying on right side', 'Motion'],
    ARRAY['Skin', 'Venous system', 'Gastrointestinal tract', 'Portal system']
  ),
  (
    '33333333-0002-0000-0000-000000000002',
    '44444444-0001-0000-0000-000000000001',
    'Apprehensive of losing reason or that people will observe mental confusion. Fears disaster, heart disease, infection.',
    'Fair, fat, flabby with sluggish glandular metabolism. Cold damp feet feel as if wearing wet stockings. Profuse sour head sweats.',
    'Craving for boiled eggs and indigestible things (chalk, dirt). Great shortness of breath ascending stairs or slight exertion.',
    ARRAY['Cold and damp weather', 'Ascending stairs', 'Physical exertion', 'Full moon'],
    ARRAY['Dry weather', 'Lying on painful side', 'Resting quietly'],
    ARRAY['Glands', 'Bones and cartilage', 'Blood vessels', 'Respiratory system']
  ),
  (
    '33333333-0003-0000-0000-000000000003',
    '44444444-0001-0000-0000-000000000001',
    'Anticipatory anxiety before public speaking or performance, yet performs well. Intellectual keenness with physical frailty. Dictatorial at home, cowardly in society.',
    'Deep right-sided complaints or right-to-left progression. Emaciation of upper body with abdominal distension.',
    'Excessive flatulence and abdominal bloating immediately after eating slightest mouthful. Craving warm food and warm drinks. Fan-like motion of alae nasi.',
    ARRAY['4 to 8 PM aggravation', 'Right side', 'Cold drinks and cold food', 'Warm room'],
    ARRAY['Warm drinks and warm food', 'Motion in cool open air', 'Uncovering head', 'Eructations'],
    ARRAY['Liver and digestive tract', 'Urinary organs', 'Right lung', 'Throat']
  ),
  (
    '33333333-0005-0000-0000-000000000005',
    '44444444-0001-0000-0000-000000000001',
    'Open, sympathetic, highly impressionable, clairvoyant tendencies. Intense fear of twilight, thunderstorm, being alone, and dark.',
    'Tall, slender, narrow-chested, delicate skin. Burning sensations along spine and between scapulae. Hemorrhagic diathesis with frequent epistaxis.',
    'Desire for icy cold drinks which are vomited as soon as they become warm in the stomach. Craving salt, ice cream, and refreshing spicy food.',
    ARRAY['Twilight and evening', 'Thunderstorm', 'Lying on left side or back', 'Cold air'],
    ARRAY['Eating', 'Sleeping (even a short nap)', 'Cold food until warm', 'Dark room'],
    ARRAY['Lungs and respiratory', 'Nervous system', 'Blood and circulation', 'Bones (lower jaw)']
  ),
  (
    '33333333-0006-0000-0000-000000000006',
    '44444444-0001-0000-0000-000000000001',
    'Mild, gentle, timid, yielding disposition. Weeps easily when narrating symptoms. Highly seeks consoling sympathy. Variable moods.',
    'Thirstless in almost all complaints. Wandering and shifting pains from joint to joint with swelling and redness. Bland, thick, yellowish-green discharges.',
    'Chilly yet suffocates in warm close room. Aversion to fatty and rich food which deranges digestion. Dry mouth without thirst.',
    ARRAY['Warm stuffy room', 'Rich, fatty food', 'Evening', 'Lying on painless side'],
    ARRAY['Cool open air', 'Gentle continuous motion', 'Cold applications', 'Consolation'],
    ARRAY['Mucous membranes', 'Venous circulation', 'Female reproductive system', 'Synovial joints']
  ),
  (
    '33333333-0008-0000-0000-000000000008',
    '44444444-0001-0000-0000-000000000001',
    'Intense anxiety, mental restlessness, anguish, and despair of recovery. Fear of death when alone. Exceedingly fastidious order and neatness.',
    'Burning pains like coals of fire, yet paradoxically relieved by hot applications. Great prostration disproportionate to illness. Chilly to the bone.',
    'Midnight aggravation between 1 AM and 2 AM. Thirst for small sips of water at frequent intervals. Acrid excoriating discharges.',
    ARRAY['After midnight (1-2 AM)', 'Cold weather and cold drinks', 'Seashore', 'Physical exertion'],
    ARRAY['Heat and warm wraps', 'Warm drinks', 'Head elevated', 'Company'],
    ARRAY['Gastrointestinal tract', 'Respiratory system', 'Heart and circulation', 'Skin']
  )
ON CONFLICT (remedy_id, book_id) DO NOTHING;

