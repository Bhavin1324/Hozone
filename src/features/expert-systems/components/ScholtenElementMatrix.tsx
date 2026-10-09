import React, { useMemo } from 'react';
import { Card, Tag, Select, Button } from 'antd';
import { BookOpen, Layers, Atom } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setScholtenCoordinates } from '@/app/store/slices/expertSystemsSlice';
import type { ScholtenElement } from '../types';
import {
  findScholtenElement,
  getSeriesElements,
  describeAxisCoordinates,
} from '@/core/expert-systems/scholtenEngine';
import {
  SCHOLTEN_SERIES_METADATA,
  SCHOLTEN_STAGES_METADATA,
} from '@/core/storage/expertSystemsData';
import { ROUTES } from '@/core/config/constants';

interface ScholtenElementMatrixProps {
  elements: ScholtenElement[];
}

export const ScholtenElementMatrix: React.FC<ScholtenElementMatrixProps> = ({ elements }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedSeries, selectedStage } = useAppSelector(
    (state) => state.expertSystems
  );

  const matchedElement = useMemo(() => {
    return findScholtenElement(elements, selectedSeries, selectedStage);
  }, [elements, selectedSeries, selectedStage]);

  const seriesElements = useMemo(() => {
    return getSeriesElements(elements, selectedSeries);
  }, [elements, selectedSeries]);

  const axisDescription = useMemo(() => {
    return describeAxisCoordinates(selectedSeries, selectedStage);
  }, [selectedSeries, selectedStage]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-surface-card border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Atom className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Element Theory System (Jan Scholten Periodic Table Analysis)
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Mineral axis analysis across 7 Series (Life Themes) × 18 Stages (Developmental Phases).
          </p>
        </div>
        <Tag color="geekblue" className="font-semibold text-xs">
          Periodic Table Matrix
        </Tag>
      </div>

      {/* Axis Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border-subtle shadow-xs">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
            Horizontal Axis: Series (Row 1 to 7)
          </label>
          <Select
            className="w-full"
            value={selectedSeries}
            onChange={(val) =>
              dispatch(
                setScholtenCoordinates({
                  series: val,
                  stage: selectedStage,
                })
              )
            }
            options={SCHOLTEN_SERIES_METADATA.map((s) => ({
              value: s.series,
              label: `Series ${s.series}: ${s.name} — ${s.theme}`,
            }))}
          />
        </Card>

        <Card className="border-border-subtle shadow-xs">
          <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
            Vertical Axis: Stage (Column 1 to 18)
          </label>
          <Select
            className="w-full"
            value={selectedStage}
            onChange={(val) =>
              dispatch(
                setScholtenCoordinates({
                  series: selectedSeries,
                  stage: val,
                })
              )
            }
            options={SCHOLTEN_STAGES_METADATA.map((st) => ({
              value: st.stage,
              label: `Stage ${st.stage}: ${st.theme}`,
            }))}
          />
        </Card>
      </div>

      {/* Matched Element & Core Delusion */}
      {matchedElement ? (
        <Card className="border-primary-500/30 bg-surface-card shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border-subtle">
            <div>
              <div className="flex items-center space-x-2">
                <Tag color="gold" className="text-xs font-bold uppercase">
                  Element Compound Match
                </Tag>
                <Tag color="cyan" className="font-mono text-xs">
                  Symbol: {matchedElement.elementSymbol} (Z={matchedElement.atomicNumber})
                </Tag>
              </div>

              <h3 className="text-2xl font-bold text-text-primary tracking-tight mt-1 flex items-center gap-2">
                {matchedElement.homeopathicRemedyName}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {matchedElement.seriesName} • Stage {matchedElement.stage} ({matchedElement.stageTheme})
              </p>
            </div>

            <Button
              type="primary"
              size="small"
              icon={<BookOpen className="w-3.5 h-3.5 mr-1" />}
              onClick={() => navigate(ROUTES.MATERIA_MEDICA)}
            >
              Explore in Materia Medica
            </Button>
          </div>

          <div className="py-4 space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Core Sensation & Delusion:
              </span>
              <p className="text-sm text-text-primary leading-relaxed bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
                &quot;{matchedElement.coreDelusion}&quot;
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Axis Coordinate Synthesis:
              </span>
              <p className="text-xs text-text-secondary leading-relaxed">
                {axisDescription.clinicalSynthesis}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-border-subtle text-center py-6">
          <p className="text-xs text-text-muted">
            No specific mineral monograph mapped at Series {selectedSeries}, Stage {selectedStage}.
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {axisDescription.clinicalSynthesis}
          </p>
        </Card>
      )}

      {/* Series Trajectory Strip */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary-500" />
            <span className="font-semibold text-xs text-text-primary">
              All Mapped Elements along Series {selectedSeries} ({seriesElements.length} elements)
            </span>
          </div>
        }
        className="border-border-subtle shadow-xs"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {seriesElements.map((el) => {
            const isSelected = el.stage === selectedStage;
            return (
              <div
                key={el.id}
                onClick={() =>
                  dispatch(
                    setScholtenCoordinates({
                      series: el.series,
                      stage: el.stage,
                    })
                  )
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10 shadow-xs'
                    : 'border-border-subtle bg-surface-subtle hover:border-primary-500/40'
                }`}
              >
                <span className="font-mono font-bold text-lg text-primary-600 block">
                  {el.elementSymbol}
                </span>
                <span className="text-xs font-semibold text-text-primary block truncate">
                  {el.elementName}
                </span>
                <span className="text-[10px] text-text-muted font-mono block">
                  Stage {el.stage}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
