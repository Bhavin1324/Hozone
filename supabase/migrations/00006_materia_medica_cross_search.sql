-- ==============================================================================
-- HOZONE CLINICAL DATABASE: MATERIA MEDICA CROSS-SEARCH & EXTENDED SCHEMAS
-- Migration: 00006_materia_medica_cross_search.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. ADD EXTENDED COLUMNS TO REMEDY MONOGRAPHS
ALTER TABLE public.remedy_monographs
  ADD COLUMN IF NOT EXISTS clinical_indications TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS comparisons TEXT;

-- 2. CREATE GIN INDEXES FOR RAPID CLINICAL CROSS-SEARCH
CREATE INDEX IF NOT EXISTS idx_monographs_mind_trgm
  ON public.remedy_monographs USING gin (mind gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_monographs_physicals_trgm
  ON public.remedy_monographs USING gin (physical_generals gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_monographs_comparisons_trgm
  ON public.remedy_monographs USING gin (comparisons gin_trgm_ops)
  WHERE comparisons IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_monographs_clinical_indications
  ON public.remedy_monographs USING gin (clinical_indications);

-- 3. STORED PROCEDURE: CROSS-TEXT MATERIA MEDICA SEARCH
CREATE OR REPLACE FUNCTION public.search_materia_medica_cross_text(
  query_text TEXT,
  book_filter UUID[] DEFAULT NULL
)
RETURNS TABLE (
  monograph_id UUID,
  remedy_id UUID,
  remedy_abbr TEXT,
  remedy_name TEXT,
  book_id UUID,
  book_code TEXT,
  book_title TEXT,
  matched_section TEXT,
  snippet TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_query TEXT := LOWER(TRIM(query_text));
BEGIN
  IF clean_query = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH matched_monographs AS (
    SELECT
      m.id AS m_id,
      m.remedy_id AS r_id,
      r.abbreviation AS r_abbr,
      r.full_name AS r_name,
      b.id AS b_id,
      b.code AS b_code,
      b.title AS b_title,
      CASE
        WHEN LOWER(m.keynotes) LIKE '%' || clean_query || '%' THEN 'keynotes'
        WHEN LOWER(m.mind) LIKE '%' || clean_query || '%' THEN 'mind'
        WHEN LOWER(m.physical_generals) LIKE '%' || clean_query || '%' THEN 'physicals'
        WHEN LOWER(COALESCE(m.comparisons, '')) LIKE '%' || clean_query || '%' THEN 'comparisons'
        WHEN array_to_string(m.modalities_agg, ' ') ILIKE '%' || clean_query || '%' THEN 'modalities_agg'
        WHEN array_to_string(m.modalities_amel, ' ') ILIKE '%' || clean_query || '%' THEN 'modalities_amel'
        WHEN array_to_string(m.clinical_indications, ' ') ILIKE '%' || clean_query || '%' THEN 'clinical_indications'
        WHEN array_to_string(m.organ_affinities, ' ') ILIKE '%' || clean_query || '%' THEN 'organ_affinities'
        ELSE 'general'
      END AS sec,
      CASE
        WHEN LOWER(m.keynotes) LIKE '%' || clean_query || '%' THEN m.keynotes
        WHEN LOWER(m.mind) LIKE '%' || clean_query || '%' THEN m.mind
        WHEN LOWER(m.physical_generals) LIKE '%' || clean_query || '%' THEN m.physical_generals
        WHEN LOWER(COALESCE(m.comparisons, '')) LIKE '%' || clean_query || '%' THEN m.comparisons
        WHEN array_to_string(m.modalities_agg, ' ') ILIKE '%' || clean_query || '%' THEN array_to_string(m.modalities_agg, ', ')
        WHEN array_to_string(m.modalities_amel, ' ') ILIKE '%' || clean_query || '%' THEN array_to_string(m.modalities_amel, ', ')
        WHEN array_to_string(m.clinical_indications, ' ') ILIKE '%' || clean_query || '%' THEN array_to_string(m.clinical_indications, ', ')
        WHEN array_to_string(m.organ_affinities, ' ') ILIKE '%' || clean_query || '%' THEN array_to_string(m.organ_affinities, ', ')
        ELSE m.keynotes
      END AS full_text
    FROM public.remedy_monographs m
    JOIN public.remedies r ON r.id = m.remedy_id
    JOIN public.books b ON b.id = m.book_id
    WHERE (book_filter IS NULL OR m.book_id = ANY(book_filter))
      AND (
        LOWER(m.keynotes) LIKE '%' || clean_query || '%'
        OR LOWER(COALESCE(m.mind, '')) LIKE '%' || clean_query || '%'
        OR LOWER(COALESCE(m.physical_generals, '')) LIKE '%' || clean_query || '%'
        OR LOWER(COALESCE(m.comparisons, '')) LIKE '%' || clean_query || '%'
        OR array_to_string(m.modalities_agg, ' ') ILIKE '%' || clean_query || '%'
        OR array_to_string(m.modalities_amel, ' ') ILIKE '%' || clean_query || '%'
        OR array_to_string(m.clinical_indications, ' ') ILIKE '%' || clean_query || '%'
        OR array_to_string(m.organ_affinities, ' ') ILIKE '%' || clean_query || '%'
      )
  )
  SELECT
    m_id,
    r_id,
    r_abbr,
    r_name,
    b_id,
    b_code,
    b_title,
    sec,
    SUBSTRING(full_text FROM 1 FOR 300) AS snippet
  FROM matched_monographs
  ORDER BY r_name, b_title;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_materia_medica_cross_text(TEXT, UUID[]) TO anon, authenticated, service_role;
