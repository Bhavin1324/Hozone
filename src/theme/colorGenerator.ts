import { generate } from '@ant-design/colors';

export interface PrimaryScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  950: string;
}

export interface SurfaceTokens {
  bgBase: string;
  bgSubtle: string;
  card: string;
  elevated: string;
  input: string;
}

export interface BorderTokens {
  subtle: string;
  default: string;
  strong: string;
}

export interface TextTokens {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface StatusColorSet {
  main: string;
  bg: string;
  border: string;
  text: string;
}

export interface StatusTokens {
  success: StatusColorSet;
  warning: StatusColorSet;
  error: StatusColorSet;
  info: StatusColorSet;
}

export interface ClinicalPalette {
  seed: string;
  isDark: boolean;
  isHighContrast: boolean;
  primary: PrimaryScale;
  surface: SurfaceTokens;
  border: BorderTokens;
  text: TextTokens;
  status: StatusTokens;
}

/**
 * Derives a complete clinical palette from a single seed color.
 */
export function generateClinicalPalette(
  seedColor: string,
  isDark: boolean = false,
  isHighContrast: boolean = false
): ClinicalPalette {
  const steps = isDark
    ? generate(seedColor, { theme: 'dark', backgroundColor: '#0A0F1D' })
    : generate(seedColor);

  const primary: PrimaryScale = {
    50: isDark ? steps[0] : steps[0],
    100: isDark ? steps[1] : steps[1],
    200: isDark ? steps[2] : steps[2],
    300: isDark ? steps[3] : steps[3],
    400: isDark ? steps[4] : steps[4],
    500: isDark ? steps[5] : steps[5],
    600: isDark ? steps[6] : steps[6],
    700: isDark ? steps[7] : steps[7],
    800: isDark ? steps[8] : steps[8],
    950: isDark ? steps[9] : steps[9],
  };

  const surface: SurfaceTokens = isDark
    ? {
        bgBase: isHighContrast ? '#000000' : '#0B0F17',
        bgSubtle: isHighContrast ? '#05070A' : '#111827',
        card: isHighContrast ? '#0D1117' : '#151D2A',
        elevated: isHighContrast ? '#161B22' : '#1E293B',
        input: isHighContrast ? '#0D1117' : '#0F172A',
      }
    : {
        bgBase: '#F8FAFC',
        bgSubtle: '#F1F5F9',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
        input: '#FFFFFF',
      };

  const border: BorderTokens = isDark
    ? {
        subtle: isHighContrast ? '#30363D' : '#1F2937',
        default: isHighContrast ? '#6E7681' : '#334155',
        strong: isHighContrast ? '#8B949E' : '#475569',
      }
    : {
        subtle: '#E2E8F0',
        default: '#CBD5E1',
        strong: isHighContrast ? '#334155' : '#94A3B8',
      };

  const text: TextTokens = isDark
    ? {
        primary: '#F8FAFC',
        secondary: isHighContrast ? '#E2E8F0' : '#94A3B8',
        muted: isHighContrast ? '#CBD5E1' : '#64748B',
        inverse: '#0F172A',
      }
    : {
        primary: isHighContrast ? '#000000' : '#0F172A',
        secondary: '#475569',
        muted: '#64748B',
        inverse: '#FFFFFF',
      };

  const status: StatusTokens = isDark
    ? {
        success: {
          main: '#10B981',
          bg: '#064E3B40',
          border: '#059669',
          text: '#34D399',
        },
        warning: {
          main: '#F59E0B',
          bg: '#78350F40',
          border: '#D97706',
          text: '#FBBF24',
        },
        error: {
          main: '#EF4444',
          bg: '#7F1D1D40',
          border: '#DC2626',
          text: '#F87171',
        },
        info: {
          main: '#3B82F6',
          bg: '#1E3A8A40',
          border: '#2563EB',
          text: '#60A5FA',
        },
      }
    : {
        success: {
          main: '#059669',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
        },
        warning: {
          main: '#D97706',
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
        },
        error: {
          main: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
        },
        info: {
          main: '#2563EB',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          text: '#1E40AF',
        },
      };

  return {
    seed: seedColor,
    isDark,
    isHighContrast,
    primary,
    surface,
    border,
    text,
    status,
  };
}

/**
 * Dynamically binds CSS custom variables to document root for Tailwind CSS v4 consumption.
 */
export function applyThemeCssVariables(palette: ClinicalPalette): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Primary 10-step scale
  root.style.setProperty('--color-primary-50', palette.primary[50]);
  root.style.setProperty('--color-primary-100', palette.primary[100]);
  root.style.setProperty('--color-primary-200', palette.primary[200]);
  root.style.setProperty('--color-primary-300', palette.primary[300]);
  root.style.setProperty('--color-primary-400', palette.primary[400]);
  root.style.setProperty('--color-primary-500', palette.primary[500]);
  root.style.setProperty('--color-primary-600', palette.primary[600]);
  root.style.setProperty('--color-primary-700', palette.primary[700]);
  root.style.setProperty('--color-primary-800', palette.primary[800]);
  root.style.setProperty('--color-primary-950', palette.primary[950]);

  // Surfaces
  root.style.setProperty('--color-surface-bg', palette.surface.bgBase);
  root.style.setProperty('--color-surface-subtle', palette.surface.bgSubtle);
  root.style.setProperty('--color-surface-card', palette.surface.card);
  root.style.setProperty('--color-surface-elevated', palette.surface.elevated);
  root.style.setProperty('--color-surface-input', palette.surface.input);

  // Borders
  root.style.setProperty('--color-border-subtle', palette.border.subtle);
  root.style.setProperty('--color-border-default', palette.border.default);
  root.style.setProperty('--color-border-strong', palette.border.strong);

  // Text
  root.style.setProperty('--color-text-primary', palette.text.primary);
  root.style.setProperty('--color-text-secondary', palette.text.secondary);
  root.style.setProperty('--color-text-muted', palette.text.muted);
  root.style.setProperty('--color-text-inverse', palette.text.inverse);

  // Status Colors
  root.style.setProperty('--color-status-success', palette.status.success.main);
  root.style.setProperty('--color-status-success-bg', palette.status.success.bg);
  root.style.setProperty('--color-status-warning', palette.status.warning.main);
  root.style.setProperty('--color-status-warning-bg', palette.status.warning.bg);
  root.style.setProperty('--color-status-error', palette.status.error.main);
  root.style.setProperty('--color-status-error-bg', palette.status.error.bg);
  root.style.setProperty('--color-status-info', palette.status.info.main);
  root.style.setProperty('--color-status-info-bg', palette.status.info.bg);

  // Sync classes
  if (palette.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  if (palette.isHighContrast) {
    root.classList.add('clinical-high-contrast');
  } else {
    root.classList.remove('clinical-high-contrast');
  }
}
