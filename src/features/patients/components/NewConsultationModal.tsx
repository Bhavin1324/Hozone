import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Tag,
  DatePicker,
  InputNumber,
  message,
  Tabs,
} from 'antd';
import {
  FileText,
  Sparkles,
  Pill,
  ClipboardList,
  Plus,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addConsultation,
  addPrescription,
} from '@/app/store/slices/patientSlice';
import {
  saveLocalConsultation,
  saveLocalPrescription,
} from '@/core/storage/indexedDbPatients';
import type {
  Consultation,
  Prescription,
  AttachedRubricSummary,
  PotencyScale,
  RemedyForm,
} from '@/features/patients/types';

interface NewConsultationModalProps {
  open: boolean;
  onClose: () => void;
}

const KENT_OBSERVATIONS = [
  { value: 1, label: 'Obs I: Prolonged aggravation and then rather slow improvement (Deep incurable or border case)' },
  { value: 2, label: 'Obs II: Long aggravation with slow decline of patient (Curative effort failed, incurable)' },
  { value: 3, label: 'Obs III: Aggravation quick, short, and strong, with rapid improvement (Ideal curative response)' },
  { value: 4, label: 'Obs IV: Recovery without any aggravation (Superficial acute or ideal remedy and potency)' },
  { value: 5, label: 'Obs V: Amelioration comes first and aggravation comes afterward (Unfavorable, palliative remedy)' },
  { value: 6, label: 'Obs VI: Too short relief of symptoms (Quick metabolism or structural obstacle)' },
  { value: 7, label: 'Obs VII: Full amelioration of symptoms, yet no relief of the patient (Incurable pathology)' },
  { value: 8, label: 'Obs VIII: Patient proves the remedy (Hypersensitive idiosyncrasy)' },
  { value: 9, label: 'Obs IX: Action of remedies upon provers' },
  { value: 10, label: 'Obs X: New symptoms appearing after remedy (Incorrect remedy chosen)' },
  { value: 11, label: 'Obs XI: Old symptoms returning in reverse order (Hering Law of Cure progression)' },
  { value: 12, label: 'Obs XII: Symptoms take the wrong direction (Dangerous suppression)' },
];

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const activePatient = useAppSelector((state) => state.patients.activePatient);
  const clipboardRubrics = useAppSelector(
    (state) => state.repertorization.activeRubrics
  );
  const [attachedRubrics, setAttachedRubrics] = useState<AttachedRubricSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSnapshotClipboard = () => {
    if (!clipboardRubrics || clipboardRubrics.length === 0) {
      message.info('Repertory case clipboard is currently empty. Add rubrics in Repertory first.');
      return;
    }
    const snap: AttachedRubricSummary[] = clipboardRubrics.map((r) => ({
      id: r.rubricId || (r as unknown as { id: string }).id || 'rubric',
      path: (r as unknown as { path: string }).path || r.fullPath,
      grade: r.weight || 3,
    }));
    setAttachedRubrics(snap);
    message.success(`Snapshotted ${snap.length} active rubrics from Repertory Case Clipboard.`);
  };

  const handleRemoveRubric = (id: string) => {
    setAttachedRubrics((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = async () => {
    if (!activePatient) {
      message.error('No active patient selected for consultation.');
      return;
    }

    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const consultationId = crypto.randomUUID();
      const prescriptionId = crypto.randomUUID();
      const now = new Date().toISOString();
      const consultDate = values.consultationDate
        ? values.consultationDate.toISOString()
        : now;

      const newConsultation: Consultation = {
        id: consultationId,
        patientId: activePatient.id,
        consultationDate: consultDate,
        chiefComplaints: values.chiefComplaints.trim(),
        anamnesisNotes: values.anamnesisNotes?.trim() || undefined,
        vitals: {
          bp: values.bp || undefined,
          pulse: values.pulse ? Number(values.pulse) : undefined,
          temperature: values.temperature || undefined,
          weightKg: values.weightKg ? Number(values.weightKg) : undefined,
          spo2: values.spo2 ? Number(values.spo2) : undefined,
        },
        clinicalDiagnosis: values.clinicalDiagnosis?.trim() || undefined,
        attachedRubricIds: attachedRubrics.map((r) => r.id),
        attachedRubricsData: attachedRubrics,
        remedyPrescribed: values.remedyPrescribed?.trim() || undefined,
        potency: values.potency?.trim() || undefined,
        potencyScale: values.potencyScale as PotencyScale | undefined,
        dosageInstructions: values.dosageInstructions?.trim() || undefined,
        dispensingLabel: values.dispensingLabel?.trim() || undefined,
        kentObservationNum: values.kentObservationNum || undefined,
        followUpProgression: values.followUpProgression?.trim() || undefined,
        nextFollowUpDate: values.nextFollowUpDate
          ? values.nextFollowUpDate.format('YYYY-MM-DD')
          : undefined,
        createdAt: now,
        updatedAt: now,
      };

      await saveLocalConsultation(newConsultation);
      dispatch(addConsultation(newConsultation));

      if (values.remedyPrescribed) {
        const newPrescription: Prescription = {
          id: prescriptionId,
          consultationId,
          patientId: activePatient.id,
          prescriptionDate: consultDate,
          remedyName: values.remedyPrescribed.trim(),
          potency: values.potency?.trim() || '200C',
          scale: values.potencyScale || 'Centesimal',
          form: (values.form as RemedyForm) || 'Globules',
          repetition: values.dosageInstructions?.trim() || 'Stat single dose',
          dispensingStatus: 'Dispensed',
          createdAt: now,
          updatedAt: now,
        };

        await saveLocalPrescription(newPrescription);
        dispatch(addPrescription(newPrescription));
      }

      message.success('Clinical consultation and prescription recorded.');
      form.resetFields();
      setAttachedRubrics([]);
      onClose();
    } catch {
      message.error('Please verify consultation fields before saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      okText="Record Consultation"
      cancelText="Cancel"
      width={760}
      title={
        <div className="flex items-center space-x-2 text-text-primary pb-2 border-b border-border-subtle">
          <FileText className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-lg">
            New Consultation & Prescription — {activePatient?.fullName || 'Active Patient'}
          </span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          consultationDate: dayjs(),
          potencyScale: 'Centesimal',
          potency: '200C',
          form: 'Globules',
        }}
        className="mt-3"
      >
        <Tabs
          defaultActiveKey="clinical"
          items={[
            {
              key: 'clinical',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <ClipboardList className="w-3.5 h-3.5 text-primary-500" /> Chief Complaints & Vitals
                </span>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item name="consultationDate" label="Consultation Date">
                      <DatePicker className="w-full rounded-lg" showTime />
                    </Form.Item>
                    <Form.Item name="clinicalDiagnosis" label="Clinical / Nosological Diagnosis">
                      <Input placeholder="e.g. Migraine, Allergic Bronchitis, IBS..." className="rounded-lg" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="chiefComplaints"
                    label="Chief Complaints & Current Pathological Episode"
                    rules={[{ required: true, message: 'Chief complaints are required' }]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Detailed modalities, location, sensation, concomitant symptoms, onset triggers..."
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <Form.Item name="bp" label="BP">
                      <Input placeholder="120/80" className="rounded-lg text-xs" />
                    </Form.Item>
                    <Form.Item name="pulse" label="Pulse (bpm)">
                      <InputNumber min={30} max={220} className="w-full rounded-lg text-xs" />
                    </Form.Item>
                    <Form.Item name="temperature" label="Temp">
                      <Input placeholder="98.6 F" className="rounded-lg text-xs" />
                    </Form.Item>
                    <Form.Item name="weightKg" label="Weight (kg)">
                      <InputNumber min={1} max={300} step={0.5} className="w-full rounded-lg text-xs" />
                    </Form.Item>
                    <Form.Item name="spo2" label="SpO2 (%)">
                      <InputNumber min={50} max={100} className="w-full rounded-lg text-xs" />
                    </Form.Item>
                  </div>

                  <Form.Item name="anamnesisNotes" label="Examination & Anamnesis Notes">
                    <Input.TextArea rows={2} placeholder="Tongue, face, mental state during episode, general demeanor..." className="rounded-lg" />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'rubrics',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Attached Rubrics ({attachedRubrics.length})
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border-subtle">
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary">Repertory Case Integration</h4>
                      <p className="text-[11px] text-text-secondary">
                        Capture all symptoms analyzed in the active Repertory Workspace into this consultation.
                      </p>
                    </div>
                    <Button
                      type="default"
                      icon={<Plus className="w-3.5 h-3.5 mr-1" />}
                      onClick={handleSnapshotClipboard}
                      className="border-primary-500 text-primary-600 text-xs"
                    >
                      Snapshot Clipboard ({clipboardRubrics.length})
                    </Button>
                  </div>

                  <div className="min-h-24 p-3 rounded-xl border border-border-subtle bg-surface-card space-y-2">
                    {attachedRubrics.length === 0 ? (
                      <div className="text-xs text-text-muted text-center py-6">
                        No rubrics attached yet. Click above to attach the active repertory clipboard.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {attachedRubrics.map((r) => (
                          <Tag
                            key={r.id}
                            closable
                            onClose={() => handleRemoveRubric(r.id)}
                            className="text-xs py-1 px-2.5 rounded-lg border-border-subtle"
                          >
                            <span className="font-medium text-text-primary mr-1">{r.path}</span>
                            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1 rounded">
                              Gr. {r.grade}
                            </span>
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'prescription',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Pill className="w-3.5 h-3.5 text-emerald-500" /> Posology & Prescription
                </span>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Form.Item name="remedyPrescribed" label="Simillimum / Remedy Prescribed">
                      <Input placeholder="e.g. Sanguinaria Canadensis" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="potency" label="Potency">
                      <Input placeholder="e.g. 200C, 1M, 0/3" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="potencyScale" label="Potency Scale">
                      <Select
                        options={[
                          { value: 'Centesimal', label: 'Centesimal (C/CH)' },
                          { value: 'Decimal', label: 'Decimal (X/D)' },
                          { value: '50-Millesimal (LM)', label: '50-Millesimal (LM/Q)' },
                          { value: 'Mother Tincture (Q)', label: 'Mother Tincture (θ)' },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item name="form" label="Dispensing Form">
                      <Select
                        options={[
                          { value: 'Globules', label: 'Globules (Size 30/40)' },
                          { value: 'Drops', label: 'Liquid Drops in Water' },
                          { value: 'Tablets', label: 'Tablets / Trituration' },
                          { value: 'Liquid Dilution', label: 'Liquid Dilution' },
                          { value: 'Powder', label: 'Saccharum Lactis Powder' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item name="dosageInstructions" label="Posology & Repetition Schedule">
                      <Input placeholder="e.g. 1 dose stat in water, SL bd for 7 days" className="rounded-lg" />
                    </Form.Item>
                  </div>

                  <Form.Item name="kentObservationNum" label="Kent's 12 Prognostic Observations (Outcome Evaluation)">
                    <Select
                      placeholder="Select observed patient reaction (if evaluating follow-up)..."
                      options={KENT_OBSERVATIONS}
                      allowClear
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item name="nextFollowUpDate" label="Next Follow-up Scheduled">
                      <DatePicker className="w-full rounded-lg" />
                    </Form.Item>
                    <Form.Item name="followUpProgression" label="Progression Notes">
                      <Input placeholder="e.g. Hering law direction, symptom relief percentage..." className="rounded-lg" />
                    </Form.Item>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default NewConsultationModal;
