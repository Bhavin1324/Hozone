import React from 'react';
import { Tag, Button } from 'antd';
import { User, FolderPlus, FileText, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setCaseFileOpen, clearActivePatient } from '@/app/store/slices/patientSlice';
import { setActiveCase } from '@/app/store/slices/sessionSlice';

interface ActivePatientBannerProps {
  onOpenSaveModal: () => void;
}

export const ActivePatientBanner: React.FC<ActivePatientBannerProps> = ({ onOpenSaveModal }) => {
  const dispatch = useAppDispatch();
  const activePatient = useAppSelector((state) => state.patients.activePatient);
  const activeRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  if (!activePatient) return null;

  return (
    <div className="p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-bold text-text-primary truncate">
              Active Case: {activePatient.fullName}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-card border border-border-subtle text-text-muted">
              {activePatient.registrationNumber}
            </span>
            <Tag color={activePatient.status === 'Active' ? 'green' : 'orange'} className="text-[10px] m-0">
              {activePatient.status}
            </Tag>
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">
            {activePatient.age} yrs • {activePatient.gender} • Thermal: {activePatient.thermalState || 'Ambithermal'} • Miasm: {activePatient.dominantMiasm || 'Psora'}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <Button
          type="primary"
          size="small"
          icon={<FolderPlus className="w-3.5 h-3.5" />}
          disabled={activeRubrics.length === 0}
          onClick={onOpenSaveModal}
          className="text-xs rounded-lg"
          title={activeRubrics.length === 0 ? 'Add rubrics to case clipboard first' : 'Save current repertorial totality to this patient'}
        >
          Save Totality to Case
        </Button>
        <Button
          size="small"
          icon={<FileText className="w-3.5 h-3.5" />}
          onClick={() => dispatch(setCaseFileOpen(true))}
          className="text-xs rounded-lg"
          title="Open complete clinical case drawer"
        >
          Case File
        </Button>
        <Button
          type="text"
          size="small"
          icon={<X className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />}
          onClick={() => {
            dispatch(clearActivePatient());
            dispatch(setActiveCase(null));
          }}
          className="rounded-lg"
          title="Close patient case context"
        />
      </div>
    </div>
  );
};
