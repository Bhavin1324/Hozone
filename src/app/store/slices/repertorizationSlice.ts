import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ActiveCaseRubric,
  CombinedRubric,
  FilterCriteria,
  MiasmType,
  RemedyKingdom,
  Rubric,
  ScoringModel,
  ThermalState,
} from '@/features/repertory/types';

export interface RepertorizationState {
  activeRubrics: ActiveCaseRubric[];
  filters: FilterCriteria;
  scoringModel: ScoringModel;
  selectedRemedyId: string | null;
  searchQuery: string;
  selectedChapterId: string | null;
  combinedRubricsMap: Record<string, CombinedRubric>;
  polarityViewMode: 'standard' | 'polarity';
  selectedClipboardIds: string[];
  selectedRepertoryId: string;
  expandedRubricIds: string[];
  rubricViewMode: 'tree' | 'flat';
}

const initialState: RepertorizationState = {
  activeRubrics: [],
  filters: {
    thermals: [],
    miasms: [],
    kingdoms: [],
  },
  scoringModel: 'coverage_first',
  selectedRemedyId: null,
  searchQuery: '',
  selectedChapterId: 'chap-mind',
  combinedRubricsMap: {},
  polarityViewMode: 'standard',
  selectedClipboardIds: [],
  selectedRepertoryId: 'rep-kent',
  expandedRubricIds: ['rub-mind-anxiety', 'rub-mind-fear'],
  rubricViewMode: 'tree',
};

export const repertorizationSlice = createSlice({
  name: 'repertorization',
  initialState,
  reducers: {
    addRubric: (state, action: PayloadAction<Rubric>) => {
      const exists = state.activeRubrics.some((r) => r.rubricId === action.payload.id);
      if (!exists) {
        state.activeRubrics.push({
          rubricId: action.payload.id,
          fullPath: action.payload.fullPath,
          chapterName: action.payload.chapterName,
          weight: 1,
          isEliminating: false,
        });
      }
    },
    removeRubric: (state, action: PayloadAction<string>) => {
      state.activeRubrics = state.activeRubrics.filter(
        (r) => r.rubricId !== action.payload
      );
    },
    setRubricWeight: (
      state,
      action: PayloadAction<{ rubricId: string; weight: 1 | 2 | 3 | 4 | 5 }>
    ) => {
      const item = state.activeRubrics.find((r) => r.rubricId === action.payload.rubricId);
      if (item) {
        item.weight = action.payload.weight;
      }
    },
    toggleEliminating: (state, action: PayloadAction<string>) => {
      const item = state.activeRubrics.find((r) => r.rubricId === action.payload);
      if (item) {
        item.isEliminating = !item.isEliminating;
      }
    },
    toggleThermalFilter: (state, action: PayloadAction<ThermalState>) => {
      const exists = state.filters.thermals.includes(action.payload);
      if (exists) {
        state.filters.thermals = state.filters.thermals.filter((t) => t !== action.payload);
      } else {
        state.filters.thermals.push(action.payload);
      }
    },
    toggleMiasmFilter: (state, action: PayloadAction<MiasmType>) => {
      const exists = state.filters.miasms.includes(action.payload);
      if (exists) {
        state.filters.miasms = state.filters.miasms.filter((m) => m !== action.payload);
      } else {
        state.filters.miasms.push(action.payload);
      }
    },
    toggleKingdomFilter: (state, action: PayloadAction<RemedyKingdom>) => {
      const exists = state.filters.kingdoms.includes(action.payload);
      if (exists) {
        state.filters.kingdoms = state.filters.kingdoms.filter((k) => k !== action.payload);
      } else {
        state.filters.kingdoms.push(action.payload);
      }
    },
    clearFilters: (state) => {
      state.filters = {
        thermals: [],
        miasms: [],
        kingdoms: [],
      };
    },
    setScoringModel: (state, action: PayloadAction<ScoringModel>) => {
      state.scoringModel = action.payload;
    },
    setSelectedRemedyId: (state, action: PayloadAction<string | null>) => {
      state.selectedRemedyId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedChapterId: (state, action: PayloadAction<string | null>) => {
      state.selectedChapterId = action.payload;
    },
    clearClipboard: (state) => {
      state.activeRubrics = [];
      state.combinedRubricsMap = {};
      state.selectedClipboardIds = [];
    },
    toggleSelectClipboardRubric: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedClipboardIds.includes(id)) {
        state.selectedClipboardIds = state.selectedClipboardIds.filter((item) => item !== id);
      } else {
        state.selectedClipboardIds.push(id);
      }
    },
    clearSelectedClipboardRubrics: (state) => {
      state.selectedClipboardIds = [];
    },
    combineSelectedRubrics: (
      state,
      action: PayloadAction<{ combinedRubric: CombinedRubric }>
    ) => {
      const { combinedRubric } = action.payload;
      state.activeRubrics = state.activeRubrics.filter(
        (r) => !combinedRubric.sourceRubricIds.includes(r.rubricId)
      );

      state.activeRubrics.push({
        rubricId: combinedRubric.id,
        fullPath: combinedRubric.fullPath,
        chapterName: combinedRubric.chapterName,
        weight: 1,
        isEliminating: false,
        isCombined: true,
        sourceRubricIds: combinedRubric.sourceRubricIds,
        mergeStrategy: combinedRubric.mergeStrategy,
      });

      state.combinedRubricsMap[combinedRubric.id] = combinedRubric;
      state.selectedClipboardIds = [];
    },
    uncombineRubric: (
      state,
      action: PayloadAction<{
        combinedRubricId: string;
        restoredRubrics: ActiveCaseRubric[];
      }>
    ) => {
      const { combinedRubricId, restoredRubrics } = action.payload;
      state.activeRubrics = state.activeRubrics.filter((r) => r.rubricId !== combinedRubricId);
      for (const res of restoredRubrics) {
        if (!state.activeRubrics.some((r) => r.rubricId === res.rubricId)) {
          state.activeRubrics.push(res);
        }
      }
      delete state.combinedRubricsMap[combinedRubricId];
    },
    setPolarityViewMode: (state, action: PayloadAction<'standard' | 'polarity'>) => {
      state.polarityViewMode = action.payload;
    },
    setSelectedRepertoryId: (state, action: PayloadAction<string>) => {
      state.selectedRepertoryId = action.payload;
    },
    toggleExpandRubric: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.expandedRubricIds.includes(id)) {
        state.expandedRubricIds = state.expandedRubricIds.filter((item) => item !== id);
      } else {
        state.expandedRubricIds.push(id);
      }
    },
    setExpandedRubricIds: (state, action: PayloadAction<string[]>) => {
      state.expandedRubricIds = action.payload;
    },
    setRubricViewMode: (state, action: PayloadAction<'tree' | 'flat'>) => {
      state.rubricViewMode = action.payload;
    },
  },
});

export const {
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
  clearSelectedClipboardRubrics,
  combineSelectedRubrics,
  uncombineRubric,
  setPolarityViewMode,
  setSelectedRepertoryId,
  toggleExpandRubric,
  setExpandedRubricIds,
  setRubricViewMode,
} = repertorizationSlice.actions;

export default repertorizationSlice.reducer;
