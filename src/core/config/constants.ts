/**
 * Core Application Constants & Route Registries
 */

export const APP_CONFIG = {
  name: 'Hozone Clinical Intelligence',
  shortName: 'Hozone',
  version: '1.0.0-foundation',
  defaultLanguage: 'en',
  supportEmail: 'clinical-support@hozone.internal',
} as const;

export const ROUTES = {
  ROOT: '/',
  DASHBOARD: '/dashboard',
  REPERTORY: '/repertory',
  MATERIA_MEDICA: '/materia-medica',
  EXPERT_SYSTEMS: '/expert-systems',
  CLINICAL_GUIDANCE: '/clinical-guidance',
  PATIENTS: '/patients',
  SPECIALTY: '/specialty',
  SETTINGS: '/settings',
  AUTH: '/auth',
} as const;

export const NAVIGATION_ITEMS = [
  {
    key: 'dashboard',
    label: 'Clinical Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    badge: null,
  },
  {
    key: 'repertory',
    label: 'Repertory & Rubrics',
    path: ROUTES.REPERTORY,
    icon: 'BookOpen',
    badge: 'Core',
  },
  {
    key: 'materia-medica',
    label: 'Materia Medica',
    path: ROUTES.MATERIA_MEDICA,
    icon: 'FlaskConical',
    badge: null,
  },
  {
    key: 'expert-systems',
    label: 'Expert Systems',
    path: ROUTES.EXPERT_SYSTEMS,
    icon: 'Brain',
    badge: 'Decision',
  },
  {
    key: 'clinical-guidance',
    label: 'Clinical Guidance',
    path: ROUTES.CLINICAL_GUIDANCE,
    icon: 'Stethoscope',
    badge: 'Evidence',
  },
  {
    key: 'patients',
    label: 'Patient Cases',
    path: ROUTES.PATIENTS,
    icon: 'Users',
    badge: null,
  },
  {
    key: 'specialty',
    label: 'Specialty & Veterinary',
    path: ROUTES.SPECIALTY,
    icon: 'PawPrint',
    badge: null,
  },
  {
    key: 'settings',
    label: 'Preferences & System',
    path: ROUTES.SETTINGS,
    icon: 'Settings',
    badge: null,
  },
] as const;

export const QUERY_DEFAULTS = {
  STALE_TIME_DEFAULT: 1000 * 60 * 5, // 5 minutes
  STALE_TIME_STATIC: 1000 * 60 * 30, // 30 minutes
  GC_TIME: 1000 * 60 * 15, // 15 minutes
  MAX_RETRIES: 2,
} as const;
