import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Utensils,
  Search,
  CheckCircle2,
  XCircle,
  Activity,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setNutritionSearchQuery,
  setNutritionCategoryFilter,
  setNutritionSelectedConditionId,
} from '@/app/store/slices/clinicalGuidanceSlice';
import { setSearchTerm, setViewMode } from '@/app/store/slices/materiaMedicaSlice';
import { getLocalDiseaseNutrition } from '@/core/storage/indexedDbClinicalGuidance';
import { ROUTES } from '@/core/config/constants';
import type { DiseaseNutritionGuidance, NutritionCategory } from '../types';

const CATEGORIES: NutritionCategory[] = [
  'All',
  'Metabolic',
  'Cardiovascular',
  'Renal',
  'Gastrointestinal',
  'Respiratory',
];

export const DiseaseNutritionView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = useAppSelector((state) => state.clinicalGuidance.nutritionSearchQuery);
  const categoryFilter = useAppSelector((state) => state.clinicalGuidance.nutritionCategoryFilter);
  const selectedConditionId = useAppSelector(
    (state) => state.clinicalGuidance.nutritionSelectedConditionId
  );

  const [conditions, setConditions] = useState<DiseaseNutritionGuidance[]>([]);

  useEffect(() => {
    let mounted = true;
    getLocalDiseaseNutrition({
      searchQuery,
      category: categoryFilter,
    }).then((data) => {
      if (mounted) {
        setConditions(data);
        if (data.length > 0 && !selectedConditionId) {
          dispatch(setNutritionSelectedConditionId(data[0].id));
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [searchQuery, categoryFilter, selectedConditionId, dispatch]);

  const activeCondition =
    conditions.find((c) => c.id === selectedConditionId) || conditions[0] || null;

  const handleInspectRemedy = (remedyName: string) => {
    dispatch(setSearchTerm(remedyName));
    dispatch(setViewMode('monograph'));
    navigate(ROUTES.MATERIA_MEDICA);
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search dietary regimens by condition or food item..."
            value={searchQuery}
            onChange={(e) => dispatch(setNutritionSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-card border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {CATEGORIES.map((cat) => {
            const isSelected = (!categoryFilter && cat === 'All') || categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() =>
                  dispatch(setNutritionCategoryFilter(cat === 'All' ? null : cat))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-surface-card text-text-secondary border border-border-subtle hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {conditions.length === 0 ? (
        <div className="p-12 text-center bg-surface-card border border-border-subtle rounded-2xl">
          <Utensils className="w-10 h-10 mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-text-primary">No Nutrition Protocols Found</h3>
          <p className="text-sm text-text-secondary mt-1">
            Try searching for another clinical pathology or resetting the category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Condition Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 px-1">
              Clinical Pathologies ({conditions.length})
            </h3>
            <div className="space-y-1.5">
              {conditions.map((item) => {
                const isSelected = activeCondition?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch(setNutritionSelectedConditionId(item.id))}
                    className={`w-full text-left p-3.5 rounded-xl text-sm transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-primary-500 text-white shadow-xs font-semibold'
                        : 'bg-surface-card text-text-secondary border border-border-subtle hover:bg-surface-subtle hover:text-text-primary'
                    }`}
                  >
                    <div>
                      <span className="block">{item.conditionName}</span>
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'text-white/80' : 'text-text-muted'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Nutrition Details */}
          {activeCondition && (
            <div className="lg:col-span-8 space-y-5">
              {/* Condition Title Banner */}
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-primary-500/10 text-primary-500 border border-primary-500/20">
                    {activeCondition.category} Protocol
                  </span>
                  <span className="text-xs text-text-muted">Evidence-Based Clinical Guidance</span>
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {activeCondition.conditionName}
                </h2>
              </div>

              {/* 3-Column Nutrition Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommended Foods */}
                <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-status-success font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Recommended Foods to Favor</span>
                  </div>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    {activeCondition.recommendedFoods.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-status-success font-bold mt-0.5">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Restricted Foods */}
                <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-status-error font-semibold text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>Forbidden / Foods to Strictly Avoid</span>
                  </div>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    {activeCondition.restrictedFoods.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-status-error font-bold mt-0.5">•</span>
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lifestyle Guidelines */}
              <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
                  <Activity className="w-4 h-4 text-primary-500" />
                  <span>Lifestyle & Regimen Directives</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
                  {activeCondition.lifestyleGuidelines.map((guide, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle"
                    >
                      {guide}
                    </div>
                  ))}
                </div>
              </div>

              {/* Homeopathic Antidote & Dietary Restrictions Warning Banner */}
              <div className="p-4 rounded-2xl bg-status-warning/10 border border-status-warning/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-status-warning uppercase tracking-wider">
                    Homeopathic Antidote & Dietary Caution
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {activeCondition.homeopathicDietaryCautions}
                  </p>
                </div>
              </div>

              {/* Associated Classical Remedies Chips */}
              <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                  Frequently Indicated Classical Remedies
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCondition.associatedRemedies.map((remedy) => (
                    <button
                      key={remedy}
                      onClick={() => handleInspectRemedy(remedy)}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-surface-subtle text-text-primary border border-border-subtle hover:bg-primary-500/10 hover:text-primary-500 hover:border-primary-500/20 transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{remedy}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
