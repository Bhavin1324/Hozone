import React, { useMemo } from 'react';
import { Card, Tag, Alert, Segmented } from 'antd';
import {
  Flame,
  Activity,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setThirst,
  setThermal,
  setActivity,
  setEmbryologicalLayers,
} from '@/app/store/slices/expertSystemsSlice';
import type {
  AcuteDecisionNode,
  EmbryologicalLayer,
  ThirstType,
  ThermalType,
  ActivityType,
} from '../types';
import {
  resolveAcutePrescription,
  evaluateHeringTrajectory,
} from '@/core/expert-systems/vijayakarEngine';

interface VijayakarAcuteNavigatorProps {
  nodes: AcuteDecisionNode[];
}

export const VijayakarAcuteNavigator: React.FC<VijayakarAcuteNavigatorProps> = ({ nodes }) => {
  const dispatch = useAppDispatch();
  const {
    selectedThirst,
    selectedThermal,
    selectedActivity,
    previousLayer,
    currentLayer,
  } = useAppSelector((state) => state.expertSystems);

  // Compute Hering's Law suppression evaluation
  const heringEval = useMemo(() => {
    return evaluateHeringTrajectory(previousLayer, currentLayer);
  }, [previousLayer, currentLayer]);

  // Resolve acute candidate remedy from triad
  const acuteResult = useMemo(() => {
    return resolveAcutePrescription(
      nodes,
      selectedThirst,
      selectedThermal,
      selectedActivity,
      heringEval
    );
  }, [nodes, selectedThirst, selectedThermal, selectedActivity, heringEval]);

  const matchedNode = acuteResult.node;

  return (
    <div className="space-y-6">
      {/* Top Method Header */}
      <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Dr. Prafull Vijayakar Acute Flowchart (Predictive Homeopathy)
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Triad navigation across Thirst, Thermal state, Activity, and Embryological Hering Axis.
          </p>
        </div>
        <Tag color="cyan" className="font-semibold text-xs">
          Acute Similimum Navigator
        </Tag>
      </div>

      {/* Triad Navigation Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Axis 1: Thirst */}
        <Card className="border-border-subtle shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
              Axis 1: Thirst State
            </span>
          </div>
          <Segmented<ThirstType>
            block
            value={selectedThirst}
            onChange={(val) => dispatch(setThirst(val))}
            options={[
              { label: 'Thirsty', value: 'Thirsty' },
              { label: 'Thirstless', value: 'Thirstless' },
            ]}
          />
          <p className="text-xs text-text-muted mt-2">
            {selectedThirst === 'Thirsty'
              ? 'Wants water in large gulps or small frequent sips.'
              : 'Complete absence of thirst despite acute inflammatory fever.'}
          </p>
        </Card>

        {/* Axis 2: Thermal */}
        <Card className="border-border-subtle shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
              Axis 2: Thermal State
            </span>
          </div>
          <Segmented<ThermalType>
            block
            value={selectedThermal}
            onChange={(val) => dispatch(setThermal(val))}
            options={[
              { label: 'Hot', value: 'Hot' },
              { label: 'Chilly', value: 'Chilly' },
            ]}
          />
          <p className="text-xs text-text-muted mt-2">
            {selectedThermal === 'Hot'
              ? 'Uncovers, intolerant of warm rooms, desires open cool air or fan.'
              : 'Desires blankets, wrapped up, shuddering from slightest draft.'}
          </p>
        </Card>

        {/* Axis 3: Activity */}
        <Card className="border-border-subtle shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-xs uppercase tracking-wider text-text-muted">
              Axis 3: Activity / Motor
            </span>
          </div>
          <Segmented<ActivityType>
            block
            value={selectedActivity}
            onChange={(val) => dispatch(setActivity(val))}
            options={[
              { label: 'Restless', value: 'Restless' },
              { label: 'Dull / Sluggish', value: 'Dull' },
            ]}
          />
          <p className="text-xs text-text-muted mt-2">
            {selectedActivity === 'Restless'
              ? 'Tossing about in bed, anxious movement, motor agitation.'
              : 'Averse to motion, drowsy, heavy eyelids, wishes to lie quiet.'}
          </p>
        </Card>
      </div>

      {/* Acute Prescribing Results Card */}
      {matchedNode ? (
        <Card className="border-primary-500/30 bg-surface-card shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border-subtle">
            <div>
              <div className="flex items-center space-x-2">
                <Tag color="gold" className="text-xs font-bold uppercase">
                  Primary Similimum
                </Tag>
                <span className="text-xs font-mono text-text-muted">
                  Node: {matchedNode.nodeKey}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight mt-1 flex items-center gap-2">
                {matchedNode.primaryRemedy}
                <Tag color="cyan" className="font-mono text-sm">
                  {matchedNode.remedyAbbreviation}
                </Tag>
              </h3>
              <p className="text-xs text-text-secondary mt-1 max-w-2xl leading-relaxed">
                {matchedNode.clinicalIndications}
              </p>
            </div>

            {/* Differential Remedies */}
            <div className="sm:text-right shrink-0">
              <span className="text-xs font-semibold text-text-muted block mb-1">
                Close Differentials:
              </span>
              <div className="flex flex-wrap sm:justify-end gap-1">
                {matchedNode.differentialRemedies.map((diff, i) => (
                  <Tag key={i} color="geekblue" className="text-xs">
                    {diff}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Keynote Modalities */}
          <div className="pt-4">
            <span className="text-xs font-semibold text-text-muted block mb-2">
              Keynote Modalities:
            </span>
            <div className="flex flex-wrap gap-2">
              {matchedNode.keynoteModalities.map((mod, i) => (
                <Tag key={i} className="bg-surface-subtle border-border-subtle text-text-primary">
                  {mod}
                </Tag>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Alert
          type="info"
          message="No acute node matched for the selected triad combination."
          showIcon
        />
      )}

      {/* Hering's Law & Embryological Suppression Evaluation */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="font-semibold text-sm text-text-primary">
              Embryological Axis & Hering&apos;s Law Evaluation
            </span>
          </div>
        }
        className="border-border-subtle shadow-xs"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Track whether the patient&apos;s pathology is progressing towards true cure (from within outward: Endoderm/Mesoderm → Ectoderm) or suffering suppression (outside inward: Ectoderm → Endoderm).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-text-muted block mb-1.5">
                Previous Symptom Tissue Layer:
              </span>
              <Segmented<EmbryologicalLayer>
                block
                value={previousLayer}
                onChange={(val) =>
                  dispatch(
                    setEmbryologicalLayers({
                      previous: val,
                      current: currentLayer,
                    })
                  )
                }
                options={[
                  { label: 'Ectoderm (Skin/Nerves)', value: 'Ectoderm' },
                  { label: 'Mesoderm (Joints/Muscles)', value: 'Mesoderm' },
                  { label: 'Endoderm (Lungs/GI)', value: 'Endoderm' },
                ]}
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-text-muted block mb-1.5">
                Current Symptom Tissue Layer:
              </span>
              <Segmented<EmbryologicalLayer>
                block
                value={currentLayer}
                onChange={(val) =>
                  dispatch(
                    setEmbryologicalLayers({
                      previous: previousLayer,
                      current: val,
                    })
                  )
                }
                options={[
                  { label: 'Ectoderm (Skin/Nerves)', value: 'Ectoderm' },
                  { label: 'Mesoderm (Joints/Muscles)', value: 'Mesoderm' },
                  { label: 'Endoderm (Lungs/GI)', value: 'Endoderm' },
                ]}
              />
            </div>
          </div>

          {/* Direction Banner */}
          {heringEval && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-3 ${
                heringEval.direction === 'Suppression_Warning'
                  ? 'bg-status-error/10 border-status-error/30 text-status-error'
                  : heringEval.direction === 'Cure_Progressing'
                    ? 'bg-status-success/10 border-status-success/30 text-status-success'
                    : 'bg-surface-subtle border-border-subtle text-text-primary'
              }`}
            >
              {heringEval.direction === 'Suppression_Warning' ? (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : heringEval.direction === 'Cure_Progressing' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <Activity className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  {heringEval.direction.replace('_', ' ')}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed text-text-primary">
                  {heringEval.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
