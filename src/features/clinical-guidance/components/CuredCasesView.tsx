import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  ClipboardCopy,
  CheckCircle,
  KeyRound,
  ShieldCheck,
  User,
} from 'lucide-react';
import { message, Modal } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setCasesSearchQuery,
  setCasesOrganFilter,
} from '@/app/store/slices/clinicalGuidanceSlice';
import { addRubric } from '@/app/store/slices/repertorizationSlice';
import { setSearchTerm, setViewMode } from '@/app/store/slices/materiaMedicaSlice';
import { getLocalCuredCases } from '@/core/storage/indexedDbClinicalGuidance';
import { ROUTES } from '@/core/config/constants';
import type { CuredCase, OrganSystem } from '../types';

const CASE_ORGAN_SYSTEMS: OrganSystem[] = [
  'All',
  'Respiratory',
  'Nervous System',
  'Genitourinary',
  'Dermatology',
];

export const CuredCasesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = useAppSelector((state) => state.clinicalGuidance.casesSearchQuery);
  const organFilter = useAppSelector((state) => state.clinicalGuidance.casesOrganFilter);
  const clipboardRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  const [cases, setCases] = useState<CuredCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<CuredCase | null>(null);
  const [exportedCaseId, setExportedCaseId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getLocalCuredCases({
      searchQuery,
      organSystem: organFilter,
    }).then((data) => {
      if (mounted) setCases(data);
    });
    return () => {
      mounted = false;
    };
  }, [searchQuery, organFilter]);

  const handleExportRubrics = (c: CuredCase) => {
    let addedCount = 0;
    c.symptomTotality.forEach((rubricStr, index) => {
      // Split rubric string format "Chapter - Rubric Name - Subrubric"
      const parts = rubricStr.split(' - ');
      const chapterName = parts[0] || 'Generalities';
      const rubricName = parts.slice(1).join(' - ') || rubricStr;
      const rubricId = `cured-case-${c.id}-r${index}`;

      const exists = clipboardRubrics.some((r) => r.rubricId === rubricId);
      if (!exists) {
        dispatch(
          addRubric({
            id: rubricId,
            chapterId: chapterName.toLowerCase(),
            chapterName,
            path: rubricName,
            fullPath: rubricStr,
            depth: 1,
            remedyCount: 20,
            entries: [],
          })
        );
        addedCount++;
      }
    });

    setExportedCaseId(c.id);
    message.success({
      content: `${addedCount} rubrics from "${c.title}" exported to Case Clipboard!`,
      duration: 3,
    });
    setTimeout(() => setExportedCaseId(null), 3000);
  };

  const handleInspectRemedy = (remedyName: string) => {
    dispatch(setSearchTerm(remedyName));
    dispatch(setViewMode('monograph'));
    navigate(ROUTES.MATERIA_MEDICA);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Organ Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search cases by diagnosis, remedy, author, or totality..."
            value={searchQuery}
            onChange={(e) => dispatch(setCasesSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-card border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {CASE_ORGAN_SYSTEMS.map((system) => {
            const isSelected = (!organFilter && system === 'All') || organFilter === system;
            return (
              <button
                key={system}
                onClick={() => dispatch(setCasesOrganFilter(system === 'All' ? null : system))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-surface-card text-text-secondary border border-border-subtle hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                {system}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cured Cases Cards */}
      {cases.length === 0 ? (
        <div className="p-12 text-center bg-surface-card border border-border-subtle rounded-2xl">
          <FileText className="w-10 h-10 mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-text-primary">No Cured Cases Found</h3>
          <p className="text-sm text-text-secondary mt-1">
            Try adjusting your search criteria or resetting the organ system filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-surface-card border border-border-subtle hover:border-primary-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md group"
            >
              <div className="space-y-3">
                {/* Header: Title and Author */}
                <div>
                  <span className="text-[11px] font-semibold text-primary-500 tracking-wide uppercase">
                    {c.author}
                  </span>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary-500 transition-colors leading-snug mt-0.5">
                    {c.title}
                  </h3>
                </div>

                {/* Patient Profile & Diagnosis */}
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span>{c.patientAgeGroup}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle">
                  <span className="text-[11px] text-text-muted font-medium block">
                    Clinical Diagnosis
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    {c.clinicalDiagnosis}
                  </span>
                </div>

                {/* Key Prescribing Clue Callout */}
                <div className="p-3 rounded-xl bg-status-warning/10 border border-status-warning/20">
                  <div className="flex items-center gap-1.5 text-status-warning text-xs font-semibold mb-1">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Prescribing Keynote Clue</span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {c.keyPrescribingClue}
                  </p>
                </div>

                {/* Prescribed Remedy Badge */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-text-muted text-[11px] block">Prescription</span>
                    <span className="font-bold text-sm text-text-primary">
                      {c.remedyPrescribed}
                    </span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary-500/10 text-primary-500 border border-primary-500/20">
                    {c.potencyAndDosage}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between gap-2">
                <button
                  onClick={() => handleExportRubrics(c)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    exportedCaseId === c.id
                      ? 'bg-status-success text-white'
                      : 'bg-surface-subtle text-text-primary border border-border-subtle hover:bg-primary-500/10 hover:text-primary-500 hover:border-primary-500/20'
                  }`}
                  title="Export Totality to Case Clipboard"
                >
                  {exportedCaseId === c.id ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Exported</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5" />
                      <span>Export Rubrics</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedCase(c)}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Anamnesis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Details Anamnesis Modal */}
      <Modal
        open={!!selectedCase}
        onCancel={() => setSelectedCase(null)}
        footer={null}
        width={680}
        centered
        title={
          selectedCase && (
            <div className="pr-6">
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider block">
                {selectedCase.author} • {selectedCase.patientAgeGroup}
              </span>
              <h2 className="text-lg font-bold text-text-primary leading-tight mt-0.5">
                {selectedCase.title}
              </h2>
            </div>
          )
        }
      >
        {selectedCase && (
          <div className="space-y-5 pt-3">
            {/* Clinical Diagnosis & Prescribing Clue */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
              <div className="text-xs">
                <span className="text-text-muted font-medium">Diagnosis: </span>
                <span className="font-semibold text-text-primary">
                  {selectedCase.clinicalDiagnosis} ({selectedCase.organSystem})
                </span>
              </div>
              <div className="text-xs">
                <span className="text-status-warning font-semibold flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  Pivotal Turnaround Clue:
                </span>
                <p className="text-text-secondary leading-relaxed pl-5 italic">
                  &ldquo;{selectedCase.keyPrescribingClue}&rdquo;
                </p>
              </div>
            </div>

            {/* Baseline Anamnesis / Initial Symptoms */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                Initial Anamnesis & Baseline Symptoms
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface-card p-4 rounded-xl border border-border-subtle">
                {selectedCase.initialSymptoms}
              </p>
            </div>

            {/* Symptom Totality Rubrics List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Symptom Totality Rubrics ({selectedCase.symptomTotality.length})
                </h4>
                <button
                  onClick={() => handleExportRubrics(selectedCase)}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  <span>Export All to Case Clipboard</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCase.symptomTotality.map((rubric, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-surface-card text-text-primary border border-border-subtle shadow-xs"
                  >
                    {rubric}
                  </span>
                ))}
              </div>
            </div>

            {/* Prescribed Remedy & Curative Timeline */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-muted block">Prescribed Remedy</span>
                  <span className="text-base font-bold text-text-primary">
                    {selectedCase.remedyPrescribed}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-primary-500/10 text-primary-500 font-semibold text-xs border border-primary-500/20">
                  {selectedCase.potencyAndDosage}
                </span>
              </div>

              <div>
                <span className="text-xs text-text-muted font-medium flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                  Curative Outcome & Progression:
                </span>
                <p className="text-xs text-text-secondary leading-relaxed pl-4">
                  {selectedCase.outcomeAndTimeline}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => handleInspectRemedy(selectedCase.remedyPrescribed)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 border border-primary-500/20 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Inspect in Materia Medica</span>
              </button>
              <button
                onClick={() => {
                  handleExportRubrics(selectedCase);
                  setSelectedCase(null);
                  navigate(ROUTES.REPERTORY);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-xs"
              >
                Open Case in Repertory Matrix
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
