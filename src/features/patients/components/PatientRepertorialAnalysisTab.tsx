import React, { useState, useEffect } from 'react';
import { Button, Tag, Card, Popconfirm, Empty, message } from 'antd';
import {
  Compass,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  Scale,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setActivePatientCaseAnalyses,
  removeCaseAnalysis,
  setCaseFileOpen,
} from '@/app/store/slices/patientSlice';
import { loadClipboardSession } from '@/app/store/slices/repertorizationSlice';
import {
  getLocalCaseAnalyses,
  deleteLocalCaseAnalysis,
} from '@/core/storage/indexedDbPatients';
import { ROUTES } from '@/core/config/constants';
import type { CaseRepertorialAnalysis } from '@/features/patients/types';
import type { ActiveCaseRubric, ScoringModel } from '@/features/repertory/types';

interface PatientRepertorialAnalysisTabProps {
  patientId: string;
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

export const PatientRepertorialAnalysisTab: React.FC<PatientRepertorialAnalysisTabProps> = ({
  patientId,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const analyses = useAppSelector(
    (state) => state.patients.activePatientCaseAnalyses
  );
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getLocalCaseAnalyses(patientId)
      .then((data) => {
        if (mounted) {
          dispatch(setActivePatientCaseAnalyses(data));
          setSelectedAnalysisId((prev) => (prev && data.some((d) => d.id === prev) ? prev : (data[0]?.id || null)));
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [patientId, dispatch]);

  const selectedAnalysis =
    analyses.find((a) => a.id === selectedAnalysisId) || analyses[0] || null;

  const handleLoadIntoRepertory = (analysis: CaseRepertorialAnalysis) => {
    const activeRubrics: ActiveCaseRubric[] = analysis.rubrics.map((r) => ({
      rubricId: r.rubricId,
      fullPath: r.fullPath,
      chapterName: r.chapterName,
      weight: r.weight,
      isEliminating: r.isEliminating,
    }));

    dispatch(
      loadClipboardSession({
        activeRubrics,
        scoringModel: analysis.scoringModel as ScoringModel,
        selectedRepertoryId: analysis.repertoryId,
      })
    );

    dispatch(setCaseFileOpen(false));
    navigate(ROUTES.REPERTORY);
    message.success(`Loaded "${analysis.title}" into active Repertory Workspace.`);
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await deleteLocalCaseAnalysis(id);
      dispatch(removeCaseAnalysis(id));
      if (selectedAnalysisId === id) {
        const remaining = analyses.filter((a) => a.id !== id);
        setSelectedAnalysisId(remaining.length > 0 ? remaining[0].id : null);
      }
      message.success('Repertorial analysis record deleted.');
    } catch {
      message.error('Failed to delete analysis.');
    }
  };

  if (!isLoading && analyses.length === 0) {
    return (
      <Empty
        image={<Compass className="w-12 h-12 text-primary-500/40 mx-auto mb-2" />}
        description={
          <div>
            <div className="font-semibold text-text-primary text-xs">
              No Repertorial Totality Analyses Saved
            </div>
            <p className="text-[11px] text-text-muted mt-1 max-w-sm mx-auto">
              You can build symptom totalities in the Repertory Workspace and click &quot;Save Analysis to Patient Case&quot; to link the full matrix here.
            </p>
          </div>
        }
        className="py-12"
      >
        <Button
          type="primary"
          icon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={() => {
            dispatch(setCaseFileOpen(false));
            navigate(ROUTES.REPERTORY);
          }}
          className="rounded-lg text-xs"
        >
          Open Repertory Workspace
        </Button>
      </Empty>
    );
  }

  return (
    <div className="py-2 space-y-4">
      {/* Analysis Selector Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border-subtle">
        {analyses.map((a) => {
          const isSelected = selectedAnalysis?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setSelectedAnalysisId(a.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-surface-subtle text-text-secondary hover:text-text-primary border-border-subtle hover:bg-surface-card'
              }`}
            >
              <Calendar className="w-3 h-3 opacity-80" />
              <span>{a.title}</span>
              <span className="text-[10px] opacity-75 font-mono">
                ({new Date(a.analysisDate).toLocaleDateString()})
              </span>
            </button>
          );
        })}
      </div>

      {selectedAnalysis && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Action Card */}
          <Card className="border-border-subtle shadow-2xs rounded-2xl bg-surface-card" size="small">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-primary-500 shrink-0" />
                  <h4 className="text-sm font-bold text-text-primary m-0">
                    {selectedAnalysis.title}
                  </h4>
                  <Tag color="blue" className="text-[10px] m-0">
                    {selectedAnalysis.rubrics.length} rubrics
                  </Tag>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-muted mt-1">
                  <span>Repertory: <b>{selectedAnalysis.repertoryName}</b></span>
                  <span>•</span>
                  <span>Model: <b>{selectedAnalysis.scoringModel.replace(/_/g, ' ')}</b></span>
                  <span>•</span>
                  <span>Date: <b>{new Date(selectedAnalysis.analysisDate).toLocaleString()}</b></span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Button
                  type="primary"
                  icon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={() => handleLoadIntoRepertory(selectedAnalysis)}
                  className="rounded-lg text-xs"
                >
                  Open in Repertory Workspace
                </Button>
                <Popconfirm
                  title="Delete this repertorial analysis?"
                  onConfirm={() => handleDeleteAnalysis(selectedAnalysis.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    className="rounded-lg text-xs"
                  />
                </Popconfirm>
              </div>
            </div>
          </Card>

          {/* Rubrics in Totality Chips */}
          <div>
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-primary-500" />
              <span>Rubrics in Totality ({selectedAnalysis.rubrics.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedAnalysis.rubrics.map((r) => (
                <div
                  key={r.rubricId}
                  className="p-1.5 px-2.5 rounded-lg border border-border-subtle bg-surface-subtle text-xs flex items-center space-x-2"
                >
                  <span className="font-medium text-text-primary">{r.fullPath}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-surface-card border border-border-subtle text-text-muted">
                    {r.weight}×
                  </span>
                  {r.isEliminating && (
                    <Tag color="error" className="text-[9px] m-0">Eliminating</Tag>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Repertorization Matrix Table */}
          {selectedAnalysis.rankedRemedies?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-primary-500" />
                <span>Repertorial Totality Matrix (Top Candidate Remedies)</span>
              </div>

              <div className="overflow-x-auto border border-border-subtle rounded-xl bg-surface-card shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-subtle">
                      <th className="p-2.5 font-semibold text-text-secondary min-w-[200px] border-r border-border-subtle">
                        Symptom Rubric
                      </th>
                      {selectedAnalysis.rankedRemedies.map((rem, idx) => (
                        <th
                          key={rem.remedyId}
                          className={`p-2.5 text-center min-w-[80px] border-r border-border-subtle last:border-r-0 ${
                            idx === 0 ? 'bg-primary-500/10' : ''
                          }`}
                        >
                          <div className="font-bold text-text-primary text-xs">
                            {rem.abbreviation}
                          </div>
                          <div className="text-[10px] font-mono text-primary-600 dark:text-primary-400 mt-0.5">
                            {rem.coverageCount}/{selectedAnalysis.rubrics.length} ({rem.totalScore}p)
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {selectedAnalysis.rubrics.map((rubric) => (
                      <tr key={rubric.rubricId} className="hover:bg-surface-subtle/50 transition-colors">
                        <td className="p-2 font-medium text-text-primary border-r border-border-subtle">
                          <div className="truncate max-w-[280px]" title={rubric.fullPath}>
                            {rubric.fullPath}
                          </div>
                        </td>
                        {selectedAnalysis.rankedRemedies.map((rem, idx) => {
                          const grade = rem.rubricGrades?.[rubric.rubricId] || 0;
                          const typo = getGradeTypography(grade);
                          return (
                            <td
                              key={rem.remedyId}
                              className={`p-2 text-center border-r border-border-subtle last:border-r-0 ${
                                idx === 0 ? 'bg-primary-500/5' : ''
                              }`}
                            >
                              {grade > 0 ? (
                                <span className={`inline-block px-1.5 py-0.5 rounded bg-surface-subtle ${typo.className}`}>
                                  {grade}
                                </span>
                              ) : (
                                <span className="text-text-muted text-[10px]">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Polarity Analysis Snapshot (if present) */}
          {selectedAnalysis.polarityAnalysis &&
            selectedAnalysis.polarityAnalysis.evaluatedPairCount > 0 &&
            Boolean(selectedAnalysis.polarityAnalysis.topRemedies?.length) && (
            <Card className="border-border-subtle rounded-xl bg-surface-subtle/50" size="small">
              <div className="flex items-center space-x-2 text-xs font-semibold text-text-primary mb-2">
                <Compass className="w-3.5 h-3.5 text-primary-500" />
                <span>Boenninghausen Polarity Analysis Summary</span>
                <Tag color="blue" className="text-[10px] m-0">
                  {selectedAnalysis.polarityAnalysis.evaluatedPairCount} polar pairs
                </Tag>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(selectedAnalysis.polarityAnalysis.topRemedies || []).map((pr) => (
                  <div key={pr.remedyId} className="p-2 rounded-lg bg-surface-card border border-border-subtle">
                    <div className="font-bold text-text-primary">{pr.abbreviation}</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      PD: <b className={pr.polarityDifference > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {pr.polarityDifference > 0 ? `+${pr.polarityDifference}` : pr.polarityDifference}
                      </b>
                    </div>
                    {pr.isContraindicated && (
                      <Tag color="error" className="text-[9px] mt-1 m-0">Contraindicated</Tag>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Clinical Notes */}
          {selectedAnalysis.notes && (
            <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs">
              <span className="font-semibold text-text-secondary block mb-1">
                Clinical Prescription Rationale:
              </span>
              <p className="text-text-primary m-0 leading-relaxed italic">
                &ldquo;{selectedAnalysis.notes}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
