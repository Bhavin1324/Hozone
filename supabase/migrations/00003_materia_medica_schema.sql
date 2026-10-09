-- ==============================================================================
-- HOZONE CLINICAL DATABASE: MATERIA MEDICA & REMEDY RELATIONSHIPS SCHEMA
-- Migration: 00003_materia_medica_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. BOOKS TABLE (Reference Texts)
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  edition_year INT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. REMEDY MONOGRAPHS TABLE
CREATE TABLE IF NOT EXISTS public.remedy_monographs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  mind TEXT,
  physical_generals TEXT,
  keynotes TEXT NOT NULL,
  modalities_agg TEXT[] DEFAULT ARRAY[]::TEXT[],
  modalities_amel TEXT[] DEFAULT ARRAY[]::TEXT[],
  organ_affinities TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(remedy_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_monographs_remedy_id ON public.remedy_monographs(remedy_id);
CREATE INDEX IF NOT EXISTS idx_monographs_book_id ON public.remedy_monographs(book_id);
CREATE INDEX IF NOT EXISTS idx_monographs_keynotes_trgm ON public.remedy_monographs USING gin (keynotes gin_trgm_ops);

DROP TRIGGER IF EXISTS set_monographs_updated_at ON public.remedy_monographs;
CREATE TRIGGER set_monographs_updated_at
  BEFORE UPDATE ON public.remedy_monographs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. REMEDY RELATIONSHIPS GRAPH TABLE
CREATE TABLE IF NOT EXISTS public.remedy_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  related_remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('antidote', 'complement', 'inimical', 'follows_well', 'collateral')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(primary_remedy_id, related_remedy_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_relationships_primary ON public.remedy_relationships(primary_remedy_id);
CREATE INDEX IF NOT EXISTS idx_relationships_related ON public.remedy_relationships(related_remedy_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON public.remedy_relationships(relationship_type);

DROP TRIGGER IF EXISTS set_relationships_updated_at ON public.remedy_relationships;
CREATE TRIGGER set_relationships_updated_at
  BEFORE UPDATE ON public.remedy_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_monographs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_relationships ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read books' AND tablename = 'books') THEN
    CREATE POLICY "Allow read books" ON public.books FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read monographs' AND tablename = 'remedy_monographs') THEN
    CREATE POLICY "Allow read monographs" ON public.remedy_monographs FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read relationships' AND tablename = 'remedy_relationships') THEN
    CREATE POLICY "Allow read relationships" ON public.remedy_relationships FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;
