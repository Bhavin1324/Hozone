import React, { useState, useMemo } from 'react';
import { Modal, Input } from 'antd';
import { Search, ArrowRight, BookOpen, FlaskConical, Users, LayoutDashboard, Settings, Moon, Sun, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCommandBarOpen, addRecentSearch } from '@/app/store/slices/preferencesSlice';
import { useTheme } from '@/theme/ThemeContext';
import { ROUTES } from '@/core/config/constants';
import { motion, AnimatePresence } from 'motion/react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Theme' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector((state) => state.preferences.commandBarOpen);
  const recentSearches = useAppSelector((state) => state.preferences.recentSearches);
  const { toggleMode, mode } = useTheme();
  const [query, setQuery] = useState('');

  const commands: CommandItem[] = useMemo(
    () => [
      {
        id: 'nav-dashboard',
        title: 'Go to Clinical Dashboard',
        category: 'Navigation',
        icon: <LayoutDashboard className="w-4 h-4" />,
        action: () => navigate(ROUTES.DASHBOARD),
      },
      {
        id: 'nav-repertory',
        title: 'Open Repertory & Rubrics',
        category: 'Navigation',
        icon: <BookOpen className="w-4 h-4" />,
        action: () => navigate(ROUTES.REPERTORY),
      },
      {
        id: 'nav-materia',
        title: 'Explore Materia Medica',
        category: 'Navigation',
        icon: <FlaskConical className="w-4 h-4" />,
        action: () => navigate(ROUTES.MATERIA_MEDICA),
      },
      {
        id: 'nav-patients',
        title: 'Search Patient Cases',
        category: 'Navigation',
        icon: <Users className="w-4 h-4" />,
        action: () => navigate(ROUTES.PATIENTS),
      },
      {
        id: 'nav-specialty',
        title: 'Specialty Repertories & Veterinary',
        category: 'Navigation',
        icon: <PawPrint className="w-4 h-4" />,
        action: () => navigate(ROUTES.SPECIALTY),
      },
      {
        id: 'nav-settings',
        title: 'Open Settings & Preferences',
        category: 'Navigation',
        icon: <Settings className="w-4 h-4" />,
        action: () => navigate(ROUTES.SETTINGS),
      },
      {
        id: 'action-theme',
        title: `Toggle Theme (Current: ${mode})`,
        category: 'Theme',
        icon: mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        action: () => toggleMode(),
      },
    ],
    [navigate, toggleMode, mode]
  );

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter((c) => c.title.toLowerCase().includes(lower));
  }, [commands, query]);

  const handleSelect = (cmd: CommandItem) => {
    if (query.trim()) {
      dispatch(addRecentSearch(query.trim()));
    }
    dispatch(setCommandBarOpen(false));
    setQuery('');
    cmd.action();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => dispatch(setCommandBarOpen(false))}
      footer={null}
      closable={false}
      width={560}
      centered
      className="p-0 [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-2xl"
    >
      <div className="p-4 border-b border-border-subtle bg-surface-card">
        <Input
          prefix={<Search className="w-4 h-4 text-text-muted mr-2" />}
          placeholder="Search commands, repertory rubrics, patients... (Esc to close)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="borderless"
          autoFocus
          className="text-base"
        />
      </div>

      <div className="max-h-80 overflow-y-auto p-2 bg-surface-card">
        {filteredCommands.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-muted">
            No matching commands or navigation targets found.
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <motion.button
                  key={cmd.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleSelect(cmd)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-text-primary hover:bg-surface-subtle transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-text-muted group-hover:text-primary-500 transition-colors">
                      {cmd.icon}
                    </span>
                    <span className="font-medium">{cmd.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-subtle text-text-muted">
                      {cmd.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              ))}
            </div>
          </AnimatePresence>
        )}

        {recentSearches.length > 0 && !query && (
          <div className="mt-3 pt-3 border-t border-border-subtle px-3">
            <span className="text-xs font-semibold text-text-muted tracking-wider uppercase">
              Recent Searches
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs px-2.5 py-1 rounded-md bg-surface-subtle text-text-secondary hover:text-primary-500 hover:bg-surface-elevated transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border-subtle bg-surface-subtle flex items-center justify-between text-xs text-text-muted">
        <span>Navigation Command Palette</span>
        <div className="flex items-center space-x-2">
          <kbd className="px-1.5 py-0.5 bg-surface-card border border-border-default rounded">↑↓</kbd>
          <span>to navigate</span>
          <kbd className="px-1.5 py-0.5 bg-surface-card border border-border-default rounded">↵</kbd>
          <span>to select</span>
        </div>
      </div>
    </Modal>
  );
};
