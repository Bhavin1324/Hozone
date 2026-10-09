import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../indexedDb';
import {
  getLocalPatients,
  getLocalPatientById,
  searchLocalPatients,
  saveLocalPatient,
  getLocalConsultations,
  saveLocalConsultation,
  getLocalPrescriptions,
  saveLocalPrescription,
  getLocalAppointments,
  saveLocalAppointment,
} from '../indexedDbPatients';
import type { Patient, Consultation, Prescription, Appointment } from '@/features/patients/types';

describe('Local-First IndexedDB Patient Management Storage (v8)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe('Patients Store', () => {
    it('retrieves all seeded patients', async () => {
      const patients = await getLocalPatients();
      expect(patients.length).toBeGreaterThanOrEqual(5);
      expect(patients.some((p) => p.registrationNumber === 'PT-2026-0001')).toBe(true);
      expect(patients.some((p) => p.fullName === 'Eleanor Vance')).toBe(true);
    });

    it('retrieves a single patient by ID', async () => {
      const patient = await getLocalPatientById('a1111111-1111-4111-8111-111111111111');
      expect(patient).toBeDefined();
      expect(patient?.fullName).toBe('Eleanor Vance');
      expect(patient?.dominantMiasm).toBe('Psora');
      expect(patient?.thermalState).toBe('Chilly');
    });

    it('searches patients by query and status', async () => {
      const results = await searchLocalPatients('Eleanor');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].fullName).toBe('Eleanor Vance');

      const activeOnly = await searchLocalPatients('', 'Active');
      expect(activeOnly.length).toBeGreaterThanOrEqual(4);
      expect(activeOnly.every((p) => p.status === 'Active')).toBe(true);

      const followupOnly = await searchLocalPatients('', 'Follow-up');
      expect(followupOnly.some((p) => p.fullName === 'Clara Oswald')).toBe(true);
    });

    it('persists a new patient intake', async () => {
      const newPatient: Patient = {
        id: 'test-pt-uuid-999',
        registrationNumber: 'PT-2026-0999',
        firstName: 'Lucas',
        lastName: 'Greene',
        fullName: 'Lucas Greene',
        age: 41,
        gender: 'Male',
        allergies: ['Pollen'],
        dominantMiasm: 'Psora',
        thermalState: 'Hot',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveLocalPatient(newPatient);
      const fetched = await getLocalPatientById('test-pt-uuid-999');
      expect(fetched).toBeDefined();
      expect(fetched?.fullName).toBe('Lucas Greene');
    });
  });

  describe('Consultations Store', () => {
    it('retrieves consultations for a specific patient sorted descending by date', async () => {
      const consultations = await getLocalConsultations('a1111111-1111-4111-8111-111111111111');
      expect(consultations.length).toBeGreaterThanOrEqual(2);
      expect(new Date(consultations[0].consultationDate).getTime()).toBeGreaterThan(
        new Date(consultations[1].consultationDate).getTime()
      );
      expect(consultations[0].attachedRubricsData.length).toBeGreaterThanOrEqual(1);
    });

    it('saves a new consultation record', async () => {
      const newConsultation: Consultation = {
        id: 'test-con-uuid-999',
        patientId: 'a1111111-1111-4111-8111-111111111111',
        consultationDate: new Date().toISOString(),
        chiefComplaints: 'Follow-up review for persistent clear aura',
        attachedRubricIds: ['head-pain-right-side'],
        attachedRubricsData: [{ id: 'head-pain-right-side', path: 'HEAD - PAIN - right side', grade: 1 }],
        remedyPrescribed: 'Sanguinaria Canadensis',
        potency: '10M',
        potencyScale: 'Centesimal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveLocalConsultation(newConsultation);
      const list = await getLocalConsultations('a1111111-1111-4111-8111-111111111111');
      expect(list.some((c) => c.id === 'test-con-uuid-999')).toBe(true);
    });
  });

  describe('Prescriptions and Appointments Stores', () => {
    it('retrieves prescriptions for a patient', async () => {
      const rxList = await getLocalPrescriptions('a1111111-1111-4111-8111-111111111111');
      expect(rxList.length).toBeGreaterThanOrEqual(2);
      expect(rxList[0].remedyName).toBe('Sanguinaria Canadensis');
    });

    it('saves a new prescription', async () => {
      const rx: Prescription = {
        id: 'test-rx-uuid-999',
        patientId: 'a1111111-1111-4111-8111-111111111111',
        prescriptionDate: new Date().toISOString(),
        remedyName: 'Arnica Montana',
        potency: '200C',
        scale: 'Centesimal',
        form: 'Globules',
        repetition: 'Stat dose',
        dispensingStatus: 'Dispensed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveLocalPrescription(rx);
      const list = await getLocalPrescriptions('a1111111-1111-4111-8111-111111111111');
      expect(list.some((r) => r.id === 'test-rx-uuid-999')).toBe(true);
    });

    it('retrieves and saves appointments', async () => {
      const apts = await getLocalAppointments('a1111111-1111-4111-8111-111111111111');
      expect(apts.length).toBeGreaterThanOrEqual(1);

      const newApt: Appointment = {
        id: 'test-apt-uuid-999',
        patientId: 'a1111111-1111-4111-8111-111111111111',
        appointmentDate: '2026-05-01T10:00:00Z',
        purpose: 'Follow-up 3-month scan check',
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveLocalAppointment(newApt);
      const updated = await getLocalAppointments('a1111111-1111-4111-8111-111111111111');
      expect(updated.some((a) => a.id === 'test-apt-uuid-999')).toBe(true);
    });
  });
});
