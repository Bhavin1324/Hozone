export type Gender = 'Male' | 'Female' | 'Other';
export type PatientStatus = 'Active' | 'Follow-up' | 'Archived';
export type MiasmType = 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Multi-miasmatic';
export type ThermalState = 'Chilly' | 'Hot' | 'Ambithermal';
export type PotencyScale = 'Centesimal' | 'Decimal' | '50-Millesimal (LM)' | 'Mother Tincture (Q)';
export type RemedyForm = 'Globules' | 'Drops' | 'Tablets' | 'Liquid Dilution' | 'Powder';
export type DispensingStatus = 'Dispensed' | 'Refilled' | 'Pending' | 'Discontinued';
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';

export interface PatientVitals {
  bp?: string;
  pulse?: number;
  temperature?: string;
  weightKg?: number;
  spo2?: number;
  respiratoryRate?: number;
}

export interface AttachedRubricSummary {
  id: string;
  path: string;
  grade: number;
}

export interface Patient {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  age: number;
  gender: Gender;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
  occupation?: string;
  dominantMiasm?: MiasmType;
  thermalState?: ThermalState;
  allergies: string[];
  medicalHistory?: string;
  familyHistory?: string;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  consultationDate: string;
  chiefComplaints: string;
  anamnesisNotes?: string;
  vitals?: PatientVitals;
  clinicalDiagnosis?: string;
  attachedRubricIds: string[];
  attachedRubricsData: AttachedRubricSummary[];
  remedyPrescribed?: string;
  potency?: string;
  potencyScale?: PotencyScale;
  dosageInstructions?: string;
  dispensingLabel?: string;
  kentObservationNum?: number;
  followUpProgression?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  consultationId?: string;
  patientId: string;
  prescriptionDate: string;
  remedyName: string;
  potency: string;
  scale: string;
  form: RemedyForm;
  repetition: string;
  dispensingStatus: DispensingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  appointmentDate: string;
  purpose: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
