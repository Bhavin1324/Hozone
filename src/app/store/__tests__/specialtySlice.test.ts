import { describe, it, expect } from 'vitest';
import {
  specialtyReducer,
  setActiveTab,
  setSelectedRepertoryCode,
  setSelectedSpecies,
  setSearchQuery,
  setPosologyInput,
  setSelectedRubricId,
  setSelectedCaseId,
  resetFilters,
  type SpecialtyState,
} from '../slices/specialtySlice';

describe('Specialty Redux Slice', () => {
  const initial: SpecialtyState = {
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

  it('initializes with default clinical settings', () => {
    const state = specialtyReducer(undefined, { type: '@@INIT' });
    expect(state.activeTab).toBe('repertory');
    expect(state.selectedRepertoryCode).toBe('ALL');
    expect(state.selectedSpecies).toBe('ALL');
    expect(state.posologyInput.species).toBe('Canine');
  });

  it('switches active tab between repertory, veterinary, and posology', () => {
    let state = specialtyReducer(initial, setActiveTab('veterinary-repertory'));
    expect(state.activeTab).toBe('veterinary-repertory');

    state = specialtyReducer(state, setActiveTab('posology-calculator'));
    expect(state.activeTab).toBe('posology-calculator');

    state = specialtyReducer(state, setActiveTab('veterinary-cases'));
    expect(state.activeTab).toBe('veterinary-cases');
  });

  it('updates selected repertory code and search query', () => {
    let state = specialtyReducer(initial, setSelectedRepertoryCode('BORLAND'));
    expect(state.selectedRepertoryCode).toBe('BORLAND');

    state = specialtyReducer(state, setSearchQuery('lobar'));
    expect(state.searchQuery).toBe('lobar');
  });

  it('updates veterinary species filter', () => {
    const state = specialtyReducer(initial, setSelectedSpecies('Feline'));
    expect(state.selectedSpecies).toBe('Feline');
  });

  it('updates posology calculator parameters partially or fully', () => {
    let state = specialtyReducer(
      initial,
      setPosologyInput({ species: 'Equine', weightKg: 500, acuity: 'Hyper-acute' })
    );
    expect(state.posologyInput.species).toBe('Equine');
    expect(state.posologyInput.weightKg).toBe(500);
    expect(state.posologyInput.acuity).toBe('Hyper-acute');

    state = specialtyReducer(state, setPosologyInput({ weightKg: 450 }));
    expect(state.posologyInput.weightKg).toBe(450);
    expect(state.posologyInput.species).toBe('Equine');
  });

  it('tracks selected rubric and case IDs', () => {
    let state = specialtyReducer(initial, setSelectedRubricId('rub-123'));
    expect(state.selectedRubricId).toBe('rub-123');

    state = specialtyReducer(state, setSelectedCaseId('case-456'));
    expect(state.selectedCaseId).toBe('case-456');
  });

  it('resets all clinical filters to defaults', () => {
    const modified: SpecialtyState = {
      activeTab: 'veterinary-cases',
      selectedRepertoryCode: 'CLARKE_CLINICAL',
      selectedSpecies: 'Bovine',
      searchQuery: 'mastitis',
      posologyInput: { species: 'Bovine', weightKg: 600, acuity: 'Hyper-acute' },
      selectedRubricId: 'rub-1',
      selectedCaseId: 'case-2',
    };

    const state = specialtyReducer(modified, resetFilters());
    expect(state.selectedRepertoryCode).toBe('ALL');
    expect(state.selectedSpecies).toBe('ALL');
    expect(state.searchQuery).toBe('');
    expect(state.selectedRubricId).toBeNull();
    expect(state.selectedCaseId).toBeNull();
  });
});
