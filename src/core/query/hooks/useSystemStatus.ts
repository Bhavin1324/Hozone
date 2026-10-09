import { useQuery } from '@tanstack/react-query';
import { supabase, checkSupabaseConnection } from '@/core/supabase/client';
import { queryKeys } from '../queryKeys';

export interface SystemStatusData {
  connected: boolean;
  latencyMs: number;
  databaseVersion?: string;
  schemaVersion?: string;
  environment: string;
  serverTimestamp: string;
  error?: string;
}

export function useSystemStatus() {
  return useQuery<SystemStatusData>({
    queryKey: queryKeys.system.status(),
    queryFn: async () => {
      const conn = await checkSupabaseConnection();

      let rpcData: Record<string, unknown> | null = null;
      try {
        const { data, error } = await supabase.rpc('get_system_status');
        if (!error && data) {
          rpcData = data as Record<string, unknown>;
        }
      } catch {
        // RPC might not exist before migration is applied
      }

      return {
        connected: conn.connected,
        latencyMs: conn.latencyMs,
        databaseVersion: (rpcData?.database_version as string) || 'PostgreSQL 17 (Supabase)',
        schemaVersion: (rpcData?.schema_version as string) || '00001_initial_core_schema',
        environment: import.meta.env.MODE || 'development',
        serverTimestamp: (rpcData?.server_timestamp as string) || new Date().toISOString(),
        error: conn.error,
      };
    },
    staleTime: 1000 * 30, // 30s
    refetchInterval: 1000 * 60, // Poll every minute for health
  });
}
