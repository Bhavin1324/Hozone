# Skill: Database Migration & Schema Protocol

This skill guides agents when creating and running database schema migrations for Hozone on Supabase.

---

## 1. Migration File Authoring
1. Always generate migrations in `supabase/migrations/` using chronological naming:
   `0000X_<descriptive_snake_case_name>.sql`
2. Wrap DDL statements idempotently:
   ```sql
   CREATE TABLE IF NOT EXISTS public.<table_name> (...);
   ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
   ```
3. Use `DO $$ BEGIN ... END $$;` blocks for policies to avoid collisions:
   ```sql
   DO $$ BEGIN
     IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '...' AND tablename = '...') THEN
       CREATE POLICY ... ;
     END IF;
   END $$;
   ```

---

## 2. Applying Migrations

### Method A: Via Supabase Dashboard SQL Editor
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/aobwzoofafvkqaqdeqlq/sql).
2. Paste the contents of `supabase/migrations/00001_initial_core_schema.sql` and `supabase/seed.sql`.
3. Click **Run**.

### Method B: Via Supabase CLI
```bash
supabase link --project-ref aobwzoofafvkqaqdeqlq
supabase db push
```

### Method C: Via Supabase MCP (When write scopes are active)
Use the `apply_migration` tool with `project_id: "aobwzoofafvkqaqdeqlq"`.

---

## 3. Post-Migration Verification
1. Call Supabase MCP `list_tables` with `schemas: ["public"]` to confirm created tables.
2. Call `execute_sql` with `SELECT public.get_system_status();` to verify healthy RPC execution.
3. Verify client connectivity using `src/core/query/hooks/useSystemStatus.ts`.
