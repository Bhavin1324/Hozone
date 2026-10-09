import React from 'react';
import { Outlet } from 'react-router';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { Header } from './Header';
import { CommandBar } from './CommandBar';
import { useShortcut } from '@/core/hooks/useKeyPress';
import { useAppDispatch } from '@/app/store';
import { setCommandBarOpen } from '@/app/store/slices/preferencesSlice';

export const AppShell: React.FC = () => {
  const dispatch = useAppDispatch();

  // Global Ctrl+K / Cmd+K Command Bar shortcut
  useShortcut('k', () => dispatch(setCommandBarOpen(true)), { ctrlOrCmd: true });

  return (
    <div className="min-h-screen bg-surface-bg text-text-primary flex flex-col md:flex-row antialiased">
      {/* Desktop Navigation Rail */}
      <DesktopNav />

      {/* Main Workspace Shell */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Touch Navigation */}
      <MobileNav />

      {/* Quick-action Command Bar Modal */}
      <CommandBar />
    </div>
  );
};
