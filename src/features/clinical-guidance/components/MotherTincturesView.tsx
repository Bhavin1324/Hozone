import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FlaskRound as Flask,
  Search,
  BookOpen,
  Droplets,
  Bandage,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setTincturesSearchQuery,
  setTincturesAffinityFilter,
} from '@/app/store/slices/clinicalGuidanceSlice';
import { setSearchTerm, setViewMode } from '@/app/store/slices/materiaMedicaSlice';
import { getLocalMotherTinctures } from '@/core/storage/indexedDbClinicalGuidance';
import { ROUTES } from '@/core/config/constants';
import type { MotherTincture } from '../types';

const AFFINITY_FILTERS = [
  'All',
  'Skin',
  'Blood & Immune System',
  'Capillary Blood Vessels',
  'Peripheral Nerves',
  'Renal Pelvis',
  'Myocardium',
  'Venous Wall',
];

export const MotherTincturesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = useAppSelector((state) => state.clinicalGuidance.tincturesSearchQuery);
  const affinityFilter = useAppSelector((state) => state.clinicalGuidance.tincturesAffinityFilter);

  const [tinctures, setTinctures] = useState<MotherTincture[]>([]);

  useEffect(() => {
    let mounted = true;
    getLocalMotherTinctures({
      searchQuery,
      organAffinity: affinityFilter,
    }).then((data) => {
      if (mounted) setTinctures(data);
    });
    return () => {
      mounted = false;
    };
  }, [searchQuery, affinityFilter]);

  const handleInspectRemedy = (remedyName: string) => {
    // Strip Q from name (e.g., "Arnica Montana Q" -> "Arnica Montana")
    const cleanName = remedyName.replace(/\s*Q$/, '').trim();
    dispatch(setSearchTerm(cleanName));
    dispatch(setViewMode('monograph'));
    navigate(ROUTES.MATERIA_MEDICA);
  };

  return (
    <div className="space-y-6">
      {/* Search and Affinity Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search mother tinctures by name, organ, or condition..."
            value={searchQuery}
            onChange={(e) => dispatch(setTincturesSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-card border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {AFFINITY_FILTERS.map((aff) => {
            const isSelected = (!affinityFilter && aff === 'All') || affinityFilter === aff;
            return (
              <button
                key={aff}
                onClick={() =>
                  dispatch(setTincturesAffinityFilter(aff === 'All' ? null : aff))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-surface-card text-text-secondary border border-border-subtle hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                {aff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mother Tinctures Grid */}
      {tinctures.length === 0 ? (
        <div className="p-12 text-center bg-surface-card border border-border-subtle rounded-2xl">
          <Flask className="w-10 h-10 mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-text-primary">No Mother Tinctures Found</h3>
          <p className="text-sm text-text-secondary mt-1">
            Try adjusting your search query or selecting a different affinity filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tinctures.map((t) => (
            <div
              key={t.id}
              className="bg-surface-card border border-border-subtle hover:border-primary-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md group"
            >
              <div className="space-y-4">
                {/* Header: Remedy Name, Common Name */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-text-primary group-hover:text-primary-500 transition-colors">
                        {t.remedyName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-500/10 text-primary-500 border border-primary-500/20">
                        Mother Tincture
                      </span>
                    </div>
                    <span className="text-xs text-text-muted font-medium italic block mt-0.5">
                      Common: {t.commonName}
                    </span>
                  </div>

                  <button
                    onClick={() => handleInspectRemedy(t.remedyName)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-surface-subtle text-text-primary border border-border-subtle hover:bg-primary-500/10 hover:text-primary-500 hover:border-primary-500/20 transition-colors flex items-center gap-1.5 shrink-0"
                    title="Open Materia Medica"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Materia Medica</span>
                  </button>
                </div>

                {/* Organ Affinities */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                    Organ & Tissue Affinities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.organAffinities.map((aff) => (
                      <span
                        key={aff}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle text-text-secondary border border-border-subtle"
                      >
                        {aff}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clinical Indications */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary-500" />
                    Clinical Indications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-text-secondary">
                    {t.clinicalIndications.map((ind, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg bg-surface-subtle border border-border-subtle flex items-start gap-1.5"
                      >
                        <span className="text-primary-500 font-bold">•</span>
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Posology & Dosage Box */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <Droplets className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-text-primary block">
                        Internal Posology & Drop Dosage
                      </span>
                      <span className="text-text-secondary leading-relaxed">
                        {t.internalDosage}
                      </span>
                    </div>
                  </div>

                  {t.externalApplication && (
                    <div className="flex items-start gap-2 text-xs pt-2 border-t border-border-subtle">
                      <Bandage className="w-4 h-4 text-status-info shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-text-primary block">
                          External Application & Compress Ratio
                        </span>
                        <span className="text-text-secondary leading-relaxed">
                          {t.externalApplication}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Caution Warning */}
                {t.cautionsAndContraindications && (
                  <div className="p-2.5 rounded-xl bg-status-warning/10 border border-status-warning/20 flex items-start gap-2 text-xs">
                    <AlertOctagon className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
                    <span className="text-text-secondary leading-relaxed">
                      {t.cautionsAndContraindications}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
