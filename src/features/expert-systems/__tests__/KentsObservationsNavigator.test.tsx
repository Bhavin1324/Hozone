import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import expertSystemsReducer from '@/app/store/slices/expertSystemsSlice';
import { KentsObservationsNavigator } from '../components/KentsObservationsNavigator';
import { INITIAL_KENT_OBSERVATIONS } from '@/core/storage/kentObservationsData';

function renderWithStore() {
  const store = configureStore({
    reducer: {
      expertSystems: expertSystemsReducer,
    },
  });

  return render(
    <Provider store={store}>
      <KentsObservationsNavigator rules={INITIAL_KENT_OBSERVATIONS} />
    </Provider>
  );
}

describe('KentsObservationsNavigator Component', () => {
  it('renders header, diagnostic diagnosis, and action directives', () => {
    renderWithStore();

    expect(screen.getByText(/Dr. James Tyler Kent: Twelve Prognostic Observations/i)).toBeDefined();
    expect(screen.getByText(/Prescription Outcome Diagnosis/i)).toBeDefined();
    expect(screen.getByText(/Required Physician Action Directive/i)).toBeDefined();
    expect(screen.getByText(/Repetition Protocol & Warnings/i)).toBeDefined();
  });

  it('updates diagnosis to Observation 12 (Suppression Danger) when symptoms move inward', () => {
    renderWithStore();

    const inwardRadio = screen.getByLabelText(/Symptoms Take Wrong Direction/i);
    fireEvent.click(inwardRadio);

    expect(screen.getByText(/Observation 12: Symptoms Take the Wrong Direction/i)).toBeDefined();
    expect(screen.getByText(/ANTIDOTE IMMEDIATELY/i)).toBeDefined();
  });

  it('updates diagnosis to Observation 11 when old symptoms return (Hering’s Law)', () => {
    renderWithStore();

    const oldSymptomsRadio = screen.getByLabelText(/Old Symptoms Reappear/i);
    fireEvent.click(oldSymptomsRadio);

    expect(screen.getByText(/Observation 11: Old Symptoms Are Observed to Reappear/i)).toBeDefined();
    expect(screen.getByText(/REJOICE AND DO NOT TOUCH/i)).toBeDefined();
  });

  it('resets inputs when Reset Evaluation button is clicked', () => {
    renderWithStore();

    const inwardRadio = screen.getByLabelText(/Symptoms Take Wrong Direction/i);
    fireEvent.click(inwardRadio);
    expect(screen.getByText(/Observation 12/i)).toBeDefined();

    const resetBtn = screen.getByRole('button', { name: /Reset Evaluation/i });
    fireEvent.click(resetBtn);

    // Default observation 3 restored
    expect(screen.getByText(/Observation 3: Quick, Short Aggravation/i)).toBeDefined();
  });
});
