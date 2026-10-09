-- ==============================================================================
-- HOZONE CLINICAL DATABASE SEED: SPECIALTY REPERTORIES & VETERINARY EXTENSIONS
-- Seed: seed_specialty_veterinary.sql
-- Module: Specialty Repertories & Veterinary Homeopathy (Module 6)
-- PostgreSQL: 17
-- ==============================================================================

-- 1. Specialty Repertories Registry Seed
INSERT INTO public.specialty_repertories (
    id, code, name, author, year, description, total_rubrics, category
) VALUES
(
    'a1000000-0000-4000-8000-000000000001',
    'BORLAND',
    'Pneumonias & Children Types Repertory',
    'Douglas M. Borland, M.B., Ch.B.',
    1939,
    'Definitive clinical repertory for stage-specific lobar pneumonia and constitutional childhood pediatric anamnesis.',
    4,
    'Pediatric'
),
(
    'a1000000-0000-4000-8000-000000000002',
    'CLARKE_CLINICAL',
    'Clinical Repertory',
    'John Henry Clarke, M.D.',
    1904,
    'Alphabetical dictionary of clinical pathological diagnoses, etiologies, causations, and disease names.',
    4,
    'Clinical'
),
(
    'a1000000-0000-4000-8000-000000000003',
    'BOENNINGHAUSEN_TPB',
    'Therapeutic Pocket Book (TPB)',
    'Clemens Maria Franz von Bönninghausen',
    1846,
    'Classic repertory based on generalized locations, sensations, modalities, and remedy concordances.',
    2,
    'Pocket Book'
),
(
    'a1000000-0000-4000-8000-000000000004',
    'BOGER_SYNOPTIC',
    'Synoptic Key & General Analysis',
    'Cyrus Maxwell Boger, M.D.',
    1915,
    'Pathological generalities, keynotes, and tissue affinity repertory emphasizing systemic directions.',
    2,
    'Card/Key'
),
(
    'a1000000-0000-4000-8000-000000000005',
    'VETERINARY',
    'Veterinary Homeopathic Repertory',
    'Hozone Veterinary Clinical Board',
    2026,
    'Comparative veterinary repertory mapping behavioral, somatic, and acute crisis symptoms across animal species.',
    8,
    'Veterinary'
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    author = EXCLUDED.author,
    year = EXCLUDED.year,
    description = EXCLUDED.description,
    total_rubrics = EXCLUDED.total_rubrics,
    category = EXCLUDED.category;

-- 2. Specialty Clinical Rubrics Seed
INSERT INTO public.specialty_rubrics (
    id, repertory_code, section, rubric_path, remedies_json, clinical_notes
) VALUES
-- Borland
(
    'b1000000-0000-4000-8000-000000000001',
    'BORLAND',
    'Pneumonia - Incipient Stage',
    'PNEUMONIA - Incipient - sudden chill, bounding pulse, hot skin, anxious restlessness',
    '[{"abbr": "Acon", "remedy": "Aconitum Napellus", "grade": 4}, {"abbr": "Bell", "remedy": "Belladonna", "grade": 3}, {"abbr": "Ferr-p", "remedy": "Ferrum Phosphoricum", "grade": 3}]'::JSONB,
    'Borland: Administer during first 24-48 hours before consolidation has solidified.'
),
(
    'b1000000-0000-4000-8000-000000000002',
    'BORLAND',
    'Pneumonia - Consolidation',
    'PNEUMONIA - Consolidation - pleuritic stitching pain agg. motion, dry thirst for cold water',
    '[{"abbr": "Bry", "remedy": "Bryonia Alba", "grade": 4}, {"abbr": "Merc-s", "remedy": "Mercurius Solubilis", "grade": 2}]'::JSONB,
    'Borland: Patient lies quietly on affected side to immobilize ribs; tongue coated thick white.'
),
(
    'b1000000-0000-4000-8000-000000000003',
    'BORLAND',
    'Children - Physical Generals',
    'CHILDREN - Emaciation - rapid wasting with ravenous hunger, irritable and cross',
    '[{"abbr": "Abrot", "remedy": "Abrotanum", "grade": 3}, {"abbr": "Iod", "remedy": "Iodium", "grade": 3}, {"abbr": "Nat-m", "remedy": "Natrum Muriaticum", "grade": 3}, {"abbr": "Tub", "remedy": "Tuberculinum", "grade": 2}]'::JSONB,
    'Borland: Pediatric wasting despite high caloric intake; marasmus or endocrine hypersensitivity.'
),
(
    'b1000000-0000-4000-8000-000000000004',
    'BORLAND',
    'Children - Mind & Sleep',
    'CHILDREN - Night Terrors - waking terrified with screaming, clinging to mother',
    '[{"abbr": "Stram", "remedy": "Stramonium", "grade": 4}, {"abbr": "Calc-c", "remedy": "Calcarea Carbonica", "grade": 3}, {"abbr": "Kali-br", "remedy": "Kali Bromatum", "grade": 2}]'::JSONB,
    'Borland: Common in children with enlarged adenoids, fearful of darkness and solitary sleep.'
),
-- Clarke Clinical
(
    'b1000000-0000-4000-8000-000000000005',
    'CLARKE_CLINICAL',
    'Clinical Conditions',
    'CLINICAL - Appendicitis - acute localized iliac fossa tenderness with high fever and peritoneal guarding',
    '[{"abbr": "Bell", "remedy": "Belladonna", "grade": 3}, {"abbr": "Bry", "remedy": "Bryonia Alba", "grade": 3}, {"abbr": "Merc-c", "remedy": "Mercurius Corrosivus", "grade": 2}, {"abbr": "Rhus-t", "remedy": "Rhus Toxicodendron", "grade": 2}]'::JSONB,
    'Clarke: Always monitor surgical indications; Belladonna aborts early catarrhal congestion.'
),
(
    'b1000000-0000-4000-8000-000000000006',
    'CLARKE_CLINICAL',
    'Clinical Conditions',
    'CLINICAL - Asthma - cardiac origin, waking with severe nocturnal smothering sensation',
    '[{"abbr": "Dig", "remedy": "Digitalis Purpurea", "grade": 3}, {"abbr": "Lach", "remedy": "Lachesis Mutus", "grade": 3}, {"abbr": "Naja", "remedy": "Naja Tripudians", "grade": 2}]'::JSONB,
    'Clarke: Accompanied by weak pulse, valvular murmurs, and cyanotic lips.'
),
(
    'b1000000-0000-4000-8000-000000000007',
    'CLARKE_CLINICAL',
    'Causation & Etiology',
    'CAUSATION - Cold Dry Winds - exposure to cold north-easterly winds triggering sudden acute inflammation',
    '[{"abbr": "Acon", "remedy": "Aconitum Napellus", "grade": 4}, {"abbr": "Hep", "remedy": "Hepar Sulphuris", "grade": 3}, {"abbr": "Spong", "remedy": "Spongia Tosta", "grade": 3}]'::JSONB,
    'Clarke: Hahnemannian acute triad for winter/early spring respiratory exposures.'
),
(
    'b1000000-0000-4000-8000-000000000008',
    'CLARKE_CLINICAL',
    'Causation & Etiology',
    'CAUSATION - Vaccination, bad effects of - persistent dermatological, lymphatic or neuralgic sequelae',
    '[{"abbr": "Thuja", "remedy": "Thuja Occidentalis", "grade": 4}, {"abbr": "Sil", "remedy": "Silicea", "grade": 3}, {"abbr": "Maland", "remedy": "Malandrinum", "grade": 2}]'::JSONB,
    'Clarke: Burnetts chief vaccinal antidotes.'
),
-- Boger Synoptic Key
(
    'b1000000-0000-4000-8000-000000000009',
    'BOGER_SYNOPTIC',
    'Pathological Generalities',
    'GENERAL ANALYSIS - Periodicity - paroxysms recurring at fixed exact clock intervals',
    '[{"abbr": "Cedr", "remedy": "Cedron", "grade": 4}, {"abbr": "Chin", "remedy": "China Officinalis", "grade": 3}, {"abbr": "Ars", "remedy": "Arsenicum Album", "grade": 3}]'::JSONB,
    'Boger: Cedron shows mechanical clock-like regularity to the exact minute.'
),
(
    'b1000000-0000-4000-8000-000000000010',
    'BOGER_SYNOPTIC',
    'Pathological Generalities',
    'GENERAL ANALYSIS - Secretions - thick, yellow-green, bland, non-irritating mucous discharges',
    '[{"abbr": "Puls", "remedy": "Pulsatilla Pratensis", "grade": 4}, {"abbr": "Kali-s", "remedy": "Kali Sulphuricum", "grade": 3}, {"abbr": "Hydr", "remedy": "Hydrastis Canadensis", "grade": 2}]'::JSONB,
    'Boger: Contrasts with Mercurius and Arsenicum which are acrid and excoriating.'
),
-- Boenninghausen TPB
(
    'b1000000-0000-4000-8000-000000000011',
    'BOENNINGHAUSEN_TPB',
    'Sensations & Pains',
    'SENSATIONS - Burning Pains - ameliorated by external warmth and hot applications',
    '[{"abbr": "Ars", "remedy": "Arsenicum Album", "grade": 4}, {"abbr": "Caps", "remedy": "Capsicum Annuum", "grade": 3}, {"abbr": "Sec", "remedy": "Secale Cornutum", "grade": 2}]'::JSONB,
    'TPB: Paradoxical relief of burning sensation by application of heat.'
),
(
    'b1000000-0000-4000-8000-000000000012',
    'BOENNINGHAUSEN_TPB',
    'Concordances',
    'CONCORDANCES - Psorinum - constitutional relationship to Sulphur, Tubercular, and Silicea',
    '[{"abbr": "Sulph", "remedy": "Sulphur", "grade": 4}, {"abbr": "Tub", "remedy": "Tuberculinum", "grade": 3}, {"abbr": "Sil", "remedy": "Silicea", "grade": 3}]'::JSONB,
    'TPB: Deep chronic complementary follow-up remedies.'
),
-- Veterinary
(
    'b1000000-0000-4000-8000-000000000013',
    'VETERINARY',
    'Canine Behavioral',
    'CANINE - Mind - Fear of thunderstorms, fireworks, and loud concussive noises; trembling and hiding',
    '[{"abbr": "Phos", "remedy": "Phosphorus", "grade": 4}, {"abbr": "Bor", "remedy": "Borax Veneta", "grade": 3}, {"abbr": "Rhod", "remedy": "Rhododendron", "grade": 3}, {"abbr": "Cham", "remedy": "Chamomilla", "grade": 2}]'::JSONB,
    'Vet Guidance: Administer Phosphorus 30C/200C in water 30 minutes before forecasted storm or firework display.'
),
(
    'b1000000-0000-4000-8000-000000000014',
    'VETERINARY',
    'Canine Dermatological',
    'CANINE - Skin - Acute moist dermatitis (hot spots) with raw redness, intense itching and sticky oozing',
    '[{"abbr": "Rhus-t", "remedy": "Rhus Toxicodendron", "grade": 3}, {"abbr": "Sulph", "remedy": "Sulphur", "grade": 3}, {"abbr": "Graph", "remedy": "Graphites", "grade": 3}, {"abbr": "Apis", "remedy": "Apis Mellifica", "grade": 2}]'::JSONB,
    'Vet Guidance: Cleanse with Calendula diluted tincture topically; oral Rhus Tox 30C twice daily.'
),
(
    'b1000000-0000-4000-8000-000000000015',
    'VETERINARY',
    'Feline Urological',
    'FELINE - Urinary - Feline Lower Urinary Tract Disease (FLUTD), painful straining with bloody drops',
    '[{"abbr": "Canth", "remedy": "Cantharis Vesicatoria", "grade": 4}, {"abbr": "Nux-v", "remedy": "Nux Vomica", "grade": 3}, {"abbr": "Staph", "remedy": "Staphysagria", "grade": 2}]'::JSONB,
    'Vet Guidance: Emergency ruling out of urethral obstruction in tomcats mandatory before homeopathy.'
),
(
    'b1000000-0000-4000-8000-000000000016',
    'VETERINARY',
    'Feline Respiratory',
    'FELINE - Respiratory - Feline viral rhinotracheitis with paroxysmal sneezing, photophobia, acrid coryza',
    '[{"abbr": "All-c", "remedy": "Allium Cepa", "grade": 3}, {"abbr": "Euphr", "remedy": "Euphrasia Officinalis", "grade": 3}, {"abbr": "Hep", "remedy": "Hepar Sulphuris", "grade": 2}]'::JSONB,
    'Vet Guidance: Dissolve 2 pellets in 5ml spring water; administer 0.5ml orally with plastic syringe.'
),
(
    'b1000000-0000-4000-8000-000000000017',
    'VETERINARY',
    'Equine Digestive',
    'EQUINE - Abdomen - Spasmodic colic after getting chilled or drinking ice-cold water, violent kicking at belly',
    '[{"abbr": "Coloc", "remedy": "Colocynthis", "grade": 4}, {"abbr": "Mag-p", "remedy": "Magnesia Phosphorica", "grade": 3}, {"abbr": "Cham", "remedy": "Chamomilla", "grade": 3}, {"abbr": "Nux-v", "remedy": "Nux Vomica", "grade": 2}]'::JSONB,
    'Vet Guidance: Administer Colocynthis 200C in warm water every 15 minutes up to 4 doses.'
),
(
    'b1000000-0000-4000-8000-000000000018',
    'VETERINARY',
    'Equine Locomotor',
    'EQUINE - Extremities - Acute laminitis of front hooves with heat, bounding digital pulses, reluctance to move',
    '[{"abbr": "Acon", "remedy": "Aconitum Napellus", "grade": 4}, {"abbr": "Bell", "remedy": "Belladonna", "grade": 3}, {"abbr": "Bry", "remedy": "Bryonia Alba", "grade": 3}]'::JSONB,
    'Vet Guidance: First 24 hours of founder; ice boots combined with Aconitum 1M hourly for 3 doses.'
),
(
    'b1000000-0000-4000-8000-000000000019',
    'VETERINARY',
    'Bovine Udder',
    'BOVINE - Udder - Acute mastitis with stony hardness, hot tender swelling, and clots in milk',
    '[{"abbr": "Phyt", "remedy": "Phytolacca Decandra", "grade": 4}, {"abbr": "Bell", "remedy": "Belladonna", "grade": 3}, {"abbr": "Bry", "remedy": "Bryonia Alba", "grade": 3}]'::JSONB,
    'Vet Guidance: Phytolacca 200C twice daily; frequently strip infected quarter.'
),
(
    'b1000000-0000-4000-8000-000000000020',
    'VETERINARY',
    'Avian General',
    'AVIAN - Generals - Acute chills, puffed feathers, lethargy, head tucked under wing from cold draft',
    '[{"abbr": "Acon", "remedy": "Aconitum Napellus", "grade": 4}, {"abbr": "Hep", "remedy": "Hepar Sulphuris", "grade": 3}, {"abbr": "Bry", "remedy": "Bryonia Alba", "grade": 2}]'::JSONB,
    'Vet Guidance: Dissolve 2 pellets in communal drinking water cup; replace daily.'
)
ON CONFLICT (id) DO UPDATE SET
    repertory_code = EXCLUDED.repertory_code,
    section = EXCLUDED.section,
    rubric_path = EXCLUDED.rubric_path,
    remedies_json = EXCLUDED.remedies_json,
    clinical_notes = EXCLUDED.clinical_notes;

-- 3. Veterinary Species Guidance Seed
INSERT INTO public.veterinary_species_guidance (
    id, species, physiological_characteristics, common_acute_conditions, posology_guidance, contraindications, administration_method
) VALUES
(
    'c1000000-0000-4000-8000-000000000001',
    'Canine',
    'High metabolic rate; omnivorous carnivore with strong hepatic glucuronidation; highly receptive to emotional and fear-based remedies.',
    ARRAY['Thunderstorm phobia', 'Acute gastroenteritis', 'Moist dermatitis (hot spots)', 'Kennel cough', 'Cruciate ligament sprains'],
    'Small dogs (<10kg): 2-3 globules (30C-200C). Medium/Large (10-40kg): 3-5 globules. Giant (>40kg): 5 globules. Dose frequency: Q15m in hyper-acute, TID in sub-acute, weekly in chronic.',
    'Avoid ethanol/alcohol tinctures undiluted; never force dry hard globules into throat of convulsing animals.',
    'Dissolve pellets in 2ml filtered water and administer via plastic needleless syringe into buccal pouch or on gums.'
),
(
    'c1000000-0000-4000-8000-000000000002',
    'Feline',
    'Obligate carnivore; deficient hepatic glucuronidation pathway; extreme sensitivity to taste, stress, and essential oils/phenols.',
    ARRAY['FLUTD / Idiopathic cystitis', 'Viral upper respiratory tract infection', 'Feline asthma', 'Stomatitis', 'Chronic renal insufficiency'],
    'All cat sizes: 2-3 globules. Preferred potencies: 30C, 200C, or LM1-LM3. Avoid high repetition without observation.',
    'Strictly avoid remedies containing camphor, phenol, tea tree, or undiluted high-proof alcohol tinctures.',
    'Dissolve in 1-2ml spring water; gently squirt onto front paw (cat will groom it off) or directly inside cheek.'
),
(
    'c1000000-0000-4000-8000-000000000003',
    'Equine',
    'Monogastric hindgut fermenter; massive muscle mass with delicate digestive equilibrium; exceptionally sensitive to high potencies (1M/10M).',
    ARRAY['Spasmodic and gas colic', 'Acute laminitis', 'Mud fever / Rain rot', 'Heaves (RAO)', 'Tendon strain'],
    'Ponies & Horses (200-700kg): 5-8 globules. High potencies (200C, 1M) act rapidly and profoundly.',
    'Never substitute for surgical triage in twisting/strangulating colic or complete impaction.',
    'Crush pellets in small amount of clean water and spray into mouth with syringe, or offer on a clean apple slice.'
),
(
    'c1000000-0000-4000-8000-000000000004',
    'Bovine',
    'Ruminant with four-chambered stomach; complex microflora; responds vigorously to herd-level water administration.',
    ARRAY['Acute mastitis', 'Calf scours (diarrhea)', 'Milk fever (hypocalcemia)', 'Pneumonia in calves', 'Retained placenta'],
    'Calves: 3-4 globules. Adult cattle (400-800kg): 6-10 globules. Potencies: 30C, 200C.',
    'Milk withholding rules do not apply to homeopathic potentized remedies, making it ideal for organic dairy.',
    'Administer in clean water trough for herd treatment, or drench individually with 20ml water drench gun.'
),
(
    'c1000000-0000-4000-8000-000000000005',
    'Avian',
    'Extremely rapid metabolism, unique air-sac respiratory architecture; highly prone to rapid heat loss and draft shock.',
    ARRAY['Draft shock & acute chills', 'Egg binding', 'Feather plucking', 'Crop stasis', 'Respiratory rattle'],
    'Caged birds & Poultry: 1-2 globules dissolved in daily water dispenser (50-100ml). Potencies: 30C.',
    'Never spray directly into nares or beak opening due to aspiration risk into pulmonary air sacs.',
    'Dissolve into communal water container or place 1 drop of water solution on top of beak to be swallowed.'
)
ON CONFLICT (species) DO UPDATE SET
    physiological_characteristics = EXCLUDED.physiological_characteristics,
    common_acute_conditions = EXCLUDED.common_acute_conditions,
    posology_guidance = EXCLUDED.posology_guidance,
    contraindications = EXCLUDED.contraindications,
    administration_method = EXCLUDED.administration_method;

-- 4. Veterinary Clinical Cases Seed
INSERT INTO public.veterinary_cases (
    id, species, breed_age_gender, chief_complaint, rubrics_used, remedy_prescribed, potency, outcome_notes, author
) VALUES
(
    'd1000000-0000-4000-8000-000000000001',
    'Canine',
    'Golden Retriever, 4y, Male (Neutered)',
    'Intense fear of summer thunderstorms: violently trembles, drools, claws at door frames trying to escape into closets.',
    ARRAY['CANINE - Mind - Fear of thunderstorms', 'CANINE - Mind - Desire for company', 'CANINE - Generals - Worse before storm'],
    'Phosphorus',
    '200C',
    'Single dose given 30 mins before thunderstorm season. Followed by 1 dose per month. Trembling stopped completely by third storm.',
    'Dr. Christopher Day, MA, VetMB, MRCVS'
),
(
    'd1000000-0000-4000-8000-000000000002',
    'Canine',
    'German Shepherd, 6y, Female',
    'Acute circular moist dermatitis (hot spot) on lumbar base: raw red, bleeding from compulsive chewing, intensely hot to touch.',
    ARRAY['CANINE - Skin - Acute moist dermatitis', 'CANINE - Skin - Itching worse warmth of house', 'CANINE - Mind - Restlessness'],
    'Rhus Toxicodendron',
    '30C',
    'Given TID for 3 days along with Calendula wash. Lesion dried within 24 hours; complete epithelial healing in 5 days without antibiotics.',
    'Dr. Richard Pitcairn, DVM, PhD'
),
(
    'd1000000-0000-4000-8000-000000000003',
    'Feline',
    'Domestic Shorthair, 5y, Male (Neutered)',
    'Recurrent idiopathic feline cystitis: in-and-out of litter box every 3 minutes, crying, passing drops of blood-tinged urine.',
    ARRAY['FELINE - Urinary - Straining with bloody drops', 'FELINE - Mind - Irritable when approached', 'FELINE - Abdomen - Sensitive bladder'],
    'Cantharis Vesicatoria',
    '30C',
    'Dissolved in water, 0.5ml given every 30 minutes for 3 doses, then BID. Normal flow restored within 4 hours; zero recurrence at 12-month check.',
    'Dr. Don Hamilton, DVM'
),
(
    'd1000000-0000-4000-8000-000000000004',
    'Equine',
    'Thoroughbred Gelding, 8y',
    'Severe spasmodic colic 1 hour after cold rain and drinking icy water: pawing ground, kicking belly, rolling and looking at flanks.',
    ARRAY['EQUINE - Abdomen - Spasmodic colic after cold water', 'EQUINE - Mind - Agitated', 'EQUINE - Abdomen - Relief from firm pressure'],
    'Colocynthis',
    '200C',
    'Given every 20 minutes in water by oral syringe. Gut sounds returned after 2nd dose; flatus passed, complete cessation of discomfort in 45 minutes.',
    'Dr. George Macleod, MRCVS, DVSM'
),
(
    'd1000000-0000-4000-8000-000000000005',
    'Bovine',
    'Holstein Dairy Cow, 5y',
    'Right rear quarter acute mastitis: rock-hard induration, burning heat, thick stringy yellow clots, refused to allow calf or machine to touch.',
    ARRAY['BOVINE - Udder - Acute mastitis stony hardness', 'BOVINE - Milk - Stringy clots', 'BOVINE - Udder - Pain worse touching'],
    'Phytolacca Decandra',
    '200C',
    'Given orally BID for 4 days. Swelling softened by day 2; milk cleared of clots on day 3; somatic cell count normalized on day 6.',
    'Dr. George Macleod, MRCVS, DVSM'
),
(
    'd1000000-0000-4000-8000-000000000006',
    'Avian',
    'African Grey Parrot, 3y',
    'Left next to open window overnight in autumn chill: sitting puffed on bottom of cage, eyes half-closed, rapid clicking breath with tail bob.',
    ARRAY['AVIAN - Generals - Draft shock acute chill', 'AVIAN - Respiratory - Clicking rattle', 'AVIAN - Generals - Puffed feathers'],
    'Aconitum Napellus',
    '30C',
    'Dissolved in drinking water cup + 1 drop placed on beak edge. Perked up within 3 hours, returned to perch; breathing clear by evening.',
    'Dr. Richard Pitcairn, DVM, PhD'
)
ON CONFLICT (id) DO UPDATE SET
    species = EXCLUDED.species,
    breed_age_gender = EXCLUDED.breed_age_gender,
    chief_complaint = EXCLUDED.chief_complaint,
    rubrics_used = EXCLUDED.rubrics_used,
    remedy_prescribed = EXCLUDED.remedy_prescribed,
    potency = EXCLUDED.potency,
    outcome_notes = EXCLUDED.outcome_notes,
    author = EXCLUDED.author;
