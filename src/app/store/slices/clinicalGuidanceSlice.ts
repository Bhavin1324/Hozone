import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClinicalGuidanceTab } from '@/features/clinical-guidance/types';

export interface ClinicalGuidanceState {
  activeTab: ClinicalGuidanceTab;
  // Tips Filters
  tipsSearchQuery: string;
  tipsAuthorFilter: string | null;
  tipsOrganFilter: string | null;
  // Cases Filters
  casesSearchQuery: string;
  casesAuthorFilter: string | null;
  casesOrganFilter: string | null;
  // Nutrition Filters
  nutritionSearchQuery: string;
  nutritionCategoryFilter: string | null;
  nutritionSelectedConditionId: string | null;
  // Mother Tinctures Filters
  tincturesSearchQuery: string;
  tincturesAffinityFilter: string | null;
  selectedTinctureId: string | null;
  // Bookmarks
  bookmarkedTipIds: string[];
}

const initialState: ClinicalGuidanceState = {
  activeTab: 'tips',
  tipsSearchQuery: '',
  tipsAuthorFilter: null,
  tipsOrganFilter: null,
  casesSearchQuery: '',
  casesAuthorFilter: null,
  casesOrganFilter: null,
  nutritionSearchQuery: '',
  nutritionCategoryFilter: null,
  nutritionSelectedConditionId: null,
  tincturesSearchQuery: '',
  tincturesAffinityFilter: null,
  selectedTinctureId: null,
  bookmarkedTipIds: [],
};

export const clinicalGuidanceSlice = createSlice({
  name: 'clinicalGuidance',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ClinicalGuidanceTab>) => {
      state.activeTab = action.payload;
    },
    setTipsSearchQuery: (state, action: PayloadAction<string>) => {
      state.tipsSearchQuery = action.payload;
    },
    setTipsAuthorFilter: (state, action: PayloadAction<string | null>) => {
      state.tipsAuthorFilter = action.payload;
    },
    setTipsOrganFilter: (state, action: PayloadAction<string | null>) => {
      state.tipsOrganFilter = action.payload;
    },
    setCasesSearchQuery: (state, action: PayloadAction<string>) => {
      state.casesSearchQuery = action.payload;
    },
    setCasesAuthorFilter: (state, action: PayloadAction<string | null>) => {
      state.casesAuthorFilter = action.payload;
    },
    setCasesOrganFilter: (state, action: PayloadAction<string | null>) => {
      state.casesOrganFilter = action.payload;
    },
    setNutritionSearchQuery: (state, action: PayloadAction<string>) => {
      state.nutritionSearchQuery = action.payload;
    },
    setNutritionCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.nutritionCategoryFilter = action.payload;
    },
    setNutritionSelectedConditionId: (state, action: PayloadAction<string | null>) => {
      state.nutritionSelectedConditionId = action.payload;
    },
    setTincturesSearchQuery: (state, action: PayloadAction<string>) => {
      state.tincturesSearchQuery = action.payload;
    },
    setTincturesAffinityFilter: (state, action: PayloadAction<string | null>) => {
      state.tincturesAffinityFilter = action.payload;
    },
    setSelectedTinctureId: (state, action: PayloadAction<string | null>) => {
      state.selectedTinctureId = action.payload;
    },
    toggleBookmarkTip: (state, action: PayloadAction<string>) => {
      const tipId = action.payload;
      const index = state.bookmarkedTipIds.indexOf(tipId);
      if (index >= 0) {
        state.bookmarkedTipIds.splice(index, 1);
      } else {
        state.bookmarkedTipIds.push(tipId);
      }
    },
    resetAllFilters: (state) => {
      state.tipsSearchQuery = '';
      state.tipsAuthorFilter = null;
      state.tipsOrganFilter = null;
      state.casesSearchQuery = '';
      state.casesAuthorFilter = null;
      state.casesOrganFilter = null;
      state.nutritionSearchQuery = '';
      state.nutritionCategoryFilter = null;
      state.tincturesSearchQuery = '';
      state.tincturesAffinityFilter = null;
    },
  },
});

export const {
  setActiveTab,
  setTipsSearchQuery,
  setTipsAuthorFilter,
  setTipsOrganFilter,
  setCasesSearchQuery,
  setCasesAuthorFilter,
  setCasesOrganFilter,
  setNutritionSearchQuery,
  setNutritionCategoryFilter,
  setNutritionSelectedConditionId,
  setTincturesSearchQuery,
  setTincturesAffinityFilter,
  setSelectedTinctureId,
  toggleBookmarkTip,
  resetAllFilters,
} = clinicalGuidanceSlice.actions;

export default clinicalGuidanceSlice.reducer;
