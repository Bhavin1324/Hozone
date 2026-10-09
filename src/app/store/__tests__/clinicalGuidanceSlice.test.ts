import { describe, it, expect } from 'vitest';
import reducer, {
  setActiveTab,
  setTipsSearchQuery,
  setTipsAuthorFilter,
  setTipsOrganFilter,
  setCasesSearchQuery,
  setCasesAuthorFilter,
  setNutritionSearchQuery,
  setNutritionCategoryFilter,
  setTincturesSearchQuery,
  setTincturesAffinityFilter,
  setSelectedTinctureId,
  toggleBookmarkTip,
  resetAllFilters,
  type ClinicalGuidanceState,
} from '../slices/clinicalGuidanceSlice';

describe('Clinical Guidance Redux Slice', () => {
  const initial: ClinicalGuidanceState = {
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

  it('handles setActiveTab', () => {
    const next = reducer(initial, setActiveTab('cases'));
    expect(next.activeTab).toBe('cases');
  });

  it('handles setTipsSearchQuery and filters', () => {
    let state = reducer(initial, setTipsSearchQuery('Bryonia'));
    state = reducer(state, setTipsAuthorFilter('Dr. J.T. Kent'));
    state = reducer(state, setTipsOrganFilter('Respiratory'));
    expect(state.tipsSearchQuery).toBe('Bryonia');
    expect(state.tipsAuthorFilter).toBe('Dr. J.T. Kent');
    expect(state.tipsOrganFilter).toBe('Respiratory');
  });

  it('handles setCasesSearchQuery and author filter', () => {
    let state = reducer(initial, setCasesSearchQuery('asthma'));
    state = reducer(state, setCasesAuthorFilter('Dr. Samuel Hahnemann'));
    expect(state.casesSearchQuery).toBe('asthma');
    expect(state.casesAuthorFilter).toBe('Dr. Samuel Hahnemann');
  });

  it('handles setNutritionSearchQuery and category', () => {
    let state = reducer(initial, setNutritionSearchQuery('uric acid'));
    state = reducer(state, setNutritionCategoryFilter('Metabolic'));
    expect(state.nutritionSearchQuery).toBe('uric acid');
    expect(state.nutritionCategoryFilter).toBe('Metabolic');
  });

  it('handles tinctures search, affinity, and selected id', () => {
    let state = reducer(initial, setTincturesSearchQuery('arnica'));
    state = reducer(state, setTincturesAffinityFilter('Capillary'));
    state = reducer(state, setSelectedTinctureId('tinc-1'));
    expect(state.tincturesSearchQuery).toBe('arnica');
    expect(state.tincturesAffinityFilter).toBe('Capillary');
    expect(state.selectedTinctureId).toBe('tinc-1');
  });

  it('handles toggleBookmarkTip adding and removing tip id', () => {
    let state = reducer(initial, toggleBookmarkTip('tip-123'));
    expect(state.bookmarkedTipIds).toContain('tip-123');

    state = reducer(state, toggleBookmarkTip('tip-123'));
    expect(state.bookmarkedTipIds).not.toContain('tip-123');
  });

  it('handles resetAllFilters restoring clean search states', () => {
    let state = reducer(initial, setTipsSearchQuery('something'));
    state = reducer(state, setTipsAuthorFilter('Author'));
    state = reducer(state, setCasesSearchQuery('case search'));
    state = reducer(state, resetAllFilters());

    expect(state.tipsSearchQuery).toBe('');
    expect(state.tipsAuthorFilter).toBeNull();
    expect(state.casesSearchQuery).toBe('');
  });
});
