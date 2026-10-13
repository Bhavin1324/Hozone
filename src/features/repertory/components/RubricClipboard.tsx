import React, { useState } from 'react';
import { Button, Tooltip, Tag, Checkbox, Select } from 'antd';
import { Trash2, ShieldAlert, X, Merge, Split, FolderPlus } from 'lucide-react';
import type { ActiveCaseRubric, MergeStrategy } from '../types';

interface RubricClipboardProps {
  activeRubrics: ActiveCaseRubric[];
  selectedClipboardIds: string[];
  onToggleSelect: (rubricId: string) => void;
  onCombineSelected?: (strategy: MergeStrategy) => void;
  onUncombineRubric?: (rubricId: string) => void;
  onRemoveRubric: (rubricId: string) => void;
  onSetWeight: (rubricId: string, weight: 1 | 2 | 3 | 4 | 5) => void;
  onToggleEliminating: (rubricId: string) => void;
  onClearClipboard: () => void;
  onSaveToCase?: () => void;
}

export const RubricClipboard: React.FC<RubricClipboardProps> = ({
  activeRubrics,
  selectedClipboardIds,
  onToggleSelect,
  onCombineSelected,
  onUncombineRubric,
  onRemoveRubric,
  onSetWeight,
  onToggleEliminating,
  onClearClipboard,
  onSaveToCase,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<MergeStrategy>('max_grade');

  if (activeRubrics.length === 0) {
    return (
      <div className="p-4 border border-dashed border-border-default rounded-2xl bg-surface-subtle/50 text-center flex flex-col items-center justify-center min-h-[140px]">
        <ShieldAlert className="w-6 h-6 text-text-muted mb-2 opacity-60" />
        <p className="text-xs font-semibold text-text-secondary">Case Clipboard is Empty</p>
        <p className="text-[11px] text-text-muted max-w-xs mt-0.5">
          Select rubrics from the catalog to populate symptoms and trigger real-time repertorization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Case Clipboard ({activeRubrics.length})
          </span>
          <span className="text-[11px] text-text-muted">
            • {activeRubrics.filter((r) => r.isEliminating).length} eliminating
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {onSaveToCase && (
            <Button
              type="text"
              size="small"
              icon={<FolderPlus className="w-3.5 h-3.5 mr-1 text-primary-500" />}
              onClick={onSaveToCase}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Save to Case
            </Button>
          )}
          <Button
            type="text"
            danger
            size="small"
            icon={<Trash2 className="w-3.5 h-3.5 mr-1" />}
            onClick={onClearClipboard}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Rubric Combine Action Bar when 2+ rubrics are checked */}
      {selectedClipboardIds.length >= 2 && onCombineSelected && (
        <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Merge className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-semibold text-text-primary">
              Combine {selectedClipboardIds.length} Selected Rubrics:
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              size="small"
              value={selectedStrategy}
              onChange={(val) => setSelectedStrategy(val as MergeStrategy)}
              className="text-xs w-32"
              options={[
                { value: 'max_grade', label: 'Highest Grade' },
                { value: 'sum_grades', label: 'Sum Grades' },
                { value: 'average', label: 'Average Grade' },
              ]}
            />
            <Button
              type="primary"
              size="small"
              icon={<Merge className="w-3.5 h-3.5 mr-1" />}
              onClick={() => onCombineSelected(selectedStrategy)}
            >
              Combine
            </Button>
          </div>
        </div>
      )}

      {/* List of active rubrics */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {activeRubrics.map((rubric) => {
          const isChecked = selectedClipboardIds.includes(rubric.rubricId);

          return (
            <div
              key={rubric.rubricId}
              className={`p-2.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                rubric.isEliminating
                  ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10'
                  : rubric.isCombined
                  ? 'border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10'
                  : 'border-border-subtle bg-surface-card'
              }`}
            >
              <div className="flex items-start space-x-2 flex-1 min-w-0">
                {!rubric.isCombined && (
                  <Checkbox
                    checked={isChecked}
                    onChange={() => onToggleSelect(rubric.rubricId)}
                    className="mt-0.5"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag className="text-[10px] m-0 bg-surface-subtle text-text-secondary border-border-subtle">
                      {rubric.chapterName}
                    </Tag>
                    {rubric.isCombined && (
                      <Tag color="purple" className="text-[10px] m-0 font-semibold uppercase">
                        Combined ({rubric.sourceRubricIds?.length || 2})
                      </Tag>
                    )}
                    {rubric.isEliminating && (
                      <Tag color="gold" className="text-[10px] m-0 font-semibold uppercase">
                        Eliminating
                      </Tag>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-text-primary truncate mt-1">
                    {rubric.fullPath}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                {/* Weight Multiplier Picker */}
                <div className="flex items-center space-x-0.5 bg-surface-subtle p-0.5 rounded-lg border border-border-subtle">
                  {([1, 2, 3, 4, 5] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => onSetWeight(rubric.rubricId, w)}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                        rubric.weight === w
                          ? 'bg-primary-500 text-white font-bold'
                          : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                      }`}
                      title={`Priority Weight x${w}`}
                    >
                      x{w}
                    </button>
                  ))}
                </div>

                {/* Uncombine button if this is a combined rubric */}
                {rubric.isCombined && onUncombineRubric && (
                  <Tooltip title="Uncombine into individual original rubrics">
                    <button
                      onClick={() => onUncombineRubric(rubric.rubricId)}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold border border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Split className="w-3 h-3" />
                      Unpack
                    </button>
                  </Tooltip>
                )}

                {/* Elimination Toggle */}
                <Tooltip title="When ON, candidate remedies MUST cover this rubric to be eligible.">
                  <button
                    onClick={() => onToggleEliminating(rubric.rubricId)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer ${
                      rubric.isEliminating
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-border-default text-text-muted hover:text-text-primary hover:bg-surface-subtle'
                    }`}
                  >
                    Eliminate
                  </button>
                </Tooltip>

                {/* Delete Button */}
                <button
                  onClick={() => onRemoveRubric(rubric.rubricId)}
                  className="p-1 rounded text-text-muted hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove rubric"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
