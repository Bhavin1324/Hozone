import React from 'react';
import { Input, Tag, Tooltip, Segmented } from 'antd';
import { Search, Plus, Check, FolderTree, ListFilter, Link2 } from 'lucide-react';
import type { Rubric, RubricRemedyEntry } from '../types';
import { HierarchicalRubricTree } from './HierarchicalRubricTree';

interface RubricBrowserProps {
  rubrics: Rubric[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeRubricIds: Set<string>;
  onAddRubric: (rubric: Rubric) => void;
  onSelectRemedy: (remedyId: string) => void;
  viewMode: 'tree' | 'flat';
  onViewModeChange: (mode: 'tree' | 'flat') => void;
  expandedRubricIds: string[];
  onToggleExpand: (rubricId: string) => void;
  onSelectCrossReference?: (ref: string) => void;
}

function getGradeTypography(grade: number): {
  className: string;
} {
  switch (grade) {
    case 4:
      return { className: 'font-bold text-red-600 dark:text-red-400 text-xs' };
    case 3:
      return { className: 'font-bold text-primary-600 dark:text-primary-400 text-xs' };
    case 2:
      return { className: 'italic text-text-primary text-xs font-medium' };
    default:
      return { className: 'text-text-muted text-xs' };
  }
}

export const RubricBrowser: React.FC<RubricBrowserProps> = ({
  rubrics,
  searchQuery,
  onSearchChange,
  activeRubricIds,
  onAddRubric,
  onSelectRemedy,
  viewMode,
  onViewModeChange,
  expandedRubricIds,
  onToggleExpand,
  onSelectCrossReference,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-surface-card overflow-hidden">
      {/* Search & Mode Header */}
      <div className="p-2.5 border-b border-border-subtle bg-surface-card space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              prefix={<Search className="w-3.5 h-3.5 text-text-muted mr-1.5" />}
              placeholder="Search rubrics (e.g. 'anxiety', 'cold air', 'salt')..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              size="middle"
              className="rounded-lg text-xs"
            />
          </div>

          {/* View Mode Segmented Switcher */}
          <Segmented
            value={viewMode}
            onChange={(val) => onViewModeChange(val as 'tree' | 'flat')}
            size="small"
            options={[
              {
                value: 'tree',
                icon: <FolderTree className="w-3.5 h-3.5 inline mr-1" />,
                label: 'Tree',
              },
              {
                value: 'flat',
                icon: <ListFilter className="w-3.5 h-3.5 inline mr-1" />,
                label: 'Flat',
              },
            ]}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>Found {rubrics.length} rubrics</span>
          <span className="font-mono text-[10px] text-primary-600 dark:text-primary-400">
            {viewMode === 'tree' ? 'Hierarchical Drilldown' : 'IndexedDB Flat Search'}
          </span>
        </div>
      </div>

      {/* Rubrics Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {rubrics.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted">
            No rubrics match &quot;{searchQuery}&quot;. Try broadening search terms.
          </div>
        ) : viewMode === 'tree' && !searchQuery.trim() ? (
          <HierarchicalRubricTree
            rubrics={rubrics}
            expandedRubricIds={expandedRubricIds}
            onToggleExpand={onToggleExpand}
            activeRubricIds={activeRubricIds}
            onAddRubric={onAddRubric}
            onSelectRemedy={onSelectRemedy}
            onSelectCrossReference={onSelectCrossReference}
          />
        ) : (
          rubrics.map((rubric) => {
            const isAdded = activeRubricIds.has(rubric.id);

            return (
              <div
                key={rubric.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isAdded
                    ? 'border-primary-500/40 bg-primary-500/5'
                    : 'border-border-subtle hover:border-border-default bg-surface-card'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <Tag className="text-[9px] uppercase font-semibold m-0 bg-surface-subtle border-border-subtle text-text-secondary">
                        {rubric.chapterName}
                      </Tag>
                      {rubric.depth !== undefined && (
                        <span className="text-[10px] text-text-muted font-mono">
                          L{rubric.depth}
                        </span>
                      )}
                      <span className="text-[10px] text-text-muted font-mono">
                        {rubric.remedyCount} remedies
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-text-primary mt-1 leading-snug">
                      {rubric.fullPath}
                    </h4>
                  </div>

                  <Tooltip title={isAdded ? 'Recorded in case clipboard' : 'Add to case'}>
                    <button
                      onClick={() => onAddRubric(rubric)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                        isAdded
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-border-default hover:border-primary-500 text-text-secondary hover:text-primary-500 bg-surface-subtle hover:bg-surface-elevated'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </Tooltip>
                </div>

                {/* Graded Remedies Preview Bar */}
                {rubric.entries && rubric.entries.length > 0 && (
                  <div className="mt-2 pt-1.5 border-t border-border-subtle flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider mr-1">
                      Graded:
                    </span>
                    {rubric.entries.slice(0, 10).map((entry: RubricRemedyEntry) => {
                      const style = getGradeTypography(entry.grade);
                      return (
                        <button
                          key={entry.remedyId}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRemedy(entry.remedyId);
                          }}
                          className={`px-1.5 py-0.2 rounded bg-surface-subtle hover:bg-surface-elevated border border-border-subtle transition-colors cursor-pointer ${style.className}`}
                          title={`Grade ${entry.grade} - Click to inspect`}
                        >
                          {entry.abbreviation}
                          <span className="text-[8px] opacity-70 ml-0.5">({entry.grade})</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Cross References */}
                {rubric.crossReferences && rubric.crossReferences.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <Link2 className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-[9px] text-text-muted">See also:</span>
                    {rubric.crossReferences.map((ref) => (
                      <button
                        key={ref}
                        onClick={() => onSelectCrossReference?.(ref)}
                        className="text-[10px] text-primary-600 dark:text-primary-400 hover:underline cursor-pointer bg-primary-500/5 px-1.5 py-0.2 rounded border border-primary-500/20"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
