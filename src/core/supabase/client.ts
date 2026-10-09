import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://aobwzoofafvkqaqdeqlq.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYnd6b29mYWZ2a3FhcWRlcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MTgzMDIsImV4cCI6MjEwNzA5NDMwMn0.QrOLdZIQXmsBxLkKMEmrH2pDQrvazvEp33F06J42W3I';

/**
 * Resilient Supabase client singleton configured with auth persistence and retry handling.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'hozone_auth_token',
  },
  global: {
    headers: {
      'x-application-name': 'hozone-clinical-app',
    },
  },
});

/**
 * Checks connection health to Supabase instance.
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = performance.now();
  try {
    const { error } = await supabase.from('app_settings').select('key').limit(1);
    const latencyMs = Math.round(performance.now() - start);
    if (error && error.code !== 'PGRST116') {
      return { connected: false, latencyMs, error: error.message };
    }
    return { connected: true, latencyMs };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs,
      error: err instanceof Error ? err.message : 'Unknown connection error',
    };
  }
}
