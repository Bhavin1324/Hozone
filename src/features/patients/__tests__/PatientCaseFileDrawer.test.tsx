import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer, {
  setActivePatient,
  setCaseFileOpen,
} from '@/app/store/slices/patientSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import { PatientCaseFileDrawer } from '../components/PatientCaseFileDrawer';
import { INITIAL_PATIENTS } from '@/core/storage/patientsInitialData';

function renderDrawer() {
  const store = configureStore({
    reducer: {
      patients: patientReducer,
      session: sessionReducer,
    },
  });

  // Activate first sample patient and open drawer
  store.dispatch(setActivePatient(INITIAL_PATIENTS[0]));
  store.dispatch(setCaseFileOpen(true));

  return {
    store,
    ...render(
      <Provider store={store}>
        <PatientCaseFileDrawer />
      </Provider>
    ),
  };
}

describe('PatientCaseFileDrawer Component', () => {
  it('renders patient name, registration ID, constitutional banner, and tabs', async () => {
    renderDrawer();

    expect(screen.getByText('Eleanor Vance')).toBeDefined();
    expect(screen.getByText('PT-2026-0001')).toBeDefined();
    expect(screen.getByText(/Thermal State:/i)).toBeDefined();
    expect(screen.getByText(/Dominant Miasm:/i)).toBeDefined();

    expect(screen.getByText(/Consultations Timeline/i)).toBeDefined();
    expect(screen.getByText(/Repertorial Totality/i)).toBeDefined();
    expect(screen.getByText(/Prescriptions/i)).toBeDefined();
    expect(screen.getByText(/Constitutional Anamnesis/i)).toBeDefined();
    expect(screen.getByText(/Appointments/i)).toBeDefined();
  });

  it('displays consultations in timeline from IndexedDB', async () => {
    renderDrawer();

    await waitFor(() => {
      expect(
        screen.getByText(/Throbbing right-sided hemicrania with nausea/i)
      ).toBeDefined();
    });
  });

  it('triggers New Consultation modal open when action button is clicked', async () => {
    const { store } = renderDrawer();

    const newConsultBtn = screen.getByRole('button', { name: /New Consultation/i });
    fireEvent.click(newConsultBtn);

    const state = store.getState();
    expect(state.patients.isConsultationModalOpen).toBe(true);
  });
});
