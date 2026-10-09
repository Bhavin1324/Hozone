import { describe, it, expect } from 'vitest';
import { generateClinicalPalette } from '../colorGenerator';
import { createAntdTheme } from '../themeConfig';
import { CLINICAL_PRESETS, DEFAULT_SEED_COLOR } from '../tokens';

describe('Dynamic Zero-Hardcoded Color Generator', () => {
  it('generates a complete 10-step tonal scale for default Clinical Teal seed', () => {
    const palette = generateClinicalPalette(DEFAULT_SEED_COLOR, false, false);

    expect(palette.seed).toBe(DEFAULT_SEED_COLOR);
    expect(palette.isDark).toBe(false);
    expect(palette.isHighContrast).toBe(false);

    // Validate 10 steps exist and are valid hex strings
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 950] as const;
    for (const step of steps) {
      expect(palette.primary[step]).toMatch(/^#[0-9a-fA-F]{6}$/);
    }

    // Step 500 should be the main brand hue
    expect(palette.primary[500].toLowerCase()).toBe(DEFAULT_SEED_COLOR.toLowerCase());
  });

  it('generates palettes across all clinical preset seeds', () => {
    for (const preset of CLINICAL_PRESETS) {
      const palette = generateClinicalPalette(preset.seed, false, false);
      expect(palette.primary[500].toLowerCase()).toBe(preset.seed.toLowerCase());
      expect(palette.surface.bgBase).toBe('#F8FAFC');
      expect(palette.text.primary).toBe('#0F172A');
    }
  });

  it('inverts surface and text tokens in dark mode', () => {
    const darkPalette = generateClinicalPalette(DEFAULT_SEED_COLOR, true, false);

    expect(darkPalette.isDark).toBe(true);
    // Dark surfaces should be dark elevation levels
    expect(darkPalette.surface.bgBase).toBe('#0B0F17');
    expect(darkPalette.surface.card).toBe('#151D2A');
    // Text primary should invert to light
    expect(darkPalette.text.primary).toBe('#F8FAFC');
  });

  it('applies high-contrast clinical dark specifications', () => {
    const highContrastPalette = generateClinicalPalette(DEFAULT_SEED_COLOR, true, true);

    expect(highContrastPalette.isHighContrast).toBe(true);
    // Pitch black surfaces for maximum contrast
    expect(highContrastPalette.surface.bgBase).toBe('#000000');
    expect(highContrastPalette.surface.card).toBe('#0D1117');
  });

  it('produces valid Ant Design ThemeConfig with token mapping', () => {
    const palette = generateClinicalPalette(DEFAULT_SEED_COLOR, false, false);
    const antdTheme = createAntdTheme(palette);

    expect(antdTheme.token).toBeDefined();
    expect(antdTheme.token?.colorPrimary).toBe(palette.primary[500]);
    expect(antdTheme.token?.colorBgBase).toBe(palette.surface.bgBase);
    expect(antdTheme.components).toBeDefined();
    expect(antdTheme.components?.Button).toBeDefined();
    expect(antdTheme.components?.Table).toBeDefined();
  });
});
