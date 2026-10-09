-- ==============================================================================
-- HOZONE CLINICAL DATABASE: POLARITY ANALYSIS & SYNTHETIC RUBRIC SCHEMA
-- Migration: 00005_polarity_analysis_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. POLAR SYMPTOM PAIRS TABLE (Boenninghausen / Dr. Heiner Frei Method)
CREATE TABLE IF NOT EXISTS public.polar_symptom_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  polar_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  positive_label TEXT NOT NULL,
  opposite_label TEXT NOT NULL,
  positive_rubric_path TEXT NOT NULL,
  opposite_rubric_path TEXT NOT NULL,
  clinical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_polar_pairs_category ON public.polar_symptom_pairs(category);
CREATE INDEX IF NOT EXISTS idx_polar_pairs_code ON public.polar_symptom_pairs(polar_code);

DROP TRIGGER IF EXISTS set_polar_symptom_pairs_updated_at ON public.polar_symptom_pairs;
CREATE TRIGGER set_polar_symptom_pairs_updated_at
  BEFORE UPDATE ON public.polar_symptom_pairs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. COMBINED SYNTHETIC CASE RUBRICS TABLE
CREATE TABLE IF NOT EXISTS public.combined_case_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  synthetic_title TEXT NOT NULL,
  merge_strategy TEXT NOT NULL DEFAULT 'max_grade' CHECK (merge_strategy IN ('max_grade', 'sum_grades', 'average')),
  source_rubric_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  entries_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_combined_case_rubrics_updated_at ON public.combined_case_rubrics;
CREATE TRIGGER set_combined_case_rubrics_updated_at
  BEFORE UPDATE ON public.combined_case_rubrics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.polar_symptom_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combined_case_rubrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read polar_symptom_pairs" ON public.polar_symptom_pairs;
CREATE POLICY "Public read polar_symptom_pairs"
  ON public.polar_symptom_pairs
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert polar_symptom_pairs" ON public.polar_symptom_pairs;
CREATE POLICY "Authenticated insert polar_symptom_pairs"
  ON public.polar_symptom_pairs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public read combined_case_rubrics" ON public.combined_case_rubrics;
CREATE POLICY "Public read combined_case_rubrics"
  ON public.combined_case_rubrics
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated manage combined_case_rubrics" ON public.combined_case_rubrics;
CREATE POLICY "Authenticated manage combined_case_rubrics"
  ON public.combined_case_rubrics
  FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);
