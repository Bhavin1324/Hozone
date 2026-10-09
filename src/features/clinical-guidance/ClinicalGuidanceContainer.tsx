import React from 'react';
import {
  Stethoscope,
  Lightbulb,
  FileText,
  Utensils,
  FlaskRound as Flask,
} from 'lucide-react';
import { Segmented } from 'antd';
import { motion, AnimatePresence } from 'motion/react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveTab } from '@/app/store/slices/clinicalGuidanceSlice';
import type { ClinicalGuidanceTab } from './types';
import { ClinicalTipsView } from './components/ClinicalTipsView';
import { CuredCasesView } from './components/CuredCasesView';
import { DiseaseNutritionView } from './components/DiseaseNutritionView';
import { MotherTincturesView } from './components/MotherTincturesView';

export const ClinicalGuidanceContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.clinicalGuidance.activeTab);

  const tabOptions = [
    {
      value: 'tips' as ClinicalGuidanceTab,
      label: (
        <div className="flex items-center gap-2 py-1 px-1">
          <Lightbulb className="w-4 h-4 text-primary-500" />
          <span className="font-medium text-xs md:text-sm">Clinical Pearls</span>
        </div>
      ),
    },
    {
      value: 'cases' as ClinicalGuidanceTab,
      label: (
        <div className="flex items-center gap-2 py-1 px-1">
          <FileText className="w-4 h-4 text-primary-500" />
          <span className="font-medium text-xs md:text-sm">Cured Cases Archive</span>
        </div>
      ),
    },
    {
      value: 'nutrition' as ClinicalGuidanceTab,
      label: (
        <div className="flex items-center gap-2 py-1 px-1">
          <Utensils className="w-4 h-4 text-primary-500" />
          <span className="font-medium text-xs md:text-sm">Disease Nutrition</span>
        </div>
      ),
    },
    {
      value: 'tinctures' as ClinicalGuidanceTab,
      label: (
        <div className="flex items-center gap-2 py-1 px-1">
          <Flask className="w-4 h-4 text-primary-500" />
          <span className="font-medium text-xs md:text-sm">Mother Tinctures ($Q$)</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
                  Clinical Evidence & Practice Guidance
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20">
                  Bedside Companion
                </span>
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-1">
                Verified clinical pearls, historical cured cases archive, disease nutrition & antidote matrix, and mother tincture therapeutics.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Tab Segmented Selector */}
        <div className="mt-6 pt-5 border-t border-border-subtle overflow-x-auto">
          <Segmented
            options={tabOptions}
            value={activeTab}
            onChange={(val) => dispatch(setActiveTab(val as ClinicalGuidanceTab))}
            className="p-1 bg-surface-subtle border border-border-subtle rounded-xl text-text-primary"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'tips' && <ClinicalTipsView />}
            {activeTab === 'cases' && <CuredCasesView />}
            {activeTab === 'nutrition' && <DiseaseNutritionView />}
            {activeTab === 'tinctures' && <MotherTincturesView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClinicalGuidanceContainer;
