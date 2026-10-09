import React, { useMemo } from 'react';
import { Card, Tag, Button, Checkbox, Progress } from 'antd';
import { Users, RotateCcw, Sparkles, HeartHandshake } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleTrait, clearTraits } from '@/app/store/slices/expertSystemsSlice';
import type { TemperamentProfile, TemperamentType } from '../types';
import { calculateTemperamentBlend } from '@/core/expert-systems/temprazEngine';

interface TemprazConstitutionSelectorProps {
  profiles: TemperamentProfile[];
}

const TEMPERAMENT_COLORS: Record<TemperamentType, string> = {
  sanguine: '#0284C7',
  melancholic: '#7E22CE',
  choleric: '#DC2626',
  phlegmatic: '#15803D',
  nervous: '#D97706',
};

export const TemprazConstitutionSelector: React.FC<TemprazConstitutionSelectorProps> = ({
  profiles,
}) => {
  const dispatch = useAppDispatch();
  const selectedTraits = useAppSelector((state) => state.expertSystems.selectedTraits);

  const blendResult = useMemo(() => {
    return calculateTemperamentBlend(selectedTraits, profiles);
  }, [selectedTraits, profiles]);

  const dominantProfile = profiles.find(
    (p) => p.temperament === blendResult.dominantTemperament
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Tempraz Expert System (Dr. Parinaz Humranwala)
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Constitutional similimum differentiation across the 5 core human temperaments.
          </p>
        </div>
        <Button
          size="small"
          icon={<RotateCcw className="w-3.5 h-3.5 mr-1" />}
          onClick={() => dispatch(clearTraits())}
        >
          Reset Traits
        </Button>
      </div>

      {/* Constitutional Blend Breakdown */}
      <Card className="border-border-subtle shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Temperament Distribution Profile ({selectedTraits.length} traits selected)
          </span>
          <Tag color="cyan" className="font-semibold text-xs">
            Dominant: {dominantProfile?.displayName}
          </Tag>
        </div>

        <div className="space-y-3">
          {profiles.map((p) => {
            const pct = blendResult.percentages[p.temperament];
            return (
              <div key={p.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text-primary">{p.displayName}</span>
                  <span className="font-mono text-text-secondary">{pct}%</span>
                </div>
                <Progress
                  percent={pct}
                  strokeColor={TEMPERAMENT_COLORS[p.temperament]}
                  size="small"
                  showInfo={false}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Dominant Constitutional Remedy Summary */}
      {dominantProfile && (
        <Card className="border-primary-500/30 bg-surface-card shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-bold uppercase text-primary-600">
              Constitutional Similimum Synthesis
            </span>
          </div>

          <h3 className="text-xl font-bold text-text-primary tracking-tight">
            {dominantProfile.displayName} Dominant
          </h3>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {dominantProfile.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs">
            <div>
              <span className="font-semibold text-text-muted block mb-1">Physical Habitus:</span>
              <p className="text-text-primary">{dominantProfile.physicalAppearance}</p>
            </div>
            <div>
              <span className="font-semibold text-text-muted block mb-1">Miasmatic Axis:</span>
              <p className="text-text-primary">{dominantProfile.miasmAffinity}</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-text-muted block mb-2">
              Recommended Constitutional Polychrests:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {blendResult.recommendedRemedies.map((rem, idx) => (
                <Tag key={idx} color="blue" className="text-xs font-medium">
                  {rem}
                </Tag>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Trait Checklist Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            title={
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary-500" />
                <span className="font-semibold text-xs text-text-primary">
                  {profile.displayName}
                </span>
              </div>
            }
            className="border-border-subtle shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              {profile.keyBehavioralTraits.map((trait, tIdx) => {
                const isChecked = selectedTraits.includes(trait);
                return (
                  <div
                    key={tIdx}
                    className="flex items-start space-x-2 text-xs cursor-pointer select-none"
                    onClick={() => dispatch(toggleTrait(trait))}
                  >
                    <Checkbox checked={isChecked} className="mt-0.5" />
                    <span
                      className={`${isChecked ? 'text-text-primary font-semibold' : 'text-text-secondary'}`}
                    >
                      {trait}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
