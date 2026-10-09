-- ==============================================================================
-- HOZONE CLINICAL DATABASE: REPERTORY SEED DATA
-- Script: seed_repertory.sql
-- ==============================================================================

-- 1. SEED DEFAULT REPERTORY
INSERT INTO public.repertories (id, code, title, author, edition_year, description, is_default)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'KENT_CORE',
  'Kent Repertory of the Homeopathic Materia Medica',
  'Dr. James Tyler Kent',
  1957,
  'Standard classical repertory taxonomy covering generalities, mind, and localized rubrics with 4-tier grading.',
  true
)
ON CONFLICT (code) DO NOTHING;

-- 2. SEED CHAPTERS
INSERT INTO public.chapters (id, repertory_id, name, display_order, icon)
VALUES
  ('22222222-1111-0001-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Mind', 1, 'Brain'),
  ('22222222-1111-0002-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Vertigo', 2, 'RotateCw'),
  ('22222222-1111-0003-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Head', 3, 'Smile'),
  ('22222222-1111-0004-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Eyes & Vision', 4, 'Eye'),
  ('22222222-1111-0005-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Stomach', 5, 'Utensils'),
  ('22222222-1111-0006-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Abdomen', 6, 'Activity'),
  ('22222222-1111-0007-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Respiration & Cough', 7, 'Wind'),
  ('22222222-1111-0008-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'Generalities', 8, 'Zap')
ON CONFLICT (repertory_id, name) DO NOTHING;

-- 3. SEED CORE POLYCHREST REMEDIES
INSERT INTO public.remedies (id, abbreviation, full_name, common_name, kingdom, thermal, miasm, is_polychrest, short_keynotes)
VALUES
  ('33333333-0001-0000-0000-000000000001', 'Sulph.', 'Sulphur', 'Brimstone / Sublimed Sulphur', 'Mineral', 'Hot', 'Psora', true, 'Burning heats, vertex heat, 11 AM hunger, aversion to bathing, philosophical mind.'),
  ('33333333-0002-0000-0000-000000000002', 'Calc.', 'Calcarea Carbonica', 'Calcium carbonate / Oyster shell', 'Mineral', 'Chilly', 'Psora', true, 'Cold damp feet, head sweats sleeping, craving boiled eggs, apprehension of insanity.'),
  ('33333333-0003-0000-0000-000000000003', 'Lyc.', 'Lycopodium Clavatum', 'Club Moss spores', 'Plant', 'Chilly', 'Psora', true, 'Right-sided complaints, 4-8 PM aggravation, anticipatory anxiety, gas and flatulence.'),
  ('33333333-0004-0000-0000-000000000004', 'Nat-m.', 'Natrum Muriaticum', 'Sodium chloride / Sea salt', 'Mineral', 'Hot', 'Sycosis', true, 'Grief ailments, headache sunrise to sunset, mapped tongue, craving salt, aversion to sympathy.'),
  ('33333333-0005-0000-0000-000000000005', 'Phos.', 'Phosphorus', 'Phosphorus (Yellow element)', 'Mineral', 'Chilly', 'Tubercular', true, 'Sympathetic, fearful in dark and thunderstorms, desires icy cold drinks, bleeding tendency.'),
  ('33333333-0006-0000-0000-000000000006', 'Puls.', 'Pulsatilla Pratensis', 'Wind flower', 'Plant', 'Hot', 'Sycosis', true, 'Weeping easily, yielding mild disposition, thirstless, ameliorated cool open air, wandering pains.'),
  ('33333333-0007-0000-0000-000000000007', 'Sep.', 'Sepia Officinalis', 'Cuttlefish inky juice', 'Animal', 'Chilly', 'Sycosis', true, 'Indifference to family, pelvic bearing down, worse standing, amelioration from vigorous exercise.'),
  ('33333333-0008-0000-0000-000000000008', 'Ars.', 'Arsenicum Album', 'White arsenic trioxide', 'Mineral', 'Chilly', 'Psora', true, 'Midnight aggravation (1-2 AM), burning pains relieved by heat, extreme anxiety, fastidious, sips water.'),
  ('33333333-0009-0000-0000-000000000009', 'Lach.', 'Lachesis Muta', 'Bushmaster snake venom', 'Animal', 'Hot', 'Syphilis', true, 'Left-sided, worse after sleep, intolerance of constricting collars/neckbands, loquacious, jealousy.'),
  ('33333333-0010-0000-0000-000000000010', 'Nux-v.', 'Nux Vomica', 'Poison nut', 'Plant', 'Chilly', 'Psora', true, 'Sedentary, ambitious, hyper-irritable, chilly, ineffectual urging for stool, hangover state.'),
  ('33333333-0011-0000-0000-000000000011', 'Bell.', 'Belladonna', 'Deadly nightshade', 'Plant', 'Hot', 'Psora', true, 'Sudden violent onset, flushed red face, throbbing carotids, dilated pupils, delirium with fever.'),
  ('33333333-0012-0000-0000-000000000012', 'Bry.', 'Bryonia Alba', 'White bryony', 'Plant', 'Chilly', 'Psora', true, 'Worse slightest motion, better absolute rest and hard pressure, dry mucous membranes, great thirst.'),
  ('33333333-0013-0000-0000-000000000013', 'Acon.', 'Aconitum Napellus', 'Monkshood', 'Plant', 'Chilly', 'Psora', true, 'Sudden acute onset from dry cold wind exposure, extreme panic and fear of death, restlessness.'),
  ('33333333-0014-0000-0000-000000000014', 'Rhus-t.', 'Rhus Toxicodendron', 'Poison ivy', 'Plant', 'Chilly', 'Psora', true, 'Restless, stiffness on initial motion, better continuous motion and warmth, triangular red tongue tip.'),
  ('33333333-0015-0000-0000-000000000015', 'Sil.', 'Silicea Terra', 'Pure flint / Silica', 'Mineral', 'Chilly', 'Psora', true, 'Yielding yet obstinate, chilly, offensive foot sweat, suppuration tendency, lack of grit.'),
  ('33333333-0016-0000-0000-000000000016', 'Thuj.', 'Thuja Occidentalis', 'Arbor vitae', 'Plant', 'Chilly', 'Sycosis', true, 'Hydrogenoid constitution, warts and sycotic excrescences, fixed ideas, forks in stream on urination.'),
  ('33333333-0017-0000-0000-000000000017', 'Med.', 'Medorrhinum', 'Gonorrheal discharge nosode', 'Nosode', 'Hot', 'Sycosis', true, 'Hurried, time passes too slowly, wild feeling, better by seaside and knee-chest position.'),
  ('33333333-0018-0000-0000-000000000018', 'Syph.', 'Syphilinum', 'Syphilitic chancre nosode', 'Nosode', 'Chilly', 'Syphilis', true, 'Nightly bone pains from sunset to sunrise, compulsive hand-washing, linear destructive ulceration.'),
  ('33333333-0019-0000-0000-000000000019', 'Tub.', 'Tuberculinum Bovinum', 'Tuberculous lymph nosode', 'Nosode', 'Ambithermal', 'Tubercular', true, 'Cosmopolitan wanderlust, desire to travel, changing symptoms, frequent colds, night sweats.'),
  ('33333333-0020-0000-0000-000000000020', 'Carb-v.', 'Carbo Vegetabilis', 'Vegetable charcoal', 'Plant', 'Chilly', 'Psora', true, 'Air hunger, wants to be fanned rapidly from close range, collapse state with icy cold breath.')
ON CONFLICT (abbreviation) DO NOTHING;

-- 4. SEED REPRESENTATIVE CLINICAL RUBRICS
INSERT INTO public.rubrics (id, repertory_id, chapter_id, path, full_path, depth, remedy_count)
VALUES
  ('55555555-0001-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-1111-0001-0000-000000000001', 'ANXIETY > anticipation, from', 'MIND > ANXIETY > anticipation, from', 2, 5),
  ('55555555-0002-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '22222222-1111-0001-0000-000000000001', 'FEAR > dark, of the', 'MIND > FEAR > dark, of the', 2, 5),
  ('55555555-0003-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '22222222-1111-0001-0000-000000000001', 'WEEPING > easily, tearful mood', 'MIND > WEEPING > easily, tearful mood', 2, 6),
  ('55555555-0004-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '22222222-1111-0001-0000-000000000001', 'FASTIDIOUS > order, neatness', 'MIND > FASTIDIOUS > order, neatness', 2, 4),
  ('55555555-0005-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '22222222-1111-0003-0000-000000000003', 'PAIN > right sided', 'HEAD > PAIN > right sided', 2, 5),
  ('55555555-0006-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '22222222-1111-0003-0000-000000000003', 'PAIN > motion, from slightest', 'HEAD > PAIN > motion, from slightest', 2, 4),
  ('55555555-0007-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '22222222-1111-0005-0000-000000000005', 'DESIRES > salt, things', 'STOMACH > DESIRES > salt, things', 2, 4),
  ('55555555-0008-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '22222222-1111-0005-0000-000000000005', 'DESIRES > eggs, boiled', 'STOMACH > DESIRES > eggs, boiled', 2, 3),
  ('55555555-0009-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '22222222-1111-0006-0000-000000000006', 'DISTENSION > eating, after slightest', 'ABDOMEN > DISTENSION > eating, after slightest', 2, 4),
  ('55555555-0010-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '22222222-1111-0008-0000-000000000008', 'HEAT > flushes of, heat', 'GENERALITIES > HEAT > flushes of, heat', 2, 5),
  ('55555555-0011-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '22222222-1111-0008-0000-000000000008', 'COLD > in general, cold air agg', 'GENERALITIES > COLD > in general, cold air agg', 2, 6),
  ('55555555-0012-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '22222222-1111-0008-0000-000000000008', 'RESTLESSNESS > internal, physical', 'GENERALITIES > RESTLESSNESS > internal, physical', 2, 5),
  ('55555555-0013-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '22222222-1111-0008-0000-000000000008', 'MOTION > continuous, amel', 'GENERALITIES > MOTION > continuous, amel', 2, 4)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RUBRIC REMEDY GRADED ENTRIES
INSERT INTO public.rubric_remedies (rubric_id, remedy_id, grade)
VALUES
  -- ANXIETY > anticipation
  ('55555555-0001-0000-0000-000000000001', '33333333-0003-0000-0000-000000000003', 3), -- Lyc.
  ('55555555-0001-0000-0000-000000000001', '33333333-0005-0000-0000-000000000005', 2), -- Phos.
  ('55555555-0001-0000-0000-000000000001', '33333333-0008-0000-0000-000000000008', 2), -- Ars.
  ('55555555-0001-0000-0000-000000000001', '33333333-0015-0000-0000-000000000015', 3), -- Sil.
  ('55555555-0001-0000-0000-000000000001', '33333333-0017-0000-0000-000000000017', 2), -- Med.

  -- FEAR > dark
  ('55555555-0002-0000-0000-000000000002', '33333333-0005-0000-0000-000000000005', 4), -- Phos.
  ('55555555-0002-0000-0000-000000000002', '33333333-0011-0000-0000-000000000011', 3), -- Bell.
  ('55555555-0002-0000-0000-000000000002', '33333333-0002-0000-0000-000000000002', 3), -- Calc.
  ('55555555-0002-0000-0000-000000000002', '33333333-0006-0000-0000-000000000006', 2), -- Puls.
  ('55555555-0002-0000-0000-000000000002', '33333333-0013-0000-0000-000000000013', 2), -- Acon.

  -- WEEPING > easily
  ('55555555-0003-0000-0000-000000000003', '33333333-0006-0000-0000-000000000006', 4), -- Puls.
  ('55555555-0003-0000-0000-000000000003', '33333333-0007-0000-0000-000000000007', 3), -- Sep.
  ('55555555-0003-0000-0000-000000000003', '33333333-0004-0000-0000-000000000004', 3), -- Nat-m.
  ('55555555-0003-0000-0000-000000000003', '33333333-0002-0000-0000-000000000002', 2), -- Calc.
  ('55555555-0003-0000-0000-000000000003', '33333333-0003-0000-0000-000000000003', 2), -- Lyc.
  ('55555555-0003-0000-0000-000000000003', '33333333-0015-0000-0000-000000000015', 2), -- Sil.

  -- FASTIDIOUS > order
  ('55555555-0004-0000-0000-000000000004', '33333333-0008-0000-0000-000000000008', 4), -- Ars.
  ('55555555-0004-0000-0000-000000000004', '33333333-0010-0000-0000-000000000010', 3), -- Nux-v.
  ('55555555-0004-0000-0000-000000000004', '33333333-0015-0000-0000-000000000015', 2), -- Sil.
  ('55555555-0004-0000-0000-000000000004', '33333333-0007-0000-0000-000000000007', 1), -- Sep.

  -- PAIN > motion, from slightest
  ('55555555-0006-0000-0000-000000000006', '33333333-0012-0000-0000-000000000012', 4), -- Bry.
  ('55555555-0006-0000-0000-000000000006', '33333333-0011-0000-0000-000000000011', 3), -- Bell.
  ('55555555-0006-0000-0000-000000000006', '33333333-0010-0000-0000-000000000010', 2), -- Nux-v.
  ('55555555-0006-0000-0000-000000000006', '33333333-0008-0000-0000-000000000008', 2), -- Ars.

  -- MOTION > continuous, amel
  ('55555555-0013-0000-0000-000000000013', '33333333-0014-0000-0000-000000000014', 4), -- Rhus-t.
  ('55555555-0013-0000-0000-000000000013', '33333333-0006-0000-0000-000000000006', 3), -- Puls.
  ('55555555-0013-0000-0000-000000000013', '33333333-0007-0000-0000-000000000007', 2), -- Sep.
  ('55555555-0013-0000-0000-000000000013', '33333333-0003-0000-0000-000000000003', 2)  -- Lyc.
ON CONFLICT (rubric_id, remedy_id) DO NOTHING;

