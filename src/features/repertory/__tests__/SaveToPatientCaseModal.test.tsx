import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer, { setActivePatient } from '@/app/store/slices/patientSlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import { SaveToPatientCaseModal } from '../components/SaveToPatientCaseModal';
import { deleteLocalCaseAnalysis } from '@/core/storage/indexedDbPatients';
import { INITIAL_PATIENTS } from '@/core/storage/patientsInitialData';
import type {
  ActiveCaseRubric,
  RepertorizationResultItem,
  PolarityAnalysisComputeOutput,
} from '../types';

function createModalStore(activePatientObj = INITIAL_PATIENTS[0]) {
  const store = configureStore({
    reducer: {
      patients: patientReducer,
      repertorization: repertorizationReducer,
      session: sessionReducer,
    },
  });
  if (activePatientObj) {
    store.dispatch(setActivePatient(activePatientObj));
  }
  return store;
}

const mockActiveRubrics: ActiveCaseRubric[] = [
  {
    rubricId: 'head-migraine-right',
    fullPath: 'HEAD - PAIN - right side',
    chapterName: 'HEAD',
    weight: 2,
    isEliminating: true,
  },
  {
    rubricId: 'stomach-nausea',
    fullPath: 'STOMACH - NAUSEA - headache, during',
    chapterName: 'STOMACH',
    weight: 1,
    isEliminating: false,
  },
];

const mockRankedRemedies: RepertorizationResultItem[] = [
  {
    remedy: {
      id: 'rem-sang',
      fullName: 'Sanguinaria Canadensis',
      abbreviation: 'sang.',
      commonName: 'Bloodroot',
      kingdom: 'Plant',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Right sided migraine',
    },
    coverageCount: 2,
    totalScore: 6,
    grades: {
      'head-migraine-right': 3,
      'stomach-nausea': 2,
    },
  },
];

describe('SaveToPatientCaseModal Component Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    const store = createModalStore();
    render(
      <Provider store={store}>
        <SaveToPatientCaseModal
          open={false}
          onClose={vi.fn()}
          repertoryId="rep-kent-en"
          repertoryName="Kent Repertory"
          activeRubrics={mockActiveRubrics}
          rankedRemedies={mockRankedRemedies}
          scoringModel="coverage_first"
        />
      </Provider>
    );

    expect(screen.queryByText(/Save Repertorial Totality to Patient Case/i)).toBeNull();
  });

  it('renders modal with active patient details, rubric counts, and top remedy candidate', async () => {
    const store = createModalStore(INITIAL_PATIENTS[0]);
    render(
      <Provider store={store}>
        <SaveToPatientCaseModal
          open={true}
          onClose={vi.fn()}
          repertoryId="rep-kent-en"
          repertoryName="Kent Repertory"
          activeRubrics={mockActiveRubrics}
          rankedRemedies={mockRankedRemedies}
          scoringModel="coverage_first"
        />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Save Repertorial Totality to Patient Case/i)).toBeDefined();
    });

    // Verify repertory badge
    expect(screen.getByText(/Kent Repertory/i)).toBeDefined();
    // Verify symptoms count
    expect(screen.getByText(/2 symptoms/i)).toBeDefined();
    // Verify top candidate remedy
    expect(screen.getByText(/sang\./i)).toBeDefined();
  });

  it('submits form, persists totality into IndexedDB, and updates Redux patient slice', async () => {
    const store = createModalStore(INITIAL_PATIENTS[0]);
    const mockOnClose = vi.fn();

    render(
      <Provider store={store}>
        <SaveToPatientCaseModal
          open={true}
          onClose={mockOnClose}
          repertoryId="rep-kent-en"
          repertoryName="Kent Repertory"
          activeRubrics={mockActiveRubrics}
          rankedRemedies={mockRankedRemedies}
          scoringModel="coverage_first"
        />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Analysis to Case/i })).toBeDefined();
    });

    const submitBtn = screen.getByRole('button', { name: /Save Analysis to Case/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Verify Redux state contains newly added analysis
    const caseAnalyses = store.getState().patients.activePatientCaseAnalyses;
    expect(caseAnalyses.length).toBeGreaterThanOrEqual(1);
    expect(caseAnalyses[0].repertoryId).toBe('rep-kent-en');
    expect(caseAnalyses[0].rubrics).toHaveLength(2);
    expect(caseAnalyses[0].rankedRemedies[0].abbreviation).toBe('sang.');

    // Clean up created record in IndexedDB
    const savedId = caseAnalyses[0].id;
    await deleteLocalCaseAnalysis(savedId);
  });

  it('handles submission with custom clinical notes and polarity analysis snapshot', async () => {
    const store = createModalStore(INITIAL_PATIENTS[0]);
    const mockOnClose = vi.fn();

    const polarityOutput: PolarityAnalysisComputeOutput = {
      evaluatedPairCount: 4,
      rankedRemedies: [
        {
          remedy: {
            id: 'rem-sang',
            fullName: 'Sanguinaria Canadensis',
            commonName: 'Bloodroot',
            abbreviation: 'sang.',
            kingdom: 'Plant',
            thermal: 'Chilly',
            miasm: 'Psora',
            isPolychrest: false,
            shortKeynotes: 'Right sided migraine',
          },
          polarCount: 2,
          polarScore: 6,
          contraindicationCount: 0,
          contraindicationScore: 0,
          polarityDifference: 6,
          isContraindicated: false,
          contraindicationWarnings: [],
          matchedPairs: [],
        },
      ],
      benchmarkMs: 2.5,
    };

    render(
      <Provider store={store}>
        <SaveToPatientCaseModal
          open={true}
          onClose={mockOnClose}
          repertoryId="rep-boenninghausen-en"
          repertoryName="Boenninghausen Pocketbook"
          activeRubrics={mockActiveRubrics}
          rankedRemedies={mockRankedRemedies}
          scoringModel="coverage_first"
          polarityOutput={polarityOutput}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter notes on miasmatic emphasis/i)).toBeDefined();
    });

    const notesInput = screen.getByPlaceholderText(/Enter notes on miasmatic emphasis/i);
    fireEvent.change(notesInput, {
      target: { value: 'Confirmed strong modal correspondence.' },
    });

    const submitBtn = screen.getByRole('button', { name: /Save Analysis to Case/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });

    const analyses = store.getState().patients.activePatientCaseAnalyses;
    expect(analyses[0].notes).toBe('Confirmed strong modal correspondence.');
    expect(analyses[0].polarityAnalysis?.evaluatedPairCount).toBe(4);
    expect(analyses[0].polarityAnalysis?.topRemedies[0].abbreviation).toBe('sang.');

    // Clean up
    await deleteLocalCaseAnalysis(analyses[0].id);
  });
});
