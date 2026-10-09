-- ==============================================================================
-- HOZONE CLINICAL DATABASE MIGRATION: PATIENT MANAGEMENT SYSTEM (PMS)
-- Migration: 00009_patient_management_schema.sql
-- Module: Patient Management System & Longitudinal EHR
-- PostgreSQL: 17
-- ==============================================================================

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    age INT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    occupation TEXT,
    dominant_miasm TEXT CHECK (dominant_miasm IS NULL OR dominant_miasm IN ('Psora', 'Sycosis', 'Syphilis', 'Tubercular', 'Multi-miasmatic')),
    thermal_state TEXT CHECK (thermal_state IS NULL OR thermal_state IN ('Chilly', 'Hot', 'Ambithermal')),
    allergies TEXT[] DEFAULT '{}'::TEXT[],
    medical_history TEXT,
    family_history TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Follow-up', 'Archived')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Consultations Table (Longitudinal EHR)
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    consultation_date TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    chief_complaints TEXT NOT NULL,
    anamnesis_notes TEXT,
    vitals JSONB DEFAULT '{}'::JSONB,
    clinical_diagnosis TEXT,
    attached_rubric_ids TEXT[] DEFAULT '{}'::TEXT[],
    attached_rubrics_data JSONB DEFAULT '[]'::JSONB,
    remedy_prescribed TEXT,
    potency TEXT,
    potency_scale TEXT DEFAULT 'Centesimal' CHECK (potency_scale IN ('Centesimal', 'Decimal', '50-Millesimal (LM)', 'Mother Tincture (Q)')),
    dosage_instructions TEXT,
    dispensing_label TEXT,
    kent_observation_num INT CHECK (kent_observation_num IS NULL OR (kent_observation_num >= 1 AND kent_observation_num <= 12)),
    follow_up_progression TEXT,
    next_follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Prescriptions Table (Posology History)
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    prescription_date TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    remedy_name TEXT NOT NULL,
    potency TEXT NOT NULL,
    scale TEXT NOT NULL DEFAULT 'Centesimal',
    form TEXT NOT NULL DEFAULT 'Globules' CHECK (form IN ('Globules', 'Drops', 'Tablets', 'Liquid Dilution', 'Powder')),
    repetition TEXT NOT NULL,
    dispensing_status TEXT NOT NULL DEFAULT 'Dispensed' CHECK (dispensing_status IN ('Dispensed', 'Refilled', 'Pending', 'Discontinued')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER set_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_consultations_updated_at
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_prescriptions_updated_at
    BEFORE UPDATE ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- GIN Trigram Indexes for Instant Patient & Case Searching
CREATE INDEX IF NOT EXISTS idx_patients_name_trgm ON public.patients USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_patients_reg_num ON public.patients (registration_number);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients (status);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON public.consultations (patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON public.consultations (consultation_date DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_complaints_trgm ON public.consultations USING gin (chief_complaints gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions (patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_remedy ON public.prescriptions (remedy_name);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments (appointment_date);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read access for patients"
    ON public.patients FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage patients"
    ON public.patients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for consultations"
    ON public.consultations FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage consultations"
    ON public.consultations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for prescriptions"
    ON public.prescriptions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage prescriptions"
    ON public.prescriptions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read access for appointments"
    ON public.appointments FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users manage appointments"
    ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
