import React from 'react';
import { Segmented, Tooltip } from 'antd';
import { Zap, RotateCcw } from 'lucide-react';
import type {
  FilterCriteria,
  MiasmType,
  RemedyKingdom,
  ScoringModel,
  ThermalState,
} from '../types';

interface FilterToolbarProps {
  filters: FilterCriteria;
  scoringModel: ScoringModel;
  benchmarkMs: number;
  qualifyingCount: number;
  totalEvaluated: number;
  onToggleThermal: (thermal: ThermalState) => void;
  onToggleMiasm: (miasm: MiasmType) => void;
  onToggleKingdom: (kingdom: RemedyKingdom) => void;
  onSetScoringModel: (model: ScoringModel) => void;
  onClearFilters: () => void;
}

const THERMAL_OPTIONS: ThermalState[] = ['Chilly', 'Hot', 'Ambithermal'];
const MIASM_OPTIONS: MiasmType[] = ['Psora', 'Sycosis', 'Syphilis', 'Tubercular'];
const KINGDOM_OPTIONS: RemedyKingdom[] = ['Plant', 'Mineral', 'Animal', 'Nosode'];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  scoringModel,
  benchmarkMs,
  qualifyingCount,
  totalEvaluated,
  onToggleThermal,
  onToggleMiasm,
  onToggleKingdom,
  onSetScoringModel,
  onClearFilters,
}) => {
  const hasActiveFilters =
    filters.thermals.length > 0 ||
    filters.miasms.length > 0 ||
    filters.kingdoms.length > 0;

  return (
    <div className="p-3 rounded-2xl border border-border-subtle bg-surface-card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Scoring Strategy:
          </span>
          <Segmented<ScoringModel>
            value={scoringModel}
            onChange={(val) => onSetScoringModel(val)}
            options={[
              { label: 'Coverage First (Kent)', value: 'coverage_first' },
              { label: 'Weighted Sum', value: 'weighted_sum' },
            ]}
            size="small"
          />
        </div>

        {/* Worker Performance Benchmark Pill */}
        <div className="flex items-center space-x-2">
          <Tooltip title={`Worker computed ${qualifyingCount} qualifying remedies from ${totalEvaluated} candidates in ${benchmarkMs}ms.`}>
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] bg-primary-500/10 text-primary-600 dark:text-primary-400 font-mono font-medium border border-primary-500/20">
              <Zap className="w-3 h-3 text-primary-500" />
              <span>{benchmarkMs}ms (Worker)</span>
            </div>
          </Tooltip>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-text-muted hover:text-red-500 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Strategic Filters Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {/* Thermal Group */}
        <div className="flex items-center space-x-1.5">
          <span className="text-text-muted font-medium">Thermal:</span>
          {THERMAL_OPTIONS.map((th) => {
            const active = filters.thermals.includes(th);
            return (
              <button
                key={th}
                onClick={() => onToggleThermal(th)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-primary-500 text-white border-primary-500 font-semibold'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-subtle'
                }`}
              >
                {th}
              </button>
            );
          })}
        </div>

        {/* Miasm Group */}
        <div className="flex items-center space-x-1.5">
          <span className="text-text-muted font-medium">Miasm:</span>
          {MIASM_OPTIONS.map((m) => {
            const active = filters.miasms.includes(m);
            return (
              <button
                key={m}
                onClick={() => onToggleMiasm(m)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-subtle'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Kingdom Group */}
        <div className="flex items-center space-x-1.5">
          <span className="text-text-muted font-medium">Kingdom:</span>
          {KINGDOM_OPTIONS.map((k) => {
            const active = filters.kingdoms.includes(k);
            return (
              <button
                key={k}
                onClick={() => onToggleKingdom(k)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                  active
                    ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                    : 'border-border-subtle text-text-secondary hover:bg-surface-subtle'
                }`}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
