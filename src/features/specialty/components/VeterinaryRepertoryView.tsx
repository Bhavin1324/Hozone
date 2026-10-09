import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  Sparkles,
  AlertTriangle,
  PawPrint,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSelectedSpecies,
  setSearchQuery,
} from '@/app/store/slices/specialtySlice';
import { repertorizationSlice } from '@/app/store/slices/repertorizationSlice';
import {
  getLocalSpecialtyRubrics,
  getLocalVeterinarySpeciesGuidance,
} from '@/core/storage/indexedDbSpecialty';
import type {
  SpecialtyRubric,
  VeterinarySpeciesGuidance,
  VeterinarySpecies,
} from '../types';
import type { Rubric } from '@/features/repertory/types';

const SPECIES_LIST: Array<VeterinarySpecies | 'ALL'> = [
  'ALL',
  'Canine',
  'Feline',
  'Equine',
  'Bovine',
  'Avian',
];

export const VeterinaryRepertoryView: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector((state) => state.specialty.selectedSpecies);
  const searchQuery = useAppSelector((state) => state.specialty.searchQuery);
  const activeRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  const [rubrics, setRubrics] = useState<SpecialtyRubric[]>([]);
  const [guidanceList, setGuidanceList] = useState<VeterinarySpeciesGuidance[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getLocalVeterinarySpeciesGuidance().then((data) => {
      if (mounted) setGuidanceList(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    getLocalSpecialtyRubrics('VETERINARY', searchQuery).then((data) => {
      if (mounted) {
        let filtered = data;
        if (selectedSpecies !== 'ALL') {
          filtered = data.filter((r) => r.section.toUpperCase() === selectedSpecies.toUpperCase());
        }
        setRubrics(filtered);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedSpecies, searchQuery]);

  const activeRubricIds = useMemo(() => {
    return new Set(activeRubrics.map((r) => r.rubricId));
  }, [activeRubrics]);

  const currentGuidance = useMemo(() => {
    if (selectedSpecies === 'ALL') return null;
    return guidanceList.find((g) => g.species === selectedSpecies) || null;
  }, [guidanceList, selectedSpecies]);

  const handleAddToCase = (r: SpecialtyRubric) => {
    const rubricPayload: Rubric = {
      id: r.id,
      chapterId: `vet-${r.section.toLowerCase()}`,
      chapterName: `VET - ${r.section}`,
      path: r.rubricPath,
      fullPath: `Veterinary > ${r.rubricPath}`,
      depth: 1,
      remedyCount: r.remedies.length,
      entries: r.remedies.map((rem) => ({
        remedyId: rem.abbr.toLowerCase(),
        abbreviation: rem.abbr,
        grade: rem.grade,
      })),
    };

    dispatch(repertorizationSlice.actions.addRubric(rubricPayload));
    setRecentlyAddedId(r.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-7xl mx-auto">
      {/* Species Selector Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {SPECIES_LIST.map((sp) => {
          const isSelected = selectedSpecies === sp;
          return (
            <button
              key={sp}
              type="button"
              onClick={() => dispatch(setSelectedSpecies(sp))}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-surface-card text-text-secondary border-border-subtle hover:border-primary-300'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>{sp === 'ALL' ? 'All Animal Species' : `${sp} Veterinary`}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Species Guidance Card */}
      {currentGuidance && (
        <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                {currentGuidance.species} Physiology
              </span>
              <span className="text-xs text-text-muted">
                Admin: {currentGuidance.administrationMethod}
              </span>
            </div>
            <p className="text-xs text-text-secondary">{currentGuidance.physiologicalCharacteristics}</p>
            <p className="text-xs text-text-muted">
              <span className="font-medium text-text-secondary">Posology: </span>
              {currentGuidance.posologyGuidance}
            </p>
          </div>

          {currentGuidance.contraindications && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-status-warning/10 border border-status-warning/30 text-status-warning text-xs max-w-sm shrink-0">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Species Caution:</span>
                <p className="text-[11px] mt-0.5">{currentGuidance.contraindications}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-surface-card p-3 rounded-xl border border-border-subtle">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search veterinary rubrics (e.g. thunderstorm, colic, mastitis, hot spot)..."
          value={searchQuery}
          aria-label="Search veterinary rubrics"
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* Veterinary Rubrics Feed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>Showing {rubrics.length} veterinary rubrics</span>
          <span>{activeRubricIds.size} rubrics active in case clipboard</span>
        </div>

        {rubrics.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-xl border border-border-subtle">
            <PawPrint className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-secondary">No veterinary rubrics found for this species filter.</p>
          </div>
        ) : (
          rubrics.map((r) => {
            const isAdded = activeRubricIds.has(r.id);
            const isJustAdded = recentlyAddedId === r.id;

            return (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-surface-card border border-border-subtle hover:border-border-default transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 font-semibold border border-primary-200 dark:border-primary-800">
                        {r.section}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">{r.rubricPath}</h4>
                    {r.clinicalNotes && (
                      <p className="text-xs text-text-secondary mt-1 bg-surface-subtle/50 px-2.5 py-1 rounded-lg">
                        {r.clinicalNotes}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCase(r)}
                    disabled={isAdded}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      isAdded
                        ? 'bg-status-success/10 text-status-success border border-status-success/30 cursor-default'
                        : isJustAdded
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-500 hover:text-white dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        In Case
                      </>
                    ) : isJustAdded ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add to Case
                      </>
                    )}
                  </button>
                </div>

                {/* Remedies with Grades */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle">
                  <span className="text-xs text-text-muted mr-1 font-medium">Remedies ({r.remedies.length}):</span>
                  {r.remedies.map((rem) => {
                    let gradeClass = 'text-xs px-2 py-0.5 rounded border ';
                    if (rem.grade === 4) {
                      gradeClass += 'font-bold text-status-error bg-status-error/10 border-status-error/30';
                    } else if (rem.grade === 3) {
                      gradeClass += 'font-bold text-primary-700 dark:text-primary-300 bg-primary-100/60 dark:bg-primary-900/40 border-primary-300';
                    } else if (rem.grade === 2) {
                      gradeClass += 'italic font-medium text-text-primary bg-surface-subtle border-border-subtle';
                    } else {
                      gradeClass += 'text-text-muted bg-surface-base border-border-subtle';
                    }

                    return (
                      <span key={rem.abbr} className={gradeClass} title={`${rem.remedy} (Grade ${rem.grade})`}>
                        {rem.abbr}
                        <sup className="ml-0.5 text-[10px] opacity-75">{rem.grade}</sup>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
