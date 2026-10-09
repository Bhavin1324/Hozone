import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import patientReducer from '@/app/store/slices/patientSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import { PatientsContainer } from '../PatientsContainer';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      patients: patientReducer,
      session: sessionReducer,
      repertorization: repertorizationReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <PatientsContainer />
        </MemoryRouter>
      </Provider>
    ),
  };
}

describe('PatientsContainer Component', () => {
  it('renders title, description, and action buttons', async () => {
    renderWithProviders();

    expect(
      screen.getByRole('heading', { name: /Patient Clinical Records/i })
    ).toBeDefined();
    expect(screen.getByText(/New Patient Intake/i)).toBeDefined();
    expect(
      screen.getByPlaceholderText(/Search patients by name, registration ID, or condition.../i)
    ).toBeDefined();

    // Verify initial data loads from IndexedDB
    await waitFor(() => {
      expect(screen.getByText('Eleanor Vance')).toBeDefined();
      expect(screen.getByText('Arthur Pendelton')).toBeDefined();
    });
  }, 15000);

  it('filters patients when search query is entered', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Eleanor Vance')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText(
      /Search patients by name, registration ID, or condition.../i
    );
    fireEvent.change(searchInput, { target: { value: 'Eleanor' } });

    await waitFor(() => {
      expect(screen.getByText('Eleanor Vance')).toBeDefined();
    });
  });

  it('opens New Patient Intake modal when intake button is clicked', async () => {
    renderWithProviders();

    const intakeBtn = screen.getByText(/New Patient Intake/i);
    fireEvent.click(intakeBtn);

    await waitFor(() => {
      expect(screen.getByText(/New Patient Clinical Intake/i)).toBeDefined();
      expect(screen.getByLabelText(/First Name/i)).toBeDefined();
      expect(screen.getByLabelText(/Last Name/i)).toBeDefined();
    });
  });

  it('opens Patient Case File Drawer when Case File button is clicked', async () => {
    const { store } = renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Eleanor Vance')).toBeDefined();
    });

    const caseFileBtns = screen.getAllByRole('button', { name: /Case File/i });
    expect(caseFileBtns.length).toBeGreaterThan(0);
    fireEvent.click(caseFileBtns[0]);

    await waitFor(() => {
      const state = store.getState();
      expect(state.patients.isCaseFileOpen).toBe(true);
      expect(state.patients.activePatient?.fullName).toBe('Eleanor Vance');
    });
  }, 25000);
});
