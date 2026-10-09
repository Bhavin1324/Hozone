import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ComparisonSection,
  CrossTextSearchMode,
  CrossTextSearchSection,
} from '@/features/materia-medica/types';

export interface MateriaMedicaState {
  selectedRemedyIds: string[];
  activeSection: ComparisonSection;
  activeRemedyId: string | null;
  selectedBookId: string | null;
  searchTerm: string;
  selectedKingdom: string | null;
  selectedThermal: string | null;

  // Cross-Text Multi-Book Search State
  crossSearchQuery: string;
  crossSearchBookFilters: string[];
  crossSearchSectionFilters: CrossTextSearchSection[];
  crossSearchMatchMode: CrossTextSearchMode;
  viewMode: 'monograph' | 'search' | 'comparator';
}

const initialState: MateriaMedicaState = {
  selectedRemedyIds: ['rem-lyc', 'rem-phos'],
  activeSection: 'keynotes',
  activeRemedyId: 'rem-sulph',
  selectedBookId: 'book-boericke',
  searchTerm: '',
  selectedKingdom: null,
  selectedThermal: null,

  // Cross-Search Initial State
  crossSearchQuery: '',
  crossSearchBookFilters: [],
  crossSearchSectionFilters: [],
  crossSearchMatchMode: 'all',
  viewMode: 'monograph',
};

export const materiaMedicaSlice = createSlice({
  name: 'materiaMedica',
  initialState,
  reducers: {
    addRemedyToCompare: (state, action: PayloadAction<string>) => {
      if (state.selectedRemedyIds.length < 4 && !state.selectedRemedyIds.includes(action.payload)) {
        state.selectedRemedyIds.push(action.payload);
      }
    },
    removeRemedyFromCompare: (state, action: PayloadAction<string>) => {
      state.selectedRemedyIds = state.selectedRemedyIds.filter((id) => id !== action.payload);
    },
    clearComparison: (state) => {
      state.selectedRemedyIds = [];
    },
    setActiveSection: (state, action: PayloadAction<ComparisonSection>) => {
      state.activeSection = action.payload;
    },
    setActiveRemedyId: (state, action: PayloadAction<string | null>) => {
      state.activeRemedyId = action.payload;
    },
    setSelectedBookId: (state, action: PayloadAction<string | null>) => {
      state.selectedBookId = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedKingdom: (state, action: PayloadAction<string | null>) => {
      state.selectedKingdom = action.payload;
    },
    setSelectedThermal: (state, action: PayloadAction<string | null>) => {
      state.selectedThermal = action.payload;
    },

    // Cross-Search Reducers
    setCrossSearchQuery: (state, action: PayloadAction<string>) => {
      state.crossSearchQuery = action.payload;
    },
    toggleCrossSearchBookFilter: (state, action: PayloadAction<string>) => {
      const idx = state.crossSearchBookFilters.indexOf(action.payload);
      if (idx >= 0) {
        state.crossSearchBookFilters.splice(idx, 1);
      } else {
        state.crossSearchBookFilters.push(action.payload);
      }
    },
    setCrossSearchBookFilters: (state, action: PayloadAction<string[]>) => {
      state.crossSearchBookFilters = action.payload;
    },
    toggleCrossSearchSectionFilter: (state, action: PayloadAction<CrossTextSearchSection>) => {
      const idx = state.crossSearchSectionFilters.indexOf(action.payload);
      if (idx >= 0) {
        state.crossSearchSectionFilters.splice(idx, 1);
      } else {
        state.crossSearchSectionFilters.push(action.payload);
      }
    },
    setCrossSearchSectionFilters: (state, action: PayloadAction<CrossTextSearchSection[]>) => {
      state.crossSearchSectionFilters = action.payload;
    },
    setCrossSearchMatchMode: (state, action: PayloadAction<CrossTextSearchMode>) => {
      state.crossSearchMatchMode = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'monograph' | 'search' | 'comparator'>) => {
      state.viewMode = action.payload;
    },
    resetCrossSearchFilters: (state) => {
      state.crossSearchBookFilters = [];
      state.crossSearchSectionFilters = [];
      state.crossSearchMatchMode = 'all';
    },
  },
});

export const {
  addRemedyToCompare,
  removeRemedyFromCompare,
  clearComparison,
  setActiveSection,
  setActiveRemedyId,
  setSelectedBookId,
  setSearchTerm,
  setSelectedKingdom,
  setSelectedThermal,
  setCrossSearchQuery,
  toggleCrossSearchBookFilter,
  setCrossSearchBookFilters,
  toggleCrossSearchSectionFilter,
  setCrossSearchSectionFilters,
  setCrossSearchMatchMode,
  setViewMode,
  resetCrossSearchFilters,
} = materiaMedicaSlice.actions;

export default materiaMedicaSlice.reducer;
