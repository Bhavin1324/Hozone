import React, { useEffect, useTransition } from 'react';
import {
  Drawer,
  Tabs,
  Tag,
  Button,
  Card,
  Timeline,
  Table,
  Empty,
  Spin,
} from 'antd';
import {
  User,
  Plus,
  Calendar,
  Pill,
  Sparkles,
  ClipboardList,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Thermometer,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setCaseFileOpen,
  setConsultationModalOpen,
  setActivePatientConsultations,
  setActivePatientPrescriptions,
  setActivePatientAppointments,
} from '@/app/store/slices/patientSlice';
import {
  getLocalConsultations,
  getLocalPrescriptions,
  getLocalAppointments,
} from '@/core/storage/indexedDbPatients';
import type { Prescription, Appointment } from '@/features/patients/types';

export const PatientCaseFileDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.patients.isCaseFileOpen);
  const activePatient = useAppSelector((state) => state.patients.activePatient);
  const consultations = useAppSelector(
    (state) => state.patients.activePatientConsultations
  );
  const prescriptions = useAppSelector(
    (state) => state.patients.activePatientPrescriptions
  );
  const appointments = useAppSelector(
    (state) => state.patients.activePatientAppointments
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!activePatient || !isOpen) return;

    let isMounted = true;

    Promise.all([
      getLocalConsultations(activePatient.id),
      getLocalPrescriptions(activePatient.id),
      getLocalAppointments(activePatient.id),
    ]).then(([cons, rxs, apts]) => {
      if (!isMounted) return;
      startTransition(() => {
        dispatch(setActivePatientConsultations(cons));
        dispatch(setActivePatientPrescriptions(rxs));
        dispatch(setActivePatientAppointments(apts));
      });
    });

    return () => {
      isMounted = false;
    };
  }, [activePatient, isOpen, dispatch]);

  if (!activePatient) return null;

  const rxColumns = [
    {
      title: 'Date',
      dataIndex: 'prescriptionDate',
      key: 'prescriptionDate',
      render: (d: string) => (
        <span className="text-xs text-text-muted">
          {new Date(d).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Remedy & Potency',
      key: 'remedy',
      render: (_: unknown, r: Prescription) => (
        <span className="font-semibold text-text-primary text-xs">
          {r.remedyName} <Tag color="blue" className="ml-1">{r.potency}</Tag>
        </span>
      ),
    },
    {
      title: 'Scale & Form',
      key: 'scaleForm',
      render: (_: unknown, r: Prescription) => (
        <span className="text-xs text-text-secondary">
          {r.scale} • {r.form}
        </span>
      ),
    },
    {
      title: 'Repetition',
      dataIndex: 'repetition',
      key: 'repetition',
      render: (t: string) => <span className="text-xs text-text-muted">{t}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'dispensingStatus',
      key: 'dispensingStatus',
      render: (s: string) => (
        <Tag color={s === 'Dispensed' ? 'green' : 'orange'}>{s}</Tag>
      ),
    },
  ];

  return (
    <Drawer
      open={isOpen}
      onClose={() => dispatch(setCaseFileOpen(false))}
      width={780}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-text-primary">
                  {activePatient.fullName}
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle text-text-muted">
                  {activePatient.registrationNumber}
                </span>
                <Tag color={activePatient.status === 'Active' ? 'green' : 'orange'}>
                  {activePatient.status}
                </Tag>
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {activePatient.age} years old • {activePatient.gender} • Blood:{' '}
                {activePatient.bloodGroup || 'Unspecified'}
              </div>
            </div>
          </div>

          <Button
            type="primary"
            icon={<Plus className="w-4 h-4 mr-1" />}
            onClick={() => dispatch(setConsultationModalOpen(true))}
            className="rounded-lg text-xs"
          >
            New Consultation
          </Button>
        </div>
      }
      className="patient-case-drawer"
    >
      {/* Quick Constitutional Banner */}
      <div className="mb-4 p-3 rounded-xl bg-surface-subtle border border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span className="text-text-muted">Thermal State:</span>{' '}
            <span className="font-semibold text-text-primary">
              {activePatient.thermalState || 'Ambithermal'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-text-muted">Dominant Miasm:</span>{' '}
            <span className="font-semibold text-text-primary">
              {activePatient.dominantMiasm || 'Psora'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
          <div className="line-clamp-1">
            <span className="text-text-muted">Allergies:</span>{' '}
            <span className="font-semibold text-text-primary">
              {activePatient.allergies?.length > 0
                ? activePatient.allergies.join(', ')
                : 'None known'}
            </span>
          </div>
        </div>
      </div>

      {isPending && consultations.length === 0 ? (
        <div className="py-20 flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="timeline"
          items={[
            {
              key: 'timeline',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <ClipboardList className="w-3.5 h-3.5 text-primary-500" /> Consultations Timeline ({consultations.length})
                </span>
              ),
              children: (
                <div className="py-2">
                  {consultations.length === 0 ? (
                    <Empty
                      description="No clinical consultations recorded yet for this case."
                      className="py-12"
                    >
                      <Button
                        type="primary"
                        onClick={() => dispatch(setConsultationModalOpen(true))}
                      >
                        Record First Consultation
                      </Button>
                    </Empty>
                  ) : (
                    <Timeline
                      className="mt-2"
                      items={consultations.map((c) => ({
                        color: 'var(--color-primary-500, #0F766E)',
                        children: (
                          <Card
                            className="mb-4 border-border-subtle shadow-2xs hover:border-border-default transition-colors rounded-xl"
                            size="small"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-subtle">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                                <span className="font-semibold text-text-primary text-xs">
                                  {new Date(c.consultationDate).toLocaleString()}
                                </span>
                              </div>
                              {c.clinicalDiagnosis && (
                                <Tag color="blue" className="text-xs">
                                  Dx: {c.clinicalDiagnosis}
                                </Tag>
                              )}
                            </div>

                            <div className="mt-2.5 space-y-2 text-xs">
                              <div>
                                <div className="text-text-muted font-medium mb-0.5">
                                  Chief Complaints & Modalities:
                                </div>
                                <div className="text-text-primary leading-relaxed bg-surface-subtle p-2 rounded-lg">
                                  {c.chiefComplaints}
                                </div>
                              </div>

                              {c.vitals && Object.keys(c.vitals).length > 0 && (
                                <div className="flex flex-wrap gap-3 py-1 text-[11px] text-text-secondary">
                                  {c.vitals.bp && <span>BP: <b>{c.vitals.bp}</b></span>}
                                  {c.vitals.pulse && <span>Pulse: <b>{c.vitals.pulse} bpm</b></span>}
                                  {c.vitals.temperature && <span>Temp: <b>{c.vitals.temperature}</b></span>}
                                  {c.vitals.weightKg && <span>Wt: <b>{c.vitals.weightKg} kg</b></span>}
                                  {c.vitals.spo2 && <span>SpO2: <b>{c.vitals.spo2}%</b></span>}
                                </div>
                              )}

                              {c.attachedRubricsData?.length > 0 && (
                                <div>
                                  <div className="text-text-muted font-medium mb-1">
                                    Repertorized Rubrics Snapshot:
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {c.attachedRubricsData.map((rb) => (
                                      <Tag key={rb.id} className="text-[11px] rounded border-border-subtle">
                                        {rb.path} (Gr. {rb.grade})
                                      </Tag>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {c.remedyPrescribed && (
                                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
                                      <Pill className="w-3.5 h-3.5" />
                                      <span>Rx: {c.remedyPrescribed} {c.potency}</span>
                                    </div>
                                    <span className="text-[10px] text-emerald-600">
                                      {c.potencyScale}
                                    </span>
                                  </div>
                                  {c.dosageInstructions && (
                                    <div className="text-text-secondary text-[11px] mt-1">
                                      {c.dosageInstructions}
                                    </div>
                                  )}
                                </div>
                              )}

                              {c.kentObservationNum && (
                                <div className="text-[11px] bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 rounded-lg p-2 text-amber-900 dark:text-amber-300">
                                  <b>Kent Observation #{c.kentObservationNum}:</b> {c.followUpProgression || 'Progression noted.'}
                                </div>
                              )}
                            </div>
                          </Card>
                        ),
                      }))}
                    />
                  )}
                </div>
              ),
            },
            {
              key: 'prescriptions',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Pill className="w-3.5 h-3.5 text-emerald-500" /> Prescriptions ({prescriptions.length})
                </span>
              ),
              children: (
                <div className="py-2">
                  <Table
                    dataSource={prescriptions}
                    columns={rxColumns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    size="small"
                  />
                </div>
              ),
            },
            {
              key: 'constitution',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Constitutional Anamnesis
                </span>
              ),
              children: (
                <div className="py-2 space-y-4 text-xs">
                  <Card title="Past Medical & Hereditary History" size="small" className="border-border-subtle rounded-xl">
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-text-primary mb-1">Medical History:</div>
                        <p className="text-text-secondary leading-relaxed bg-surface-subtle p-2.5 rounded-lg">
                          {activePatient.medicalHistory || 'No past medical history recorded.'}
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary mb-1">Family Diathesis History:</div>
                        <p className="text-text-secondary leading-relaxed bg-surface-subtle p-2.5 rounded-lg">
                          {activePatient.familyHistory || 'No family history recorded.'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card title="Patient Demographics & Contact" size="small" className="border-border-subtle rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-text-muted" />
                        <span>Phone: {activePatient.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-text-muted" />
                        <span>Email: {activePatient.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-text-muted" />
                        <span>Occupation: {activePatient.occupation || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-text-muted" />
                        <span>Address: {activePatient.address || 'N/A'}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              key: 'appointments',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" /> Appointments ({appointments.length})
                </span>
              ),
              children: (
                <div className="py-2 space-y-2">
                  {appointments.length === 0 ? (
                    <Empty description="No appointments scheduled." className="py-8" />
                  ) : (
                    appointments.map((apt: Appointment) => (
                      <div
                        key={apt.id}
                        className="p-3 rounded-xl border border-border-subtle bg-surface-card flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-text-primary flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary-500" />
                            {new Date(apt.appointmentDate).toLocaleString()}
                          </div>
                          <div className="text-text-secondary">{apt.purpose}</div>
                          {apt.notes && <div className="text-text-muted text-[11px]">{apt.notes}</div>}
                        </div>
                        <Tag color={apt.status === 'Completed' ? 'green' : 'blue'}>
                          {apt.status}
                        </Tag>
                      </div>
                    ))
                  )}
                </div>
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default PatientCaseFileDrawer;
