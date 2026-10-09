# Supabase & PostgreSQL Architecture Guidelines

## 1. Schema Conventions
- **Identifiers**: Lowercase snake_case for all tables, columns, indexes, and RPC functions (e.g., `audit_logs`, `patient_cases`, `get_system_status`).
- **Primary Keys**: Always `UUID PRIMARY KEY DEFAULT gen_random_uuid()` or `auth.users(id)` for user profiles.
- **Foreign Keys**: Always specify `ON DELETE` behavior explicitly (`CASCADE`, `SET NULL`, or `RESTRICT`).
- **Timestamps**:
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` with the `handle_updated_at()` trigger.

## 2. Row Level Security (RLS)
- **Zero-Trust Default**: Every table must have `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;`.
- **Explicit Policies**:
  - `SELECT`: Restricted to `auth.uid() = user_id` or public read if configuration data.
  - `INSERT`: Validate `auth.uid() = user_id`.
  - `UPDATE`: Validate `auth.uid() = user_id` in both `USING` and `WITH CHECK`.
  - `DELETE`: Disallow hard deletes on clinical records; prefer soft delete flags (`is_archived BOOLEAN DEFAULT false`).

## 3. Clinical Audit Trails
- Any mutation to patient records, prescriptions, or repertorizations must generate an entry in `public.audit_logs`:
  ```sql
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), 'PATIENT_RECORD_UPDATED', 'patients', patient_id, details_json);
  ```

## 4. MCP Permissions & Migration Execution
- When using the Supabase MCP:
  - If the active token has `supabase_read_only_user` privileges, execute read-only queries and diagnostic checks via MCP.
  - Apply DDL migrations through the Supabase Dashboard SQL Editor or via the Supabase CLI (`supabase db push`) when authenticated with database migration privileges.
- Always check extensions exist (`pg_trgm`, `uuid-ossp`, `unaccent`) before using fuzzy similarity operators (`%` or `similarity()`).
