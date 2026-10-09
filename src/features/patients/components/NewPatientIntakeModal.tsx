import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Radio, message, Tabs } from 'antd';
import { UserPlus, Sparkles, Activity, Heart } from 'lucide-react';
import { useAppDispatch } from '@/app/store';
import {
  addPatient,
  setActivePatient,
  setCaseFileOpen,
} from '@/app/store/slices/patientSlice';
import { setActiveCase } from '@/app/store/slices/sessionSlice';
import { saveLocalPatient } from '@/core/storage/indexedDbPatients';
import type { Patient, Gender, MiasmType, ThermalState } from '@/features/patients/types';

interface NewPatientIntakeModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewPatientIntakeModal: React.FC<NewPatientIntakeModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('demographics');

  // Auto-generate next registration ID
  const generateRegId = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `PT-2026-${randomSuffix}`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const now = new Date().toISOString();
      const patientId = crypto.randomUUID();
      const registrationNumber = values.registrationNumber || generateRegId();

      const newPatient: Patient = {
        id: patientId,
        registrationNumber,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        fullName: `${values.firstName.trim()} ${values.lastName.trim()}`,
        age: Number(values.age),
        gender: values.gender as Gender,
        bloodGroup: values.bloodGroup || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        address: values.address?.trim() || undefined,
        occupation: values.occupation?.trim() || undefined,
        dominantMiasm: values.dominantMiasm as MiasmType | undefined,
        thermalState: values.thermalState as ThermalState | undefined,
        allergies: values.allergies ? values.allergies.filter(Boolean) : [],
        medicalHistory: values.medicalHistory?.trim() || undefined,
        familyHistory: values.familyHistory?.trim() || undefined,
        status: 'Active',
        createdAt: now,
        updatedAt: now,
      };

      await saveLocalPatient(newPatient);
      dispatch(addPatient(newPatient));
      dispatch(setActivePatient(newPatient));
      dispatch(setActiveCase(newPatient.id));
      dispatch(setCaseFileOpen(true));

      message.success(`Patient record ${registrationNumber} registered successfully.`);
      form.resetFields();
      onClose();
    } catch {
      message.error('Please verify required fields before registering.');
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
      okText="Register & Open Case"
      cancelText="Cancel"
      width={720}
      title={
        <div className="flex items-center space-x-2 text-text-primary pb-2 border-b border-border-subtle">
          <UserPlus className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-lg">New Patient Clinical Intake</span>
        </div>
      }
      className="new-patient-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          gender: 'Female',
          age: 30,
          thermalState: 'Ambithermal',
          dominantMiasm: 'Psora',
          allergies: [],
        }}
        className="mt-4"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'demographics',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Heart className="w-3.5 h-3.5 text-primary-500" /> Demographics
                </span>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'First name is required' }]}
                    >
                      <Input placeholder="e.g. Eleanor" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Last name is required' }]}
                    >
                      <Input placeholder="e.g. Vance" className="rounded-lg" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Form.Item
                      name="age"
                      label="Age (Years)"
                      rules={[{ required: true, message: 'Age is required' }]}
                    >
                      <InputNumber min={0} max={120} className="w-full rounded-lg" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                      <Radio.Group buttonStyle="solid" className="w-full flex">
                        <Radio.Button value="Female" className="flex-1 text-center">Female</Radio.Button>
                        <Radio.Button value="Male" className="flex-1 text-center">Male</Radio.Button>
                        <Radio.Button value="Other" className="flex-1 text-center">Other</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item name="bloodGroup" label="Blood Group">
                      <Select
                        placeholder="Select Group"
                        options={[
                          { value: 'A+', label: 'A+' },
                          { value: 'A-', label: 'A-' },
                          { value: 'B+', label: 'B+' },
                          { value: 'B-', label: 'B-' },
                          { value: 'AB+', label: 'AB+' },
                          { value: 'AB-', label: 'AB-' },
                          { value: 'O+', label: 'O+' },
                          { value: 'O-', label: 'O-' },
                        ]}
                        allowClear
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item name="phone" label="Contact Phone">
                      <Input placeholder="+1 555-0192" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="email" label="Email Address">
                      <Input placeholder="patient@example.com" type="email" className="rounded-lg" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item name="occupation" label="Occupation">
                      <Input placeholder="e.g. Software Engineer" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="address" label="Residential Address">
                      <Input placeholder="e.g. 42 Beacon St, Boston, MA" className="rounded-lg" />
                    </Form.Item>
                  </div>
                </div>
              ),
            },
            {
              key: 'constitution',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Constitutional Generals
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item
                      name="thermalState"
                      label="Thermal State (Hahnemannian Temperature Sensibility)"
                    >
                      <Select
                        placeholder="Select Thermal State"
                        options={[
                          { value: 'Chilly', label: 'Chilly (Aggravated by Cold / Desires Warmth)' },
                          { value: 'Hot', label: 'Hot (Aggravated by Heat / Desires Fresh Air)' },
                          { value: 'Ambithermal', label: 'Ambithermal (Sensitive to Both Extrems)' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name="dominantMiasm"
                      label="Dominant Miasmatic Diathesis"
                    >
                      <Select
                        placeholder="Select Miasm"
                        options={[
                          { value: 'Psora', label: 'Psora (Functional disturbance, itching, hypersensitivity)' },
                          { value: 'Sycosis', label: 'Sycosis (Overgrowth, infiltration, worse dampness)' },
                          { value: 'Syphilis', label: 'Syphilis (Destruction, ulceration, nocturnal pains)' },
                          { value: 'Tubercular', label: 'Tubercular (Rapid emaciation, chest, wanderlust)' },
                          { value: 'Multi-miasmatic', label: 'Multi-miasmatic (Mixed constitutional traits)' },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="allergies"
                    label="Allergies / Hypersensitivities (Press Enter to add)"
                  >
                    <Select
                      mode="tags"
                      placeholder="Add allergies, food reactions, or environmental triggers..."
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              ),
            },
            {
              key: 'anamnesis',
              label: (
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> Clinical Anamnesis
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <Form.Item
                    name="medicalHistory"
                    label="Past Medical History & Recurring Pathologies"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter chief historical illnesses, past surgeries, chronic ailments, suppressions, vaccinations..."
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="familyHistory"
                    label="Family Hereditary History & Diathesis"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter maternal and paternal health tendencies (hypertension, cancer, diabetes, arthritis, asthma)..."
                      className="rounded-lg"
                    />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
};

export default NewPatientIntakeModal;
