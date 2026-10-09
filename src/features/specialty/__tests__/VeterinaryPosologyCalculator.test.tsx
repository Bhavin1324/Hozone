import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { specialtyReducer } from '@/app/store/slices/specialtySlice';
import { VeterinaryPosologyCalculator } from '../components/VeterinaryPosologyCalculator';
import { calculatePosology } from '../posologyCalculator';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      specialty: specialtyReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <VeterinaryPosologyCalculator />
      </Provider>
    ),
  };
}

describe('VeterinaryPosologyCalculator Component', () => {
  it('renders default canine posology calculation', () => {
    renderWithProviders();

    expect(screen.getByText(/Veterinary Posology & Dosing Calculator/i)).toBeDefined();
    expect(screen.getByText(/Target Animal Species/i)).toBeDefined();
    expect(screen.getByText(/30C to 200C/i)).toBeDefined();
  });

  it('switches species and updates precaution banner', () => {
    renderWithProviders();

    // Click Feline species button
    const felineBtn = screen.getByRole('button', { name: /^Feline$/i });
    fireEvent.click(felineBtn);

    // Feline alcohol contraindication must appear
    expect(screen.getByText(/Critical Clinical Precaution \(Feline\)/i)).toBeDefined();
    expect(screen.getByText(/cannot metabolize ethyl alcohol/i)).toBeDefined();
  });

  it('calculates posology accurately across clinical acuity levels', () => {
    // Hyper-acute test
    const hyperResult = calculatePosology('Canine', 25, 'Hyper-acute');
    expect(hyperResult.recommendedPotencyRange).toBe('200C to 1M');
    expect(hyperResult.frequency).toContain('Every 15-30 minutes');

    // Sub-acute test
    const subResult = calculatePosology('Equine', 500, 'Sub-acute');
    expect(subResult.recommendedPotencyRange).toBe('30C to 200C');
    expect(subResult.dilutionInstructions).toContain('100ml');

    // Chronic test
    const chronicResult = calculatePosology('Avian', 0.4, 'Chronic');
    expect(chronicResult.recommendedPotencyRange).toContain('LM');
    expect(chronicResult.specialPrecautions).toContain('fatal tracheal aspiration');
  });
});
