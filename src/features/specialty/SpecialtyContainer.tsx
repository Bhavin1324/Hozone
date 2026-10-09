import React from 'react';
import {
  BookOpen,
  PawPrint,
  Calculator,
  Award,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setActiveTab,
  type SpecialtyTab,
} from '@/app/store/slices/specialtySlice';
import { SpecialtyRepertoryView } from './components/SpecialtyRepertoryView';
import { VeterinaryRepertoryView } from './components/VeterinaryRepertoryView';
import { VeterinaryPosologyCalculator } from './components/VeterinaryPosologyCalculator';
import { VeterinaryCasesView } from './components/VeterinaryCasesView';

interface TabItem {
  key: SpecialtyTab;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabItem[] = [
  {
    key: 'repertory',
    label: 'Specialty Repertories',
    icon: BookOpen,
    description: 'Borland, Clarke Clinical, Boger Synoptic, TPB Pocket Book',
  },
  {
    key: 'veterinary-repertory',
    label: 'Veterinary Repertory',
    icon: PawPrint,
    description: 'Canine, Feline, Equine, Bovine & Avian clinical rubrics',
  },
  {
    key: 'posology-calculator',
    label: 'Posology & Dosing',
    icon: Calculator,
    description: 'Species-adapted potency, dilution, and administration',
  },
  {
    key: 'veterinary-cases',
    label: 'Veterinary Cases',
    icon: Award,
    description: 'Verified clinical cures with remedy outcomes',
  },
];

export const SpecialtyContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.specialty.activeTab);
  const activeRubrics = useAppSelector((state) => state.repertorization.activeRubrics);

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Clinical Workspace Header */}
      <header className="border-b border-border-subtle bg-surface-card px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                100% Hompath Zomeo Elite Parity
              </span>
              <span className="text-xs text-text-muted">Module 6: Final Milestone</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">
              Specialty Repertories & Veterinary Extensions
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Comprehensive pediatric, clinical, pocket book, multi-species veterinary repertories and posology.
            </p>
          </div>

          {/* Active Case Rubric Counter */}
          <div className="flex items-center gap-3 bg-surface-subtle px-4 py-2 rounded-xl border border-border-subtle shrink-0">
            <ClipboardList className="w-4 h-4 text-primary-500" />
            <div className="text-xs">
              <span className="text-text-muted block">Active Case Clipboard</span>
              <span className="font-semibold text-text-primary">
                {activeRubrics.length} {activeRubrics.length === 1 ? 'Rubric' : 'Rubrics'} loaded
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => dispatch(setActiveTab(tab.key))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                    : 'bg-surface-card text-text-secondary border-border-subtle hover:border-primary-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div>{tab.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 pb-12">
        {activeTab === 'repertory' && <SpecialtyRepertoryView />}
        {activeTab === 'veterinary-repertory' && <VeterinaryRepertoryView />}
        {activeTab === 'posology-calculator' && <VeterinaryPosologyCalculator />}
        {activeTab === 'veterinary-cases' && <VeterinaryCasesView />}
      </main>
    </div>
  );
};

export default SpecialtyContainer;
