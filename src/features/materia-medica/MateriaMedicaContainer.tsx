import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Segmented } from 'antd';
import {
  FlaskConical,
  Sparkles,
  BookOpen,
  ArrowRightLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addRemedyToCompare,
  removeRemedyFromCompare,
  clearComparison,
  setActiveRemedyId,
  setSelectedBookId,
  setSearchTerm,
  setCrossSearchQuery,
  toggleCrossSearchBookFilter,
  toggleCrossSearchSectionFilter,
  setCrossSearchMatchMode,
  setViewMode,
  resetCrossSearchFilters,
} from '@/app/store/slices/materiaMedicaSlice';
import {
  getLocalRemedies,
  getLocalBooks,
  getLocalMonograph,
  getLocalMonographs,
  getAllLocalMonographs,
  getLocalRelationships,
} from '@/core/storage/indexedDb';
import { searchCrossTextMateriaMedica } from '@/core/materia-medica/crossTextSearchEngine';
import { deriveClinicalMonograph } from '@/core/materia-medica/monographSynthesizer';
import type { Remedy } from '@/features/repertory/types';
import type {
  MateriaMedicaBook,
  RemedyMonograph,
  RemedyRelationship,
  RemedyComparisonSlot,
} from './types';
import { MateriaMedicaBrowser } from './components/MateriaMedicaBrowser';
import { MonographView } from './components/MonographView';
import { MultiRemedyComparator } from './components/MultiRemedyComparator';
import { CrossTextSearchView } from './components/CrossTextSearchView';

export const MateriaMedicaContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    selectedRemedyIds,
    activeRemedyId,
    selectedBookId,
    searchTerm,
    crossSearchQuery,
    crossSearchBookFilters,
    crossSearchSectionFilters,
    crossSearchMatchMode,
    viewMode,
  } = useAppSelector((state) => state.materiaMedica);

  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [books, setBooks] = useState<MateriaMedicaBook[]>([]);
  const [allMonographs, setAllMonographs] = useState<RemedyMonograph[]>([]);
  const [activeMonograph, setActiveMonograph] = useState<RemedyMonograph | undefined>();
  const [activeRelationships, setActiveRelationships] = useState<RemedyRelationship[]>([]);
  const [comparisonMonographs, setComparisonMonographs] = useState<Map<string, RemedyMonograph>>(
    new Map()
  );
  const [comparisonRelationships, setComparisonRelationships] = useState<
    Map<string, RemedyRelationship[]>
  >(new Map());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load reference books, remedies, and all monographs on mount
  useEffect(() => {
    let mounted = true;
    Promise.all([getLocalRemedies(), getLocalBooks(), getAllLocalMonographs()]).then(
      ([remList, bookList, monoList]) => {
        if (!mounted) return;
        setRemedies(remList);
        setBooks(bookList);
        setAllMonographs(monoList);

        if (remList.length > 0 && !activeRemedyId) {
          dispatch(setActiveRemedyId(remList[0].id));
        }
      }
    );
    return () => {
      mounted = false;
    };
  }, [dispatch, activeRemedyId]);

  const activeRemedy = useMemo(() => {
    return remedies.find((r) => r.id === activeRemedyId) || null;
  }, [remedies, activeRemedyId]);

  // Load active remedy monograph based on active remedy & selected book
  useEffect(() => {
    let mounted = true;
    if (!activeRemedyId) {
      Promise.resolve().then(() => {
        if (mounted) {
          setActiveMonograph(undefined);
          setActiveRelationships([]);
        }
      });
      return () => {
        mounted = false;
      };
    }

    Promise.all([
      getLocalMonograph(activeRemedyId, selectedBookId || undefined),
      getLocalRelationships(activeRemedyId),
    ]).then(([mono, rels]) => {
      if (mounted) {
        if (mono) {
          setActiveMonograph(mono);
        } else if (activeRemedy) {
          setActiveMonograph(
            deriveClinicalMonograph(activeRemedy, selectedBookId || undefined, books)
          );
        } else {
          setActiveMonograph(undefined);
        }
        setActiveRelationships(rels);
      }
    });

    return () => {
      mounted = false;
    };
  }, [activeRemedyId, activeRemedy, selectedBookId, books]);

  // Load comparison data whenever selected remedies change
  useEffect(() => {
    let mounted = true;
    if (selectedRemedyIds.length === 0) {
      Promise.resolve().then(() => {
        if (mounted) {
          setComparisonMonographs(new Map());
          setComparisonRelationships(new Map());
        }
      });
      return () => {
        mounted = false;
      };
    }

    Promise.all([
      getLocalMonographs(selectedRemedyIds),
      Promise.all(selectedRemedyIds.map((id) => getLocalRelationships(id))),
    ]).then(([monos, relsByRemedy]) => {
      if (!mounted) return;

      const monoMap = new Map<string, RemedyMonograph>();
      for (const m of monos) {
        monoMap.set(m.remedyId, m);
      }
      for (const id of selectedRemedyIds) {
        if (!monoMap.has(id)) {
          const rem = remedies.find((r) => r.id === id);
          if (rem) {
            monoMap.set(id, deriveClinicalMonograph(rem, undefined, books));
          }
        }
      }
      setComparisonMonographs(monoMap);

      const relMap = new Map<string, RemedyRelationship[]>();
      selectedRemedyIds.forEach((id, idx) => {
        relMap.set(id, relsByRemedy[idx] || []);
      });
      setComparisonRelationships(relMap);
    });

    return () => {
      mounted = false;
    };
  }, [selectedRemedyIds, remedies, books]);

  // Available books for currently active remedy
  const availableBooksForRemedy = useMemo(() => {
    return books;
  }, [books]);

  // Cross-Text Search Results computed in real time
  const crossSearchResult = useMemo(() => {
    return searchCrossTextMateriaMedica(crossSearchQuery, allMonographs, remedies, {
      bookIds: crossSearchBookFilters,
      sections: crossSearchSectionFilters,
      mode: crossSearchMatchMode,
    });
  }, [
    crossSearchQuery,
    allMonographs,
    remedies,
    crossSearchBookFilters,
    crossSearchSectionFilters,
    crossSearchMatchMode,
  ]);

  const comparisonSlots = useMemo<RemedyComparisonSlot[]>(() => {
    const slots: RemedyComparisonSlot[] = [];
    for (const id of selectedRemedyIds) {
      const rem = remedies.find((r) => r.id === id);
      if (rem) {
        slots.push({
          remedy: rem,
          monograph: comparisonMonographs.get(id),
          relationships: comparisonRelationships.get(id) || [],
        });
      }
    }
    return slots;
  }, [selectedRemedyIds, remedies, comparisonMonographs, comparisonRelationships]);

  const handleToggleCompare = useCallback(
    (id: string) => {
      if (selectedRemedyIds.includes(id)) {
        dispatch(removeRemedyFromCompare(id));
      } else {
        dispatch(addRemedyToCompare(id));
      }
    },
    [dispatch, selectedRemedyIds]
  );

  const handleSelectRemedy = useCallback(
    (id: string) => {
      dispatch(setActiveRemedyId(id));
      dispatch(setViewMode('monograph'));
    },
    [dispatch]
  );

  const handleOpenInReader = useCallback(
    (remedyId: string, bookId: string) => {
      dispatch(setActiveRemedyId(remedyId));
      dispatch(setSelectedBookId(bookId));
      dispatch(setViewMode('monograph'));
    },
    [dispatch]
  );

  const isCurrentActiveComparing = Boolean(
    activeRemedyId && selectedRemedyIds.includes(activeRemedyId)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-surface-subtle">
      {/* Top Banner Navigation */}
      <header className="px-6 py-3 bg-surface-card border-b border-border-subtle flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary-500" />
            Materia Medica Knowledge Base
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Cross-text symptom search, multi-book monographs, and 2-to-4 remedy differential comparator.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Segmented
            value={viewMode}
            onChange={(val) => dispatch(setViewMode(val as 'monograph' | 'search' | 'comparator'))}
            options={[
              {
                value: 'monograph',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    Monograph Reader
                  </span>
                ),
              },
              {
                value: 'search',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                    <Search className="w-3.5 h-3.5" />
                    Cross-Text Search
                  </span>
                ),
              },
              {
                value: 'comparator',
                label: (
                  <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    Comparator ({selectedRemedyIds.length}/4)
                  </span>
                ),
              },
            ]}
          />

          {viewMode === 'monograph' && (
            <Button
              size="small"
              icon={
                isSidebarOpen ? (
                  <PanelLeftClose className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <PanelLeftOpen className="w-3.5 h-3.5 mr-1" />
                )
              }
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? 'Collapse Remedy Catalog' : 'Expand Remedy Catalog'}
              className="border-border-subtle"
            >
              <span className="hidden sm:inline">
                {isSidebarOpen ? 'Hide Catalog' : 'Show Catalog'}
              </span>
            </Button>
          )}

          {viewMode === 'monograph' && (
            <Button
              type="primary"
              size="small"
              icon={<Sparkles className="w-3.5 h-3.5 mr-1" />}
              onClick={() => dispatch(setViewMode('comparator'))}
              disabled={selectedRemedyIds.length < 2}
            >
              Compare Selected ({selectedRemedyIds.length})
            </Button>
          )}
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Left Remedy Browser Sidebar (Visible only in monograph view when open) */}
        {viewMode === 'monograph' && isSidebarOpen && (
          <MateriaMedicaBrowser
            remedies={remedies}
            searchTerm={searchTerm}
            onSearchChange={(val) => dispatch(setSearchTerm(val))}
            activeRemedyId={activeRemedyId}
            onSelectRemedy={handleSelectRemedy}
            selectedComparisonIds={selectedRemedyIds}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {/* Right Content Pane: Monograph, Cross-Search, or Comparator */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {viewMode === 'monograph' ? (
            <div className="flex-1 overflow-y-auto min-w-0">
              <MonographView
                remedy={activeRemedy}
                monograph={activeMonograph}
                relationships={activeRelationships}
                availableBooks={availableBooksForRemedy}
                selectedBookId={selectedBookId}
                onSelectBook={(bId) => dispatch(setSelectedBookId(bId))}
                onSelectRemedy={handleSelectRemedy}
                onAddToCompare={handleToggleCompare}
                isComparing={isCurrentActiveComparing}
              />
            </div>
          ) : viewMode === 'search' ? (
            <CrossTextSearchView
              searchResult={crossSearchResult}
              books={books}
              query={crossSearchQuery}
              onQueryChange={(q) => dispatch(setCrossSearchQuery(q))}
              matchMode={crossSearchMatchMode}
              onMatchModeChange={(mode) => dispatch(setCrossSearchMatchMode(mode))}
              selectedBookFilters={crossSearchBookFilters}
              onToggleBookFilter={(bId) => dispatch(toggleCrossSearchBookFilter(bId))}
              selectedSectionFilters={crossSearchSectionFilters}
              onToggleSectionFilter={(sec) => dispatch(toggleCrossSearchSectionFilter(sec))}
              onResetFilters={() => dispatch(resetCrossSearchFilters())}
              selectedRemedyIds={selectedRemedyIds}
              onAddToCompare={handleToggleCompare}
              onOpenInReader={handleOpenInReader}
            />
          ) : (
            <MultiRemedyComparator
              slots={comparisonSlots}
              onRemoveSlot={(id) => dispatch(removeRemedyFromCompare(id))}
              onClearAll={() => dispatch(clearComparison())}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MateriaMedicaContainer;
