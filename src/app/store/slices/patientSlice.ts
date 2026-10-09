import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Patient,
  Consultation,
  Prescription,
  Appointment,
  PatientStatus,
} from '@/features/patients/types';

export interface PatientState {
  patients: Patient[];
  activePatient: Patient | null;
  activePatientConsultations: Consultation[];
  activePatientPrescriptions: Prescription[];
  activePatientAppointments: Appointment[];
  searchQuery: string;
  filterStatus: PatientStatus | 'All';
  isCaseFileOpen: boolean;
  isIntakeModalOpen: boolean;
  isConsultationModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  activePatient: null,
  activePatientConsultations: [],
  activePatientPrescriptions: [],
  activePatientAppointments: [],
  searchQuery: '',
  filterStatus: 'All',
  isCaseFileOpen: false,
  isIntakeModalOpen: false,
  isConsultationModalOpen: false,
  loading: false,
  error: null,
};

export const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients = [action.payload, ...state.patients.filter((p) => p.id !== action.payload.id)];
    },
    updatePatient: (state, action: PayloadAction<Patient>) => {
      state.patients = state.patients.map((p) => (p.id === action.payload.id ? action.payload : p));
      if (state.activePatient?.id === action.payload.id) {
        state.activePatient = action.payload;
      }
    },
    setActivePatient: (state, action: PayloadAction<Patient | null>) => {
      state.activePatient = action.payload;
    },
    clearActivePatient: (state) => {
      state.activePatient = null;
      state.activePatientConsultations = [];
      state.activePatientPrescriptions = [];
      state.activePatientAppointments = [];
    },
    setActivePatientConsultations: (state, action: PayloadAction<Consultation[]>) => {
      state.activePatientConsultations = action.payload;
    },
    addConsultation: (state, action: PayloadAction<Consultation>) => {
      state.activePatientConsultations = [action.payload, ...state.activePatientConsultations];
    },
    setActivePatientPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.activePatientPrescriptions = action.payload;
    },
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.activePatientPrescriptions = [action.payload, ...state.activePatientPrescriptions];
    },
    setActivePatientAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.activePatientAppointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.activePatientAppointments = [...state.activePatientAppointments, action.payload];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<PatientStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    setCaseFileOpen: (state, action: PayloadAction<boolean>) => {
      state.isCaseFileOpen = action.payload;
    },
    setIntakeModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isIntakeModalOpen = action.payload;
    },
    setConsultationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isConsultationModalOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
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
  setSearchQuery,
  setFilterStatus,
  setCaseFileOpen,
  setIntakeModalOpen,
  setConsultationModalOpen,
  setLoading,
  setError,
} = patientSlice.actions;

export default patientSlice.reducer;
