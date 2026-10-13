import { getDb } from './indexedDb';
import type {
  Patient,
  Consultation,
  Prescription,
  Appointment,
  PatientStatus,
  CaseRepertorialAnalysis,
} from '@/features/patients/types';

export async function getLocalPatients(): Promise<Patient[]> {
  const db = await getDb();
  return db.getAll('patients');
}

export async function getLocalPatientById(id: string): Promise<Patient | undefined> {
  const db = await getDb();
  return db.get('patients', id);
}

export async function searchLocalPatients(
  query: string,
  status?: PatientStatus
): Promise<Patient[]> {
  const db = await getDb();
  const allPatients = await db.getAll('patients');
  let filtered = allPatients;

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (!query.trim()) {
    return filtered;
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  return filtered.filter((p) => {
    const haystack = `${p.registrationNumber} ${p.fullName} ${p.phone || ''} ${p.email || ''} ${p.medicalHistory || ''}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export async function saveLocalPatient(patient: Patient): Promise<Patient> {
  const db = await getDb();
  await db.put('patients', patient);
  return patient;
}

export async function getLocalConsultations(patientId: string): Promise<Consultation[]> {
  const db = await getDb();
  const list = await db.getAllFromIndex('consultations', 'byPatient', patientId);
  return list.sort(
    (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
  );
}

export async function saveLocalConsultation(consultation: Consultation): Promise<Consultation> {
  const db = await getDb();
  await db.put('consultations', consultation);
  return consultation;
}

export async function getLocalPrescriptions(patientId: string): Promise<Prescription[]> {
  const db = await getDb();
  const list = await db.getAllFromIndex('prescriptions', 'byPatient', patientId);
  return list.sort(
    (a, b) => new Date(b.prescriptionDate).getTime() - new Date(a.prescriptionDate).getTime()
  );
}

export async function saveLocalPrescription(prescription: Prescription): Promise<Prescription> {
  const db = await getDb();
  await db.put('prescriptions', prescription);
  return prescription;
}

export async function getLocalAppointments(patientId: string): Promise<Appointment[]> {
  const db = await getDb();
  const list = await db.getAllFromIndex('appointments', 'byPatient', patientId);
  return list.sort(
    (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
  );
}

export async function saveLocalAppointment(appointment: Appointment): Promise<Appointment> {
  const db = await getDb();
  await db.put('appointments', appointment);
  return appointment;
}

export async function getLocalCaseAnalyses(patientId: string): Promise<CaseRepertorialAnalysis[]> {
  const db = await getDb();
  if (!db.objectStoreNames.contains('case_analyses')) return [];
  const list = await db.getAllFromIndex('case_analyses', 'byPatient', patientId);
  return list.sort(
    (a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime()
  );
}

export async function saveLocalCaseAnalysis(
  analysis: CaseRepertorialAnalysis
): Promise<CaseRepertorialAnalysis> {
  const db = await getDb();
  if (db.objectStoreNames.contains('case_analyses')) {
    await db.put('case_analyses', analysis);
  }
  return analysis;
}

export async function deleteLocalCaseAnalysis(id: string): Promise<void> {
  const db = await getDb();
  if (db.objectStoreNames.contains('case_analyses')) {
    await db.delete('case_analyses', id);
  }
}
