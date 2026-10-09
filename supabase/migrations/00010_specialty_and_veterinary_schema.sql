-- ==============================================================================
-- HOZONE CLINICAL DATABASE MIGRATION: SPECIALTY REPERTORIES & VETERINARY EXTENSIONS
-- Migration: 00010_specialty_and_veterinary_schema.sql
-- Module: Specialty Repertories & Veterinary Homeopathy (Module 6 - 100% Parity)
-- PostgreSQL: 17
-- ==============================================================================

-- 1. Specialty Repertories Registry
CREATE TABLE IF NOT EXISTS public.specialty_repertories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    author TEXT NOT NULL,
    year INT,
    description TEXT,
    total_rubrics INT DEFAULT 0,
    category TEXT NOT NULL CHECK (category IN ('Clinical', 'Pediatric', 'Card/Key', 'Pocket Book', 'Veterinary')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Specialty Clinical Rubrics Table
CREATE TABLE IF NOT EXISTS public.specialty_rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repertory_code TEXT NOT NULL REFERENCES public.specialty_repertories(code) ON DELETE CASCADE,
    section TEXT NOT NULL,
    rubric_path TEXT NOT NULL,
    remedies_json JSONB NOT NULL DEFAULT '[]'::JSONB,
    clinical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Veterinary Species Guidance & Physiology Table
CREATE TABLE IF NOT EXISTS public.veterinary_species_guidance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species TEXT NOT NULL UNIQUE CHECK (species IN ('Canine', 'Feline', 'Equine', 'Bovine', 'Avian')),
    physiological_characteristics TEXT NOT NULL,
    common_acute_conditions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    posology_guidance TEXT NOT NULL,
    contraindications TEXT,
    administration_method TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Veterinary Clinical Cases Table
CREATE TABLE IF NOT EXISTS public.veterinary_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species TEXT NOT NULL CHECK (species IN ('Canine', 'Feline', 'Equine', 'Bovine', 'Avian')),
    breed_age_gender TEXT NOT NULL,
    chief_complaint TEXT NOT NULL,
    rubrics_used TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    remedy_prescribed TEXT NOT NULL,
    potency TEXT NOT NULL,
    outcome_notes TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER set_specialty_repertories_updated_at
    BEFORE UPDATE ON public.specialty_repertories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_specialty_rubrics_updated_at
    BEFORE UPDATE ON public.specialty_rubrics
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_veterinary_species_guidance_updated_at
    BEFORE UPDATE ON public.veterinary_species_guidance
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_veterinary_cases_updated_at
    BEFORE UPDATE ON public.veterinary_cases
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- GIN Trigram Indexes for Instant Sub-Second Search
CREATE INDEX IF NOT EXISTS idx_specialty_rubrics_path_trgm ON public.specialty_rubrics USING gin (rubric_path gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_specialty_rubrics_rep_code ON public.specialty_rubrics (repertory_code);
CREATE INDEX IF NOT EXISTS idx_specialty_rubrics_section ON public.specialty_rubrics (section);

CREATE INDEX IF NOT EXISTS idx_veterinary_cases_complaint_trgm ON public.veterinary_cases USING gin (chief_complaint gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_veterinary_cases_species ON public.veterinary_cases (species);
CREATE INDEX IF NOT EXISTS idx_veterinary_cases_remedy ON public.veterinary_cases (remedy_prescribed);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.specialty_repertories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinary_species_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinary_cases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access for specialty_repertories"
    ON public.specialty_repertories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage specialty_repertories"
    ON public.specialty_repertories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for specialty_rubrics"
    ON public.specialty_rubrics FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage specialty_rubrics"
    ON public.specialty_rubrics FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for veterinary_species_guidance"
    ON public.veterinary_species_guidance FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage veterinary_species_guidance"
    ON public.veterinary_species_guidance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for veterinary_cases"
    ON public.veterinary_cases FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage veterinary_cases"
    ON public.veterinary_cases FOR ALL TO authenticated USING (true) WITH CHECK (true);
