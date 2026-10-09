import { describe, it, expect } from 'vitest';
import expertSystemsReducer, {
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
  type ExpertSystemsState,
} from '../slices/expertSystemsSlice';

describe('expertSystemsSlice Redux State Management', () => {
  const getInitialState = (): ExpertSystemsState => ({
    activeSystem: 'vijayakar',
    selectedThirst: 'Thirsty',
    selectedThermal: 'Hot',
    selectedActivity: 'Restless',
    previousLayer: 'Ectoderm',
    currentLayer: 'Endoderm',
    selectedTraits: ['Optimistic and enthusiastic'],
    sehgalQuery: '',
    selectedSeries: 3,
    selectedStage: 1,
    kentAggravation: 'short_strong',
    kentAmelioration: 'rapid_permanent',
    kentEvolution: 'normal_progression',
    kentIsProver: false,
  });

  describe('System Navigation', () => {
    it('switches between expert systems including Kent', () => {
      const state = getInitialState();
      let s = expertSystemsReducer(state, setActiveSystem('tempraz'));
      expect(s.activeSystem).toBe('tempraz');

      s = expertSystemsReducer(s, setActiveSystem('scholten'));
      expect(s.activeSystem).toBe('scholten');

      s = expertSystemsReducer(s, setActiveSystem('kent'));
      expect(s.activeSystem).toBe('kent');
    });
  });

  describe('Vijayakar Flowchart State', () => {
    it('updates acute triad controls', () => {
      let state = getInitialState();
      state = expertSystemsReducer(state, setThirst('Thirstless'));
      state = expertSystemsReducer(state, setThermal('Chilly'));
      state = expertSystemsReducer(state, setActivity('Dull'));

      expect(state.selectedThirst).toBe('Thirstless');
      expect(state.selectedThermal).toBe('Chilly');
      expect(state.selectedActivity).toBe('Dull');
    });

    it('updates embryological trajectory layers', () => {
      const state = getInitialState();
      const nextState = expertSystemsReducer(
        state,
        setEmbryologicalLayers({ previous: 'Endoderm', current: 'Ectoderm' })
      );

      expect(nextState.previousLayer).toBe('Endoderm');
      expect(nextState.currentLayer).toBe('Ectoderm');
    });
  });

  describe('Tempraz Trait Management', () => {
    it('toggles traits on and off', () => {
      let state = getInitialState();
      // Add a new trait
      state = expertSystemsReducer(state, toggleTrait('Impatient and irritable'));
      expect(state.selectedTraits).toContain('Impatient and irritable');

      // Toggle off the original trait
      state = expertSystemsReducer(state, toggleTrait('Optimistic and enthusiastic'));
      expect(state.selectedTraits).not.toContain('Optimistic and enthusiastic');
    });

    it('clears all selected traits', () => {
      const state = getInitialState();
      const nextState = expertSystemsReducer(state, clearTraits());
      expect(nextState.selectedTraits).toHaveLength(0);
    });
  });

  describe('Sehgal and Scholten Inputs', () => {
    it('updates Sehgal patient narrative query', () => {
      const state = getInitialState();
      const nextState = expertSystemsReducer(
        state,
        setSehgalQuery('I feel like floating')
      );
      expect(nextState.sehgalQuery).toBe('I feel like floating');
    });

    it('updates Scholten Series and Stage coordinates', () => {
      const state = getInitialState();
      const nextState = expertSystemsReducer(
        state,
        setScholtenCoordinates({ series: 6, stage: 11 })
      );
      expect(nextState.selectedSeries).toBe(6);
      expect(nextState.selectedStage).toBe(11);
    });

    it('resets state to defaults', () => {
      let state = getInitialState();
      state = expertSystemsReducer(state, setActiveSystem('scholten'));
      state = expertSystemsReducer(state, clearTraits());

      const resetState = expertSystemsReducer(state, resetAllSystems());
      expect(resetState.activeSystem).toBe('vijayakar');
      expect(resetState.selectedTraits.length).toBeGreaterThan(0);
    });
  });

  describe('Kent 12 Prognostic Observations State', () => {
    it('updates follow-up evaluation inputs', () => {
      let state = getInitialState();
      state = expertSystemsReducer(state, setKentAggravation('long_severe'));
      state = expertSystemsReducer(state, setKentAmelioration('slow_steady'));
      state = expertSystemsReducer(state, setKentEvolution('old_symptoms_return'));
      state = expertSystemsReducer(state, setKentIsProver(true));

      expect(state.kentAggravation).toBe('long_severe');
      expect(state.kentAmelioration).toBe('slow_steady');
      expect(state.kentEvolution).toBe('old_symptoms_return');
      expect(state.kentIsProver).toBe(true);
    });

    it('resets Kent inputs to ideal defaults', () => {
      let state = getInitialState();
      state = expertSystemsReducer(state, setKentAggravation('prolonged_decline'));
      state = expertSystemsReducer(state, setKentIsProver(true));

      state = expertSystemsReducer(state, resetKentObservationInput());
      expect(state.kentAggravation).toBe('short_strong');
      expect(state.kentAmelioration).toBe('rapid_permanent');
      expect(state.kentIsProver).toBe(false);
    });
  });
});
