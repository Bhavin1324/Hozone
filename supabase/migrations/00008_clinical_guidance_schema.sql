-- ==============================================================================
-- HOZONE CLINICAL DATABASE MIGRATION: CLINICAL EVIDENCE & PRACTICE GUIDANCE
-- Migration: 00008_clinical_guidance_schema.sql
-- Module: Clinical Guidance & Practice Knowledge Engine
-- PostgreSQL: 17
-- ==============================================================================

-- 1. Clinical Tips & Pearls of Practice Table
CREATE TABLE IF NOT EXISTS public.clinical_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remedy_id UUID REFERENCES public.remedies(id) ON DELETE SET NULL,
    remedy_name TEXT NOT NULL,
    author TEXT NOT NULL,
    clinical_condition TEXT NOT NULL,
    organ_system TEXT NOT NULL,
    tip_content TEXT NOT NULL,
    verification_level TEXT NOT NULL DEFAULT 'verified' CHECK (verification_level IN ('clinical_pearl', 'verified', 'frequent_confirmation', 'keynote_clue')),
    tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Cured Cases Archive Table
CREATE TABLE IF NOT EXISTS public.cured_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    patient_age_group TEXT NOT NULL,
    clinical_diagnosis TEXT NOT NULL,
    organ_system TEXT NOT NULL,
    initial_symptoms TEXT NOT NULL,
    symptom_totality TEXT[] DEFAULT '{}'::TEXT[],
    remedy_prescribed TEXT NOT NULL,
    potency_and_dosage TEXT NOT NULL,
    key_prescribing_clue TEXT NOT NULL,
    outcome_and_timeline TEXT NOT NULL,
    kent_observation_num INT CHECK (kent_observation_num IS NULL OR (kent_observation_num >= 1 AND kent_observation_num <= 12)),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Disease Nutrition & Diet Guidance Table
CREATE TABLE IF NOT EXISTS public.disease_nutrition_guidance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    condition_name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    recommended_foods TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    restricted_foods TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    lifestyle_guidelines TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    homeopathic_dietary_cautions TEXT NOT NULL,
    associated_remedies TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Mother Tinctures & External Applications Compendium Table
CREATE TABLE IF NOT EXISTS public.mother_tinctures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remedy_name TEXT NOT NULL UNIQUE,
    common_name TEXT NOT NULL,
    organ_affinities TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    clinical_indications TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    internal_dosage TEXT NOT NULL,
    external_application TEXT,
    pharmacological_actions TEXT NOT NULL,
    cautions_and_contraindications TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER set_clinical_tips_updated_at
    BEFORE UPDATE ON public.clinical_tips
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_cured_cases_updated_at
    BEFORE UPDATE ON public.cured_cases
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_disease_nutrition_updated_at
    BEFORE UPDATE ON public.disease_nutrition_guidance
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_mother_tinctures_updated_at
    BEFORE UPDATE ON public.mother_tinctures
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- GIN Trigram Indexes for Instant Clinical Keyword Searches
CREATE INDEX IF NOT EXISTS idx_clinical_tips_content_trgm ON public.clinical_tips USING gin (tip_content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_clinical_tips_remedy ON public.clinical_tips (remedy_name);
CREATE INDEX IF NOT EXISTS idx_clinical_tips_organ_system ON public.clinical_tips (organ_system);
CREATE INDEX IF NOT EXISTS idx_clinical_tips_author ON public.clinical_tips (author);

CREATE INDEX IF NOT EXISTS idx_cured_cases_title_trgm ON public.cured_cases USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cured_cases_diagnosis_trgm ON public.cured_cases USING gin (clinical_diagnosis gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cured_cases_remedy ON public.cured_cases (remedy_prescribed);
CREATE INDEX IF NOT EXISTS idx_cured_cases_author ON public.cured_cases (author);

CREATE INDEX IF NOT EXISTS idx_disease_nutrition_name ON public.disease_nutrition_guidance (condition_name);
CREATE INDEX IF NOT EXISTS idx_disease_nutrition_category ON public.disease_nutrition_guidance (category);

CREATE INDEX IF NOT EXISTS idx_mother_tinctures_name ON public.mother_tinctures (remedy_name);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.clinical_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cured_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_nutrition_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mother_tinctures ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for reference knowledge, Authenticated full access
CREATE POLICY "Public read access for clinical tips"
    ON public.clinical_tips FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage clinical tips"
    ON public.clinical_tips FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for cured cases"
    ON public.cured_cases FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage cured cases"
    ON public.cured_cases FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for disease nutrition"
    ON public.disease_nutrition_guidance FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage disease nutrition"
    ON public.disease_nutrition_guidance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for mother tinctures"
    ON public.mother_tinctures FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage mother tinctures"
    ON public.mother_tinctures FOR ALL TO authenticated USING (true) WITH CHECK (true);
