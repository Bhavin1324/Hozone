import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import patientReducer, {
  addCaseAnalysis,
  removeCaseAnalysis,
  setActivePatientCaseAnalyses,
  setCaseFileOpen,
} from '@/app/store/slices/patientSlice';
import repertorizationReducer, {
  loadClipboardSession,
  setScoringModel,
  setSelectedRepertoryId,
  toggleSelectClipboardRubric,
} from '@/app/store/slices/repertorizationSlice';
import sessionReducer from '@/app/store/slices/sessionSlice';
import { PatientRepertorialAnalysisTab } from '../components/PatientRepertorialAnalysisTab';
import {
  getLocalCaseAnalyses, saveLocalCaseAnalysis, deleteLocalCaseAnalysis,
} from '@/core/storage/indexedDbPatients';
import type {
  CaseRepertorialAnalysis, CaseRubricSnapshot, CaseRankedRemedySnapshot,
} from '@/features/patients/types';

// Mock react-router useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

function createTestStore() {
  return configureStore({
    reducer: {
      patients: patientReducer,
      repertorization: repertorizationReducer,
      session: sessionReducer,
    },
  });
}

const mockRubric1: CaseRubricSnapshot = {
  rubricId: 'rub-head-migraine-right',
  fullPath: 'HEAD - PAIN - right side',
  chapterName: 'HEAD',
  weight: 3,
  isEliminating: true,
};

const mockRubric2: CaseRubricSnapshot = {
  rubricId: 'rub-mind-anxiety',
  fullPath: 'MIND - ANXIETY - health, about',
  chapterName: 'MIND',
  weight: 1,
  isEliminating: false,
};

const mockRemedy1: CaseRankedRemedySnapshot = {
  remedyId: 'rem-sang',
  abbreviation: 'sang.',
  fullName: 'Sanguinaria Canadensis',
  coverageCount: 2,
  totalScore: 9,
  rubricGrades: {
    'rub-head-migraine-right': 3,
    'rub-mind-anxiety': 1,
  },
};

const mockRemedy2: CaseRankedRemedySnapshot = {
  remedyId: 'rem-bell',
  abbreviation: 'bell.',
  fullName: 'Belladonna',
  coverageCount: 1,
  totalScore: 4,
  rubricGrades: {
    'rub-head-migraine-right': 2,
    // Note: 'rub-mind-anxiety' is omitted to test non-covering edge case
  },
};

const mockAnalysisWithPolarity: CaseRepertorialAnalysis = {
  id: 'edge-analysis-001',
  patientId: 'edge-patient-001',
  title: 'Comprehensive Right-Sided Migraine Analysis',
  analysisDate: '2026-10-12T14:30:00Z',
  repertoryId: 'rep-kent-en',
  repertoryName: 'Kent Repertory (Authentic 1905)',
  scoringModel: 'coverage_first',
  rubrics: [mockRubric1, mockRubric2],
  rankedRemedies: [mockRemedy1, mockRemedy2],
  polarityAnalysis: {
    evaluatedPairCount: 3,
    topRemedies: [
      {
        remedyId: 'rem-bell',
        abbreviation: 'bell.',
        polarScore: 4,
        contraindicationScore: 8,
        polarityDifference: -4,
        isContraindicated: true,
      },
    ],
  },
  notes: 'Sanguinaria clearly covers the right-sided rubric and eliminates non-matching remedies.',
  createdAt: '2026-10-12T14:30:00Z',
  updatedAt: '2026-10-12T14:30:00Z',
};

const mockAnalysisMinimal: CaseRepertorialAnalysis = {
  id: 'edge-analysis-002',
  patientId: 'edge-patient-001',
  title: 'Follow-up Minimal Totality',
  analysisDate: '2026-10-13T09:15:00Z',
  repertoryId: 'rep-boenninghausen-en',
  repertoryName: 'Boenninghausen Therapeutic Pocketbook',
  scoringModel: 'weighted_sum',
  rubrics: [mockRubric1],
  rankedRemedies: [mockRemedy1],
  createdAt: '2026-10-13T09:15:00Z',
  updatedAt: '2026-10-13T09:15:00Z',
};

describe('Repertorial Totality / Case Analysis Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Storage Layer Edge Cases', () => {
    it('returns empty array when patient has no saved repertorial analyses', async () => {
      const results = await getLocalCaseAnalyses('nonexistent-patient-id-xyz');
      expect(results).toEqual([]);
    });

    it('handles saving an analysis with minimal fields (undefined polarity, no notes)', async () => {
      const minimalId = 'minimal-analysis-test-id';
      const minimal: CaseRepertorialAnalysis = {
        id: minimalId,
        patientId: 'test-patient-edge',
        title: 'Minimal Totality',
        analysisDate: new Date().toISOString(),
        repertoryId: 'rep-kent-en',
        repertoryName: 'Kent Repertory',
        scoringModel: 'coverage_first',
        rubrics: [],
        rankedRemedies: [],
      };

      await saveLocalCaseAnalysis(minimal);
      const fetched = await getLocalCaseAnalyses('test-patient-edge');
      expect(fetched.length).toBeGreaterThanOrEqual(1);
      const found = fetched.find((a) => a.id === minimalId);
      expect(found).toBeDefined();
      expect(found?.title).toBe('Minimal Totality');
      expect(found?.polarityAnalysis).toBeUndefined();
      expect(found?.notes).toBeUndefined();

      // Clean up
      await deleteLocalCaseAnalysis(minimalId);
    });

    it('returns multiple analyses sorted descending by analysisDate (newest first)', async () => {
      const pId = 'patient-multi-sort-test';
      const older: CaseRepertorialAnalysis = {
        id: 'multi-older',
        patientId: pId,
        title: 'Older Session',
        analysisDate: '2026-01-01T10:00:00Z',
        repertoryId: 'rep-kent-en',
        repertoryName: 'Kent Repertory',
        scoringModel: 'coverage_first',
        rubrics: [],
        rankedRemedies: [],
      };
      const newer: CaseRepertorialAnalysis = {
        id: 'multi-newer',
        patientId: pId,
        title: 'Newer Session',
        analysisDate: '2026-06-01T10:00:00Z',
        repertoryId: 'rep-kent-en',
        repertoryName: 'Kent Repertory',
        scoringModel: 'coverage_first',
        rubrics: [],
        rankedRemedies: [],
      };

      await saveLocalCaseAnalysis(older);
      await saveLocalCaseAnalysis(newer);

      const list = await getLocalCaseAnalyses(pId);
      expect(list.length).toBe(2);
      expect(list[0].id).toBe('multi-newer');
      expect(list[1].id).toBe('multi-older');

      // Clean up
      await deleteLocalCaseAnalysis('multi-older');
      await deleteLocalCaseAnalysis('multi-newer');
    });

    it('deleting a nonexistent ID does not fail or throw error', async () => {
      await expect(deleteLocalCaseAnalysis('completely-fictional-analysis-id')).resolves.toBeUndefined();
    });
  });

  describe('Redux Slice Edge Cases', () => {
    it('loadClipboardSession preserves current scoringModel and repertoryId when optional payload fields are omitted', () => {
      const store = createTestStore();
      store.dispatch(setScoringModel('weighted_sum'));
      store.dispatch(setSelectedRepertoryId('rep-custom-123'));
      store.dispatch(toggleSelectClipboardRubric('dummy-sel'));

      store.dispatch(
        loadClipboardSession({
          activeRubrics: [
            {
              rubricId: 'rub-1',
              fullPath: 'MIND - ANXIETY',
              chapterName: 'MIND',
              weight: 2,
              isEliminating: false,
            },
          ],
        })
      );

      const state = store.getState().repertorization;
      expect(state.activeRubrics).toHaveLength(1);
      expect(state.activeRubrics[0].rubricId).toBe('rub-1');
      // Preserved fields
      expect(state.scoringModel).toBe('weighted_sum');
      expect(state.selectedRepertoryId).toBe('rep-custom-123');
      // Cleared selection
      expect(state.selectedClipboardIds).toEqual([]);
    });

    it('addCaseAnalysis prepends to active analyses maintaining reverse-chronological order', () => {
      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisMinimal]));
      store.dispatch(addCaseAnalysis(mockAnalysisWithPolarity));
      const analyses = store.getState().patients.activePatientCaseAnalyses;
      expect(analyses).toHaveLength(2);
      expect(analyses[0].id).toBe('edge-analysis-001');
      expect(analyses[1].id).toBe('edge-analysis-002');
    });

    it('removeCaseAnalysis with non-matching ID leaves analyses unchanged', () => {
      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisWithPolarity]));
      store.dispatch(removeCaseAnalysis('non-existent-id'));
      expect(store.getState().patients.activePatientCaseAnalyses).toHaveLength(1);
    });
  });

  describe('UI Component Edge Cases (PatientRepertorialAnalysisTab)', () => {
    it('renders empty state when patient has no saved case analyses', async () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <PatientRepertorialAnalysisTab patientId="empty-patient-999" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText(/No Repertorial Totality Analyses Saved/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Open Repertory Workspace/i })).toBeDefined();
      });
    });

    it('renders analysis with polarity analysis, contraindication warnings, and rubric matrix', async () => {
      await saveLocalCaseAnalysis(mockAnalysisWithPolarity);

      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisWithPolarity]));
      store.dispatch(setCaseFileOpen(true));

      render(
        <Provider store={store}>
          <PatientRepertorialAnalysisTab patientId="edge-patient-001" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Comprehensive Right-Sided Migraine Analysis/i).length).toBeGreaterThanOrEqual(1);
      });

      // Verify Polarity section is displayed
      expect(screen.getByText(/Boenninghausen Polarity Analysis Summary/i)).toBeDefined();
      expect(screen.getByText(/3 polar pairs/i)).toBeDefined();

      // Verify Kent Repertory catalog badge
      expect(screen.getByText(/Kent Repertory \(Authentic 1905\)/i)).toBeDefined();

      // Verify Eliminating badge on mockRubric1
      expect(screen.getByText(/Eliminating/i)).toBeDefined();

      // Verify Weight badge (3×) on mockRubric1
      expect(screen.getByText(/3×/i)).toBeDefined();

      // Verify remedy abbreviation is displayed in matrix header
      expect(screen.getAllByText(/sang\./i).length).toBeGreaterThanOrEqual(1);

      // Verify Open in Repertory Workspace button
      expect(screen.getByText(/Open in Repertory Workspace/i)).toBeDefined();

      await deleteLocalCaseAnalysis(mockAnalysisWithPolarity.id);
    });

    it('renders remedy with non-covering rubric showing dash without crashing', async () => {
      await saveLocalCaseAnalysis(mockAnalysisWithPolarity);

      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisWithPolarity]));
      store.dispatch(setCaseFileOpen(true));

      render(
        <Provider store={store}>
          <PatientRepertorialAnalysisTab patientId="edge-patient-001" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/bell\./i).length).toBeGreaterThanOrEqual(1);
      });

      // Dashes should be present for non-covering cell
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThanOrEqual(1);

      await deleteLocalCaseAnalysis(mockAnalysisWithPolarity.id);
    });

    it('clicking "Open in Repertory Workspace" restores session, closes drawer, and navigates', async () => {
      await saveLocalCaseAnalysis(mockAnalysisWithPolarity);

      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisWithPolarity]));
      store.dispatch(setCaseFileOpen(true));

      render(
        <Provider store={store}>
          <PatientRepertorialAnalysisTab patientId="edge-patient-001" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Open in Repertory Workspace/i })).toBeDefined();
      });

      const loadBtn = screen.getByRole('button', { name: /Open in Repertory Workspace/i });
      fireEvent.click(loadBtn);

      // Verify drawer is closed
      expect(store.getState().patients.isCaseFileOpen).toBe(false);

      // Verify active rubrics restored in repertorization slice
      const repertorizationState = store.getState().repertorization;
      expect(repertorizationState.activeRubrics).toHaveLength(2);
      expect(repertorizationState.activeRubrics[0].rubricId).toBe('rub-head-migraine-right');
      expect(repertorizationState.activeRubrics[0].weight).toBe(3);
      expect(repertorizationState.activeRubrics[0].isEliminating).toBe(true);
      expect(repertorizationState.selectedRepertoryId).toBe('rep-kent-en');

      // Verify navigation called
      expect(mockNavigate).toHaveBeenCalledWith('/repertory');

      await deleteLocalCaseAnalysis(mockAnalysisWithPolarity.id);
    });

    it('renders minimal analysis without polarity analysis gracefully', async () => {
      await saveLocalCaseAnalysis(mockAnalysisMinimal);

      const store = createTestStore();
      store.dispatch(setActivePatientCaseAnalyses([mockAnalysisMinimal]));
      store.dispatch(setCaseFileOpen(true));

      render(
        <Provider store={store}>
          <PatientRepertorialAnalysisTab patientId="edge-patient-001" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Follow-up Minimal Totality/i).length).toBeGreaterThanOrEqual(1);
      });

      // Should NOT render Polarity Summary section
      expect(screen.queryByText(/Boenninghausen Polarity Analysis Summary/i)).toBeNull();

      await deleteLocalCaseAnalysis(mockAnalysisMinimal.id);
    });
  });
});
