import { describe, it, expect } from 'vitest';
import materiaMedicaReducer, {
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
  setCrossSearchMatchMode,
  setViewMode,
  resetCrossSearchFilters,
  type MateriaMedicaState,
} from '../slices/materiaMedicaSlice';

describe('materiaMedicaSlice Redux State Management', () => {
  const getInitialState = (): MateriaMedicaState => ({
    selectedRemedyIds: ['rem-lyc', 'rem-phos'],
    activeSection: 'keynotes',
    activeRemedyId: 'rem-sulph',
    selectedBookId: 'book-boericke',
    searchTerm: '',
    selectedKingdom: null,
    selectedThermal: null,
    crossSearchQuery: '',
    crossSearchBookFilters: [],
    crossSearchSectionFilters: [],
    crossSearchMatchMode: 'all',
    viewMode: 'monograph',
  });

  describe('Comparison Slot Management', () => {
    it('adds a remedy to compare if under maximum 4 slots', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, addRemedyToCompare('rem-calc'));

      expect(nextState.selectedRemedyIds).toHaveLength(3);
      expect(nextState.selectedRemedyIds).toContain('rem-calc');
    });

    it('enforces maximum 4 remedies limit in comparison slots', () => {
      let state = getInitialState();
      state = materiaMedicaReducer(state, addRemedyToCompare('rem-calc')); // 3rd
      state = materiaMedicaReducer(state, addRemedyToCompare('rem-sulph')); // 4th
      expect(state.selectedRemedyIds).toHaveLength(4);

      // Attempting to add 5th remedy should be ignored
      const cappedState = materiaMedicaReducer(state, addRemedyToCompare('rem-bell'));
      expect(cappedState.selectedRemedyIds).toHaveLength(4);
      expect(cappedState.selectedRemedyIds).not.toContain('rem-bell');
    });

    it('prevents duplicate additions to comparison slots', () => {
      const state = getInitialState(); // already has 'rem-lyc'
      const nextState = materiaMedicaReducer(state, addRemedyToCompare('rem-lyc'));

      expect(nextState.selectedRemedyIds).toHaveLength(2);
    });

    it('removes a remedy from comparison slots', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, removeRemedyFromCompare('rem-lyc'));

      expect(nextState.selectedRemedyIds).toHaveLength(1);
      expect(nextState.selectedRemedyIds).not.toContain('rem-lyc');
    });

    it('clears all remedies from comparison slots', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, clearComparison());

      expect(nextState.selectedRemedyIds).toHaveLength(0);
    });
  });

  describe('Section, Book and Remedy Navigation', () => {
    it('updates active comparison section', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setActiveSection('modalities'));

      expect(nextState.activeSection).toBe('modalities');
    });

    it('updates active monograph remedy ID', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setActiveRemedyId('rem-puls'));

      expect(nextState.activeRemedyId).toBe('rem-puls');
    });

    it('updates selected reference book ID', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setSelectedBookId('book-allen'));

      expect(nextState.selectedBookId).toBe('book-allen');
    });
  });

  describe('Search and Filter Controls', () => {
    it('updates search query term', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setSearchTerm('restlessness'));

      expect(nextState.searchTerm).toBe('restlessness');
    });

    it('updates kingdom filter selection', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setSelectedKingdom('Plant'));

      expect(nextState.selectedKingdom).toBe('Plant');
    });

    it('updates thermal filter selection', () => {
      const state = getInitialState();
      const nextState = materiaMedicaReducer(state, setSelectedThermal('Hot'));

      expect(nextState.selectedThermal).toBe('Hot');
    });
  });

  describe('Cross-Text Multi-Book Search Reducers', () => {
    it('updates cross-search query and match mode', () => {
      const state = getInitialState();
      let s = materiaMedicaReducer(state, setCrossSearchQuery('burning soles'));
      s = materiaMedicaReducer(s, setCrossSearchMatchMode('phrase'));

      expect(s.crossSearchQuery).toBe('burning soles');
      expect(s.crossSearchMatchMode).toBe('phrase');
    });

    it('toggles book filter chips', () => {
      const state = getInitialState();
      let s = materiaMedicaReducer(state, toggleCrossSearchBookFilter('book-allen'));
      expect(s.crossSearchBookFilters).toContain('book-allen');

      // Toggling again removes it
      s = materiaMedicaReducer(s, toggleCrossSearchBookFilter('book-allen'));
      expect(s.crossSearchBookFilters).not.toContain('book-allen');
    });

    it('toggles section filters and resets them', () => {
      const state = getInitialState();
      let s = materiaMedicaReducer(state, toggleCrossSearchSectionFilter('mind'));
      s = materiaMedicaReducer(s, toggleCrossSearchSectionFilter('keynotes'));
      s = materiaMedicaReducer(s, setCrossSearchBookFilters(['book-boericke']));
      expect(s.crossSearchSectionFilters).toEqual(['mind', 'keynotes']);

      s = materiaMedicaReducer(s, resetCrossSearchFilters());
      expect(s.crossSearchSectionFilters).toEqual([]);
      expect(s.crossSearchBookFilters).toEqual([]);
      expect(s.crossSearchMatchMode).toBe('all');
    });

    it('switches viewMode between monograph, search, and comparator', () => {
      const state = getInitialState();
      let s = materiaMedicaReducer(state, setViewMode('search'));
      expect(s.viewMode).toBe('search');

      s = materiaMedicaReducer(s, setViewMode('comparator'));
      expect(s.viewMode).toBe('comparator');
    });
  });
});
