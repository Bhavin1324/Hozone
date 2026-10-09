import type { ThemeConfig } from 'antd';
import { theme as antTheme } from 'antd';
import type { ClinicalPalette } from './colorGenerator';
import { SYSTEM_TOKENS } from './tokens';

/**
 * Creates an Ant Design ThemeConfig synchronized with our clinical palette.
 */
export function createAntdTheme(palette: ClinicalPalette): ThemeConfig {
  const { defaultAlgorithm, darkAlgorithm } = antTheme;

  return {
    algorithm: palette.isDark ? [darkAlgorithm] : [defaultAlgorithm],
    token: {
      colorPrimary: palette.primary[500],
      colorSuccess: palette.status.success.main,
      colorWarning: palette.status.warning.main,
      colorError: palette.status.error.main,
      colorInfo: palette.status.info.main,
      colorBgBase: palette.surface.bgBase,
      colorBgContainer: palette.surface.card,
      colorBgElevated: palette.surface.elevated,
      colorTextBase: palette.text.primary,
      colorTextDescription: palette.text.secondary,
      colorBorder: palette.border.default,
      colorBorderSecondary: palette.border.subtle,
      borderRadius: SYSTEM_TOKENS.borderRadius.md,
      fontFamily: SYSTEM_TOKENS.fontFamily.sans,
      fontFamilyCode: SYSTEM_TOKENS.fontFamily.mono,
    },
    components: {
      Button: {
        borderRadius: SYSTEM_TOKENS.borderRadius.md,
        controlHeight: 38,
        fontWeight: 500,
        primaryShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      },
      Table: {
        borderRadius: SYSTEM_TOKENS.borderRadius.md,
        headerBg: palette.surface.bgSubtle,
        headerColor: palette.text.primary,
        rowHoverBg: palette.isDark ? '#1E293B60' : '#F1F5F980',
        borderColor: palette.border.subtle,
      },
      Card: {
        borderRadiusLG: SYSTEM_TOKENS.borderRadius.lg,
        colorBgContainer: palette.surface.card,
        colorBorderSecondary: palette.border.subtle,
      },
      Modal: {
        borderRadiusLG: SYSTEM_TOKENS.borderRadius.lg,
        contentBg: palette.surface.elevated,
        headerBg: palette.surface.elevated,
      },
      Menu: {
        itemBorderRadius: SYSTEM_TOKENS.borderRadius.sm,
        itemHoverBg: palette.isDark ? '#1E293B80' : '#F1F5F9',
        itemSelectedBg: palette.isDark ? '#13312f' : '#E6F4F1',
        itemSelectedColor: palette.primary[500],
      },
      Input: {
        borderRadius: SYSTEM_TOKENS.borderRadius.md,
        colorBgContainer: palette.surface.input,
        colorBorder: palette.border.default,
      },
      Segmented: {
        borderRadius: SYSTEM_TOKENS.borderRadius.md,
        trackBg: palette.surface.bgSubtle,
      },
    },
  };
}
