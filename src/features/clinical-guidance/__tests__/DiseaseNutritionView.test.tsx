import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import clinicalGuidanceReducer from '@/app/store/slices/clinicalGuidanceSlice';
import materiaMedicaReducer from '@/app/store/slices/materiaMedicaSlice';
import { DiseaseNutritionView } from '../components/DiseaseNutritionView';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      clinicalGuidance: clinicalGuidanceReducer,
      materiaMedica: materiaMedicaReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DiseaseNutritionView />
      </MemoryRouter>
    </Provider>
  );
}

describe('DiseaseNutritionView Component', () => {
  it('renders search input and category filters', async () => {
    renderWithProviders();

    expect(
      screen.getByPlaceholderText(/Search dietary regimens by condition/i)
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /^All$/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^Metabolic$/i })).toBeDefined();
  });

  it('loads disease nutrition conditions and displays protocols', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText(/Gout & Hyperuricemia/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Recommended Foods to Favor/i)).toBeDefined();
      expect(screen.getByText(/Forbidden \/ Foods to Strictly Avoid/i)).toBeDefined();
      expect(screen.getByText(/Homeopathic Antidote & Dietary Caution/i)).toBeDefined();
    });
  });

  it('switches active condition on sidebar button click', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText(/Gout & Hyperuricemia/i).length).toBeGreaterThan(0);
    });

    const renalBtns = screen.getAllByText(/Renal Calculi/i);
    fireEvent.click(renalBtns[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/Renal Calculi \(Nephrolithiasis\)/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Barley water/i)).toBeDefined();
    });
  });
});
