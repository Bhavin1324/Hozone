import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import { specialtyReducer } from '@/app/store/slices/specialtySlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import { SpecialtyContainer } from '../SpecialtyContainer';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      specialty: specialtyReducer,
      repertorization: repertorizationReducer,
      session: sessionReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <SpecialtyContainer />
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('SpecialtyContainer Component', () => {
  it('renders header, 100% parity badge, and 4 tab triggers', () => {
    renderWithProviders();

    expect(
      screen.getByRole('heading', { name: /Specialty Repertories & Veterinary Extensions/i })
    ).toBeDefined();
    expect(screen.getByText(/100% Hompath Zomeo Elite Parity/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Specialty Repertories/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Veterinary Repertory/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Posology & Dosing/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Veterinary Cases/i })).toBeDefined();
  });

  it('switches between tabs on click', async () => {
    renderWithProviders();

    // Default tab is Specialty Repertories - wait for async data
    await waitFor(() => {
      expect(screen.getByText(/Pneumonias & Children Types Repertory/i)).toBeDefined();
    });

    // Switch to Posology & Dosing tab
    const posologyTab = screen.getByRole('button', { name: /Posology & Dosing/i });
    fireEvent.click(posologyTab);

    await waitFor(() => {
      expect(screen.getByText(/Veterinary Posology & Dosing Calculator/i)).toBeDefined();
      expect(screen.getByText(/Target Animal Species/i)).toBeDefined();
    });

    // Switch to Veterinary Cases tab
    const casesTab = screen.getByRole('button', { name: /Veterinary Cases/i });
    fireEvent.click(casesTab);

    await waitFor(() => {
      expect(screen.getByText(/All Animal Cases/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Search veterinary cured cases/i)).toBeDefined();
    });

    // Switch to Veterinary Repertory tab
    const vetRepTab = screen.getByRole('button', { name: /Veterinary Repertory/i });
    fireEvent.click(vetRepTab);

    await waitFor(() => {
      expect(screen.getByText(/All Animal Species/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Search veterinary rubrics/i)).toBeDefined();
    });
  });
});
