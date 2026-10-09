import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ThirstType,
  ThermalType,
  ActivityType,
  EmbryologicalLayer,
  AggravationDuration,
  AmeliorationPattern,
  SymptomEvolution,
} from '@/features/expert-systems/types';

export type ExpertSystemType =
  | 'vijayakar'
  | 'tempraz'
  | 'sehgal'
  | 'scholten'
  | 'kent';

export interface ExpertSystemsState {
  activeSystem: ExpertSystemType;
  // Vijayakar state
  selectedThirst: ThirstType;
  selectedThermal: ThermalType;
  selectedActivity: ActivityType;
  previousLayer: EmbryologicalLayer;
  currentLayer: EmbryologicalLayer;
  // Tempraz state
  selectedTraits: string[];
  // Sehgal state
  sehgalQuery: string;
  // Scholten state
  selectedSeries: number;
  selectedStage: number;
  // Kent 12 Observations state
  kentAggravation: AggravationDuration;
  kentAmelioration: AmeliorationPattern;
  kentEvolution: SymptomEvolution;
  kentIsProver: boolean;
}

const initialState: ExpertSystemsState = {
  activeSystem: 'vijayakar',
  selectedThirst: 'Thirsty',
  selectedThermal: 'Hot',
  selectedActivity: 'Restless',
  previousLayer: 'Ectoderm',
  currentLayer: 'Endoderm',
  selectedTraits: ['Optimistic and enthusiastic', 'Socially outgoing'],
  sehgalQuery: '',
  selectedSeries: 3,
  selectedStage: 1,
  // Kent Initial state
  kentAggravation: 'short_strong',
  kentAmelioration: 'rapid_permanent',
  kentEvolution: 'normal_progression',
  kentIsProver: false,
};

export const expertSystemsSlice = createSlice({
  name: 'expertSystems',
  initialState,
  reducers: {
    setActiveSystem: (state, action: PayloadAction<ExpertSystemType>) => {
      state.activeSystem = action.payload;
    },
    setThirst: (state, action: PayloadAction<ThirstType>) => {
      state.selectedThirst = action.payload;
    },
    setThermal: (state, action: PayloadAction<ThermalType>) => {
      state.selectedThermal = action.payload;
    },
    setActivity: (state, action: PayloadAction<ActivityType>) => {
      state.selectedActivity = action.payload;
    },
    setEmbryologicalLayers: (
      state,
      action: PayloadAction<{ previous: EmbryologicalLayer; current: EmbryologicalLayer }>
    ) => {
      state.previousLayer = action.payload.previous;
      state.currentLayer = action.payload.current;
    },
    toggleTrait: (state, action: PayloadAction<string>) => {
      const trait = action.payload;
      if (state.selectedTraits.includes(trait)) {
        state.selectedTraits = state.selectedTraits.filter((t) => t !== trait);
      } else {
        state.selectedTraits.push(trait);
      }
    },
    clearTraits: (state) => {
      state.selectedTraits = [];
    },
    setSehgalQuery: (state, action: PayloadAction<string>) => {
      state.sehgalQuery = action.payload;
    },
    setScholtenCoordinates: (
      state,
      action: PayloadAction<{ series: number; stage: number }>
    ) => {
      state.selectedSeries = action.payload.series;
      state.selectedStage = action.payload.stage;
    },
    // Kent Reducers
    setKentAggravation: (state, action: PayloadAction<AggravationDuration>) => {
      state.kentAggravation = action.payload;
    },
    setKentAmelioration: (state, action: PayloadAction<AmeliorationPattern>) => {
      state.kentAmelioration = action.payload;
    },
    setKentEvolution: (state, action: PayloadAction<SymptomEvolution>) => {
      state.kentEvolution = action.payload;
    },
    setKentIsProver: (state, action: PayloadAction<boolean>) => {
      state.kentIsProver = action.payload;
    },
    resetKentObservationInput: (state) => {
      state.kentAggravation = 'short_strong';
      state.kentAmelioration = 'rapid_permanent';
      state.kentEvolution = 'normal_progression';
      state.kentIsProver = false;
    },
    resetAllSystems: () => initialState,
  },
});

export const {
  setActiveSystem,
  setThirst,
  setThermal,
  setActivity,
  setEmbryologicalLayers,
  toggleTrait,
  clearTraits,
  setSehgalQuery,
  setScholtenCoordinates,
  setKentAggravation,
  setKentAmelioration,
  setKentEvolution,
  setKentIsProver,
  resetKentObservationInput,
  resetAllSystems,
} = expertSystemsSlice.actions;

export default expertSystemsSlice.reducer;
