import React, { useMemo } from 'react';
import {
  Calculator,
  Droplets,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setPosologyInput } from '@/app/store/slices/specialtySlice';
import type { VeterinarySpecies } from '../types';
import { calculatePosology } from '../posologyCalculator';

const SPECIES_OPTIONS: VeterinarySpecies[] = [
  'Canine',
  'Feline',
  'Equine',
  'Bovine',
  'Avian',
];

const ACUITY_OPTIONS: Array<'Hyper-acute' | 'Sub-acute' | 'Chronic'> = [
  'Hyper-acute',
  'Sub-acute',
  'Chronic',
];

const WEIGHT_PRESETS: Record<VeterinarySpecies, number[]> = {
  Canine: [5, 15, 25, 40],
  Feline: [3, 4.5, 6],
  Equine: [350, 500, 650],
  Bovine: [450, 600, 800],
  Avian: [0.05, 0.1, 0.4, 1.0],
};

export const VeterinaryPosologyCalculator: React.FC = () => {
  const dispatch = useAppDispatch();
  const posologyInput = useAppSelector((state) => state.specialty.posologyInput);

  const result = useMemo(() => {
    return calculatePosology(
      posologyInput.species,
      posologyInput.weightKg,
      posologyInput.acuity
    );
  }, [posologyInput]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Veterinary Posology & Dosing Calculator
          </h2>
          <p className="text-xs text-text-secondary">
            Species-adapted potency, pellet mass, dilution protocol, and repetition frequency.
          </p>
        </div>
      </div>

      {/* Input Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-card p-5 rounded-2xl border border-border-subtle">
        {/* Species Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary">Target Animal Species</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SPECIES_OPTIONS.map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => dispatch(setPosologyInput({ species: sp, weightKg: WEIGHT_PRESETS[sp][1] }))}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  posologyInput.species === sp
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-surface-subtle text-text-secondary border-border-subtle hover:border-primary-300'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Body Weight Input & Quick Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary">
            Body Weight (kg): <span className="text-primary-600">{posologyInput.weightKg} kg</span>
          </label>
          <input
            type="number"
            min={0.01}
            step={0.5}
            aria-label="Target Animal Weight in kilograms"
            value={posologyInput.weightKg}
            onChange={(e) =>
              dispatch(setPosologyInput({ weightKg: Math.max(0.01, parseFloat(e.target.value) || 1) }))
            }
            className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary-500"
          />
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-text-muted">Presets:</span>
            {WEIGHT_PRESETS[posologyInput.species].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => dispatch(setPosologyInput({ weightKg: w }))}
                className="text-[11px] px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle text-text-secondary hover:text-primary-600"
              >
                {w}kg
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Acuity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-secondary">Acuity & Chronicity</label>
          <div className="flex flex-col gap-1.5">
            {ACUITY_OPTIONS.map((ac) => (
              <button
                key={ac}
                type="button"
                onClick={() => dispatch(setPosologyInput({ acuity: ac }))}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                  posologyInput.acuity === ac
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-surface-subtle text-text-secondary border-border-subtle hover:border-primary-300'
                }`}
              >
                <span>{ac}</span>
                <span className="text-[10px] opacity-75">
                  {ac === 'Hyper-acute' ? '200C - 1M' : ac === 'Sub-acute' ? '30C - 200C' : 'LM / 30C'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Computed Calculation Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Potency & Dosage Card */}
        <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle space-y-3">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Potency & Dose Mass</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Recommended Potency</span>
              <span className="text-sm font-bold text-primary-600">{result.recommendedPotencyRange}</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
              <span className="text-[11px] text-text-muted block">Pellet / Dose Count</span>
              <span className="text-sm font-semibold text-text-primary">{result.recommendedPelletCount}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-start gap-2 text-xs text-text-secondary">
            <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-text-primary block">Repetition Schedule:</span>
              <span>{result.frequency}</span>
            </div>
          </div>
        </div>

        {/* Administration & Dilution Instructions */}
        <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle space-y-3">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Droplets className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Preparation & Delivery</h3>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-secondary space-y-1">
            <span className="font-semibold text-text-primary block">Water Dilution Protocol:</span>
            <p>{result.dilutionInstructions}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-secondary space-y-1">
            <span className="font-semibold text-text-primary block">Administration Route:</span>
            <p>{result.administrationMethod}</p>
          </div>
        </div>
      </div>

      {/* Special Species Caution Banner */}
      <div className="p-4 rounded-xl bg-status-warning/10 border border-status-warning/30 flex items-start gap-3 text-xs text-status-warning">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-sm">Critical Clinical Precaution ({result.species})</span>
          <p className="mt-1 leading-relaxed">{result.specialPrecautions}</p>
        </div>
      </div>
    </div>
  );
};
