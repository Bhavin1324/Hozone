-- ==============================================================================
-- HOZONE CLINICAL DATABASE: REPERTORY & REMEDY CORE SCHEMA
-- Migration: 00002_repertory_engine_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. REPERTORIES TABLE
CREATE TABLE IF NOT EXISTS public.repertories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  edition_year INT,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_repertories_updated_at ON public.repertories;
CREATE TRIGGER set_repertories_updated_at
  BEFORE UPDATE ON public.repertories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repertory_id UUID NOT NULL REFERENCES public.repertories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(repertory_id, name)
);

CREATE INDEX IF NOT EXISTS idx_chapters_repertory_order ON public.chapters(repertory_id, display_order);

DROP TRIGGER IF EXISTS set_chapters_updated_at ON public.chapters;
CREATE TRIGGER set_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. REMEDIES TABLE (Materia Medica catalog)
CREATE TABLE IF NOT EXISTS public.remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abbreviation TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  common_name TEXT,
  kingdom TEXT NOT NULL CHECK (kingdom IN ('Plant', 'Mineral', 'Animal', 'Nosode', 'Sarcode', 'Imponderabilia')),
  thermal TEXT CHECK (thermal IN ('Chilly', 'Hot', 'Ambithermal')),
  miasm TEXT CHECK (miasm IN ('Psora', 'Sycosis', 'Syphilis', 'Tubercular', 'Multi-miasmatic')),
  is_polychrest BOOLEAN NOT NULL DEFAULT false,
  short_keynotes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_remedies_abbr_trgm ON public.remedies USING gin (abbreviation gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_remedies_full_name_trgm ON public.remedies USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_remedies_kingdom ON public.remedies(kingdom);
CREATE INDEX IF NOT EXISTS idx_remedies_thermal ON public.remedies(thermal);
CREATE INDEX IF NOT EXISTS idx_remedies_miasm ON public.remedies(miasm);

DROP TRIGGER IF EXISTS set_remedies_updated_at ON public.remedies;
CREATE TRIGGER set_remedies_updated_at
  BEFORE UPDATE ON public.remedies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. RUBRICS TABLE (Hierarchical symptoms)
CREATE TABLE IF NOT EXISTS public.rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repertory_id UUID NOT NULL REFERENCES public.repertories(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.rubrics(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  full_path TEXT NOT NULL,
  depth INT NOT NULL DEFAULT 0,
  remedy_count INT NOT NULL DEFAULT 0,
  cross_references TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rubrics_chapter_id ON public.rubrics(chapter_id);
CREATE INDEX IF NOT EXISTS idx_rubrics_parent_id ON public.rubrics(parent_id);
CREATE INDEX IF NOT EXISTS idx_rubrics_full_path_trgm ON public.rubrics USING gin (full_path gin_trgm_ops);

DROP TRIGGER IF EXISTS set_rubrics_updated_at ON public.rubrics;
CREATE TRIGGER set_rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. RUBRIC_REMEDIES JUNCTION TABLE (Graded symptom mappings)
CREATE TABLE IF NOT EXISTS public.rubric_remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rubric_id UUID NOT NULL REFERENCES public.rubrics(id) ON DELETE CASCADE,
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rubric_id, remedy_id)
);

CREATE INDEX IF NOT EXISTS idx_rubric_remedies_rubric ON public.rubric_remedies(rubric_id);
CREATE INDEX IF NOT EXISTS idx_rubric_remedies_remedy ON public.rubric_remedies(remedy_id);
CREATE INDEX IF NOT EXISTS idx_rubric_remedies_grade ON public.rubric_remedies(grade DESC);

DROP TRIGGER IF EXISTS set_rubric_remedies_updated_at ON public.rubric_remedies;
CREATE TRIGGER set_rubric_remedies_updated_at
  BEFORE UPDATE ON public.rubric_remedies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.repertories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rubric_remedies ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Public Read Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read repertories' AND tablename = 'repertories') THEN
    CREATE POLICY "Allow read repertories" ON public.repertories FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read chapters' AND tablename = 'chapters') THEN
    CREATE POLICY "Allow read chapters" ON public.chapters FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read remedies' AND tablename = 'remedies') THEN
    CREATE POLICY "Allow read remedies" ON public.remedies FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read rubrics' AND tablename = 'rubrics') THEN
    CREATE POLICY "Allow read rubrics" ON public.rubrics FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read rubric_remedies' AND tablename = 'rubric_remedies') THEN
    CREATE POLICY "Allow read rubric_remedies" ON public.rubric_remedies FOR SELECT TO anon, authenticated USING (true);
  END IF;

  -- Authenticated Author Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated insert remedies' AND tablename = 'remedies') THEN
    CREATE POLICY "Allow authenticated insert remedies" ON public.remedies FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated update remedies' AND tablename = 'remedies') THEN
    CREATE POLICY "Allow authenticated update remedies" ON public.remedies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;
