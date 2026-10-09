-- ==============================================================================
-- HOZONE CLINICAL DATABASE: EXPERT SYSTEMS SEED DATA
-- Script: seed_expert_systems.sql
-- ==============================================================================

-- 1. SEED VIJAYAKAR ACUTE DECISION NODES
INSERT INTO public.acute_decision_nodes (
  node_key, thirst, thermal, activity, primary_remedy, remedy_abbreviation,
  differential_remedies, clinical_indications, keynote_modalities
)
VALUES
  (
    'hot_thirsty_restless',
    'Thirsty',
    'Hot',
    'Restless',
    'Aconitum Napellus',
    'Acon.',
    ARRAY['Belladonna', 'Chamomilla'],
    'Sudden violent onset from exposure to cold dry wind. High fever, red dry skin, intense fear of death and mental agitation.',
    ARRAY['< Cold dry wind', '< Midnight', '> Warm perspiration', '> Rest']
  ),
  (
    'hot_thirsty_dull',
    'Thirsty',
    'Hot',
    'Dull',
    'Bryonia Alba',
    'Bry.',
    ARRAY['Baptisia', 'Opium'],
    'Insidious onset, dry mouth and tongue with thirst for large quantities at long intervals. Stitching pains, irritable when disturbed.',
    ARRAY['< Least motion', '< Warmth', '> Absolute quiet', '> Pressure on painful side']
  ),
  (
    'hot_thirstless_restless',
    'Thirstless',
    'Hot',
    'Restless',
    'Apis Mellifica',
    'Apis',
    ARRAY['Pulsatilla', 'Stramonium'],
    'Edematous stinging pains, intolerance of heat, warm rooms, or hot baths. Absence of thirst despite high inflammatory fever.',
    ARRAY['< Heat in all forms', '< Touch', '> Cold applications', '> Cool open air']
  ),
  (
    'hot_thirstless_dull',
    'Thirstless',
    'Hot',
    'Dull',
    'Pulsatilla Pratensis',
    'Puls.',
    ARRAY['Gelsemium', 'Antimonium Crudum'],
    'Mild weeping disposition, desires fresh open air, dry mouth without thirst, wandering pains with fever.',
    ARRAY['< Warm close room', '< Rich fatty food', '> Gentle walking in open air', '> Cold drinks']
  ),
  (
    'chilly_thirsty_restless',
    'Thirsty',
    'Chilly',
    'Restless',
    'Arsenicum Album',
    'Ars.',
    ARRAY['Rhus Toxicodendron', 'China'],
    'Midnight aggravation (1-2 AM), burning pains ameliorated by hot applications. Extreme prostration with obsessive mental restlessness and sips of water.',
    ARRAY['< Midnight (1-2 AM)', '< Cold air and drinks', '> Hot applications', '> Warm drinks']
  ),
  (
    'chilly_thirsty_dull',
    'Thirsty',
    'Chilly',
    'Dull',
    'Eupatorium Perfoliatum',
    'Eup-per.',
    ARRAY['Phosphorus', 'Nux Vomica'],
    'Intense aching bone pains as if broken, severe chills with intense thirst for cold water prior to and during paroxysm.',
    ARRAY['< 7 to 9 AM', '< Motion', '> Sweating', '> Resting quietly']
  ),
  (
    'chilly_thirstless_restless',
    'Thirstless',
    'Chilly',
    'Restless',
    'Rhus Toxicodendron',
    'Rhus-t.',
    ARRAY['Dulcamara', 'Causticum'],
    'Physical restlessness due to aching stiffness, triangular red tip of tongue. Thirstless or desires sips of milk.',
    ARRAY['< Beginning of motion', '< Cold wet weather', '> Continued gentle motion', '> Warm dry heat']
  ),
  (
    'chilly_thirstless_dull',
    'Thirstless',
    'Chilly',
    'Dull',
    'Gelsemium Sempervirens',
    'Gels.',
    ARRAY['Ferrum Phosphoricum', 'Baptisia'],
    'Classic 4-D syndrome: Drowsy, Dizzy, Dull, Dumb. Heavy drooping eyelids, occipital headache, complete absence of thirst.',
    ARRAY['< Humid warm weather', '< Anticipation', '> Profuse urination', '> Reclining head elevated']
  )
ON CONFLICT (node_key) DO UPDATE
  SET primary_remedy = EXCLUDED.primary_remedy,
      remedy_abbreviation = EXCLUDED.remedy_abbreviation,
      clinical_indications = EXCLUDED.clinical_indications,
      differential_remedies = EXCLUDED.differential_remedies,
      keynote_modalities = EXCLUDED.keynote_modalities;

-- 2. SEED TEMPRAZ TEMPERAMENTS
INSERT INTO public.temperament_profiles (
  temperament, display_name, description, key_behavioral_traits,
  leading_remedies, miasm_affinity, physical_appearance
)
VALUES
  (
    'sanguine',
    'Sanguine Temperament',
    'Optimistic, cheerful, socially active, warm-blooded, expressive and adaptable. Quick to anger but rapidly forgets.',
    ARRAY['Optimistic and enthusiastic', 'Socially outgoing', 'Expressive facial movements', 'Restless curiosity', 'Adaptable to change'],
    ARRAY['Pulsatilla', 'Phosphorus', 'Calcarea Phosphorica', 'Coffea Cruda', 'Crocus Sativus'],
    'Psora / Sycosis',
    'Pleasant, florid complexion, sparkling eyes, warm moist skin, active motor gait.'
  ),
  (
    'melancholic',
    'Melancholic Temperament',
    'Thoughtful, reserved, deeply sensitive, introspective, serious, holds grievances and dwells on past grief.',
    ARRAY['Introspective and reserved', 'Dwells on past disappointments', 'Conscientious about trifles', 'Dislikes consolation', 'Perfectionist'],
    ARRAY['Natrum Muriaticum', 'Ignatia Amara', 'Aurum Metallicum', 'Sepia Officinalis', 'Staphysagria'],
    'Syphilis / Psora',
    'Lean build, serious or brooding expression, pale or earthy complexion, measured steps.'
  ),
  (
    'choleric',
    'Choleric Temperament',
    'Passionate, ambitious, impatient, forceful, argumentative, goal-driven, impatient with slower individuals.',
    ARRAY['Impatient and irritable', 'Highly ambitious and competitive', 'Argumentative when challenged', 'Sedentary workaholic', 'Obstinate'],
    ARRAY['Nux Vomica', 'Bryonia Alba', 'Chamomilla', 'Sulphur', 'Lycopodium Clavatum'],
    'Psora',
    'Sharp features, intense gaze, tense muscle tone, brisk purposeful movement.'
  ),
  (
    'phlegmatic',
    'Phlegmatic Temperament',
    'Calm, sluggish, tolerant, peaceful, unhurried, emotionally steady, slow to react and slow to digest.',
    ARRAY['Calm and unhurried', 'Sluggish reaction time', 'Averse to physical exertion', 'Peaceable and non-confrontational', 'Contented'],
    ARRAY['Calcarea Carbonica', 'Baryta Carbonica', 'Gelsemium', 'Antimonium Crudum', 'Graphites'],
    'Sycosis',
    'Fair, relaxed tissue tone, soft flabby musculature, slow deliberation in speech.'
  ),
  (
    'nervous',
    'Nervous Temperament',
    'Hypersensitive, excitable, easily startled, trembling under stress, hyper-alert, hurried with anticipatory anxiety.',
    ARRAY['Highly excitable and reactive', 'Trembling from anticipation', 'Hypersensitive to noise and light', 'Hurried in actions and speech', 'Apprehensive'],
    ARRAY['Arsenicum Album', 'Argentum Nitricum', 'Silicea Terra', 'Zincum Metallicum', 'Anacardium'],
    'Tubercular / Psora',
    'Slender, quick twitching reflexes, dilated reactive pupils, restless gestures.'
  )
ON CONFLICT (temperament) DO UPDATE
  SET description = EXCLUDED.description,
      key_behavioral_traits = EXCLUDED.key_behavioral_traits,
      leading_remedies = EXCLUDED.leading_remedies,
      miasm_affinity = EXCLUDED.miasm_affinity;

-- 3. SEED SEHGAL BEHAVIORAL SCRIPTS & MIND RUBRIC CONVERSIONS
INSERT INTO public.sehgal_behavioral_scripts (
  patient_phrase, keywords, rubric_chapter, rubric_path, rubric_full_path, top_remedies, clinical_notes
)
VALUES
  (
    'I feel completely light, as if floating in the air',
    ARRAY['floating', 'light', 'air', 'weightless'],
    'Mind',
    'DELUSION > floating in air',
    'MIND > DELUSIONS > floating in air',
    ARRAY['Asar.', 'Bell.', 'Cann-i.', 'Lac-c.', 'Op.'],
    'Classical Sehgal mind conversion: sensation of light-headedness or detachment translated to delusion of floating.'
  ),
  (
    'I keep checking the lock and the stove over and over again',
    ARRAY['checking', 'lock', 'stove', 'order', 'duty'],
    'Mind',
    'FASTIDIOUS > conscience, of',
    'MIND > ANXIETY > conscience of, as if guilty of a crime',
    ARRAY['Ars.', 'Ign.', 'Nux-v.', 'Sil.', 'Zinc.'],
    'Compulsive verification behavior translating to conscience/fastidious anxiety.'
  ),
  (
    'I just want everyone to leave me alone in peace and quiet',
    ARRAY['alone', 'peace', 'quiet', 'disturb', 'leave'],
    'Mind',
    'QUIET > wants to be, repose and tranquility',
    'MIND > QUIET > wants to be, repose and tranquility, desires',
    ARRAY['Bry.', 'Gels.', 'Hyos.', 'Nux-v.'],
    'Aversion to company or interruption in acute or chronic state.'
  ),
  (
    'I am afraid I will lose my job and end up with no money',
    ARRAY['job', 'money', 'poverty', 'poor', 'ruin'],
    'Mind',
    'FEAR > poverty, of',
    'MIND > FEAR > poverty, of',
    ARRAY['Calc.', 'Psor.', 'Sep.', 'Sil.', 'Sulph.'],
    'Unfounded dread of economic deprivation despite adequate resources.'
  ),
  (
    'I smile and laugh even when explaining how terrible my illness is',
    ARRAY['smile', 'laugh', 'serious', 'terrible', 'illness'],
    'Mind',
    'LAUGHING > serious matters, at',
    'MIND > LAUGHING > serious matters, over',
    ARRAY['Anac.', 'Apis', 'Cann-i.', 'Lyc.', 'Nat-m.', 'Plat.'],
    'Incongruous affective display during narration of distressing complaints.'
  ),
  (
    'I feel like everybody is watching me and judging my every move',
    ARRAY['watching', 'judging', 'observed', 'criticized'],
    'Mind',
    'DELUSION > watched, that he is',
    'MIND > DELUSIONS > watched, that she is',
    ARRAY['Ars.', 'Calc.', 'Hyos.', 'Plat.', 'Rhus-t.'],
    'Paranoid self-consciousness and perceived surveillance.'
  ),
  (
    'I cannot bear to see anyone else in pain, it breaks my heart',
    ARRAY['pain', 'others', 'sympathetic', 'heart', 'suffering'],
    'Mind',
    'SYMPATHETIC > compassionate',
    'MIND > SYMPATHETIC > compassionate, disposition',
    ARRAY['Caust.', 'Nit-ac.', 'Phos.', 'Puls.'],
    'Overactive empathy and visceral distress at witnessing suffering of others.'
  ),
  (
    'I feel so hurried inside that time seems to pass too slowly',
    ARRAY['hurried', 'time', 'slowly', 'haste', 'impatient'],
    'Mind',
    'TIME > slowly, passes too',
    'MIND > TIME > passes too slowly, appears longer',
    ARRAY['Arg-n.', 'Cann-i.', 'Med.', 'Nux-v.', 'Plat.'],
    'Distortion of subjective temporal perception typical of sycotic acceleration.'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SCHOLTEN ELEMENT MATRIX MAPPINGS
INSERT INTO public.scholten_element_mappings (
  element_symbol, element_name, atomic_number, series, series_name,
  stage, stage_theme, homeopathic_remedy_name, core_delusion
)
VALUES
  ('H', 'Hydrogen', 1, 1, 'Hydrogen Series (Being / Existence)', 1, 'Inception', 'Hydrogenium', 'Conflict between being whole and merging with the infinite universe.'),
  ('Li', 'Lithium', 3, 2, 'Carbon Series (Self-Worth / Ego)', 1, 'Impulsive Beginning', 'Lithium Carbonicum', 'Childish dependency, alternation between manic enthusiasm and quiet despair.'),
  ('Na', 'Natrium (Sodium)', 11, 3, 'Silica Series (Relationships / Family)', 1, 'Starting alone, vulnerable', 'Natrum Muriaticum', 'Vulnerability in one-on-one relationships, silent grief, fear of emotional rejection.'),
  ('Mg', 'Magnesium', 12, 3, 'Silica Series (Relationships / Family)', 2, 'Seeking support / pacifying', 'Magnesium Carbonicum', 'Orphan state, suppressed anger, peacekeeping to avoid being abandoned.'),
  ('Si', 'Silicium (Silicon)', 14, 3, 'Silica Series (Relationships / Family)', 10, 'Established identity / image', 'Silicea Terra', 'Fixation on maintaining a delicate public image and reputation, stubborn yield.'),
  ('P', 'Phosphorus', 15, 3, 'Silica Series (Relationships / Family)', 15, 'Diffusion / loss of boundary', 'Phosphorus', 'Open boundaries, sympathy, fear of isolation, burning desire for connection.'),
  ('Cl', 'Chlorum (Chlorine)', 17, 3, 'Silica Series (Relationships / Family)', 17, 'Exile / letting go', 'Muriaticum Acidum', 'Feeling discarded by loved ones, sense of worthlessness, maternal separation.'),
  ('Ca', 'Calcium', 20, 4, 'Iron Series (Work / Duty / Routine)', 2, 'Needing protection in task', 'Calcarea Carbonica', 'Fears being observed unable to perform, seeks a safe shell, fear of poverty.'),
  ('Fe', 'Ferrum (Iron)', 26, 4, 'Iron Series (Work / Duty / Routine)', 10, 'Peak duty / fighting for work', 'Ferrum Metallicum', 'Duty, soldier mentality, intolerance of contradiction, defending obligations.'),
  ('As', 'Arsenicum', 33, 4, 'Iron Series (Work / Duty / Routine)', 15, 'Decline / fear of theft and loss', 'Arsenicum Album', 'Dread of loss of possessions, health, and order; fastidious control of chaos.'),
  ('Ag', 'Argentum (Silver)', 47, 5, 'Silver Series (Creativity / Science)', 11, 'Holding top performance', 'Argentum Nitricum', 'Performance anxiety, stage fright, fear of failing expectations in the spotlight.'),
  ('Au', 'Aurum (Gold)', 79, 6, 'Gold Series (Leadership / Kingdom)', 11, 'Absolute responsibility', 'Aurum Metallicum', 'Profound sense of ruined leadership, failed duty as king/ruler, suicidal depression.')
ON CONFLICT (element_symbol) DO UPDATE
  SET series = EXCLUDED.series,
      series_name = EXCLUDED.series_name,
      stage = EXCLUDED.stage,
      stage_theme = EXCLUDED.stage_theme,
      homeopathic_remedy_name = EXCLUDED.homeopathic_remedy_name,
      core_delusion = EXCLUDED.core_delusion;
