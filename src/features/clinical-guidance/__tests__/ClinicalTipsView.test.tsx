import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import clinicalGuidanceReducer from '@/app/store/slices/clinicalGuidanceSlice';
import materiaMedicaReducer from '@/app/store/slices/materiaMedicaSlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import { ClinicalTipsView } from '../components/ClinicalTipsView';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      clinicalGuidance: clinicalGuidanceReducer,
      materiaMedica: materiaMedicaReducer,
      repertorization: repertorizationReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ClinicalTipsView />
      </MemoryRouter>
    </Provider>
  );
}

describe('ClinicalTipsView Component', () => {
  it('renders search input and organ system filter chips', async () => {
    renderWithProviders();

    expect(
      screen.getByPlaceholderText(/Search pearls by remedy, condition, or keyword/i)
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /^All$/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^Respiratory$/i })).toBeDefined();
  });

  it('loads and renders clinical pearls', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Aconitum Napellus/i)).toBeDefined();
      expect(screen.getByText(/Bryonia Alba/i)).toBeDefined();
    });
  });
});
