import React, { useEffect, useTransition } from 'react';
import { Card, Table, Tag, Button, Input, Segmented } from 'antd';
import {
  Users,
  Search,
  Plus,
  FileText,
  Thermometer,
  Flame,
  Stethoscope,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setPatients,
  setActivePatient,
  setSearchQuery,
  setFilterStatus,
  setCaseFileOpen,
  setIntakeModalOpen,
  setConsultationModalOpen,
} from '@/app/store/slices/patientSlice';
import { setActiveCase } from '@/app/store/slices/sessionSlice';
import { searchLocalPatients } from '@/core/storage/indexedDbPatients';
import { NewPatientIntakeModal } from './components/NewPatientIntakeModal';
import { PatientCaseFileDrawer } from './components/PatientCaseFileDrawer';
import { NewConsultationModal } from './components/NewConsultationModal';
import type { Patient, PatientStatus } from './types';

export const PatientsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector((state) => state.patients.patients);
  const searchQuery = useAppSelector((state) => state.patients.searchQuery);
  const filterStatus = useAppSelector((state) => state.patients.filterStatus);
  const isIntakeOpen = useAppSelector((state) => state.patients.isIntakeModalOpen);
  const isConsultOpen = useAppSelector(
    (state) => state.patients.isConsultationModalOpen
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;
    const statusParam = filterStatus === 'All' ? undefined : filterStatus;
    searchLocalPatients(searchQuery, statusParam)
      .then((records) => {
        if (!isMounted) return;
        startTransition(() => {
          dispatch(setPatients(records));
        });
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, filterStatus, dispatch]);

  const handleOpenCase = (patient: Patient) => {
    dispatch(setActivePatient(patient));
    dispatch(setActiveCase(patient.id));
    dispatch(setCaseFileOpen(true));
  };

  const handleQuickConsult = (patient: Patient) => {
    dispatch(setActivePatient(patient));
    dispatch(setActiveCase(patient.id));
    dispatch(setConsultationModalOpen(true));
  };

  const columns = [
    {
      title: 'Record ID',
      dataIndex: 'registrationNumber',
      key: 'registrationNumber',
      render: (id: string) => (
        <span className="font-mono text-xs font-semibold text-primary-600 bg-primary-50/50 px-2 py-0.5 rounded border border-primary-200/50">
          {id}
        </span>
      ),
    },
    {
      title: 'Patient Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: Patient) => (
        <div>
          <button
            onClick={() => handleOpenCase(record)}
            className="font-semibold text-text-primary hover:text-primary-600 cursor-pointer text-left text-sm"
          >
            {name}
          </button>
          <div className="text-[11px] text-text-muted">
            {record.phone || record.email || 'No contact provided'}
          </div>
        </div>
      ),
    },
    {
      title: 'Demographics',
      key: 'demographics',
      render: (_: unknown, record: Patient) => (
        <span className="text-xs text-text-secondary">
          {record.age}y / {record.gender}
          {record.bloodGroup && (
            <span className="ml-1 text-[10px] font-mono text-text-muted">
              ({record.bloodGroup})
            </span>
          )}
        </span>
      ),
    },
    {
      title: 'Constitution & Miasm',
      key: 'constitution',
      render: (_: unknown, record: Patient) => (
        <div className="flex flex-wrap gap-1 text-[11px]">
          {record.thermalState && (
            <Tag icon={<Thermometer className="w-3 h-3 mr-0.5 inline" />} color="blue">
              {record.thermalState}
            </Tag>
          )}
          {record.dominantMiasm && (
            <Tag icon={<Flame className="w-3 h-3 mr-0.5 inline" />} color="orange">
              {record.dominantMiasm}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PatientStatus) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Follow-up' ? 'orange' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Patient) => (
        <div className="flex items-center space-x-2">
          <Button
            size="small"
            icon={<FileText className="w-3.5 h-3.5 mr-1" />}
            onClick={() => handleOpenCase(record)}
            className="text-xs"
          >
            Case File
          </Button>
          <Button
            size="small"
            icon={<Stethoscope className="w-3.5 h-3.5 mr-1" />}
            onClick={() => handleQuickConsult(record)}
            className="text-xs border-primary-500 text-primary-600"
          >
            Consult
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" />
            Patient Clinical Records
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Maintain longitudinal patient case histories, constitutional anamnesis, and follow-up trajectories.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4 mr-1" />}
          onClick={() => dispatch(setIntakeModalOpen(true))}
          className="rounded-xl shadow-xs"
        >
          New Patient Intake
        </Button>
      </div>

      <Card className="border-border-subtle shadow-xs">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              prefix={<Search className="w-4 h-4 text-text-muted mr-2" />}
              placeholder="Search patients by name, registration ID, or condition..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              allowClear
              className="rounded-xl"
            />
          </div>

          <Segmented
            value={filterStatus}
            onChange={(val) => dispatch(setFilterStatus(val as PatientStatus | 'All'))}
            options={['All', 'Active', 'Follow-up', 'Archived']}
            className="self-start sm:self-auto"
          />
        </div>

        <Table
          dataSource={patients}
          columns={columns}
          rowKey="id"
          loading={isPending}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="overflow-x-auto"
        />
      </Card>

      {/* Modals & Workspace Drawer */}
      <NewPatientIntakeModal
        open={isIntakeOpen}
        onClose={() => dispatch(setIntakeModalOpen(false))}
      />

      <PatientCaseFileDrawer />

      <NewConsultationModal
        open={isConsultOpen}
        onClose={() => dispatch(setConsultationModalOpen(false))}
      />
    </div>
  );
};

export default PatientsContainer;
