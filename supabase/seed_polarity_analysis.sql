-- ==============================================================================
-- HOZONE CLINICAL DATABASE: POLARITY ANALYSIS SEED FIXTURES
-- Script: seed_polarity_analysis.sql
-- Database: PostgreSQL 17 (Supabase Linked Execution)
-- ==============================================================================

INSERT INTO public.polar_symptom_pairs (
  polar_code,
  name,
  category,
  positive_label,
  opposite_label,
  positive_rubric_path,
  opposite_rubric_path,
  clinical_notes
) VALUES
(
  'POLAR_THERMAL_COLD_WARM',
  'Thermal Sensitivity (Cold vs Warmth)',
  'Thermal',
  '< Cold in general / winter / cold wind',
  '< Warmth in general / heated room',
  'Generalities; Cold; agg.',
  'Generalities; Warmth; agg.',
  'Boenninghausen core thermal modality. Differentiates predominantly Chilly remedies (Ars., Nux-v., Calc., Hep.) from Warm-blooded remedies (Puls., Sulph., Apis, Arg-n.).'
),
(
  'POLAR_MOTION_REST',
  'Physical Motion (Movement vs Inactivity)',
  'Motion',
  '< Movement / physical exertion',
  '< Rest / sitting still',
  'Generalities; Motion; agg.',
  'Generalities; Rest; agg.',
  'Classic Boenninghausen modality polarity. Differentiates Bryonia (< motion, > absolute rest) from Rhus tox and Ferrum (< rest, > gentle continuous motion).'
),
(
  'POLAR_PRESSURE_TOUCH',
  'Mechanical Pressure & Touch',
  'Pressure',
  '< Touch / light contact',
  '> Hard pressure / firm binding',
  'Generalities; Touch; agg.',
  'Generalities; Pressure; amel.',
  'Essential differentiation for hypersensitive remedies like Belladonna, Chamomilla, and Lachesis (< light touch) vs Colocynthis, Bryonia, and Mag-p (> hard pressure).'
),
(
  'POLAR_ATMOSPHERE_AIR',
  'Open Air vs Enclosed Space',
  'Environment',
  '< Open air / draft / walking outdoors',
  '> Open air / desires fresh air indoors',
  'Generalities; Air; open; agg.',
  'Generalities; Air; open; amel.',
  'Differentiates remedies aggravated by outdoor exposure (Sil., Kali-c., Rhus-t.) from remedies suffocating in warm rooms and craving open air (Puls., Kali-s., All-c.).'
),
(
  'POLAR_POSTURE_LYING',
  'Posture (Lying vs Sitting Up)',
  'Posture',
  '< Lying down / reclining position',
  '> Lying down / resting quietly',
  'Generalities; Lying; agg.',
  'Generalities; Lying; amel.',
  'Respiratory and cardiac polarity: Arsenicum, Drosera, Spongia (< lying down flat) vs Bryonia and Nux-v (> lying still).'
),
(
  'POLAR_BEVERAGE_TEMP',
  'Beverage Temperature (Cold vs Warm Drinks)',
  'Ingestion',
  '< Cold drinks (chills, gastric spasm)',
  '< Warm drinks (nausea, flush)',
  'Stomach; Drinks; cold; agg.',
  'Stomach; Drinks; warm; agg.',
  'Arsenicum and Lycopodium (< cold drinks, > hot sips) vs Phosphorus and Pulsatilla (< warm drinks, craves ice-cold drinks).'
)
ON CONFLICT (polar_code) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  positive_label = EXCLUDED.positive_label,
  opposite_label = EXCLUDED.opposite_label,
  positive_rubric_path = EXCLUDED.positive_rubric_path,
  opposite_rubric_path = EXCLUDED.opposite_rubric_path,
  clinical_notes = EXCLUDED.clinical_notes,
  updated_at = NOW();
