/**
 * Global Core TypeScript Definitions for Hozone
 */

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  registration_number: string | null;
  role: 'practitioner' | 'administrator' | 'researcher';
  theme_preference: 'light' | 'dark' | 'system' | 'high-contrast';
  seed_color_preference: string;
  created_at: string;
  updated_at: string;
}

export interface AppSetting {
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface SystemStatus {
  database_version: string;
  schema_version: string;
  environment: string;
  server_timestamp: string;
  status: 'healthy' | 'degraded' | 'maintenance';
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  statusCode: number;
}
