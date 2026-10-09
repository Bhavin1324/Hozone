import React from 'react';
import { Button, Tooltip, Dropdown, type MenuProps } from 'antd';
import {
  Sun,
  Moon,
  Contrast,
  Search,
  Activity,
  User,
  Palette,
  Check,
} from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { CLINICAL_PRESETS } from '@/theme/tokens';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCommandBarOpen } from '@/app/store/slices/preferencesSlice';
import { setActiveCase } from '@/app/store/slices/sessionSlice';
import { setCaseFileOpen, clearActivePatient } from '@/app/store/slices/patientSlice';
import { useSystemStatus } from '@/core/query/hooks/useSystemStatus';

interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const dispatch = useAppDispatch();
  const practitioner = useAppSelector((state) => state.session.practitionerName);
  const activePatient = useAppSelector((state) => state.patients.activePatient);
  const { mode, setMode, seedColor, setSeedColor } = useTheme();
  const { data: status, isLoading: isStatusLoading } = useSystemStatus();

  const themeMenuItems: MenuProps['items'] = [
    {
      key: 'light',
      label: 'Light Mode',
      icon: <Sun className="w-4 h-4" />,
      onClick: () => setMode('light'),
    },
    {
      key: 'dark',
      label: 'Dark Mode',
      icon: <Moon className="w-4 h-4" />,
      onClick: () => setMode('dark'),
    },
    {
      key: 'high-contrast',
      label: 'Clinical High Contrast',
      icon: <Contrast className="w-4 h-4" />,
      onClick: () => setMode('high-contrast'),
    },
    {
      type: 'divider',
    },
    {
      key: 'system',
      label: 'Follow System',
      onClick: () => setMode('system'),
    },
  ];

  const paletteMenuItems: MenuProps['items'] = CLINICAL_PRESETS.map((preset) => ({
    key: preset.id,
    label: (
      <div className="flex items-center justify-between w-40">
        <div className="flex items-center space-x-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
            style={{ backgroundColor: preset.seed }}
          />
          <span>{preset.name}</span>
        </div>
        {seedColor.toLowerCase() === preset.seed.toLowerCase() && (
          <Check className="w-3.5 h-3.5 text-primary-500" />
        )}
      </div>
    ),
    onClick: () => setSeedColor(preset.seed),
  }));

  return (
    <header className="h-16 border-b border-border-subtle bg-surface-card px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Quick Search / Command Trigger */}
        <button
          onClick={() => dispatch(setCommandBarOpen(true))}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs text-text-muted bg-surface-subtle hover:bg-surface-elevated border border-border-subtle hover:border-border-default rounded-lg transition-colors cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary-500 transition-colors" />
          <span className="hidden sm:inline">Quick command...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-surface-card border border-border-subtle rounded font-mono shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Active Clinical Case Workspace Pill */}
        {activePatient ? (
          <div className="flex items-center space-x-1.5 bg-primary-50 border border-primary-200 text-primary-700 px-2.5 py-1 rounded-full text-xs animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <button
              onClick={() => dispatch(setCaseFileOpen(true))}
              className="font-medium hover:underline cursor-pointer flex items-center space-x-1"
              title="Click to view Active Clinical Case File"
            >
              <span>Case: {activePatient.fullName}</span>
              <span className="text-[10px] font-mono opacity-75">({activePatient.registrationNumber})</span>
            </button>
            <button
              onClick={() => {
                dispatch(clearActivePatient());
                dispatch(setActiveCase(null));
              }}
              className="text-primary-500 hover:text-primary-800 ml-1 cursor-pointer font-bold"
              title="Close Case Workspace"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center text-xs text-text-muted px-2 py-1 rounded-full border border-dashed border-border-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-border-subtle mr-1.5" />
            <span>No Active Case</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Backend Latency & Health Indicator */}
        <Tooltip
          title={
            status?.connected
              ? `Connected to Supabase (hozone_db) • ${status.latencyMs}ms latency`
              : 'Offline / Reconnecting to Supabase'
          }
        >
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs bg-surface-subtle border border-border-subtle">
            <Activity
              className={`w-3.5 h-3.5 ${
                isStatusLoading
                  ? 'text-text-muted animate-spin'
                  : status?.connected
                    ? 'text-status-success animate-pulse'
                    : 'text-status-error'
              }`}
            />
            <span className="hidden md:inline font-mono text-[11px] text-text-secondary">
              {isStatusLoading ? 'Checking...' : `${status?.latencyMs ?? 0}ms`}
            </span>
          </div>
        </Tooltip>

        {/* Clinical Palette Selector */}
        <Dropdown menu={{ items: paletteMenuItems }} trigger={['click']}>
          <Tooltip title="Switch Clinical Accent Palette">
            <Button
              type="text"
              icon={<Palette className="w-4 h-4 text-text-secondary" />}
              className="flex items-center justify-center hover:bg-surface-subtle"
            />
          </Tooltip>
        </Dropdown>

        {/* Theme Mode Toggle (Light/Dark/High Contrast) */}
        <Dropdown menu={{ items: themeMenuItems }} trigger={['click']}>
          <Tooltip title={`Theme Mode: ${mode}`}>
            <Button
              type="text"
              icon={
                mode === 'dark' ? (
                  <Moon className="w-4 h-4 text-primary-400" />
                ) : mode === 'high-contrast' ? (
                  <Contrast className="w-4 h-4 text-primary-500" />
                ) : (
                  <Sun className="w-4 h-4 text-primary-600" />
                )
              }
              className="flex items-center justify-center hover:bg-surface-subtle"
            />
          </Tooltip>
        </Dropdown>

        {/* Practitioner Status Avatar */}
        <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs leading-tight">
            <div className="font-semibold text-text-primary line-clamp-1">
              {practitioner || 'Dr. Evelyn Vance'}
            </div>
            <div className="text-text-muted text-[11px]">Practitioner</div>
          </div>
        </div>
      </div>
    </header>
  );
};
