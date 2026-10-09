import React, { useMemo } from 'react';
import { Card, Tag, Button, Radio, Checkbox } from 'antd';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setKentAggravation,
  setKentAmelioration,
  setKentEvolution,
  setKentIsProver,
  resetKentObservationInput,
} from '@/app/store/slices/expertSystemsSlice';
import type {
  AggravationDuration,
  AmeliorationPattern,
  KentObservationRule,
  KentPrognosisCategory,
  SymptomEvolution,
} from '../types';
import { evaluateKentPrognosis } from '@/core/expert-systems/kentPrognosisEngine';

interface KentsObservationsNavigatorProps {
  rules: KentObservationRule[];
}

const CATEGORY_COLORS: Record<KentPrognosisCategory, string> = {
  Curable_Ideal: 'green',
  Curable_Borderline: 'blue',
  Incurable_Destructive: 'red',
  Superficial_Palliative: 'orange',
  Wrong_Remedy: 'volcano',
  Suppression_Danger: 'magenta',
  Prover_Sensitive: 'purple',
};

export const KentsObservationsNavigator: React.FC<KentsObservationsNavigatorProps> = ({
  rules,
}) => {
  const dispatch = useAppDispatch();
  const {
    kentAggravation,
    kentAmelioration,
    kentEvolution,
    kentIsProver,
  } = useAppSelector((state) => state.expertSystems);

  const evaluation = useMemo(() => {
    return evaluateKentPrognosis(
      {
        aggravationDuration: kentAggravation,
        ameliorationPattern: kentAmelioration,
        symptomEvolution: kentEvolution,
        isIdiosyncraticProver: kentIsProver,
      },
      rules
    );
  }, [kentAggravation, kentAmelioration, kentEvolution, kentIsProver, rules]);

  const matched = evaluation.matchedObservation;

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Dr. James Tyler Kent: Twelve Prognostic Observations
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Classical post-prescription case progression evaluation, Hering’s Law compliance, and decisive action directives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<RotateCcw className="w-3.5 h-3.5 mr-1" />}
            onClick={() => dispatch(resetKentObservationInput())}
            className="border-border-subtle text-xs"
          >
            Reset Evaluation
          </Button>
          <Tag color="geekblue" className="font-semibold text-xs m-0">
            Post-Prescription Prognosis
          </Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Diagnostics Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border-subtle shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 pb-1 border-b border-border-subtle">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              Follow-Up Observation Triad
            </h3>

            {/* Aggravation Duration */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-primary block">
                1. Initial Aggravation Duration:
              </span>
              <Radio.Group
                value={kentAggravation}
                onChange={(e) => dispatch(setKentAggravation(e.target.value as AggravationDuration))}
                className="flex flex-col space-y-1.5 text-xs"
              >
                <Radio value="none">No Aggravation (Smooth progression)</Radio>
                <Radio value="short_strong">Short &amp; Strong (Hours to a few days)</Radio>
                <Radio value="long_severe">Long &amp; Severe (Weeks of intensity)</Radio>
                <Radio value="prolonged_decline">Prolonged Continuous Vital Decline</Radio>
              </Radio.Group>
            </div>

            {/* Amelioration Pattern */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <span className="text-xs font-semibold text-text-primary block">
                2. Amelioration Pattern:
              </span>
              <Radio.Group
                value={kentAmelioration}
                onChange={(e) => dispatch(setKentAmelioration(e.target.value as AmeliorationPattern))}
                className="flex flex-col space-y-1.5 text-xs"
              >
                <Radio value="rapid_permanent">Rapid &amp; Long-Lasting Permanent Recovery</Radio>
                <Radio value="slow_steady">Slow, Gradual &amp; Steady Improvement</Radio>
                <Radio value="first_then_worse">First Better, Then Worse (Relapse)</Radio>
                <Radio value="short_relief">Too Short Relief (Quick recurrence)</Radio>
                <Radio value="relief_symptoms_not_patient">Symptom Relief, but NOT Patient</Radio>
                <Radio value="none">No Perceptible Relief</Radio>
              </Radio.Group>
            </div>

            {/* Symptom Evolution (Hering's Law) */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <span className="text-xs font-semibold text-text-primary block">
                3. Symptom Evolution (Direction of Disease):
              </span>
              <Radio.Group
                value={kentEvolution}
                onChange={(e) => dispatch(setKentEvolution(e.target.value as SymptomEvolution))}
                className="flex flex-col space-y-1.5 text-xs"
              >
                <Radio value="normal_progression">Normal Progressive Convalescence</Radio>
                <Radio value="old_symptoms_return">Old Symptoms Reappear (Reverse Order)</Radio>
                <Radio value="new_symptoms_appear">New Symptoms Appear (Not of disease)</Radio>
                <Radio value="wrong_direction_suppression">Symptoms Take Wrong Direction (Inward!)</Radio>
                <Radio value="prover_response">Action of Remedy upon Prover</Radio>
              </Radio.Group>
            </div>

            {/* Idiosyncratic Prover Checkbox */}
            <div className="pt-2 border-t border-border-subtle">
              <Checkbox
                checked={kentIsProver}
                onChange={(e) => dispatch(setKentIsProver(e.target.checked))}
                className="text-xs font-medium text-text-primary"
              >
                Patient is oversensitive and proves every remedy
              </Checkbox>
            </div>
          </Card>
        </div>

        {/* Right: Diagnostic Prognosis Outcome & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border-subtle shadow-xs space-y-4">
            {/* Header Result Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-subtle">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                  Prescription Outcome Diagnosis
                </span>
                <h3 className="text-lg font-bold text-text-primary tracking-tight">
                  {matched.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <Tag color={CATEGORY_COLORS[matched.category]} className="font-semibold text-xs py-0.5 px-2">
                  {matched.category.replace('_', ' ')}
                </Tag>
              </div>
            </div>

            {/* Hering's Law Indicator Card */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                matched.heringCompliance === 'Strictly_Compliant'
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : matched.heringCompliance === 'Non_Compliant_Suppression'
                  ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
                  : 'bg-surface-subtle border-border-subtle text-text-primary'
              }`}
            >
              {matched.heringCompliance === 'Strictly_Compliant' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : matched.heringCompliance === 'Non_Compliant_Suppression' ? (
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-0.5">
                <span className="font-bold block uppercase tracking-wider">
                  Hering’s Law of Cure Assessment: {matched.heringCompliance.replace(/_/g, ' ')}
                </span>
                <p className="opacity-90">{matched.clinicalSignificance}</p>
              </div>
            </div>

            {/* Decisive Physician Action Directive */}
            <div className="p-4 rounded-xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/25 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Required Physician Action Directive:
              </span>
              <p className="text-sm font-semibold text-text-primary leading-relaxed">
                {evaluation.recommendedAction}
              </p>
            </div>

            {/* Repetition Warning Callout */}
            <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wider">
                  Repetition Protocol &amp; Warnings:
                </span>
                <p className="text-text-primary leading-relaxed">
                  {matched.repetitionWarning}
                </p>
              </div>
            </div>

            {/* Contraindicated Pitfalls */}
            {evaluation.contraindicatedActions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                  Actions Contraindicated in this State:
                </span>
                <ul className="space-y-1 text-xs text-text-primary list-disc list-inside">
                  {evaluation.contraindicatedActions.map((act, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Classical 12 Observations Reference Compendium */}
      <Card className="border-border-subtle shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5 pb-1 border-b border-border-subtle">
          <Activity className="w-3.5 h-3.5 text-primary-500" />
          Kent’s 12 Observations Reference Compendium
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rules.map((rule) => {
            const isCurrentlySelected = matched.observationNumber === rule.observationNumber;
            return (
              <div
                key={rule.id}
                className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                  isCurrentlySelected
                    ? 'bg-primary-500/5 border-primary-500 shadow-xs'
                    : 'bg-surface-subtle border-border-subtle'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-text-primary">
                    Obs #{rule.observationNumber}
                  </span>
                  <Tag color={CATEGORY_COLORS[rule.category]} className="text-[10px] m-0 py-0 px-1.5 font-semibold">
                    {rule.category.replace('_', ' ')}
                  </Tag>
                </div>
                <h4 className="font-semibold text-text-primary leading-snug">
                  {rule.title.replace(/^Observation \d+:\s*/, '')}
                </h4>
                <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-3">
                  {rule.shortDescription}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
