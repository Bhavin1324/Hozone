-- ==============================================================================
-- HOZONE CLINICAL DATABASE SEED DATA
-- Seed: seed.sql
-- ==============================================================================

INSERT INTO public.app_settings (key, value, description)
VALUES
  (
    'system_branding',
    '{"title": "Hozone Clinical Intelligence", "default_seed_color": "#0F766E", "locale": "en-US"}'::jsonb,
    'Core system branding and default seed color'
  ),
  (
    'clinical_repertory_config',
    '{"default_grading_scale": 4, "default_scoring_model": "weighted_rubric_sum", "cache_ttl_minutes": 30}'::jsonb,
    'Repertorization and rubric scoring configuration'
  ),
  (
    'audit_retention_days',
    '{"retention_days": 365, "compliance_standard": "HIPAA-2026"}'::jsonb,
    'Clinical audit log retention schedule'
  )
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      description = EXCLUDED.description,
      updated_at = NOW();
