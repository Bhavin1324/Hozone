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
} from '@/core/storage/indexedDb';
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
import { ChapterSidebar } from './components/ChapterSidebar';
import { RubricBrowser } from './components/RubricBrowser';
import { RubricClipboard } from './components/RubricClipboard';
import { FilterToolbar } from './components/FilterToolbar';
import { RepertorizationGrid } from './components/RepertorizationGrid';
import { PolarityAnalysisGrid } from './components/PolarityAnalysisGrid';
import { RemedyDetailDrawer } from './components/RemedyDetailDrawer';
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
  } = useAppSelector((state) => state.repertorization);

  const [repertories, setRepertories] = useState<RepertoryCatalogItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [allRubricsList, setAllRubricsList] = useState<Rubric[]>([]);
  const [polarPairs, setPolarPairs] = useState<PolarSymptomPair[]>([]);
  const [computeOutput, setComputeOutput] = useState<RepertorizationComputeOutput>({
    rankedRemedies: [],
    benchmarkMs: 0,
    totalEvaluated: 0,
    qualifyingCount: 0,
  });

  const debouncedSearch = useDebounce(searchQuery, 150);

  // 1. Hydrate Repertories, Chapters, Remedies & Polar Pairs from Local-First Storage
  useEffect(() => {
    let mounted = true;
    Promise.all([
      getLocalRepertories(),
      getLocalChapters(),
      getLocalRemedies(),
      getLocalPolarPairs(),
    ]).then(([reps, ch, rem, pp]) => {
      if (mounted) {
        setRepertories(reps);
        setChapters(ch);
        setRemedies(rem);
        setPolarPairs(pp);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Query Rubrics on Search / Chapter Change
  useEffect(() => {
    let mounted = true;
    searchLocalRubrics(debouncedSearch, selectedChapterId || undefined).then((res) => {
      if (mounted) {
        setRubrics(res);
      }
    });
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedChapterId]);

  // 3. Keep cache of all rubrics for matrix calculation
  useEffect(() => {
    let mounted = true;
    searchLocalRubrics('').then((all) => {
      if (mounted) {
        setAllRubricsList(all);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Effective rubrics list combining base rubrics and active synthetic combined rubrics
  const effectiveRubricsList = useMemo(() => {
    const combined = Object.values(combinedRubricsMap);
    return [...allRubricsList, ...combined];
  }, [allRubricsList, combinedRubricsMap]);

  // 4. Dispatch Matrix Calculation to Web Worker
  useEffect(() => {
    if (remedies.length === 0 || effectiveRubricsList.length === 0) return;

    let isCurrent = true;
    repertoryClient
      .compute({
        activeRubrics,
        allRubrics: effectiveRubricsList,
        allRemedies: remedies,
        filters,
        scoringModel,
      })
      .then((output) => {
        if (isCurrent) {
          setComputeOutput(output);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [activeRubrics, effectiveRubricsList, remedies, filters, scoringModel]);

  // 5. Compute Boenninghausen Polarity Analysis
  const polarityOutput = useMemo<PolarityAnalysisComputeOutput>(() => {
    if (polarPairs.length === 0 || activeRubrics.length === 0 || remedies.length === 0) {
      return { rankedRemedies: [], evaluatedPairCount: 0, benchmarkMs: 0 };
    }
    return executePolarityAnalysis({
      activeRubrics,
      polarPairs,
      allRubrics: effectiveRubricsList,
      candidateRemedies: remedies,
    });
  }, [activeRubrics, polarPairs, effectiveRubricsList, remedies]);

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
    (strategy: MergeStrategy) => {
      const rubricsToMerge = effectiveRubricsList.filter((r) =>
        selectedClipboardIds.includes(r.id)
      );
      if (rubricsToMerge.length < 2) {
        message.warning('Please select at least 2 rubrics to combine.');
        return;
      }
      const combined = mergeRubrics(rubricsToMerge, { strategy });
      dispatch(combineSelectedRubrics({ combinedRubric: combined }));
      message.success(`Combined ${rubricsToMerge.length} rubrics into single clinical symptom.`);
    },
    [effectiveRubricsList, selectedClipboardIds, dispatch]
  );

  const handleUncombineRubric = useCallback(
    (combinedRubricId: string) => {
      const combined = combinedRubricsMap[combinedRubricId];
      if (!combined) return;
      const restored = combined.sourceRubricIds.map((id) => {
        const orig = allRubricsList.find((r) => r.id === id);
        return {
          rubricId: id,
          fullPath: orig?.fullPath || id,
          chapterName: orig?.chapterName || 'General',
          weight: 1 as const,
          isEliminating: false,
        };
      });
      dispatch(uncombineRubric({ combinedRubricId, restoredRubrics: restored }));
      message.success('Restored individual rubrics to case clipboard.');
    },
    [combinedRubricsMap, allRubricsList, dispatch]
  );

  const handleSelectCrossReference = useCallback(
    (refText: string) => {
      const queryPart = refText.split('>').pop()?.trim() || refText;
      dispatch(setSearchQuery(queryPart));
    },
    [dispatch]
  );

  return (
    <div className="space-y-6">
      {/* 43+ Repertories Header Selector */}
      <RepertorySelector
        repertories={repertories}
        selectedRepertoryId={selectedRepertoryId}
        onSelectRepertory={(id) => dispatch(setSelectedRepertoryId(id))}
      />

      {/* Top Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chapter Rail & Hierarchical Rubric Browser */}
        <div className="lg:col-span-6 h-[540px] flex rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <ChapterSidebar
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            onSelectChapter={(id) => dispatch(setSelectedChapterId(id))}
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
            onToggleExpand={(id) => dispatch(toggleExpandRubric(id))}
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
          />

          <FilterToolbar
            filters={filters}
            scoringModel={scoringModel}
            benchmarkMs={computeOutput.benchmarkMs}
            qualifyingCount={computeOutput.qualifyingCount}
            totalEvaluated={computeOutput.totalEvaluated}
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
          rankedRemedies={computeOutput.rankedRemedies}
          activeRubrics={activeRubrics}
          onSelectRemedy={(id) => dispatch(setSelectedRemedyId(id))}
        />
      )}

      {/* Slide-out Remedy Keynotes Drawer */}
      <RemedyDetailDrawer
        remedy={selectedRemedy}
        onClose={() => dispatch(setSelectedRemedyId(null))}
      />
    </div>
  );
};

export default RepertoryContainer;
