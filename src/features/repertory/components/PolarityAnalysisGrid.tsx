import React, { useState } from 'react';
import { Tag, Tooltip, Alert, Button, Modal } from 'antd';
import { Compass, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { PolarityRemedyResult } from '../types';

interface PolarityAnalysisGridProps {
  rankedRemedies: PolarityRemedyResult[];
  evaluatedPairCount: number;
  benchmarkMs: number;
  onSelectRemedy: (remedyId: string) => void;
}

export const PolarityAnalysisGrid: React.FC<PolarityAnalysisGridProps> = ({
  rankedRemedies,
  evaluatedPairCount,
  benchmarkMs,
  onSelectRemedy,
}) => {
  const [inspectRemedy, setInspectRemedy] = useState<PolarityRemedyResult | null>(null);

  if (evaluatedPairCount === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border-default rounded-2xl bg-surface-card flex flex-col items-center justify-center p-6">
        <Compass className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <h4 className="text-sm font-semibold text-text-primary">
          No Polar Symptoms Detected in Case Clipboard
        </h4>
        <p className="text-xs text-text-secondary max-w-md mt-1 mb-3 leading-relaxed">
          Boenninghausen Polarity Analysis requires polar symptoms (such as &lt; Cold vs &lt; Warmth, &lt; Motion vs &lt; Rest, or &gt; Open air).
          Add modal polar symptoms to your case clipboard to trigger polarity calculation.
        </p>
      </div>
    );
  }

  if (rankedRemedies.length === 0) {
    return (
      <div className="py-16 text-center border border-border-subtle rounded-2xl bg-surface-card p-6">
        <p className="text-sm font-semibold text-text-primary">No Remedies Matched Active Polarities</p>
        <p className="text-xs text-text-muted mt-1">
          None of the candidate remedies have provings recorded for the currently active polar symptom pairs.
        </p>
      </div>
    );
  }

  const contraindicatedCount = rankedRemedies.filter((r) => r.isContraindicated).length;

  return (
    <div className="border border-border-subtle rounded-2xl bg-surface-card overflow-hidden shadow-xs space-y-0">
      {/* Top Method Info Banner */}
      <div className="p-4 border-b border-border-subtle bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-primary-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Boenninghausen Polarity Analysis (Dr. Heiner Frei Method)
            </h3>
            <Tag color="blue" className="text-[11px] font-mono m-0">
              {evaluatedPairCount} polar pairs active
            </Tag>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Polarity Difference (PD) = Positive Polar Score (+) − Contrary Contraindication Penalty (−). High PD indicates specific clinical similimum.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-text-muted">
          <span>{benchmarkMs} ms</span>
          {contraindicatedCount > 0 && (
            <Tag color="error" className="m-0 font-medium">
              {contraindicatedCount} Contraindicated
            </Tag>
          )}
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-subtle sticky top-0 z-10 shadow-xs">
              <th className="p-3 font-semibold text-text-secondary w-16 text-center">Rank</th>
              <th className="p-3 font-semibold text-text-secondary min-w-[200px]">Remedy</th>
              <th className="p-3 font-semibold text-text-secondary text-center w-28">Polar Match (+)</th>
              <th className="p-3 font-semibold text-text-secondary text-center w-32">Contraindication (−)</th>
              <th className="p-3 font-semibold text-text-secondary text-center w-28">Polarity Diff (PD)</th>
              <th className="p-3 font-semibold text-text-secondary min-w-[220px]">Clinical Status</th>
              <th className="p-3 font-semibold text-text-secondary text-right w-24">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {rankedRemedies.map((item, idx) => {
              const isTop = idx === 0 && !item.isContraindicated;

              return (
                <tr
                  key={item.remedy.id}
                  className={`hover:bg-surface-subtle/50 transition-colors ${
                    item.isContraindicated
                      ? 'bg-red-500/5 dark:bg-red-500/10'
                      : isTop
                      ? 'bg-primary-500/5 dark:bg-primary-500/10'
                      : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="p-3 text-center font-mono font-bold text-text-muted">
                    #{idx + 1}
                  </td>

                  {/* Remedy Name */}
                  <td className="p-3">
                    <button
                      onClick={() => onSelectRemedy(item.remedy.id)}
                      className="text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-primary-600 dark:text-primary-400 group-hover:underline">
                          {item.remedy.abbreviation}
                        </span>
                        <Tag className="text-[10px] m-0">{item.remedy.thermal}</Tag>
                      </div>
                      <span className="text-[11px] text-text-muted block truncate max-w-[190px]">
                        {item.remedy.fullName}
                      </span>
                    </button>
                  </td>

                  {/* Polar Positive Score */}
                  <td className="p-3 text-center">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{item.polarScore}
                    </span>
                    <span className="text-[11px] text-text-muted block">
                      ({item.polarCount} symptoms)
                    </span>
                  </td>

                  {/* Contraindication Score */}
                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold ${
                        item.contraindicationScore > 0
                          ? 'text-red-500 font-bold'
                          : 'text-text-muted'
                      }`}
                    >
                      {item.contraindicationScore > 0 ? `−${item.contraindicationScore}` : '0'}
                    </span>
                    <span className="text-[11px] text-text-muted block">
                      ({item.contraindicationCount} contrary)
                    </span>
                  </td>

                  {/* Polarity Difference (PD) */}
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                        item.polarityDifference > 0
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : item.polarityDifference < 0
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : 'bg-surface-subtle text-text-secondary border border-border-subtle'
                      }`}
                    >
                      {item.polarityDifference > 0 ? `+${item.polarityDifference}` : item.polarityDifference}
                    </span>
                  </td>

                  {/* Clinical Status / Warnings */}
                  <td className="p-3">
                    {item.isContraindicated ? (
                      <Tooltip
                        title={
                          item.contraindicationWarnings.join('; ') ||
                          'Negative Polarity Difference indicates remedy polarities oppose patient state.'
                        }
                      >
                        <Tag
                          color="error"
                          icon={<AlertTriangle className="w-3 h-3 mr-1 inline" />}
                          className="text-[11px] font-semibold cursor-help m-0"
                        >
                          Contraindicated ⚠️
                        </Tag>
                      </Tooltip>
                    ) : (
                      <Tag
                        color="success"
                        icon={<CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                        className="text-[11px] font-semibold m-0"
                      >
                        Clinically Favorable
                      </Tag>
                    )}
                  </td>

                  {/* Details Button */}
                  <td className="p-3 text-right">
                    <Button
                      size="small"
                      type="text"
                      icon={<ChevronRight className="w-3.5 h-3.5" />}
                      onClick={() => setInspectRemedy(item)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Breakdown Modal */}
      {inspectRemedy && (
        <Modal
          open={Boolean(inspectRemedy)}
          onCancel={() => setInspectRemedy(null)}
          footer={null}
          title={
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-primary-500" />
              <span>
                Polarity Breakdown: {inspectRemedy.remedy.fullName} ({inspectRemedy.remedy.abbreviation})
              </span>
            </div>
          }
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[11px] text-text-muted block">Polar Score (+)</span>
                <span className="text-base font-bold text-emerald-600">+{inspectRemedy.polarScore}</span>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-[11px] text-text-muted block">Contraindication (−)</span>
                <span className="text-base font-bold text-red-500">−{inspectRemedy.contraindicationScore}</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-subtle border border-border-subtle">
                <span className="text-[11px] text-text-muted block">Net Difference (PD)</span>
                <span className="text-base font-bold font-mono">
                  {inspectRemedy.polarityDifference > 0
                    ? `+${inspectRemedy.polarityDifference}`
                    : inspectRemedy.polarityDifference}
                </span>
              </div>
            </div>

            {inspectRemedy.contraindicationWarnings.length > 0 && (
              <Alert
                type="error"
                showIcon
                message="Polar Contraindications"
                description={
                  <ul className="text-xs list-disc list-inside space-y-1 mt-1">
                    {inspectRemedy.contraindicationWarnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                }
              />
            )}

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Polar Symptom Pairs Analysis
              </h4>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {inspectRemedy.matchedPairs.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs space-y-1"
                  >
                    <span className="font-semibold text-text-primary block">{p.pairName}:</span>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {p.positiveLabel}: <strong>Grade {p.positiveGrade || 0}</strong>
                      </span>
                      <span className="text-red-500">
                        {p.oppositeLabel}: <strong>Grade {p.oppositeGrade || 0}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
