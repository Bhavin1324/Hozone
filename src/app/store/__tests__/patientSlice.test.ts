import { describe, it, expect } from 'vitest';
import patientReducer, {
  setPatients,
  addPatient,
  updatePatient,
  setActivePatient,
  clearActivePatient,
  setActivePatientConsultations,
  addConsultation,
  setActivePatientPrescriptions,
  addPrescription,
  setActivePatientAppointments,
  addAppointment,
  setActivePatientCaseAnalyses,
  addCaseAnalysis,
  removeCaseAnalysis,
  setSearchQuery,
  setFilterStatus,
  setCaseFileOpen,
  setIntakeModalOpen,
  setConsultationModalOpen,
  type PatientState,
} from '../slices/patientSlice';
import type {
  Patient,
  Consultation,
  Prescription,
  Appointment,
  CaseRepertorialAnalysis,
} from '@/features/patients/types';

const mockPatient: Patient = {
  id: 'test-p1',
  registrationNumber: 'PT-2026-0001',
  firstName: 'Eleanor',
  lastName: 'Vance',
  fullName: 'Eleanor Vance',
  age: 34,
  gender: 'Female',
  allergies: [],
  status: 'Active',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockConsultation: Consultation = {
  id: 'test-c1',
  patientId: 'test-p1',
  consultationDate: '2026-01-15T10:00:00Z',
  chiefComplaints: 'Right migraine',
  attachedRubricIds: ['head-pain-right-side'],
  attachedRubricsData: [{ id: 'head-pain-right-side', path: 'HEAD - PAIN - right side', grade: 3 }],
  remedyPrescribed: 'Sanguinaria',
  potency: '200C',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

const mockPrescription: Prescription = {
  id: 'test-rx1',
  patientId: 'test-p1',
  prescriptionDate: '2026-01-15T10:00:00Z',
  remedyName: 'Sanguinaria',
  potency: '200C',
  scale: 'Centesimal',
  form: 'Globules',
  repetition: 'Stat',
  dispensingStatus: 'Dispensed',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

const mockAppointment: Appointment = {
  id: 'test-apt1',
  patientId: 'test-p1',
  appointmentDate: '2026-02-15T10:00:00Z',
  purpose: 'Follow-up',
  status: 'Scheduled',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

const mockCaseAnalysis: CaseRepertorialAnalysis = {
  id: 'test-ca1',
  patientId: 'test-p1',
  title: 'Acute Migraine Totality',
  analysisDate: '2026-01-15T10:00:00Z',
  repertoryId: 'rep-kent-en',
  repertoryName: 'Kent Repertory',
  scoringModel: 'coverage_first',
  rubrics: [
    {
      rubricId: 'head-pain-right-side',
      fullPath: 'HEAD - PAIN - right side',
      chapterName: 'HEAD',
      weight: 1,
      isEliminating: false,
    },
  ],
  rankedRemedies: [
    {
      remedyId: 'rem-sang',
      abbreviation: 'sang.',
      fullName: 'Sanguinaria',
      coverageCount: 1,
      totalScore: 3,
      rubricGrades: { 'head-pain-right-side': 3 },
    },
  ],
};

describe('Patient Slice Reducers', () => {
  const initial: PatientState = {
    patients: [],
    activePatient: null,
    activePatientConsultations: [],
    activePatientPrescriptions: [],
    activePatientAppointments: [],
    activePatientCaseAnalyses: [],
    searchQuery: '',
    filterStatus: 'All',
    isCaseFileOpen: false,
    isIntakeModalOpen: false,
    isConsultationModalOpen: false,
    loading: false,
    error: null,
  };

  it('sets patients list', () => {
    const state = patientReducer(initial, setPatients([mockPatient]));
    expect(state.patients).toHaveLength(1);
    expect(state.patients[0].fullName).toBe('Eleanor Vance');
  });

  it('adds and updates a patient', () => {
    let state = patientReducer(initial, addPatient(mockPatient));
    expect(state.patients).toHaveLength(1);

    const updated = { ...mockPatient, age: 35 };
    state = patientReducer(state, updatePatient(updated));
    expect(state.patients[0].age).toBe(35);
  });

  it('sets and clears active patient session', () => {
    let state = patientReducer(initial, setActivePatient(mockPatient));
    expect(state.activePatient?.id).toBe('test-p1');

    state = patientReducer(state, setActivePatientConsultations([mockConsultation]));
    state = patientReducer(state, setActivePatientPrescriptions([mockPrescription]));
    state = patientReducer(state, setActivePatientAppointments([mockAppointment]));
    state = patientReducer(state, setActivePatientCaseAnalyses([mockCaseAnalysis]));
    expect(state.activePatientConsultations).toHaveLength(1);
    expect(state.activePatientPrescriptions).toHaveLength(1);
    expect(state.activePatientAppointments).toHaveLength(1);
    expect(state.activePatientCaseAnalyses).toHaveLength(1);

    state = patientReducer(state, clearActivePatient());
    expect(state.activePatient).toBeNull();
    expect(state.activePatientConsultations).toHaveLength(0);
    expect(state.activePatientCaseAnalyses).toHaveLength(0);
  });

  it('adds consultation, prescription, and appointment', () => {
    let state = patientReducer(initial, addConsultation(mockConsultation));
    expect(state.activePatientConsultations).toHaveLength(1);

    state = patientReducer(state, addPrescription(mockPrescription));
    expect(state.activePatientPrescriptions).toHaveLength(1);

    state = patientReducer(state, addAppointment(mockAppointment));
    expect(state.activePatientAppointments).toHaveLength(1);
  });

  it('manages active patient repertorial case analyses totality', () => {
    let state = patientReducer(initial, setActivePatientCaseAnalyses([mockCaseAnalysis]));
    expect(state.activePatientCaseAnalyses).toHaveLength(1);
    expect(state.activePatientCaseAnalyses[0].id).toBe('test-ca1');

    const secondAnalysis: CaseRepertorialAnalysis = {
      ...mockCaseAnalysis,
      id: 'test-ca2',
      title: 'Second Analysis',
    };
    state = patientReducer(state, addCaseAnalysis(secondAnalysis));
    expect(state.activePatientCaseAnalyses).toHaveLength(2);
    expect(state.activePatientCaseAnalyses[0].id).toBe('test-ca2');

    state = patientReducer(state, removeCaseAnalysis('test-ca1'));
    expect(state.activePatientCaseAnalyses).toHaveLength(1);
    expect(state.activePatientCaseAnalyses[0].id).toBe('test-ca2');
  });

  it('updates filters and modal states', () => {
    let state = patientReducer(initial, setSearchQuery('Eleanor'));
    expect(state.searchQuery).toBe('Eleanor');

    state = patientReducer(state, setFilterStatus('Active'));
    expect(state.filterStatus).toBe('Active');

    state = patientReducer(state, setCaseFileOpen(true));
    expect(state.isCaseFileOpen).toBe(true);

    state = patientReducer(state, setIntakeModalOpen(true));
    expect(state.isIntakeModalOpen).toBe(true);

    state = patientReducer(state, setConsultationModalOpen(true));
    expect(state.isConsultationModalOpen).toBe(true);
  });
});
