import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Check,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSelectedRepertoryCode,
  setSearchQuery,
} from '@/app/store/slices/specialtySlice';
import { repertorizationSlice } from '@/app/store/slices/repertorizationSlice';
import {
  getLocalSpecialtyRepertories,
  getLocalSpecialtyRubrics,
} from '@/core/storage/indexedDbSpecialty';
import type { SpecialtyRepertory, SpecialtyRubric } from '../types';
import type { Rubric } from '@/features/repertory/types';

export const SpecialtyRepertoryView: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCode = useAppSelector((state) => state.specialty.selectedRepertoryCode);
  const searchQuery = useAppSelector((state) => state.specialty.searchQuery);
  const activeRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  const [repertories, setRepertories] = useState<SpecialtyRepertory[]>([]);
  const [rubrics, setRubrics] = useState<SpecialtyRubric[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getLocalSpecialtyRepertories().then((data) => {
      if (mounted) {
        // Exclude veterinary here, handled in dedicated veterinary view
        setRepertories(data.filter((r) => r.code !== 'VETERINARY'));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const filterCode = selectedCode === 'ALL' || selectedCode === 'VETERINARY' ? undefined : selectedCode;
    getLocalSpecialtyRubrics(filterCode, searchQuery).then((data) => {
      if (mounted) {
        // Exclude veterinary rubrics in specialty view
        const specialtyOnly = data.filter((r) => r.repertoryCode !== 'VETERINARY');
        setRubrics(specialtyOnly);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedCode, searchQuery]);

  const sections = useMemo(() => {
    const set = new Set<string>();
    rubrics.forEach((r) => set.add(r.section));
    return ['ALL', ...Array.from(set)];
  }, [rubrics]);

  const filteredRubrics = useMemo(() => {
    if (selectedSection === 'ALL') return rubrics;
    return rubrics.filter((r) => r.section === selectedSection);
  }, [rubrics, selectedSection]);

  const activeRubricIds = useMemo(() => {
    return new Set(activeRubrics.map((r) => r.rubricId));
  }, [activeRubrics]);

  const handleAddToCase = (r: SpecialtyRubric) => {
    const rubricPayload: Rubric = {
      id: r.id,
      chapterId: r.repertoryCode.toLowerCase(),
      chapterName: `${r.repertoryCode} - ${r.section}`,
      path: r.rubricPath,
      fullPath: `${r.repertoryCode} > ${r.rubricPath}`,
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
      {/* Repertory Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {repertories.map((rep) => {
          const isSelected = selectedCode === rep.code;
          return (
            <div
              key={rep.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                dispatch(setSelectedRepertoryCode(isSelected ? 'ALL' : rep.code));
                setSelectedSection('ALL');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  dispatch(setSelectedRepertoryCode(isSelected ? 'ALL' : rep.code));
                  setSelectedSection('ALL');
                }
              }}
              className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                isSelected
                  ? 'bg-primary-50/70 dark:bg-primary-950/30 border-primary-500 shadow-sm'
                  : 'bg-surface-card border-border-subtle hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                  {rep.category}
                </span>
                <span className="text-xs text-text-muted">{rep.year}</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{rep.name}</h3>
              <p className="text-xs text-text-secondary mt-1">{rep.author}</p>
              <p className="text-xs text-text-muted mt-2 line-clamp-2">{rep.description}</p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-card p-4 rounded-xl border border-border-subtle">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search specialty rubrics, remedies, or notes..."
            value={searchQuery}
            aria-label="Search specialty rubrics"
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        {sections.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {sections.slice(0, 6).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  selectedSection === sec
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-surface-subtle text-text-secondary border-border-subtle hover:border-primary-300'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rubrics List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>Showing {filteredRubrics.length} clinical rubrics</span>
          <span>{activeRubricIds.size} rubrics active in case clipboard</span>
        </div>

        {filteredRubrics.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-xl border border-border-subtle">
            <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-secondary">No specialty rubrics matching your criteria.</p>
          </div>
        ) : (
          filteredRubrics.map((r) => {
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
                      <span className="text-xs px-2 py-0.5 rounded bg-surface-subtle font-medium text-text-secondary border border-border-subtle">
                        {r.repertoryCode}
                      </span>
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {r.section}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary">{r.rubricPath}</h4>
                    {r.clinicalNotes && (
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1 bg-surface-subtle/50 px-2.5 py-1 rounded-lg">
                        <Info className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                        <span>{r.clinicalNotes}</span>
                      </div>
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
