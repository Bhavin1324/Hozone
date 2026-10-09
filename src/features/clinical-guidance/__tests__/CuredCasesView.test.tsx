import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import clinicalGuidanceReducer from '@/app/store/slices/clinicalGuidanceSlice';
import materiaMedicaReducer from '@/app/store/slices/materiaMedicaSlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import { CuredCasesView } from '../components/CuredCasesView';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      clinicalGuidance: clinicalGuidanceReducer,
      materiaMedica: materiaMedicaReducer,
      repertorization: repertorizationReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <CuredCasesView />
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('CuredCasesView Component', () => {
  it('renders search bar and case cards', async () => {
    renderWithProviders();

    expect(
      screen.getByPlaceholderText(/Search cases by diagnosis, remedy, author/i)
    ).toBeDefined();

    await waitFor(() => {
      expect(
        screen.getByText(/Acute Pleuritic Stitch Cured with Bryonia/i)
      ).toBeDefined();
    });
  });

  it('exports rubrics to repertorization slice when Export Rubrics button is clicked', async () => {
    const { store } = renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText(/Acute Pleuritic Stitch Cured with Bryonia/i)
      ).toBeDefined();
    });

    const exportButtons = screen.getAllByRole('button', { name: /Export Rubrics/i });
    expect(exportButtons.length).toBeGreaterThan(0);

    fireEvent.click(exportButtons[0]);

    // Check that rubrics were added to repertorization state
    const state = store.getState();
    expect(state.repertorization.activeRubrics.length).toBeGreaterThan(0);
  });

  it('opens Anamnesis details modal on click', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText(/Acute Pleuritic Stitch Cured with Bryonia/i)
      ).toBeDefined();
    });

    const anamnesisButtons = screen.getAllByRole('button', { name: /Anamnesis/i });
    fireEvent.click(anamnesisButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Initial Anamnesis & Baseline Symptoms/i)).toBeDefined();
    });
  });
});
