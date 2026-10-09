import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer, {
  setActivePatient,
} from '@/app/store/slices/patientSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import repertorizationReducer, {
  addRubric,
} from '@/app/store/slices/repertorizationSlice';
import { NewConsultationModal } from '../components/NewConsultationModal';
import { INITIAL_PATIENTS } from '@/core/storage/patientsInitialData';
import type { Rubric } from '@/features/repertory/types';

const sampleRubric: Rubric = {
  id: 'test-rubric-migraine',
  chapterId: 'head',
  chapterName: 'HEAD',
  path: 'HEAD - PAIN - right side',
  fullPath: 'HEAD - PAIN - right side',
  depth: 2,
  remedyCount: 45,
  entries: [],
};

function renderModal(open = true, onClose = () => {}) {
  const store = configureStore({
    reducer: {
      patients: patientReducer,
      session: sessionReducer,
      repertorization: repertorizationReducer,
    },
  });

  store.dispatch(setActivePatient(INITIAL_PATIENTS[0]));
  store.dispatch(addRubric(sampleRubric));

  return {
    store,
    ...render(
      <Provider store={store}>
        <NewConsultationModal open={open} onClose={onClose} />
      </Provider>
    ),
  };
}

describe('NewConsultationModal Component', () => {
  it('renders consultation title, patient name, and tabs', () => {
    renderModal(true);

    expect(screen.getByText(/New Consultation & Prescription/i)).toBeDefined();
    expect(screen.getByText(/Eleanor Vance/i)).toBeDefined();
    expect(screen.getByText(/Chief Complaints & Vitals/i)).toBeDefined();
    expect(screen.getByText(/Attached Rubrics/i)).toBeDefined();
    expect(screen.getByText(/Posology & Prescription/i)).toBeDefined();
  });

  it('snapshots rubrics from repertory case clipboard', async () => {
    renderModal(true);

    const rubricsTab = screen.getByText(/Attached Rubrics/i);
    fireEvent.click(rubricsTab);

    const snapshotBtn = screen.getByRole('button', { name: /Snapshot Clipboard/i });
    fireEvent.click(snapshotBtn);

    await waitFor(() => {
      expect(screen.getByText('HEAD - PAIN - right side')).toBeDefined();
    });
  }, 15000);

  it('records clinical consultation and posology prescription', async () => {
    let closed = false;
    const { store } = renderModal(true, () => {
      closed = true;
    });

    const complaintsInput = screen.getByPlaceholderText(
      /Detailed modalities, location, sensation, concomitant symptoms/i
    );
    fireEvent.change(complaintsInput, {
      target: { value: 'Persistent episodic throbbing temporal cephalalgia.' },
    });

    const submitBtn = screen.getByRole('button', { name: /Record Consultation/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.patients.activePatientConsultations.length).toBeGreaterThan(0);
      expect(closed).toBe(true);
    });
  }, 15000);
});
