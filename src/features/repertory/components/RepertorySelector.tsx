import React, { useMemo } from 'react';
import { Select, Tag, Tooltip } from 'antd';
import { BookOpen, Layers, ShieldCheck } from 'lucide-react';
import type { RepertoryCatalogItem, RepertoryCategory } from '../types';

interface RepertorySelectorProps {
  repertories: RepertoryCatalogItem[];
  selectedRepertoryId: string;
  onSelectRepertory: (id: string) => void;
}

const CATEGORY_ORDER: RepertoryCategory[] = [
  'Master General & Classical',
  'Clinical & General Practice',
  'Regional & Organ Therapeutics',
  'Sensations, Causation & Modalities',
  'Modern & Thematic Systems',
];

export const RepertorySelector: React.FC<RepertorySelectorProps> = ({
  repertories,
  selectedRepertoryId,
  onSelectRepertory,
}) => {
  const currentRepertory = useMemo(() => {
    return (
      repertories.find((r) => r.id === selectedRepertoryId) ||
      repertories[0] || {
        id: 'rep-kent',
        title: "Kent's Repertory of the Homoeopathic Materia Medica",
        author: 'Dr. James Tyler Kent',
        editionYear: 1957,
        category: 'Master General & Classical' as const,
        description: 'Standard classical repertory',
      }
    );
  }, [repertories, selectedRepertoryId]);

  const groupedOptions = useMemo(() => {
    return CATEGORY_ORDER.map((category) => {
      const items = repertories.filter((r) => r.category === category);
      return {
        label: (
          <span className="font-semibold text-xs text-text-muted uppercase tracking-wider">
            {category} ({items.length})
          </span>
        ),
        options: items.map((r) => ({
          value: r.id,
          label: (
            <div className="flex items-center justify-between gap-2 py-0.5">
              <span className="truncate font-medium text-xs text-text-primary">
                {r.title}
              </span>
              <span className="text-[10px] text-text-muted shrink-0 font-mono">
                {r.author.replace(/^Dr\.\s*/i, '').split(' ').pop()} • {r.editionYear}
              </span>
            </div>
          ),
        })),
      };
    }).filter((g) => g.options.length > 0);
  }, [repertories]);

  return (
    <div className="p-3 rounded-2xl border border-border-subtle bg-surface-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Active Repertory Info */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 text-primary-600 dark:text-primary-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-text-primary truncate">
              {currentRepertory.title}
            </h3>
            <Tag className="text-[10px] font-mono m-0 bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20">
              {currentRepertory.editionYear}
            </Tag>
          </div>
          <p className="text-xs text-text-muted truncate mt-0.5">
            {currentRepertory.author} • {currentRepertory.category}
          </p>
        </div>
      </div>

      {/* Repertory Dropdown & Parity Badge */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <Tooltip title="Switch between 44 classical, regional, sensation, and modern repertories">
          <div className="w-64 sm:w-80">
            <Select
              value={selectedRepertoryId}
              onChange={onSelectRepertory}
              options={groupedOptions}
              className="w-full text-xs"
              placeholder="Select active repertory..."
              popupMatchSelectWidth={false}
              suffixIcon={<Layers className="w-3.5 h-3.5 text-text-muted" />}
            />
          </div>
        </Tooltip>

        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-secondary">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-[11px]">44 Repertories</span>
        </div>
      </div>
    </div>
  );
};
