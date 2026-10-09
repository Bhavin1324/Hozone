import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import clinicalGuidanceReducer from '@/app/store/slices/clinicalGuidanceSlice';
import materiaMedicaReducer from '@/app/store/slices/materiaMedicaSlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import { ClinicalGuidanceContainer } from '../ClinicalGuidanceContainer';

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
        <ClinicalGuidanceContainer />
      </MemoryRouter>
    </Provider>
  );
}

describe('ClinicalGuidanceContainer Component', () => {
  it('renders header, title, and 4-tab segmented control', () => {
    renderWithProviders();

    expect(
      screen.getByRole('heading', { name: /Clinical Evidence & Practice Guidance/i })
    ).toBeDefined();
    expect(screen.getByText(/Bedside Companion/i)).toBeDefined();
    expect(screen.getByText('Clinical Pearls')).toBeDefined();
    expect(screen.getByText('Cured Cases Archive')).toBeDefined();
    expect(screen.getByText('Disease Nutrition')).toBeDefined();
    expect(screen.getByText('Mother Tinctures ($Q$)')).toBeDefined();
  });

  it('switches to Cured Cases tab when clicked', async () => {
    renderWithProviders();

    const casesTab = screen.getByText('Cured Cases Archive');
    fireEvent.click(casesTab);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search cases by diagnosis, remedy, author/i)
      ).toBeDefined();
    });
  });

  it('switches to Disease Nutrition tab when clicked', async () => {
    renderWithProviders();

    const nutTab = screen.getByText('Disease Nutrition');
    fireEvent.click(nutTab);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search dietary regimens by condition/i)
      ).toBeDefined();
    });
  });

  it('switches to Mother Tinctures tab when clicked', async () => {
    renderWithProviders();

    const tincTab = screen.getByText('Mother Tinctures ($Q$)');
    fireEvent.click(tincTab);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Search mother tinctures by name, organ, or condition/i)
      ).toBeDefined();
    });
  });
});
