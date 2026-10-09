import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VeterinarySpecies } from '@/features/specialty/types';

export type SpecialtyTab =
  | 'repertory'
  | 'veterinary-repertory'
  | 'posology-calculator'
  | 'veterinary-cases';

export interface PosologyInputState {
  species: VeterinarySpecies;
  weightKg: number;
  acuity: 'Hyper-acute' | 'Sub-acute' | 'Chronic';
}

export interface SpecialtyState {
  activeTab: SpecialtyTab;
  selectedRepertoryCode: string;
  selectedSpecies: VeterinarySpecies | 'ALL';
  searchQuery: string;
  posologyInput: PosologyInputState;
  selectedRubricId: string | null;
  selectedCaseId: string | null;
}

const initialState: SpecialtyState = {
  activeTab: 'repertory',
  selectedRepertoryCode: 'ALL',
  selectedSpecies: 'ALL',
  searchQuery: '',
  posologyInput: {
    species: 'Canine',
    weightKg: 20,
    acuity: 'Sub-acute',
  },
  selectedRubricId: null,
  selectedCaseId: null,
};

export const specialtySlice = createSlice({
  name: 'specialty',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<SpecialtyTab>) => {
      state.activeTab = action.payload;
    },
    setSelectedRepertoryCode: (state, action: PayloadAction<string>) => {
      state.selectedRepertoryCode = action.payload;
    },
    setSelectedSpecies: (state, action: PayloadAction<VeterinarySpecies | 'ALL'>) => {
      state.selectedSpecies = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPosologyInput: (
      state,
      action: PayloadAction<Partial<PosologyInputState>>
    ) => {
      state.posologyInput = {
        ...state.posologyInput,
        ...action.payload,
      };
    },
    setSelectedRubricId: (state, action: PayloadAction<string | null>) => {
      state.selectedRubricId = action.payload;
    },
    setSelectedCaseId: (state, action: PayloadAction<string | null>) => {
      state.selectedCaseId = action.payload;
    },
    resetFilters: (state) => {
      state.selectedRepertoryCode = 'ALL';
      state.selectedSpecies = 'ALL';
      state.searchQuery = '';
      state.selectedRubricId = null;
      state.selectedCaseId = null;
    },
  },
});

export const {
  setActiveTab,
  setSelectedRepertoryCode,
  setSelectedSpecies,
  setSearchQuery,
  setPosologyInput,
  setSelectedRubricId,
  setSelectedCaseId,
  resetFilters,
} = specialtySlice.actions;

export const specialtyReducer = specialtySlice.reducer;
