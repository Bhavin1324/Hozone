-- ==============================================================================
-- HOZONE CLINICAL DATABASE: CLINICAL EVIDENCE & PRACTICE GUIDANCE SEED
-- Script: seed_clinical_guidance.sql
-- ==============================================================================

-- 1. Clinical Tips & Pearls of Practice
INSERT INTO public.clinical_tips (
  id,
  remedy_name,
  author,
  clinical_condition,
  organ_system,
  tip_content,
  verification_level,
  tags
)
VALUES
  (
    '88888888-0001-0000-0000-000000000001',
    'Aconitum Napellus',
    'Dr. William Boericke',
    'Acute Inflammatory Fevers & Croup',
    'Respiratory',
    'Aconite is only indicated at the absolute onset of inflammatory fever before exudation or localization begins. Once localized exudates or plastic infiltration occur, Aconite ceases to be of service; switch to Bryonia, Hepar Sulph, or Mercurius.',
    'clinical_pearl',
    ARRAY['acute', 'fever', 'restlessness', 'respiratory']
  ),
  (
    '88888888-0002-0000-0000-000000000002',
    'Bryonia Alba',
    'Dr. J.T. Kent',
    'Pleurisy & Splitting Headaches',
    'Respiratory',
    'The characteristic headache of Bryonia is relieved by pressure and firm bandaging, but aggravated by the slightest motion of the eyeballs or coughing. In pleurisy, the patient invariably lies on the painful affected side to immobilize the intercostal movement.',
    'keynote_clue',
    ARRAY['pleurisy', 'pressure_amel', 'motion_agg', 'headache']
  ),
  (
    '88888888-0003-0000-0000-000000000003',
    'Arsenicum Album',
    'Dr. E.B. Nash',
    'Asthmatic Paroxysms & Nocturnal Gastritis',
    'Respiratory',
    'Arsenicum asthma occurs with intense anguish, fear of death, and suffocating attacks between 1 AM and 3 AM. The patient cannot lie down and must sit bent forward, yet insists on sipping warm water frequently.',
    'verified',
    ARRAY['asthma', 'periodic', 'warmth_amel', 'midnight_agg']
  ),
  (
    '88888888-0004-0000-0000-000000000004',
    'Silicea Terra',
    'Dr. J.H. Clarke',
    'Suppuration & Foreign Body Expulsion',
    'Dermatology',
    'Silicea ripens abscesses and promotes the swift expulsion of foreign bodies (splinters, fishbones, needles) from soft tissues. CAUTION: Avoid high potencies of Silicea in patients with encapsulated pulmonary tubercles or surgical implants.',
    'frequent_confirmation',
    ARRAY['abscess', 'foreign_body', 'suppuration', 'tissues']
  ),
  (
    '88888888-0005-0000-0000-000000000005',
    'Lachesis Muta',
    'Dr. C.M. Boger',
    'Septic Throats & Climacteric Flushing',
    'Cardiovascular',
    'The symptom of left-sided pathology spreading to the right, combined with extreme intolerance to anything tight touching the throat or collar, is unfailing. Aggravation after sleep is the sovereign modality.',
    'keynote_clue',
    ARRAY['left_sided', 'sleep_agg', 'constriction', 'septic']
  ),
  (
    '88888888-0006-0000-0000-000000000006',
    'Lycopodium Clavatum',
    'Dr. M.L. Tyler',
    'Flatulent Dyspepsia & Right Renal Colic',
    'Gastrointestinal',
    'A single mouthful fills the patient up to the throat with excessive intestinal rumbling and distension. Pains typically begin on the right side and travel left, with regular afternoon aggravations from 4 PM to 8 PM.',
    'verified',
    ARRAY['flatulence', 'right_sided', 'afternoon_agg', 'dyspepsia']
  ),
  (
    '88888888-0007-0000-0000-000000000007',
    'Nux Vomica',
    'Dr. J.C. Burnett',
    'Gastrointestinal Spasms & Sedentary Dyspepsia',
    'Gastrointestinal',
    'Frequent ineffectual urge to stool and urinate; passing small quantities provides brief relief. Highly impatient, hypersensitive to noise, light, and cold draft. Sovereign antidote to over-drugging and coffee excess.',
    'frequent_confirmation',
    ARRAY['spasm', 'ineffectual_urging', 'chilly', 'antidote']
  ),
  (
    '88888888-0008-0000-0000-000000000008',
    'Phosphorus',
    'Dr. J.T. Kent',
    'Hemoptysis & Destructive Lung Pathology',
    'Respiratory',
    'Craves ice-cold drinks and food which are ejected as soon as they become warm in the stomach. Oppressive tightness across the chest; patient cannot lie on the left side without dyspnea and palpitating anxiety.',
    'clinical_pearl',
    ARRAY['hemorrhage', 'cold_craving', 'left_side_agg', 'chest_tightness']
  ),
  (
    '88888888-0009-0000-0000-000000000009',
    'Pulsatilla Pratensis',
    'Dr. William Boericke',
    'Catarrhal Otitis & Wandering Arthritis',
    'Musculoskeletal',
    'Symptoms ever-changing and wandering rapidly from joint to joint. Absolute thirstlessness even with high fever or dry mouth. Marked relief from slow movement in cool, open fresh air; aggravated in a warm stuffy room.',
    'verified',
    ARRAY['wandering_pains', 'thirstless', 'open_air_amel', 'mild']
  ),
  (
    '88888888-0010-0000-0000-000000000010',
    'Rhus Toxicodendron',
    'Dr. E.B. Nash',
    'Rheumatic Strains & Joint Stiffness',
    'Musculoskeletal',
    'Pains and stiffness markedly worse on first beginning to move, but gradually improving with continued gentle motion. Aggravated before storms, in damp rainy weather, and relieved by hot bathing and dry heat.',
    'keynote_clue',
    ARRAY['rest_agg', 'motion_amel', 'damp_agg', 'rheumatism']
  ),
  (
    '88888888-0011-0000-0000-000000000011',
    'Belladonna',
    'Dr. C.M. Boger',
    'Violent Throbbing Congestions',
    'Nervous System',
    'Sudden onset, sudden cessation. Intense redness, radiating burning heat, and throbbing carotids. Aggravated by light, noise, touch, or jarring of the bed; pupils widely dilated with glassy eyes.',
    'clinical_pearl',
    ARRAY['sudden', 'throbbing', 'heat', 'jarring_agg']
  ),
  (
    '88888888-0012-0000-0000-000000000012',
    'Spigelia Anthelmia',
    'Dr. J.H. Clarke',
    'Left Trigeminal Neuralgia & Pericarditis',
    'Nervous System',
    'Severe ciliary and supraorbital neuralgia strictly limited to the left side, following the sun from sunrise, peaking at noon, and declining at sunset. Heart palpitations shake the entire chest wall and are audible.',
    'keynote_clue',
    ARRAY['neuralgia', 'left_eye', 'sun_agg', 'pericarditis']
  )
ON CONFLICT (id) DO UPDATE SET
  tip_content = EXCLUDED.tip_content,
  verification_level = EXCLUDED.verification_level,
  tags = EXCLUDED.tags;

-- 2. Cured Cases Archive
INSERT INTO public.cured_cases (
  id,
  title,
  author,
  patient_age_group,
  clinical_diagnosis,
  organ_system,
  initial_symptoms,
  symptom_totality,
  remedy_prescribed,
  potency_and_dosage,
  key_prescribing_clue,
  outcome_and_timeline,
  kent_observation_num
)
VALUES
  (
    '88888888-0002-0000-0000-000000000001',
    'Acute Pleuritic Stitch Cured with Bryonia',
    'Dr. Samuel Hahnemann',
    'Adult (42yo Female, Washerwoman)',
    'Acute Pleurisy with Dry Stitching Cough',
    'Respiratory',
    'Severe sharp stitching pains in the right side of the chest; every inspiration and cough induces acute agony. Extreme irritability, tongue thickly coated white, intense thirst for large quantities of cold water at long intervals.',
    ARRAY['Chest - Pain - Stitching - Inspiration agg', 'Chest - Pain - Stitching - Coughing agg', 'Mind - Irritability - Pain during', 'Stomach - Thirst - Large quantities - Long intervals', 'Generalities - Motion agg'],
    'Bryonia Alba',
    '30C single dose, followed by rest',
    'Pain strictly aggravated by the slightest breath or movement, and ameliorated by firm pressure against the affected side.',
    'Within 4 hours the stitches softened. Patient slept peacefully through the night. Complete resolution of pleural friction rub within 48 hours without effusion.',
    3
  ),
  (
    '88888888-0002-0000-0000-000000000002',
    'Chronic Severe Bronchial Asthma Unlocked by Sycotic History',
    'Dr. J.T. Kent',
    'Adult (38yo Male)',
    'Intractable Bronchial Asthma with Nocturnal Suffocation',
    'Respiratory',
    'Debilitating asthma for 7 years. Suffocation awakens him at 3 AM. Must sit bent forward at the window gasping for breath. History of suppressed gonorrhea 8 years prior. Craves sour foods and ice.',
    ARRAY['Respiration - Asthmatic - Midnight after - 3 h', 'Respiration - Asthmatic - Sitting bent forward amel', 'Stomach - Desires - Sour', 'Mind - Time passes too slowly', 'Generalities - Damp weather agg'],
    'Medorrhinum',
    '1M single dose dry on tongue',
    'Relief of asthmatic dyspnea only when lying prone (face downward) or in the knee-chest posture.',
    'A brief 12-hour aggravation followed by clear chest breathing. At day 14, an old urethral discharge reappeared for 4 days (Hering''s law) and vanished. Patient remained free of asthma for 5 years.',
    4
  ),
  (
    '88888888-0002-0000-0000-000000000003',
    'Violent Left-Sided Trigeminal Neuralgia Cured by Spigelia',
    'Dr. E.B. Nash',
    'Adult (50yo Female)',
    'Left Trigeminal & Supraorbital Neuralgia',
    'Nervous System',
    'Intolerable burning, jerking, and tearing pains radiating from the left eye back into the occiput. Attacks begin at sunrise, reach intolerable agony at midday, and subside at sunset. Left eye intensely red and watery.',
    ARRAY['Head - Pain - Neuralgic - Left sided', 'Eye - Pain - Extending backward to occiput', 'Head - Pain - Sun - Rising to setting of', 'Generalities - Noise agg', 'Generalities - Touch agg'],
    'Spigelia Anthelmia',
    '200C single dose in water',
    'The strict concordance of the neuralgic cycle with the course of the sun, radiating exclusively on the left side of the face.',
    'Pain did not return the following morning. Slight soreness of scalp persisted for 24 hours, followed by permanent cure.',
    3
  ),
  (
    '88888888-0002-0000-0000-000000000004',
    'Recurrent Nephrolithiasis with Radiating Ureteric Spasm',
    'Dr. N.M. Choudhuri',
    'Elderly (64yo Male)',
    'Right Renal Colic with Nephrolithiasis',
    'Genitourinary',
    'Excruciating bubbling, cutting, and stitching pains in the right renal region radiating down the ureter into the bladder, testicle, and anterior thigh. Urine turbid with copious reddish-brick dust sediment.',
    ARRAY['Kidneys - Pain - Stitching - Extending to bladder', 'Kidneys - Pain - Stitching - Extending to thigh', 'Kidneys - Bubbling sensation', 'Urine - Sediment - Red', 'Generalities - Jar agg'],
    'Berberis Vulgaris',
    '30C every 2 hours for 3 doses',
    'Characteristic bubbling sensation in the lumbar region with pain radiating outward and downward along the ureter into the thigh.',
    'Pain subsided completely within 3 hours. On the second morning, passed a 4mm smooth calculus with minimal discomfort.',
    3
  ),
  (
    '88888888-0002-0000-0000-000000000005',
    'Chronic Suppurative Otitis Media with Mastoid Tenderness',
    'Dr. H.A. Roberts',
    'Child (8yo Boy)',
    'Chronic Suppurative Otitis Media with Fistula',
    'Dermatology',
    'Offensive, yellow, purulent discharge from left ear of 14 months duration following scarlet fever. Mastoid tender to touch; periosteal thickening. Child extremely chilly, head sweats profusely during sleep, feet foul-smelling.',
    ARRAY['Ear - Discharge - Purulent - Offensive', 'Ear - Pain - Mastoid process', 'Perspiration - Head - Sleep during', 'Generalities - Cold air agg', 'Generalities - Chilly'],
    'Silicea Terra',
    '200C, one dose weekly for 3 weeks',
    'Extreme lack of vital heat, profuse sour nocturnal head sweat, and chronic fistulous tendency.',
    'Discharge increased slightly for 2 days, then turned watery and ceased completely. Mastoid tenderness vanished and tympanic membrane scarred closed.',
    2
  ),
  (
    '88888888-0002-0000-0000-000000000006',
    'Severe Right Lower Lobe Lobar Pneumonia',
    'Dr. J.T. Kent',
    'Adult (29yo Male)',
    'Right Lobar Pneumonia (Stage of Hepatization)',
    'Respiratory',
    'High fever (104.2 F), pulse rapid and soft. Rusty, prune-juice sputum with violent panting respiration. Tight, suffocative constriction of the chest; patient cannot lie on the left side.',
    ARRAY['Chest - Hepatization of lungs - Right', 'Chest - Pain - Constriction', 'Expectoration - Rust-colored', 'Stomach - Desires - Cold drinks', 'Generalities - Lying on left side agg'],
    'Phosphorus',
    '10M single dose',
    'Intense craving for ice-cold water, which causes nausea when warm in the stomach; right lower lobe consolidation with left lateral decubitus aggravation.',
    'Prompt crisis perspiration occurred 8 hours post-dose. Temperature dropped to 99.5 F. Full resolution of consolidation confirmed on day 7.',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  symptom_totality = EXCLUDED.symptom_totality,
  remedy_prescribed = EXCLUDED.remedy_prescribed,
  potency_and_dosage = EXCLUDED.potency_and_dosage,
  outcome_and_timeline = EXCLUDED.outcome_and_timeline;

-- 3. Disease Nutrition & Diet Guidance
INSERT INTO public.disease_nutrition_guidance (
  id,
  condition_name,
  category,
  recommended_foods,
  restricted_foods,
  lifestyle_guidelines,
  homeopathic_dietary_cautions,
  associated_remedies
)
VALUES
  (
    '88888888-0003-0000-0000-000000000001',
    'Gout & Hyperuricemia',
    'Metabolic',
    ARRAY['Cherries and dark berries (anthocyanins)', 'High-water vegetables (cucumber, zucchini, celery)', 'Flaxseed and olive oil', 'Alkalizing lemon water', 'Abundant pure water (3+ liters daily)'],
    ARRAY['Organ meats (liver, kidneys, sweetbreads)', 'Shellfish and anchovies', 'Red meats and game', 'Beer and distilled spirits', 'High-fructose corn syrup beverages', 'Yeast extracts'],
    ARRAY['Maintain steady hydration throughout day and night', 'Avoid rapid crash dieting which spikes serum uric acid', 'Gentle non-weight bearing exercise (swimming)'],
    'Avoid raw onions, strong garlic, and coffee which antidote Colchicum and Ledum Palustre during acute gout flares.',
    ARRAY['Colchicum Autumnale', 'Ledum Palustre', 'Benzoicum Acidum', 'Urtica Urens', 'Lycopodium']
  ),
  (
    '88888888-0003-0000-0000-000000000002',
    'Hypertension & Cardiovascular Arteriosclerosis',
    'Cardiovascular',
    ARRAY['Potassium-rich greens (spinach, Swiss chard)', 'Garlic and aged garlic extract', 'Beetroot juice (dietary nitrates)', 'Oats and soluble fiber', 'Pomegranate and berries', 'Magnesium-rich pumpkin seeds'],
    ARRAY['Excess dietary table salt / processed sodium', 'Trans fats and deep-fried foods', 'Excess black licorice (glycyrrhizin)', 'Energy drinks and high-caffeine beverages', 'Cured deli meats'],
    ARRAY['Brisk daily 30-minute walking', 'Regular diaphragmatic breathing and vagal tone meditation', 'Maintain consistent 7-8 hour sleep schedule'],
    'Do not consume camphorated preparations, strong mint tea, or excessive tobacco while taking Crataegus, Glonoinum, or Lachesis.',
    ARRAY['Crataegus Oxyacantha', 'Glonoinum', 'Lachesis Muta', 'Baryta Carbonica', 'Aurum Metallicum']
  ),
  (
    '88888888-0003-0000-0000-000000000003',
    'Renal Calculi (Nephrolithiasis)',
    'Renal',
    ARRAY['Barley water (traditional renal demulcent)', 'Lemon and lime juice (natural urinary citrates)', 'Pomegranate juice', 'Watermelon and cucumber', 'Distilled and low-mineral spring water'],
    ARRAY['Excess high-oxalate foods (spinach, rhubarb, beet greens, cocoa)', 'Heavy animal protein loads', 'Excess refined table salt', 'High-dose synthetic vitamin C (>1000mg) in oxalate form', 'Dark colas with phosphoric acid'],
    ARRAY['Drink water before retiring to prevent nocturnal concentrated urine', 'Filter drinking water in hard-water geographic regions'],
    'Avoid vinegar and strong pickles which can aggravate urinary tracts under Berberis Vulgaris, Lycopodium, and Sarsaparilla.',
    ARRAY['Berberis Vulgaris', 'Sarsaparilla', 'Lycopodium Clavatum', 'Ocimum Canum', 'Cantharis']
  ),
  (
    '88888888-0003-0000-0000-000000000004',
    'Peptic Ulcer Disease & GERD',
    'Gastrointestinal',
    ARRAY['Cabbage juice (glutamine and S-methylmethionine)', 'Steamed oats and soothing porridge', 'Ripe bananas and papayas', 'Bone broth and collagen', 'Chamomile and deglycyrrhizinated licorice tea'],
    ARRAY['Raw hot chili and pepper sauces', 'Fried and greasy fast foods', 'Caffeine, black tea, and colas', 'Alcohol and spirits', 'Acidic citrus on empty stomach', 'Smoking and NSAIDs'],
    ARRAY['Eat small, frequent meals; never overfill stomach', 'Do not recline within 3 hours after evening meal', 'Elevate head of bed by 15 cm'],
    'Strictly avoid coffee and peppermint which directly antidote Nux Vomica and Argentum Nitricum.',
    ARRAY['Nux Vomica', 'Argentum Nitricum', 'Hydrastis Canadensis', 'Anacardium Orientale', 'Phosphorus']
  ),
  (
    '88888888-0003-0000-0000-000000000005',
    'Bronchial Asthma & Allergic Rhinitis',
    'Respiratory',
    ARRAY['Warm ginger and turmeric infusions', 'Quercetin-rich foods (red apples, capers)', 'Omega-3 fatty fish (salmon, sardines)', 'Warm vegetable broths', 'Honey (local raw) for pollen desensitization'],
    ARRAY['Ice-cold water and chilled refrigerated desserts', 'Sulfited dried fruits and wines', 'Excess dairy products (which increase viscous mucus)', 'Artificial food dyes (tartrazine)', 'High-histamine aged cheeses'],
    ARRAY['Protect chest and neck against cold, damp drafts', 'Use HEPA air purifiers in sleeping chambers', 'Avoid damp basements and mold exposure'],
    'Avoid inhaling camphor, eucalyptus chest rubs, or menthol vaporizers which promptly antidote Arsenicum, Dulcamara, and Natrum Sulph.',
    ARRAY['Arsenicum Album', 'Natrum Sulphuricum', 'Blatta Orientalis', 'Ipecacuanha', 'Medorrhinum']
  )
ON CONFLICT (id) DO UPDATE SET
  condition_name = EXCLUDED.condition_name,
  recommended_foods = EXCLUDED.recommended_foods,
  restricted_foods = EXCLUDED.restricted_foods,
  homeopathic_dietary_cautions = EXCLUDED.homeopathic_dietary_cautions;

-- 4. Mother Tinctures & External Applications
INSERT INTO public.mother_tinctures (
  id,
  remedy_name,
  common_name,
  organ_affinities,
  clinical_indications,
  internal_dosage,
  external_application,
  pharmacological_actions,
  cautions_and_contraindications
)
VALUES
  (
    '88888888-0004-0000-0000-000000000001',
    'Arnica Montana Q',
    'Leopard''s Bane',
    ARRAY['Capillary Blood Vessels', 'Muscular Tissue', 'Periosteum', 'Venous Circulation'],
    ARRAY['Mechanical trauma and contusions', 'Ecchymosis and extravasated blood', 'Muscular soreness from over-exertion', 'Pre- and post-surgical tissue healing'],
    '3 to 5 drops in 2 tablespoons of warm water, twice daily after severe muscular strain.',
    'Lotion: 1 teaspoon tincture to 100ml distilled water for unbroken contusions. CAUTION: NEVER apply to broken skin or open wounds as it induces severe erysipelatous dermatitis.',
    'Stimulates capillary reabsorption of extravasated blood; relieves muscular soreness.',
    'Contraindicated on open broken skin, abraded cuts, or in persons with Arnica hypersensitivity.'
  ),
  (
    '88888888-0004-0000-0000-000000000002',
    'Calendula Officinalis Q',
    'Marigold',
    ARRAY['Skin & Epithelial Tissue', 'Subcutaneous Connective Tissue', 'Surgical Wounds'],
    ARRAY['Lacerated wounds with loss of substance', 'Post-extraction dental sockets', 'Superficial burns and scalds', 'Bedsores and diabetic ulcers'],
    '10 drops in 1/4th cup water, 3 times daily in septic lacerations or post-operative trauma.',
    'Topical: 1 part tincture to 4 parts boiled sterile water as compress or dressing. Remarkable antiseptic that prevents suppuration and accelerates scar-free healing.',
    'Remarkable physiological healing stimulant; promotes healthy granulation without disfiguring keloid.',
    'Completely safe and non-irritating to open flesh.'
  ),
  (
    '88888888-0004-0000-0000-000000000003',
    'Echinacea Angustifolia Q',
    'Purple Coneflower',
    ARRAY['Blood & Immune System', 'Lymphatic Vessels', 'Skin & Connective Tissues'],
    ARRAY['Systemic blood poisoning and septicemia', 'Recurrent boils, carbuncles, and furuncles', 'Insect and spider stings', 'Low typhoid states and gangrene'],
    '10 to 20 drops in warm water every 2 to 4 hours in acute sepsis; 10 drops twice daily for chronic furunculosis.',
    'Compress: 20 drops in 1/2 cup sterile water applied locally to foul ulcers, carbuncles, and venomous bites.',
    'Stimulates phagocytosis and inhibits hyaluronidase enzyme, acting as a profound natural systemic antiseptic.',
    'Safe; produces harmless tingling and numbness on the tongue when fresh.'
  ),
  (
    '88888888-0004-0000-0000-000000000004',
    'Crataegus Oxyacantha Q',
    'Hawthorn Berries',
    ARRAY['Myocardium & Coronary Arteries', 'Vascular Endothelium', 'Cardiac Muscle'],
    ARRAY['Chronic heart failure (NYHA I-II)', 'Arteriosclerosis and senile heart weakness', 'Hypertension with tachycardia', 'Dyspnea on slight exertion in cardiac patients'],
    '10 to 15 drops in half glass of water, 3 times daily continuously for 4 to 8 weeks.',
    'Internal use only.',
    'Acts as a physiological cardiac tonic, dilating coronary arteries, improving myocardial oxygenation without cumulative digitalis toxicity.',
    'Safe and gentle; does not cause drug dependency.'
  ),
  (
    '88888888-0004-0000-0000-000000000005',
    'Cantharis Q',
    'Spanish Fly',
    ARRAY['Urinary Tract & Bladder Mucosa', 'Skin (Epidermis)', 'Serous Membranes'],
    ARRAY['Superficial burns and scalds before vesication', 'Acute burning cystitis with cutting strangury', 'Vesicular eruptions with burning agony'],
    '2 to 5 drops in water every 2 hours in acute cystitis.',
    'Topical: 10 drops in 100ml water applied immediately with gauze to fresh burns prevents blistering and relieves burning agony instantly.',
    'Controls intense vesication, erythema, and mucosal tenesmus.',
    'Avoid large doses internally which irritate renal glomeruli.'
  ),
  (
    '88888888-0004-0000-0000-000000000006',
    'Hypericum Perforatum Q',
    'St. John''s Wort',
    ARRAY['Peripheral Nerves & Nerve Terminals', 'Spinal Cord', 'Coccyx & Nailbeds'],
    ARRAY['Crushed fingers, toes, and nailbeds', 'Injuries to parts rich in sentient nerves', 'Coccydynia from falls on back', 'Puncture wounds from nails and needles'],
    '5 to 10 drops in warm water 3 times daily for traumatic neuritis.',
    'Lotion: 1 part tincture to 5 parts water applied as compress to lacerated fingertips or painful nerve stumps.',
    'Specific nerve restorative; prevents tetanus in lacerated puncture wounds.',
    'Avoid prolonged intense sunlight exposure during high-dose systemic intake.'
  ),
  (
    '88888888-0004-0000-0000-000000000007',
    'Berberis Vulgaris Q',
    'Barberry',
    ARRAY['Renal Pelvis & Ureters', 'Liver & Gallbladder', 'Lumbar Musculature'],
    ARRAY['Acute nephrolithiasis with radiating lumbar pain', 'Biliary colic with jaundice', 'Rheumatic stiffness with uric acid diathesis'],
    '10 to 15 drops in warm water 3 times daily; in acute renal colic, every 30 minutes in hot water.',
    'Internal use only.',
    'Relaxes ureteric and biliary smooth muscle, promotes renal clearance of urates and micro-calculi.',
    'Discontinue once calculus passes or colic subsides.'
  ),
  (
    '88888888-0004-0000-0000-000000000008',
    'Plantago Major Q',
    'Plantain',
    ARRAY['Dental Nerves', 'Periodontal Tissue', 'Auditory Canal'],
    ARRAY['Excruciating toothache with sensitive dentin', 'Pyorrhea and spongy, bleeding gums', 'Otalgia associated with dental neuralgia'],
    '5 to 10 drops in water 3 times daily.',
    'Topical: Apply pure tincture on cotton pledget directly into carious dental cavity; instant relief of severe toothache.',
    'Natural local analgesic and astringent for periodontal mucosa.',
    'Topical application should not replace permanent dental restoration.'
  ),
  (
    '88888888-0004-0000-0000-000000000009',
    'Hamamelis Virginiana Q',
    'Witch Hazel',
    ARRAY['Venous Wall', 'Capillary Plexus', 'Rectal Veins'],
    ARRAY['Bleeding hemorrhoids with soreness and heaviness', 'Varicose veins and venous stasis ulcers', 'Passive dark venous hemorrhages'],
    '5 to 10 drops in water 3 times daily.',
    'Compress: 1 part tincture to 5 parts water applied locally to painful hemorrhoids or varices.',
    'Potent venous astringent and vasoconstrictor.',
    'Non-toxic and gentle.'
  ),
  (
    '88888888-0004-0000-0000-000000000010',
    'Passiflora Incarnata Q',
    'Passion Flower',
    ARRAY['Central Nervous System', 'Cerebral Cortex', 'Cardiac Rhythm'],
    ARRAY['Insomnia due to worry and mental overwork', 'Nocturnal restlessness in infants and elderly', 'Mild convulsive spasms and hysteria'],
    '20 to 30 drops in warm water before retiring; repeat in 1 hour if required.',
    'Internal use only.',
    'Non-narcotic sedative that promotes natural, physiological restorative sleep without morning grogginess.',
    'Avoid combining with pharmaceutical sedatives without dosage monitoring.'
  )
ON CONFLICT (id) DO UPDATE SET
  remedy_name = EXCLUDED.remedy_name,
  organ_affinities = EXCLUDED.organ_affinities,
  clinical_indications = EXCLUDED.clinical_indications,
  internal_dosage = EXCLUDED.internal_dosage,
  external_application = EXCLUDED.external_application;
