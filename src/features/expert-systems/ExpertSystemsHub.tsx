import React, { useEffect, useState } from 'react';
import { Segmented } from 'antd';
import {
  Compass,
  HeartHandshake,
  Brain,
  Atom,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setActiveSystem,
  type ExpertSystemType,
} from '@/app/store/slices/expertSystemsSlice';
import {
  getLocalAcuteNodes,
  getLocalTemperaments,
  getLocalSehgalScripts,
  getLocalScholtenElements,
  getLocalKentObservations,
} from '@/core/storage/indexedDb';
import type {
  AcuteDecisionNode,
  TemperamentProfile,
  SehgalScript,
  ScholtenElement,
  KentObservationRule,
} from './types';
import { VijayakarAcuteNavigator } from './components/VijayakarAcuteNavigator';
import { TemprazConstitutionSelector } from './components/TemprazConstitutionSelector';
import { SehgalMindRubricTranslator } from './components/SehgalMindRubricTranslator';
import { ScholtenElementMatrix } from './components/ScholtenElementMatrix';
import { KentsObservationsNavigator } from './components/KentsObservationsNavigator';

export const ExpertSystemsHub: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeSystem = useAppSelector((state) => state.expertSystems.activeSystem);

  const [acuteNodes, setAcuteNodes] = useState<AcuteDecisionNode[]>([]);
  const [temperaments, setTemperaments] = useState<TemperamentProfile[]>([]);
  const [sehgalScripts, setSehgalScripts] = useState<SehgalScript[]>([]);
  const [scholtenElements, setScholtenElements] = useState<ScholtenElement[]>([]);
  const [kentRules, setKentRules] = useState<KentObservationRule[]>([]);

  // Hydrate data from IndexedDB
  useEffect(() => {
    let mounted = true;
    Promise.all([
      getLocalAcuteNodes(),
      getLocalTemperaments(),
      getLocalSehgalScripts(),
      getLocalScholtenElements(),
      getLocalKentObservations(),
    ]).then(([nodes, temps, scripts, elements, kRules]) => {
      if (mounted) {
        setAcuteNodes(nodes);
        setTemperaments(temps);
        setSehgalScripts(scripts);
        setScholtenElements(elements);
        setKentRules(kRules);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <header className="px-6 py-4 bg-surface-card border-b border-border-subtle rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Clinical Decision &amp; Expert Systems
            </h1>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Predictive acute navigation, constitutional temperaments, Mind rubric translation, Scholten element theory, and Kent’s 12 prognostic observations.
          </p>
        </div>

        <Segmented<ExpertSystemType>
          value={activeSystem}
          onChange={(val) => dispatch(setActiveSystem(val))}
          options={[
            {
              value: 'vijayakar',
              label: (
                <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5 text-primary-500" />
                  Vijayakar Acute
                </span>
              ),
            },
            {
              value: 'tempraz',
              label: (
                <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <HeartHandshake className="w-3.5 h-3.5 text-blue-500" />
                  Tempraz
                </span>
              ),
            },
            {
              value: 'sehgal',
              label: (
                <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Brain className="w-3.5 h-3.5 text-purple-500" />
                  Sehgal Mind
                </span>
              ),
            },
            {
              value: 'scholten',
              label: (
                <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Atom className="w-3.5 h-3.5 text-emerald-500" />
                  Scholten Elements
                </span>
              ),
            },
            {
              value: 'kent',
              label: (
                <span className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  Kent 12 Observations
                </span>
              ),
            },
          ]}
        />
      </header>

      {/* Main Content Area */}
      <main>
        {activeSystem === 'vijayakar' && (
          <VijayakarAcuteNavigator nodes={acuteNodes} />
        )}

        {activeSystem === 'tempraz' && (
          <TemprazConstitutionSelector profiles={temperaments} />
        )}

        {activeSystem === 'sehgal' && (
          <SehgalMindRubricTranslator scripts={sehgalScripts} />
        )}

        {activeSystem === 'scholten' && (
          <ScholtenElementMatrix elements={scholtenElements} />
        )}

        {activeSystem === 'kent' && (
          <KentsObservationsNavigator rules={kentRules} />
        )}
      </main>
    </div>
  );
};

export default ExpertSystemsHub;
