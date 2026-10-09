-- ==============================================================================
-- HOZONE CLINICAL DATABASE: KENT'S 12 PROGNOSTIC OBSERVATIONS SCHEMA
-- Migration: 00007_kents_prognosis_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.kent_prognostic_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_number INT NOT NULL UNIQUE CHECK (observation_number BETWEEN 1 AND 12),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  clinical_significance TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Curable_Ideal',
    'Curable_Borderline',
    'Incurable_Destructive',
    'Superficial_Palliative',
    'Wrong_Remedy',
    'Suppression_Danger',
    'Prover_Sensitive'
  )),
  hering_compliance TEXT NOT NULL CHECK (hering_compliance IN (
    'Strictly_Compliant',
    'Non_Compliant_Suppression',
    'Irrelevant',
    'Pending'
  )),
  physician_action TEXT NOT NULL,
  repetition_warning TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_kent_prognostic_rules_updated_at ON public.kent_prognostic_rules;
CREATE TRIGGER set_kent_prognostic_rules_updated_at
  BEFORE UPDATE ON public.kent_prognostic_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.kent_prognostic_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Allow read kent_prognostic_rules'
      AND tablename = 'kent_prognostic_rules'
  ) THEN
    CREATE POLICY "Allow read kent_prognostic_rules"
      ON public.kent_prognostic_rules
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
