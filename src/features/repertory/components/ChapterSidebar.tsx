import React, { useState, useMemo } from 'react';
import { Input } from 'antd';
import {
  Brain,
  RotateCw,
  Smile,
  Eye,
  Utensils,
  Activity,
  Wind,
  Zap,
  BookOpen,
  Sparkles,
  SmilePlus,
  Shield,
  Heart,
  Moon,
  Thermometer,
  Flame,
  Droplets,
  Compass,
  MessageSquare,
  Layers,
  Search,
} from 'lucide-react';
import type { Chapter } from '../types';

interface ChapterSidebarProps {
  chapters: Chapter[];
  selectedChapterId: string | null;
  onSelectChapter: (chapterId: string | null) => void;
  isSearchActive?: boolean;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Brain,
  RotateCw,
  Smile,
  Eye,
  Utensils,
  Activity,
  Wind,
  Zap,
  Sparkles,
  SmilePlus,
  Shield,
  Heart,
  Moon,
  Thermometer,
  Flame,
  Droplets,
  Compass,
  MessageSquare,
  Layers,
  BookOpen,
};

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  chapters,
  selectedChapterId,
  onSelectChapter,
  isSearchActive = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredChapters = useMemo(() => {
    if (!filterQuery.trim()) return chapters;
    const q = filterQuery.toLowerCase().trim();
    return chapters.filter((c) => c.name.toLowerCase().includes(q));
  }, [chapters, filterQuery]);

  return (
    <div className="w-56 border-r border-border-subtle bg-surface-card flex flex-col h-full select-none">
      {/* Header with All button */}
      <div className="p-2.5 border-b border-border-subtle flex items-center justify-between">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Chapters ({filteredChapters.length})
        </span>
        <button
          onClick={() => onSelectChapter(null)}
          className={`text-xs px-2 py-0.5 rounded transition-colors cursor-pointer ${
            selectedChapterId === null
              ? 'bg-primary-500 text-white font-medium'
              : 'text-text-secondary hover:text-primary-500 hover:bg-surface-subtle'
          }`}
        >
          All
        </button>
      </div>

      {/* Quick Chapter Filter Input */}
      <div className="p-2 border-b border-border-subtle bg-surface-subtle/50">
        <Input
          prefix={<Search className="w-3 h-3 text-text-muted mr-1" />}
          placeholder="Filter chapters..."
          size="small"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          allowClear
          className="rounded-md text-xs"
        />
      </div>

      {/* Chapters Scroll List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {filteredChapters.map((chap) => {
          const Icon = ICON_MAP[chap.icon] || BookOpen;
          const isSelected = selectedChapterId === chap.id;

          return (
            <button
              key={chap.id}
              onClick={() => onSelectChapter(chap.id)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-primary-500/10 text-primary-500 font-semibold border border-primary-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-primary-500' : 'text-text-muted'
                  }`}
                />
                <span className="truncate">{chap.name}</span>
              </div>
              {chap.rubricCount !== undefined && chap.rubricCount > 0 ? (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 font-medium ${
                    isSearchActive
                      ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 font-bold border border-primary-500/20'
                      : 'bg-surface-subtle text-text-muted'
                  }`}
                >
                  {chap.rubricCount.toLocaleString()}
                </span>
              ) : isSearchActive ? (
                <span className="text-[10px] text-text-muted/40 font-mono px-1 shrink-0">
                  0
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
