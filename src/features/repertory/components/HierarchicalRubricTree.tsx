import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import { ChevronRight, ChevronDown, Plus, Check, Link2 } from 'lucide-react';
import type { Rubric, RubricRemedyEntry } from '../types';

interface HierarchicalRubricTreeProps {
  rubrics: Rubric[];
  expandedRubricIds: string[];
  onToggleExpand: (rubricId: string) => void;
  activeRubricIds: Set<string>;
  onAddRubric: (rubric: Rubric) => void;
  onSelectRemedy: (remedyId: string) => void;
  onSelectCrossReference?: (ref: string) => void;
}

interface TreeNode {
  rubric: Rubric;
  children: TreeNode[];
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

export const HierarchicalRubricTree: React.FC<HierarchicalRubricTreeProps> = ({
  rubrics,
  expandedRubricIds,
  onToggleExpand,
  activeRubricIds,
  onAddRubric,
  onSelectRemedy,
  onSelectCrossReference,
}) => {
  // Build parent-child tree from rubrics list
  const treeNodes = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    for (const r of rubrics) {
      nodeMap.set(r.id, { rubric: r, children: [] });
    }

    const roots: TreeNode[] = [];
    for (const r of rubrics) {
      const node = nodeMap.get(r.id)!;
      if (r.parentId && nodeMap.has(r.parentId)) {
        nodeMap.get(r.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }, [rubrics]);

  const renderNode = (node: TreeNode, level = 0): React.ReactNode => {
    const { rubric, children } = node;
    const isExpanded = expandedRubricIds.includes(rubric.id);
    const hasChildren = children.length > 0 || (rubric.depth !== undefined && rubric.depth < 3);
    const isAdded = activeRubricIds.has(rubric.id);

    return (
      <div key={rubric.id} className="relative">
        <div
          className={`p-2.5 rounded-xl border transition-all mb-1.5 ${
            isAdded
              ? 'border-primary-500/40 bg-primary-500/5'
              : 'border-border-subtle hover:border-border-default bg-surface-card'
          } ${level > 0 ? 'ml-4 sm:ml-6' : ''}`}
        >
          {/* Node Header Row */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start space-x-2 min-w-0 flex-1">
              {/* Expand/Collapse Toggle */}
              {hasChildren ? (
                <button
                  onClick={() => onToggleExpand(rubric.id)}
                  className="p-1 rounded-md hover:bg-surface-subtle text-text-muted hover:text-text-primary transition-colors cursor-pointer shrink-0 mt-0.5"
                  title={isExpanded ? 'Collapse sub-rubrics' : 'Expand sub-rubrics'}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-primary-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="w-6 shrink-0" />
              )}

              {/* Rubric Title & Path */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-subtle border border-border-subtle text-text-muted">
                    L{rubric.depth || level + 1}
                  </span>
                  <span className="text-xs font-semibold text-text-primary leading-tight">
                    {rubric.path}
                  </span>
                  <span className="text-[11px] text-text-muted font-mono">
                    ({rubric.remedyCount} rem)
                  </span>
                </div>

                {/* Breadcrumbs for deep nodes */}
                {level > 0 && (
                  <p className="text-[10px] text-text-muted truncate mt-0.5">
                    {rubric.fullPath}
                  </p>
                )}
              </div>
            </div>

            {/* Action Button: Add to Case */}
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
            <div className="mt-2 pt-1.5 border-t border-border-subtle/80 flex flex-wrap gap-1 items-center">
              <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider mr-1">
                Rem:
              </span>
              {rubric.entries.slice(0, 8).map((entry: RubricRemedyEntry) => {
                const style = getGradeTypography(entry.grade);
                return (
                  <button
                    key={entry.remedyId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRemedy(entry.remedyId);
                    }}
                    className={`px-1 py-0.2 rounded bg-surface-subtle hover:bg-surface-elevated border border-border-subtle transition-colors cursor-pointer ${style.className}`}
                    title={`Grade ${entry.grade} - Click to inspect`}
                  >
                    {entry.abbreviation}
                    <span className="text-[8px] opacity-70 ml-0.5">({entry.grade})</span>
                  </button>
                );
              })}
              {rubric.entries.length > 8 && (
                <span className="text-[9px] text-text-muted font-mono">
                  +{rubric.entries.length - 8} more
                </span>
              )}
            </div>
          )}

          {/* Cross-References / 'See Also' Links */}
          {rubric.crossReferences && rubric.crossReferences.length > 0 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <Link2 className="w-3 h-3 text-text-muted shrink-0" />
              <span className="text-[9px] text-text-muted font-medium">See also:</span>
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

        {/* Recursive Children Rendering */}
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-primary-500/20 ml-3 pl-1 mb-2">
            {children.length > 0 ? (
              children.map((child) => renderNode(child, level + 1))
            ) : (
              <div className="ml-4 py-1 text-[11px] text-text-muted italic">
                Loading sub-rubrics...
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {treeNodes.map((rootNode) => renderNode(rootNode, 0))}
    </div>
  );
};
