-- ==============================================================================
-- HOZONE CLINICAL DATABASE INITIAL CORE SCHEMA
-- Migration: 00001_initial_core_schema.sql
-- Database: PostgreSQL 17 (Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  registration_number TEXT,
  role TEXT NOT NULL DEFAULT 'practitioner' CHECK (role IN ('practitioner', 'administrator', 'researcher')),
  theme_preference TEXT NOT NULL DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'system', 'high-contrast')),
  seed_color_preference TEXT NOT NULL DEFAULT '#0F766E',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. APP SETTINGS TABLE (Key-Value scoped config)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for app_settings updated_at
DROP TRIGGER IF EXISTS set_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER set_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. AUDIT LOGS TABLE (Immutable clinical log trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient audit filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- 6. SYSTEM STATUS RPC FUNCTION
CREATE OR REPLACE FUNCTION public.get_system_status()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_db_version TEXT;
  v_result JSONB;
BEGIN
  SELECT version() INTO v_db_version;

  v_result := jsonb_build_object(
    'status', 'healthy',
    'database_version', v_db_version,
    'schema_version', '00001_initial_core_schema',
    'server_timestamp', NOW(),
    'environment', 'production'
  );

  RETURN v_result;
END;
$$;

-- Grant execution to public / anon / authenticated
GRANT EXECUTE ON FUNCTION public.get_system_status() TO anon, authenticated, service_role;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Profiles Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view their own profile"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- App Settings Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view app settings' AND tablename = 'app_settings') THEN
    CREATE POLICY "Anyone can view app settings"
      ON public.app_settings
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update app settings' AND tablename = 'app_settings') THEN
    CREATE POLICY "Authenticated users can update app settings"
      ON public.app_settings
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Audit Logs Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can insert audit logs' AND tablename = 'audit_logs') THEN
    CREATE POLICY "Authenticated users can insert audit logs"
      ON public.audit_logs
      FOR INSERT
      TO authenticated, anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own audit logs' AND tablename = 'audit_logs') THEN
    CREATE POLICY "Users can view their own audit logs"
      ON public.audit_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);
  END IF;
END $$;
