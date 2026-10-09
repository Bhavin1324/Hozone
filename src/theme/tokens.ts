/**
 * Design Token Contracts & Presets for Hozone Clinical System
 * Strictly enforces zero-hardcoded ad-hoc values across the platform.
 */

export type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';
export type ResolvedMode = 'light' | 'dark';

export interface ClinicalSeedPreset {
  id: string;
  name: string;
  seed: string;
  description: string;
}

export const CLINICAL_PRESETS: readonly ClinicalSeedPreset[] = [
  {
    id: 'clinical-teal',
    name: 'Clinical Teal',
    seed: '#0F766E',
    description: 'Calibrated for clinical clarity, repertory rubrics, and high focus.',
  },
  {
    id: 'ocean-slate',
    name: 'Ocean Slate',
    seed: '#0284C7',
    description: 'Crisp diagnostic blue with calm analytical depth.',
  },
  {
    id: 'forest-sage',
    name: 'Forest Sage',
    seed: '#15803D',
    description: 'Organic herbal botanical tone inspired by natural materia medica.',
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    seed: '#7E22CE',
    description: 'High contrast specialized palette for nocturnal case study sessions.',
  },
] as const;

export const DEFAULT_SEED_COLOR = '#0F766E';

export interface SystemTokens {
  borderRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  fontFamily: {
    sans: string;
    mono: string;
  };
}

export const SYSTEM_TOKENS: SystemTokens = {
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontFamily: {
    sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};
