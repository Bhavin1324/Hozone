import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { FolderPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addCaseAnalysis, setActivePatient } from '@/app/store/slices/patientSlice';
import { saveLocalCaseAnalysis, getLocalPatients } from '@/core/storage/indexedDbPatients';
import type {
  Patient,
  CaseRepertorialAnalysis,
  CaseRubricSnapshot,
  CaseRankedRemedySnapshot,
} from '@/features/patients/types';
import type {
  ActiveCaseRubric,
  RepertorizationResultItem,
  PolarityAnalysisComputeOutput,
  FilterCriteria,
} from '../types';

interface SaveToPatientCaseModalProps {
  open: boolean;
  onClose: () => void;
  repertoryId: string;
  repertoryName: string;
  activeRubrics: ActiveCaseRubric[];
  rankedRemedies: RepertorizationResultItem[];
  scoringModel: string;
  filters?: FilterCriteria;
  polarityOutput?: PolarityAnalysisComputeOutput;
}

export const SaveToPatientCaseModal: React.FC<SaveToPatientCaseModalProps> = ({
  open,
  onClose,
  repertoryId,
  repertoryName,
  activeRubrics,
  rankedRemedies,
  scoringModel,
  filters,
  polarityOutput,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const activePatient = useAppSelector((state) => state.patients.activePatient);
  const consultations = useAppSelector((state) => state.patients.activePatientConsultations);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      getLocalPatients().then((pts) => setPatients(pts));
      const today = new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      form.setFieldsValue({
        patientId: activePatient?.id || undefined,
        title: `Repertorial Totality — ${today}`,
        consultationId: undefined,
        notes: '',
      });
    }
  }, [open, activePatient, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const targetPatient =
        patients.find((p) => p.id === values.patientId) || activePatient;
      if (!targetPatient) {
        message.error('Please select a patient to attach this repertorial analysis.');
        return;
      }

      // Convert active rubrics into snapshot format
      const rubricsSnapshot: CaseRubricSnapshot[] = activeRubrics.map((r) => ({
        rubricId: r.rubricId,
        fullPath: r.fullPath,
        chapterName: r.chapterName,
        weight: r.weight,
        isEliminating: r.isEliminating,
      }));

      // Convert top 15 ranked remedies with grades matrix
      const remediesSnapshot: CaseRankedRemedySnapshot[] = rankedRemedies
        .slice(0, 15)
        .map((rem) => ({
          remedyId: rem.remedy.id,
          abbreviation: rem.remedy.abbreviation,
          fullName: rem.remedy.fullName,
          coverageCount: rem.coverageCount,
          totalScore: rem.totalScore,
          rubricGrades: rem.grades || {},
        }));

      const now = new Date().toISOString();
      const analysisId = crypto.randomUUID();

      const newAnalysis: CaseRepertorialAnalysis = {
        id: analysisId,
        patientId: targetPatient.id,
        consultationId: values.consultationId || undefined,
        title: values.title.trim(),
        analysisDate: now,
        repertoryId,
        repertoryName,
        scoringModel,
        rubrics: rubricsSnapshot,
        rankedRemedies: remediesSnapshot,
        polarityAnalysis: polarityOutput && polarityOutput.evaluatedPairCount > 0 ? {
          evaluatedPairCount: polarityOutput.evaluatedPairCount,
          topRemedies: polarityOutput.rankedRemedies.slice(0, 5).map((pr) => ({
            remedyId: pr.remedy.id,
            abbreviation: pr.remedy.abbreviation,
            polarScore: pr.polarScore,
            contraindicationScore: pr.contraindicationScore,
            polarityDifference: pr.polarityDifference,
            isContraindicated: pr.isContraindicated,
          })),
        } : undefined,
        filters: filters ? {
          thermals: filters.thermals,
          miasms: filters.miasms,
          kingdoms: filters.kingdoms,
        } : undefined,
        notes: values.notes?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      await saveLocalCaseAnalysis(newAnalysis);
      dispatch(addCaseAnalysis(newAnalysis));

      if (!activePatient || activePatient.id !== targetPatient.id) {
        dispatch(setActivePatient(targetPatient));
      }

      message.success(
        `Repertorial Totality successfully saved to ${targetPatient.fullName}'s case file.`
      );
      onClose();
    } catch {
      message.error('Please verify the form fields before saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const topCandidate = rankedRemedies[0];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      title={
        <div className="flex items-center space-x-2">
          <FolderPlus className="w-4 h-4 text-primary-500" />
          <span>Save Repertorial Totality to Patient Case</span>
        </div>
      }
      okText="Save Analysis to Case"
      cancelText="Cancel"
      width={560}
      className="rounded-2xl"
    >
      <div className="py-2 space-y-4">
        {/* Analysis Summary Badge Bar */}
        <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-text-muted">Rubrics in Totality:</div>
            <div className="font-semibold text-text-primary mt-0.5">
              {activeRubrics.length} symptoms
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted">Active Repertory:</div>
            <div className="font-semibold text-text-primary mt-0.5 truncate" title={repertoryName}>
              {repertoryName}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted">Top Similimum:</div>
            <div className="font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
              {topCandidate ? `${topCandidate.remedy.abbreviation} (${topCandidate.coverageCount}/${activeRubrics.length})` : '—'}
            </div>
          </div>
        </div>

        <Form form={form} layout="vertical" className="space-y-1">
          <Form.Item
            name="patientId"
            label="Patient Case File"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <Select
              placeholder="Search or select a patient..."
              showSearch
              filterOption={(input, option) =>
                ((option?.label as string) || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={patients.map((p) => ({
                value: p.id,
                label: `${p.fullName} (${p.registrationNumber})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Analysis Title / Session Tag"
            rules={[{ required: true, message: 'Please provide a title' }]}
          >
            <Input placeholder="e.g. Initial Intake Totality, Acute Flare Analysis..." />
          </Form.Item>

          {consultations.length > 0 && (
            <Form.Item
              name="consultationId"
              label="Link to Consultation Visit (Optional)"
            >
              <Select
                allowClear
                placeholder="Select a consultation to link (or keep as standalone analysis)..."
                options={consultations.map((c) => ({
                  value: c.id,
                  label: `${new Date(c.consultationDate).toLocaleDateString()} — ${c.chiefComplaints.slice(0, 45)}...`,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item name="notes" label="Clinical Notes / Prescription Intention">
            <Input.TextArea
              rows={3}
              placeholder="Enter notes on miasmatic emphasis, eliminating reasons, or key modalities considered in this totality..."
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
