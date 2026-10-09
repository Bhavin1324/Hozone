/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ThemeConfig } from 'antd';
import {
  type ClinicalPalette,
  applyThemeCssVariables,
  generateClinicalPalette,
} from './colorGenerator';
import { createAntdTheme } from './themeConfig';
import {
  DEFAULT_SEED_COLOR,
  type ResolvedMode,
  type ThemeMode,
} from './tokens';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  seedColor: string;
  palette: ClinicalPalette;
  antdTheme: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setSeedColor: (seed: string) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_MODE = 'hozone_theme_mode';
const STORAGE_KEY_SEED = 'hozone_seed_color';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
    return saved || 'light';
  });

  const [seedColor, setSeedColorState] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_SEED_COLOR;
    return localStorage.getItem(STORAGE_KEY_SEED) || DEFAULT_SEED_COLOR;
  });

  // System preference detection
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Compute resolved mode
  const resolvedMode: ResolvedMode = useMemo(() => {
    if (mode === 'system') return systemDark ? 'dark' : 'light';
    if (mode === 'high-contrast') return 'dark';
    return mode;
  }, [mode, systemDark]);

  const isHighContrast = mode === 'high-contrast';
  const deferredSeed = useDeferredValue(seedColor);

  // Generate palette
  const palette = useMemo(() => {
    return generateClinicalPalette(
      deferredSeed,
      resolvedMode === 'dark',
      isHighContrast
    );
  }, [deferredSeed, resolvedMode, isHighContrast]);

  // Ant Design Theme Config
  const antdTheme = useMemo(() => {
    return createAntdTheme(palette);
  }, [palette]);

  // Apply CSS custom variables to document root
  useEffect(() => {
    applyThemeCssVariables(palette);
  }, [palette]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
  }, []);

  const setSeedColor = useCallback((newSeed: string) => {
    setSeedColorState(newSeed);
    localStorage.setItem(STORAGE_KEY_SEED, newSeed);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => {
      const next: ThemeMode =
        current === 'light'
          ? 'dark'
          : current === 'dark'
            ? 'high-contrast'
            : 'light';
      localStorage.setItem(STORAGE_KEY_MODE, next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedMode,
      seedColor,
      palette,
      antdTheme,
      setMode,
      setSeedColor,
      toggleMode,
    }),
    [
      mode,
      resolvedMode,
      seedColor,
      palette,
      antdTheme,
      setMode,
      setSeedColor,
      toggleMode,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
