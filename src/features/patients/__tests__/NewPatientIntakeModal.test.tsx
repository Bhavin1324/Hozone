import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '@/app/store/slices/patientSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import { NewPatientIntakeModal } from '../components/NewPatientIntakeModal';

function renderModal(open = true, onClose = () => {}) {
  const store = configureStore({
    reducer: {
      patients: patientReducer,
      session: sessionReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <NewPatientIntakeModal open={open} onClose={onClose} />
      </Provider>
    ),
  };
}

describe('NewPatientIntakeModal Component', () => {
  it('renders intake modal with title and tabs', () => {
    renderModal(true);

    expect(screen.getByText('New Patient Clinical Intake')).toBeDefined();
    expect(screen.getByText('Demographics')).toBeDefined();
    expect(screen.getByText('Constitutional Generals')).toBeDefined();
    expect(screen.getByText('Clinical Anamnesis')).toBeDefined();
  });

  it('allows filling demographics and submitting a new patient', async () => {
    let closed = false;
    const { store } = renderModal(true, () => {
      closed = true;
    });

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    fireEvent.change(firstNameInput, { target: { value: 'Harrison' } });
    fireEvent.change(lastNameInput, { target: { value: 'Wells' } });

    const submitBtn = screen.getByRole('button', { name: /Register & Open Case/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.patients.activePatient?.firstName).toBe('Harrison');
      expect(state.patients.activePatient?.lastName).toBe('Wells');
      expect(closed).toBe(true);
    });
  }, 25000);
});
