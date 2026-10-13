import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Segmented, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addRubric,
  removeRubric,
  setRubricWeight,
  toggleEliminating,
  toggleThermalFilter,
  toggleMiasmFilter,
  toggleKingdomFilter,
  clearFilters,
  setScoringModel,
  setSelectedRemedyId,
  setSearchQuery,
  setSelectedChapterId,
  clearClipboard,
  toggleSelectClipboardRubric,
  combineSelectedRubrics,
  uncombineRubric,
  setPolarityViewMode,
  setSelectedRepertoryId,
  toggleExpandRubric,
  setRubricViewMode,
} from '@/app/store/slices/repertorizationSlice';
import {
  getLocalRepertories,
  getLocalChapters,
  getLocalRemedies,
  searchLocalRubrics,
  getLocalPolarPairs,
  getRubricsByIds,
  getLocalRubricChildren,
} from '@/core/storage/indexedDb';
import { sqliteClient } from '@/core/workers/sqliteDatabaseClient';
import { repertoryClient } from '@/core/workers/repertoryClient';
import { mergeRubrics } from '@/core/repertory/rubricMerger';
import { executePolarityAnalysis } from '@/core/repertory/polarityEngine';
import type {
  Chapter,
  Remedy,
  Rubric,
  PolarSymptomPair,
  PolarityAnalysisComputeOutput,
  RepertorizationComputeOutput,
  MergeStrategy,
  RepertoryCatalogItem,
} from './types';
import { RepertorySelector } from './components/RepertorySelector';
import { DatabaseSyncIndicator } from './components/DatabaseSyncIndicator';
import { ChapterSidebar } from './components/ChapterSidebar';
import { RubricBrowser } from './components/RubricBrowser';
import { RubricClipboard } from './components/RubricClipboard';
import { FilterToolbar } from './components/FilterToolbar';
import { RepertorizationGrid } from './components/RepertorizationGrid';
import { PolarityAnalysisGrid } from './components/PolarityAnalysisGrid';
import { RemedyDetailDrawer } from './components/RemedyDetailDrawer';
import { ActivePatientBanner } from './components/ActivePatientBanner';
import { SaveToPatientCaseModal } from './components/SaveToPatientCaseModal';
import { useDebounce } from '@/core/hooks/useDebounce';

export const RepertoryContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeRubrics,
    filters,
    scoringModel,
    selectedRemedyId,
    searchQuery,
    selectedChapterId,
    combinedRubricsMap,
    polarityViewMode,
    selectedClipboardIds,
    selectedRepertoryId,
    expandedRubricIds,
    rubricViewMode,
    sqliteSync,
  } = useAppSelector((state) => state.repertorization);

  const [repertories, setRepertories] = useState<RepertoryCatalogItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [polarPairs, setPolarPairs] = useState<PolarSymptomPair[]>([]);
  const [polarRubrics, setPolarRubrics] = useState<Rubric[]>([]);
  const [computeOutput, setComputeOutput] = useState<RepertorizationComputeOutput>({
    rankedRemedies: [],
    benchmarkMs: 0,
    totalEvaluated: 0,
    qualifyingCount: 0,
  });
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 150);

  const activeRepertoryName = useMemo(() => {
    return repertories.find((r) => r.id === selectedRepertoryId)?.title || 'Kent Repertory';
  }, [repertories, selectedRepertoryId]);

  // 1. Hydrate Repertories, Remedies & Polar Pairs from Local-First Storage
  useEffect(() => {
    let mounted = true;
    Promise.all([
      getLocalRepertories(),
      getLocalRemedies(),
      getLocalPolarPairs(),
    ]).then(([reps, rem, pp]) => {
      if (mounted) {
        setRepertories(reps);
        setRemedies(rem);
        setPolarPairs(pp);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Hydrate Chapters dynamically based on active repertory, search query, and SQLite readiness
  useEffect(() => {
    let mounted = true;
    getLocalChapters(selectedRepertoryId, debouncedSearch).then((ch) => {
      if (mounted) {
        setChapters(ch);
      }
    });
    return () => {
      mounted = false;
    };
  }, [selectedRepertoryId, debouncedSearch, sqliteSync.status]);

  // 3. Query Rubrics on Search / Chapter Change / Repertory Change
  useEffect(() => {
    let mounted = true;
    searchLocalRubrics(debouncedSearch, selectedChapterId || undefined, selectedRepertoryId).then((res) => {
      if (mounted) {
        setRubrics(res);
      }
    });
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedChapterId, selectedRepertoryId, sqliteSync.status]);

  // 4. Preload polar pair rubrics to support instant Polarity Analysis
  useEffect(() => {
    if (polarPairs.length === 0) return;
    const polarIds: string[] = [];
    for (const p of polarPairs) {
      if (p.positiveRubricId) polarIds.push(p.positiveRubricId);
      if (p.oppositeRubricId) polarIds.push(p.oppositeRubricId);
    }
    if (polarIds.length > 0) {
      let mounted = true;
      getRubricsByIds(polarIds).then((rubs) => {
        if (mounted) setPolarRubrics(rubs);
      });
      return () => {
        mounted = false;
      };
    }
  }, [polarPairs, sqliteSync.status]);

  // 5. Dispatch Matrix Calculation directly to SQLite Web Worker (with fallback)
  useEffect(() => {
    if (remedies.length === 0 || activeRubrics.length === 0) {
      return;
    }

    let isCurrent = true;

    if (sqliteClient.isReady()) {
      sqliteClient
        .executeRepertorization({
          activeRubrics,
          filters,
          scoringModel,
          combinedRubrics: Object.values(combinedRubricsMap),
        })
        .then((output) => {
          if (isCurrent) {
            setComputeOutput(output);
          }
        })
        .catch((err) => {
          console.warn('[RepertoryContainer] SQLite execution error, falling back to in-memory:', err);
        });
    } else {
      repertoryClient
        .compute({
          activeRubrics,
          allRubrics: [...rubrics, ...polarRubrics, ...Object.values(combinedRubricsMap)],
          allRemedies: remedies,
          filters,
          scoringModel,
        })
        .then((output) => {
          if (isCurrent) {
            setComputeOutput(output);
          }
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [
    activeRubrics,
    combinedRubricsMap,
    remedies,
    rubrics,
    polarRubrics,
    filters,
    scoringModel,
    sqliteSync.status,
  ]);

  const effectiveComputeOutput = useMemo(() => {
    if (remedies.length === 0 || activeRubrics.length === 0) {
      return {
        rankedRemedies: [],
        benchmarkMs: 0,
        totalEvaluated: remedies.length,
        qualifyingCount: 0,
      };
    }
    return computeOutput;
  }, [computeOutput, remedies.length, activeRubrics.length]);

  // 6. Compute Boenninghausen Polarity Analysis
  const polarityOutput = useMemo<PolarityAnalysisComputeOutput>(() => {
    if (polarPairs.length === 0 || activeRubrics.length === 0 || remedies.length === 0) {
      return { rankedRemedies: [], evaluatedPairCount: 0, benchmarkMs: 0 };
    }
    const allAvailableRubrics = [...rubrics, ...polarRubrics, ...Object.values(combinedRubricsMap)];
    return executePolarityAnalysis({
      activeRubrics,
      polarPairs,
      allRubrics: allAvailableRubrics,
      candidateRemedies: remedies,
    });
  }, [activeRubrics, polarPairs, rubrics, polarRubrics, combinedRubricsMap, remedies]);

  const activeRubricIds = useMemo(
    () => new Set(activeRubrics.map((r) => r.rubricId)),
    [activeRubrics]
  );

  const selectedRemedy = useMemo(() => {
    if (!selectedRemedyId) return null;
    return remedies.find((r) => r.id === selectedRemedyId) || null;
  }, [remedies, selectedRemedyId]);

  const handleAddRubric = useCallback(
    (rubric: Rubric) => {
      if (activeRubricIds.has(rubric.id)) {
        dispatch(removeRubric(rubric.id));
      } else {
        dispatch(addRubric(rubric));
      }
    },
    [activeRubricIds, dispatch]
  );

  const handleCombineSelected = useCallback(
    async (strategy: MergeStrategy) => {
      if (selectedClipboardIds.length < 2) {
        message.warning('Please select at least 2 rubrics to combine.');
        return;
      }
      try {
        const rubricsToMerge = await getRubricsByIds(selectedClipboardIds);
        if (rubricsToMerge.length < 2) {
          message.warning('Please select at least 2 rubrics to combine.');
          return;
        }
        const combined = mergeRubrics(rubricsToMerge, { strategy });
        dispatch(combineSelectedRubrics({ combinedRubric: combined }));
        message.success(`Combined ${rubricsToMerge.length} rubrics into single clinical symptom.`);
      } catch (err) {
        console.error('[RepertoryContainer] Error combining rubrics:', err);
        message.error('Failed to combine rubrics.');
      }
    },
    [selectedClipboardIds, dispatch]
  );

  const handleUncombineRubric = useCallback(
    (combinedRubricId: string) => {
      const combined = combinedRubricsMap[combinedRubricId];
      if (!combined) return;
      const restored = combined.sourceRubricIds.map((id) => {
        const orig = rubrics.find((r) => r.id === id);
        return {
          rubricId: id,
          fullPath: orig?.fullPath || id,
          chapterName: orig?.chapterName || combined.chapterName,
          weight: 1 as const,
          isEliminating: false,
        };
      });
      dispatch(uncombineRubric({ combinedRubricId, restoredRubrics: restored }));
      message.success('Restored individual rubrics to case clipboard.');
    },
    [combinedRubricsMap, rubrics, dispatch]
  );

  const handleSelectCrossReference = useCallback(
    (refText: string) => {
      const queryPart = refText.split('>').pop()?.trim() || refText;
      dispatch(setSearchQuery(queryPart));
    },
    [dispatch]
  );

  const handleToggleExpandRubric = useCallback(
    async (rubricId: string) => {
      const willExpand = !expandedRubricIds.includes(rubricId);
      dispatch(toggleExpandRubric(rubricId));

      if (willExpand) {
        const hasLoadedChildren = rubrics.some((r) => r.parentId === rubricId);
        if (!hasLoadedChildren) {
          try {
            const children = await getLocalRubricChildren(rubricId);
            if (children.length > 0) {
              setRubrics((prev) => {
                const existingIds = new Set(prev.map((r) => r.id));
                const newChildren = children.filter((c) => !existingIds.has(c.id));
                return newChildren.length > 0 ? [...prev, ...newChildren] : prev;
              });
            }
          } catch (err) {
            console.warn('[handleToggleExpandRubric] Error loading children:', err);
          }
        }
      }
    },
    [dispatch, expandedRubricIds, rubrics]
  );

  return (
    <div className="space-y-6">
      {/* Active Patient Session Banner (Homepath Zomeo Parity) */}
      <ActivePatientBanner onOpenSaveModal={() => setIsSaveModalOpen(true)} />

      {/* 43+ Repertories Header Selector */}
      <RepertorySelector
        repertories={repertories}
        selectedRepertoryId={selectedRepertoryId}
        onSelectRepertory={(id) => dispatch(setSelectedRepertoryId(id))}
        extra={<DatabaseSyncIndicator />}
      />

      {/* Top Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chapter Rail & Hierarchical Rubric Browser */}
        <div className="lg:col-span-6 h-[540px] flex rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <ChapterSidebar
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            onSelectChapter={(id) => dispatch(setSelectedChapterId(id))}
            isSearchActive={Boolean(debouncedSearch.trim())}
          />
          <RubricBrowser
            rubrics={rubrics}
            searchQuery={searchQuery}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            activeRubricIds={activeRubricIds}
            onAddRubric={handleAddRubric}
            onSelectRemedy={(id) => dispatch(setSelectedRemedyId(id))}
            viewMode={rubricViewMode}
            onViewModeChange={(m) => dispatch(setRubricViewMode(m))}
            expandedRubricIds={expandedRubricIds}
            onToggleExpand={handleToggleExpandRubric}
            onSelectCrossReference={handleSelectCrossReference}
          />
        </div>

        {/* Right Column: Active Case Clipboard & Filters */}
        <div className="lg:col-span-6 space-y-4">
          <RubricClipboard
            activeRubrics={activeRubrics}
            selectedClipboardIds={selectedClipboardIds}
            onToggleSelect={(id) => dispatch(toggleSelectClipboardRubric(id))}
            onCombineSelected={handleCombineSelected}
            onUncombineRubric={handleUncombineRubric}
            onRemoveRubric={(id) => dispatch(removeRubric(id))}
            onSetWeight={(id, w) => dispatch(setRubricWeight({ rubricId: id, weight: w }))}
            onToggleEliminating={(id) => dispatch(toggleEliminating(id))}
            onClearClipboard={() => dispatch(clearClipboard())}
            onSaveToCase={() => setIsSaveModalOpen(true)}
          />

          <FilterToolbar
            filters={filters}
            scoringModel={scoringModel}
            benchmarkMs={effectiveComputeOutput.benchmarkMs}
            qualifyingCount={effectiveComputeOutput.qualifyingCount}
            totalEvaluated={effectiveComputeOutput.totalEvaluated}
            onToggleThermal={(t) => dispatch(toggleThermalFilter(t))}
            onToggleMiasm={(m) => dispatch(toggleMiasmFilter(m))}
            onToggleKingdom={(k) => dispatch(toggleKingdomFilter(k))}
            onSetScoringModel={(m) => dispatch(setScoringModel(m))}
            onClearFilters={() => dispatch(clearFilters())}
          />
        </div>
      </div>

      {/* Mode Switcher for Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          <Segmented
            value={polarityViewMode}
            onChange={(val) => dispatch(setPolarityViewMode(val as 'standard' | 'polarity'))}
            options={[
              { value: 'standard', label: 'Standard Repertory Matrix' },
              { value: 'polarity', label: 'Boenninghausen Polarity Analysis (Frei)' },
            ]}
          />
        </div>
        <span className="text-xs text-text-muted">
          {polarityViewMode === 'standard'
            ? 'Kent & Synthetic matrix view'
            : 'Polarity Difference (PD) & Contraindication warnings'}
        </span>
      </div>

      {/* Bottom Full-Width Workspace: Grid View */}
      {polarityViewMode === 'polarity' ? (
        <PolarityAnalysisGrid
          rankedRemedies={polarityOutput.rankedRemedies}
          evaluatedPairCount={polarityOutput.evaluatedPairCount}
          benchmarkMs={polarityOutput.benchmarkMs}
          onSelectRemedy={(id) => dispatch(setSelectedRemedyId(id))}
        />
      ) : (
        <RepertorizationGrid
          rankedRemedies={effectiveComputeOutput.rankedRemedies}
          activeRubrics={activeRubrics}
          onSelectRemedy={(id) => dispatch(setSelectedRemedyId(id))}
        />
      )}

      {/* Slide-out Remedy Keynotes Drawer */}
      <RemedyDetailDrawer
        remedy={selectedRemedy}
        onClose={() => dispatch(setSelectedRemedyId(null))}
      />

      {/* Save Totality to Patient Case Modal (Homepath Zomeo Parity) */}
      <SaveToPatientCaseModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        repertoryId={selectedRepertoryId}
        repertoryName={activeRepertoryName}
        activeRubrics={activeRubrics}
        rankedRemedies={effectiveComputeOutput.rankedRemedies}
        scoringModel={scoringModel}
        filters={filters}
        polarityOutput={polarityOutput}
      />
    </div>
  );
};

export default RepertoryContainer;
