import React, { useRef } from 'react';
import { Tag, Alert, Button } from 'antd';
import {
  ShieldAlert,
  Sparkles,
  X,
  Layers,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import type { RemedyComparisonSlot } from '../types';
import {
  buildDifferentialComparison,
  detectModalityContrasts,
} from '@/core/materia-medica/comparatorEngine';

interface MultiRemedyComparatorProps {
  slots: RemedyComparisonSlot[];
  onRemoveSlot: (remedyId: string) => void;
  onClearAll: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const MultiRemedyComparator: React.FC<MultiRemedyComparatorProps> = ({
  slots,
  onRemoveSlot,
  onClearAll,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (tableScrollRef.current) {
      if (typeof tableScrollRef.current.scrollBy === 'function') {
        tableScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      } else {
        tableScrollRef.current.scrollLeft -= 320;
      }
    }
  };

  const handleScrollRight = () => {
    if (tableScrollRef.current) {
      if (typeof tableScrollRef.current.scrollBy === 'function') {
        tableScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      } else {
        tableScrollRef.current.scrollLeft += 320;
      }
    }
  };

  if (slots.length < 2) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-surface-card border border-dashed border-border-default rounded-2xl text-center">
        <ArrowRightLeft className="w-10 h-10 text-text-muted mb-3 opacity-50" />
        <h3 className="text-base font-bold text-text-primary">Multi-Remedy Comparator Standby</h3>
        <p className="text-xs text-text-secondary max-w-md mt-1 mb-4">
          Select at least 2 remedies (up to 4) using the &quot;+ Compare&quot; button in the catalog to generate side-by-side differential comparisons.
        </p>
        <span className="text-xs text-text-muted">
          Currently comparing: {slots.length} / 4 remedies
        </span>
      </div>
    );
  }

  const comparison = buildDifferentialComparison(slots);
  const contrasts = detectModalityContrasts(slots);

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full bg-surface-card overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {onToggleSidebar && (
            <Button
              size="small"
              icon={
                isSidebarOpen ? (
                  <PanelLeftClose className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <PanelLeftOpen className="w-3.5 h-3.5 mr-1" />
                )
              }
              onClick={onToggleSidebar}
              className="border-border-subtle"
              title={isSidebarOpen ? 'Maximize Comparison View' : 'Show Remedy Catalog'}
            >
              <span className="hidden sm:inline">
                {isSidebarOpen ? 'Maximize View' : 'Show Catalog'}
              </span>
            </Button>
          )}
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Differential Remedy Comparator ({slots.length} of 4)
          </h2>
          <Tag color="blue" className="text-xs font-semibold">
            Scrollable Matrix
          </Tag>
        </div>

        <div className="flex items-center space-x-2">
          {/* Horizontal scroll helpers */}
          <div className="flex items-center space-x-1 bg-surface-subtle border border-border-subtle rounded-lg p-0.5">
            <span className="text-[11px] text-text-muted px-2 font-medium hidden md:inline">
              Scroll:
            </span>
            <Button
              type="text"
              size="small"
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
              onClick={handleScrollLeft}
              title="Scroll Columns Left"
            />
            <Button
              type="text"
              size="small"
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={handleScrollRight}
              title="Scroll Columns Right"
            />
          </div>

          <Button size="small" danger onClick={onClearAll}>
            Clear Comparison
          </Button>
        </div>
      </div>

      {/* Inimical Alert Caution Banner */}
      {comparison.inimicalConflicts.length > 0 && (
        <Alert
          type="error"
          showIcon
          icon={<ShieldAlert className="w-4 h-4 text-red-500" />}
          message="Inimical (Incompatible) Prescribing Conflict Detected"
          description={
            <div className="space-y-1 mt-1 text-xs">
              {comparison.inimicalConflicts.map((c, i) => (
                <div key={i} className="font-medium">
                  <span className="font-bold underline">{c.remedyA}</span> and{' '}
                  <span className="font-bold underline">{c.remedyB}</span>: {c.notes}
                </div>
              ))}
            </div>
          }
          className="rounded-xl border border-red-500/30"
        />
      )}

      {/* Complementary Synergism Banner */}
      {comparison.complementaryLinks.length > 0 && (
        <Alert
          type="success"
          showIcon
          icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
          message="Complementary Follow-Up Relationship Present"
          description={
            <div className="space-y-1 mt-1 text-xs">
              {comparison.complementaryLinks.map((c, i) => (
                <div key={i}>
                  <span className="font-bold">{c.remedyA}</span> ⇄{' '}
                  <span className="font-bold">{c.remedyB}</span>: {c.notes}
                </div>
              ))}
            </div>
          }
          className="rounded-xl border border-emerald-500/30"
        />
      )}

      {/* Contrasting Modalities Analysis Card */}
      <div className="p-4 rounded-xl border border-border-subtle bg-surface-subtle space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Key Modality Polarities
          </span>
        </div>

        <div className="space-y-2">
          {contrasts.map((c, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-surface-card border border-border-subtle text-xs">
              <span className="font-bold text-text-secondary block mb-1.5">{c.factor}:</span>
              <div
                className={`grid gap-2 ${
                  slots.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : slots.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {slots.map((s) => (
                  <div key={s.remedy.id} className="p-1.5 rounded bg-surface-subtle">
                    <span className="font-semibold text-primary-600 dark:text-primary-400 block text-[11px]">
                      {s.remedy.abbreviation}:
                    </span>
                    <span className="text-text-primary text-[11px]">
                      {c.descriptions[s.remedy.abbreviation] || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="border border-border-subtle rounded-2xl overflow-hidden shadow-xs bg-surface-card flex flex-col">
        {/* Table scroll helper header banner */}
        <div className="px-4 py-2.5 bg-surface-subtle/80 border-b border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
          <span className="font-medium">
            Comparing <strong className="text-text-primary">{slots.map((s) => s.remedy.abbreviation).join(', ')}</strong> side-by-side
          </span>
          <span className="text-[11px] text-text-muted hidden sm:inline">
            ⇄ Scroll horizontally or use arrows above to inspect remedies
          </span>
        </div>

        {/* Scrollable table container */}
        <div
          ref={tableScrollRef}
          className="overflow-x-auto scrollbar-thin focus:outline-none"
          tabIndex={0}
        >
          <table className="w-full text-left border-collapse text-xs min-w-max">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-subtle">
                <th className="p-3 font-semibold text-text-secondary w-[180px] min-w-[180px] max-w-[180px] sticky left-0 top-0 z-30 bg-surface-card border-r border-border-subtle shadow-xs">
                  Clinical Section
                </th>
                {slots.map((slot) => (
                  <th
                    key={slot.remedy.id}
                    className="p-3 font-semibold text-text-primary min-w-[280px] max-w-[340px] border-r border-border-subtle/60 sticky top-0 z-20 bg-surface-subtle"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm text-primary-600 dark:text-primary-400 block">
                          {slot.remedy.abbreviation}
                        </span>
                        <span className="text-[11px] text-text-muted truncate block max-w-[220px]">
                          {slot.remedy.fullName}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Tag className="text-[10px] m-0">{slot.remedy.kingdom}</Tag>
                          <Tag className="text-[10px] m-0">{slot.remedy.thermal}</Tag>
                          <Tag className="text-[10px] m-0">{slot.remedy.miasm}</Tag>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveSlot(slot.remedy.id)}
                        className="p-1 rounded text-text-muted hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {/* Row 1: Keynotes */}
              <tr className="hover:bg-surface-subtle/30 transition-colors">
                <td className="p-3 font-bold text-text-secondary align-top sticky left-0 z-10 bg-surface-card w-[180px] min-w-[180px] max-w-[180px] border-r border-border-subtle shadow-xs">
                  Keynotes
                </td>
                {slots.map((s) => (
                  <td key={s.remedy.id} className="p-3 align-top leading-relaxed text-text-primary min-w-[280px] max-w-[340px] border-r border-border-subtle/40">
                    {s.monograph?.keynotes || s.remedy.shortKeynotes}
                  </td>
                ))}
              </tr>

              {/* Row 2: Mind */}
              <tr className="hover:bg-surface-subtle/30 transition-colors">
                <td className="p-3 font-bold text-text-secondary align-top sticky left-0 z-10 bg-surface-card w-[180px] min-w-[180px] max-w-[180px] border-r border-border-subtle shadow-xs">
                  Mind & Emotion
                </td>
                {slots.map((s) => (
                  <td key={s.remedy.id} className="p-3 align-top leading-relaxed text-text-primary min-w-[280px] max-w-[340px] border-r border-border-subtle/40">
                    {s.monograph?.mind || 'No mental picture recorded.'}
                  </td>
                ))}
              </tr>

              {/* Row 3: Modalities Aggravation */}
              <tr className="hover:bg-surface-subtle/30 transition-colors">
                <td className="p-3 font-bold text-red-600 dark:text-red-400 align-top sticky left-0 z-10 bg-surface-card w-[180px] min-w-[180px] max-w-[180px] border-r border-border-subtle shadow-xs">
                  &lt; Aggravation
                </td>
                {slots.map((s) => (
                  <td key={s.remedy.id} className="p-3 align-top text-text-primary min-w-[280px] max-w-[340px] border-r border-border-subtle/40">
                    <ul className="space-y-1">
                      {(s.monograph?.modalitiesAgg || []).map((m, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 4: Modalities Amelioration */}
              <tr className="hover:bg-surface-subtle/30 transition-colors">
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 align-top sticky left-0 z-10 bg-surface-card w-[180px] min-w-[180px] max-w-[180px] border-r border-border-subtle shadow-xs">
                  &gt; Amelioration
                </td>
                {slots.map((s) => (
                  <td key={s.remedy.id} className="p-3 align-top text-text-primary min-w-[280px] max-w-[340px] border-r border-border-subtle/40">
                    <ul className="space-y-1">
                      {(s.monograph?.modalitiesAmel || []).map((m, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Row 5: Organ Affinities */}
              <tr className="hover:bg-surface-subtle/30 transition-colors">
                <td className="p-3 font-bold text-text-secondary align-top sticky left-0 z-10 bg-surface-card w-[180px] min-w-[180px] max-w-[180px] border-r border-border-subtle shadow-xs">
                  Organ Affinities
                </td>
                {slots.map((s) => (
                  <td key={s.remedy.id} className="p-3 align-top min-w-[280px] max-w-[340px] border-r border-border-subtle/40">
                    <div className="flex flex-wrap gap-1">
                      {(s.monograph?.organAffinities || []).map((aff, i) => (
                        <Tag key={i} className="text-[10px] m-0 bg-surface-subtle border-border-subtle">
                          {aff}
                        </Tag>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
