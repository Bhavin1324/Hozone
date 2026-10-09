-- ==============================================================================
-- HOZONE CLINICAL DATABASE: CLINICAL DECISION & EXPERT SYSTEMS SCHEMA
-- Migration: 00004_expert_systems_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. VIJAYAKAR ACUTE DECISION NODES TABLE
CREATE TABLE IF NOT EXISTS public.acute_decision_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_key TEXT NOT NULL UNIQUE,
  thirst TEXT NOT NULL,
  thermal TEXT NOT NULL,
  activity TEXT NOT NULL,
  primary_remedy TEXT NOT NULL,
  remedy_abbreviation TEXT NOT NULL,
  differential_remedies TEXT[] DEFAULT ARRAY[]::TEXT[],
  clinical_indications TEXT NOT NULL,
  keynote_modalities TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acute_nodes_thirst ON public.acute_decision_nodes(thirst);
CREATE INDEX IF NOT EXISTS idx_acute_nodes_thermal ON public.acute_decision_nodes(thermal);
CREATE INDEX IF NOT EXISTS idx_acute_nodes_activity ON public.acute_decision_nodes(activity);

DROP TRIGGER IF EXISTS set_acute_nodes_updated_at ON public.acute_decision_nodes;
CREATE TRIGGER set_acute_nodes_updated_at
  BEFORE UPDATE ON public.acute_decision_nodes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. TEMPRAZ TEMPERAMENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.temperament_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temperament TEXT NOT NULL UNIQUE CHECK (temperament IN ('sanguine', 'melancholic', 'choleric', 'phlegmatic', 'nervous')),
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  key_behavioral_traits TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  leading_remedies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  miasm_affinity TEXT NOT NULL,
  physical_appearance TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_temperament_profiles_updated_at ON public.temperament_profiles;
CREATE TRIGGER set_temperament_profiles_updated_at
  BEFORE UPDATE ON public.temperament_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. SEHGAL BEHAVIORAL SCRIPTS & MIND RUBRICS TABLE
CREATE TABLE IF NOT EXISTS public.sehgal_behavioral_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_phrase TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  rubric_chapter TEXT NOT NULL DEFAULT 'Mind',
  rubric_path TEXT NOT NULL,
  rubric_full_path TEXT NOT NULL,
  top_remedies TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  clinical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sehgal_scripts_phrase_trgm ON public.sehgal_behavioral_scripts USING gin (patient_phrase gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_sehgal_scripts_rubric_path ON public.sehgal_behavioral_scripts(rubric_path);

DROP TRIGGER IF EXISTS set_sehgal_scripts_updated_at ON public.sehgal_behavioral_scripts;
CREATE TRIGGER set_sehgal_scripts_updated_at
  BEFORE UPDATE ON public.sehgal_behavioral_scripts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. SCHOLTEN ELEMENT MATRIX MAPPINGS TABLE
CREATE TABLE IF NOT EXISTS public.scholten_element_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_symbol TEXT NOT NULL UNIQUE,
  element_name TEXT NOT NULL,
  atomic_number INT NOT NULL,
  series INT NOT NULL CHECK (series BETWEEN 1 AND 7),
  series_name TEXT NOT NULL,
  stage INT NOT NULL CHECK (stage BETWEEN 1 AND 18),
  stage_theme TEXT NOT NULL,
  homeopathic_remedy_name TEXT NOT NULL,
  core_delusion TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholten_series_stage ON public.scholten_element_mappings(series, stage);
CREATE INDEX IF NOT EXISTS idx_scholten_remedy ON public.scholten_element_mappings(homeopathic_remedy_name);

DROP TRIGGER IF EXISTS set_scholten_mappings_updated_at ON public.scholten_element_mappings;
CREATE TRIGGER set_scholten_mappings_updated_at
  BEFORE UPDATE ON public.scholten_element_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.acute_decision_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temperament_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sehgal_behavioral_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholten_element_mappings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read acute_decision_nodes' AND tablename = 'acute_decision_nodes') THEN
    CREATE POLICY "Allow read acute_decision_nodes" ON public.acute_decision_nodes FOR SELECT TO anon, authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read temperament_profiles' AND tablename = 'temperament_profiles') THEN
    CREATE POLICY "Allow read temperament_profiles" ON public.temperament_profiles FOR SELECT TO anon, authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read sehgal_behavioral_scripts' AND tablename = 'sehgal_behavioral_scripts') THEN
    CREATE POLICY "Allow read sehgal_behavioral_scripts" ON public.sehgal_behavioral_scripts FOR SELECT TO anon, authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read scholten_element_mappings' AND tablename = 'scholten_element_mappings') THEN
    CREATE POLICY "Allow read scholten_element_mappings" ON public.scholten_element_mappings FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;
