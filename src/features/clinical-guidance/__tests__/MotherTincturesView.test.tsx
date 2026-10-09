import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import clinicalGuidanceReducer from '@/app/store/slices/clinicalGuidanceSlice';
import materiaMedicaReducer from '@/app/store/slices/materiaMedicaSlice';
import { MotherTincturesView } from '../components/MotherTincturesView';

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
        <MotherTincturesView />
      </MemoryRouter>
    </Provider>
  );
}

describe('MotherTincturesView Component', () => {
  it('renders search input and organ affinity filters', async () => {
    renderWithProviders();

    expect(
      screen.getByPlaceholderText(/Search mother tinctures by name, organ, or condition/i)
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /^All$/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /^Skin$/i })).toBeDefined();
  });

  it('loads mother tinctures with dosage and external application guidance', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText(/Arnica Montana Q/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Calendula Officinalis Q/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Internal Posology & Drop Dosage/i).length).toBeGreaterThan(0);
    });
  });
});
