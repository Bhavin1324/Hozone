import { describe, it, expect } from 'vitest';
import repertorizationReducer, {
  addRubric,
  removeRubric,
  setRubricWeight,
  toggleEliminating,
  toggleThermalFilter,
  toggleMiasmFilter,
  toggleKingdomFilter,
  clearFilters,
  setScoringModel,
  clearClipboard,
  toggleSelectClipboardRubric,
  clearSelectedClipboardRubrics,
  combineSelectedRubrics,
  uncombineRubric,
  setPolarityViewMode,
  setSelectedRepertoryId,
  toggleExpandRubric,
  setRubricViewMode,
} from '../slices/repertorizationSlice';
import { INITIAL_RUBRICS } from '@/core/storage/initialData';

describe('Repertorization Redux Slice', () => {
  const initial = repertorizationReducer(undefined, { type: 'unknown' });

  it('initializes with empty case clipboard and default coverage_first scoring model', () => {
    expect(initial.activeRubrics).toHaveLength(0);
    expect(initial.scoringModel).toBe('coverage_first');
    expect(initial.filters.thermals).toHaveLength(0);
    expect(initial.filters.miasms).toHaveLength(0);
    expect(initial.filters.kingdoms).toHaveLength(0);
  });

  it('adds rubrics to active clipboard with default weight x1 and eliminates false', () => {
    const rubric = INITIAL_RUBRICS[0];
    const state = repertorizationReducer(initial, addRubric(rubric));

    expect(state.activeRubrics).toHaveLength(1);
    expect(state.activeRubrics[0].rubricId).toBe(rubric.id);
    expect(state.activeRubrics[0].weight).toBe(1);
    expect(state.activeRubrics[0].isEliminating).toBe(false);
  });

  it('prevents duplicate rubric additions', () => {
    const rubric = INITIAL_RUBRICS[0];
    let state = repertorizationReducer(initial, addRubric(rubric));
    state = repertorizationReducer(state, addRubric(rubric));

    expect(state.activeRubrics).toHaveLength(1);
  });

  it('removes rubrics from active clipboard', () => {
    const rubric1 = INITIAL_RUBRICS[0];
    const rubric2 = INITIAL_RUBRICS[1];
    let state = repertorizationReducer(initial, addRubric(rubric1));
    state = repertorizationReducer(state, addRubric(rubric2));

    expect(state.activeRubrics).toHaveLength(2);

    state = repertorizationReducer(state, removeRubric(rubric1.id));
    expect(state.activeRubrics).toHaveLength(1);
    expect(state.activeRubrics[0].rubricId).toBe(rubric2.id);
  });

  it('updates rubric weight multiplier', () => {
    const rubric = INITIAL_RUBRICS[0];
    let state = repertorizationReducer(initial, addRubric(rubric));
    state = repertorizationReducer(state, setRubricWeight({ rubricId: rubric.id, weight: 4 }));

    expect(state.activeRubrics[0].weight).toBe(4);
  });

  it('toggles elimination flag on recorded rubric', () => {
    const rubric = INITIAL_RUBRICS[0];
    let state = repertorizationReducer(initial, addRubric(rubric));
    expect(state.activeRubrics[0].isEliminating).toBe(false);

    state = repertorizationReducer(state, toggleEliminating(rubric.id));
    expect(state.activeRubrics[0].isEliminating).toBe(true);

    state = repertorizationReducer(state, toggleEliminating(rubric.id));
    expect(state.activeRubrics[0].isEliminating).toBe(false);
  });

  it('toggles strategic filters and allows clearing all filters', () => {
    let state = repertorizationReducer(initial, toggleThermalFilter('Hot'));
    expect(state.filters.thermals).toContain('Hot');

    state = repertorizationReducer(state, toggleMiasmFilter('Sycosis'));
    expect(state.filters.miasms).toContain('Sycosis');

    state = repertorizationReducer(state, toggleKingdomFilter('Plant'));
    expect(state.filters.kingdoms).toContain('Plant');

    // Toggling off
    state = repertorizationReducer(state, toggleThermalFilter('Hot'));
    expect(state.filters.thermals).not.toContain('Hot');

    // Resetting all
    state = repertorizationReducer(state, clearFilters());
    expect(state.filters.thermals).toHaveLength(0);
    expect(state.filters.miasms).toHaveLength(0);
    expect(state.filters.kingdoms).toHaveLength(0);
  });

  it('updates scoring model and clears clipboard', () => {
    let state = repertorizationReducer(initial, setScoringModel('weighted_sum'));
    expect(state.scoringModel).toBe('weighted_sum');

    state = repertorizationReducer(state, addRubric(INITIAL_RUBRICS[0]));
    state = repertorizationReducer(state, addRubric(INITIAL_RUBRICS[1]));
    expect(state.activeRubrics).toHaveLength(2);

    state = repertorizationReducer(state, clearClipboard());
    expect(state.activeRubrics).toHaveLength(0);
  });

  it('handles multi-select clipboard toggling and clearing', () => {
    let state = repertorizationReducer(initial, toggleSelectClipboardRubric('rub-1'));
    expect(state.selectedClipboardIds).toContain('rub-1');

    state = repertorizationReducer(state, toggleSelectClipboardRubric('rub-2'));
    expect(state.selectedClipboardIds).toHaveLength(2);

    state = repertorizationReducer(state, toggleSelectClipboardRubric('rub-1'));
    expect(state.selectedClipboardIds).toEqual(['rub-2']);

    state = repertorizationReducer(state, clearSelectedClipboardRubrics());
    expect(state.selectedClipboardIds).toHaveLength(0);
  });

  it('combines multiple rubrics into a synthetic rubric and restores on uncombine', () => {
    const rub1 = INITIAL_RUBRICS[0];
    const rub2 = INITIAL_RUBRICS[1];

    let state = repertorizationReducer(initial, addRubric(rub1));
    state = repertorizationReducer(state, addRubric(rub2));
    expect(state.activeRubrics).toHaveLength(2);

    // Combine them
    const combinedRubric = {
      ...rub1,
      id: 'comb-test-12',
      fullPath: '[Combined: 2 Rubrics] Anxiety + Fear',
      path: '[Combined: 2 Rubrics]',
      isCombined: true as const,
      sourceRubricIds: [rub1.id, rub2.id],
      mergeStrategy: 'max_grade' as const,
    };

    state = repertorizationReducer(state, combineSelectedRubrics({ combinedRubric }));
    expect(state.activeRubrics).toHaveLength(1);
    expect(state.activeRubrics[0].rubricId).toBe('comb-test-12');
    expect(state.activeRubrics[0].isCombined).toBe(true);
    expect(state.combinedRubricsMap['comb-test-12']).toBeDefined();

    // Uncombine
    state = repertorizationReducer(
      state,
      uncombineRubric({
        combinedRubricId: 'comb-test-12',
        restoredRubrics: [
          { rubricId: rub1.id, fullPath: rub1.fullPath, chapterName: rub1.chapterName, weight: 1, isEliminating: false },
          { rubricId: rub2.id, fullPath: rub2.fullPath, chapterName: rub2.chapterName, weight: 1, isEliminating: false },
        ],
      })
    );
    expect(state.activeRubrics).toHaveLength(2);
    expect(state.combinedRubricsMap['comb-test-12']).toBeUndefined();
  });

  it('toggles polarity view mode between standard and polarity', () => {
    let state = repertorizationReducer(initial, setPolarityViewMode('polarity'));
    expect(state.polarityViewMode).toBe('polarity');

    state = repertorizationReducer(state, setPolarityViewMode('standard'));
    expect(state.polarityViewMode).toBe('standard');
  });

  it('manages 43+ repertory selection and tree view expansion state (Phase C)', () => {
    let state = repertorizationReducer(initial, setSelectedRepertoryId('rep-complete-2024'));
    expect(state.selectedRepertoryId).toBe('rep-complete-2024');

    state = repertorizationReducer(state, toggleExpandRubric('rub-mind-anxiety'));
    // If it was in initial, toggling will remove it; if not, adds it
    const wasIn = initial.expandedRubricIds.includes('rub-mind-anxiety');
    expect(state.expandedRubricIds.includes('rub-mind-anxiety')).toBe(!wasIn);

    state = repertorizationReducer(state, setRubricViewMode('flat'));
    expect(state.rubricViewMode).toBe('flat');

    state = repertorizationReducer(state, setRubricViewMode('tree'));
    expect(state.rubricViewMode).toBe('tree');
  });
});
