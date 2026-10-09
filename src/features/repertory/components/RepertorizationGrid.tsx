import React from 'react';
import { Tag, Tooltip } from 'antd';
import { Layers } from 'lucide-react';
import type { ActiveCaseRubric, RepertorizationResultItem } from '../types';

interface RepertorizationGridProps {
  rankedRemedies: RepertorizationResultItem[];
  activeRubrics: ActiveCaseRubric[];
  onSelectRemedy: (remedyId: string) => void;
}

function getGradeBadge(grade: number | undefined): React.ReactNode {
  if (!grade) {
    return <span className="text-border-default select-none">·</span>;
  }

  switch (grade) {
    case 4:
      return (
        <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
          4
        </span>
      );
    case 3:
      return (
        <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-xs bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/30">
          3
        </span>
      );
    case 2:
      return (
        <span className="w-5 h-5 rounded flex items-center justify-center font-medium text-xs bg-surface-subtle text-text-primary border border-border-subtle">
          2
        </span>
      );
    default:
      return (
        <span className="w-5 h-5 rounded flex items-center justify-center text-xs text-text-muted">
          1
        </span>
      );
  }
}

export const RepertorizationGrid: React.FC<RepertorizationGridProps> = ({
  rankedRemedies,
  activeRubrics,
  onSelectRemedy,
}) => {
  if (activeRubrics.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border-default rounded-2xl bg-surface-card flex flex-col items-center justify-center">
        <Layers className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <h4 className="text-sm font-semibold text-text-primary">Repertorization Matrix Standby</h4>
        <p className="text-xs text-text-secondary max-w-sm mt-1">
          Add rubrics from the catalog to generate the instant remedy comparison grid.
        </p>
      </div>
    );
  }

  if (rankedRemedies.length === 0) {
    return (
      <div className="py-16 text-center border border-border-subtle rounded-2xl bg-surface-card">
        <p className="text-sm font-semibold text-text-primary">No Qualifying Remedies Found</p>
        <p className="text-xs text-text-muted mt-1">
          Active elimination filters or required rubrics excluded all candidates. Try loosening constraints.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border-subtle rounded-2xl bg-surface-card overflow-hidden shadow-xs">
      <div className="p-3 border-b border-border-subtle flex items-center justify-between bg-surface-subtle/50">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Repertorization Grid
          </span>
          <Tag color="cyan" className="text-[11px] font-mono m-0">
            {rankedRemedies.length} remedies qualified
          </Tag>
        </div>
        <span className="text-xs text-text-muted">Click any remedy abbreviation for keynotes</span>
      </div>

      <div className="overflow-x-auto max-h-[460px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-subtle sticky top-0 z-10 shadow-xs">
              {/* Sticky Left Column: Rubric Description */}
              <th className="p-3 font-semibold text-text-secondary min-w-[260px] sticky left-0 bg-surface-subtle z-20 border-r border-border-subtle">
                Recorded Rubric & Weight
              </th>

              {/* Remedy Columns */}
              {rankedRemedies.map((item, idx) => (
                <th
                  key={item.remedy.id}
                  className={`p-2.5 text-center min-w-[76px] cursor-pointer hover:bg-surface-elevated transition-colors border-r border-border-subtle/60 ${
                    idx === 0 ? 'bg-primary-500/10' : ''
                  }`}
                  onClick={() => onSelectRemedy(item.remedy.id)}
                >
                  <Tooltip title={`${item.remedy.fullName} (${item.remedy.kingdom}) • Click for Keynotes`}>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-xs text-primary-600 dark:text-primary-400 truncate max-w-[70px]">
                        {item.remedy.abbreviation}
                      </span>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="px-1.5 py-0.2 rounded font-mono font-bold text-[10px] bg-primary-500 text-white">
                          {item.totalScore}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {item.coverageCount}/{activeRubrics.length}
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle/60">
            {activeRubrics.map((rubric) => (
              <tr key={rubric.rubricId} className="hover:bg-surface-subtle/40 transition-colors">
                {/* Sticky Left Cell: Rubric Path */}
                <td className="p-3 sticky left-0 bg-surface-card z-10 border-r border-border-subtle">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-text-primary line-clamp-2 text-xs" title={rubric.fullPath}>
                      {rubric.fullPath}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-subtle text-text-muted shrink-0">
                      x{rubric.weight}
                    </span>
                  </div>
                </td>

                {/* Remedy Matrix Cells */}
                {rankedRemedies.map((item) => {
                  const grade = item.grades[rubric.rubricId];
                  return (
                    <td
                      key={item.remedy.id}
                      className="p-2 text-center border-r border-border-subtle/40"
                    >
                      <div className="flex items-center justify-center">
                        {getGradeBadge(grade)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
