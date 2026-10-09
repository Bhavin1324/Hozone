import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Lightbulb,
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setTipsSearchQuery,
  setTipsOrganFilter,
  toggleBookmarkTip,
} from '@/app/store/slices/clinicalGuidanceSlice';
import { setSearchTerm, setViewMode } from '@/app/store/slices/materiaMedicaSlice';
import { getLocalClinicalTips } from '@/core/storage/indexedDbClinicalGuidance';
import { ROUTES } from '@/core/config/constants';
import type { ClinicalTip, OrganSystem } from '../types';

const ORGAN_SYSTEMS: OrganSystem[] = [
  'All',
  'Respiratory',
  'Cardiovascular',
  'Gastrointestinal',
  'Nervous System',
  'Musculoskeletal',
  'Dermatology',
  'Genitourinary',
];

export const ClinicalTipsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchQuery = useAppSelector((state) => state.clinicalGuidance.tipsSearchQuery);
  const organFilter = useAppSelector((state) => state.clinicalGuidance.tipsOrganFilter);
  const bookmarkedIds = useAppSelector((state) => state.clinicalGuidance.bookmarkedTipIds);

  const [tips, setTips] = useState<ClinicalTip[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getLocalClinicalTips({
      searchQuery,
      organSystem: organFilter,
    }).then((data) => {
      if (mounted) setTips(data);
    });
    return () => {
      mounted = false;
    };
  }, [searchQuery, organFilter]);

  const handleCopy = (tip: ClinicalTip) => {
    const text = `[${tip.remedyName} - ${tip.author}] ${tip.clinicalCondition}: ${tip.tipContent}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(tip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInspectRemedy = (remedyName: string) => {
    dispatch(setSearchTerm(remedyName));
    dispatch(setViewMode('monograph'));
    navigate(ROUTES.MATERIA_MEDICA);
  };

  const verificationBadgeMap: Record<string, { label: string; colorClass: string }> = useMemo(
    () => ({
      keynote_clue: {
        label: 'Keynote Clue',
        colorClass: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
      },
      verified: {
        label: 'Verified',
        colorClass: 'bg-status-success/10 text-status-success border-status-success/20',
      },
      clinical_pearl: {
        label: 'Clinical Pearl',
        colorClass: 'bg-status-info/10 text-status-info border-status-info/20',
      },
      frequent_confirmation: {
        label: 'Frequent Confirmation',
        colorClass: 'bg-status-warning/10 text-status-warning border-status-warning/20',
      },
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Search Bar & Organ System Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search pearls by remedy, condition, or keyword..."
            value={searchQuery}
            onChange={(e) => dispatch(setTipsSearchQuery(e.target.value))}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-card border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Organ Filter Chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {ORGAN_SYSTEMS.map((system) => {
            const isSelected = (!organFilter && system === 'All') || organFilter === system;
            return (
              <button
                key={system}
                onClick={() => dispatch(setTipsOrganFilter(system === 'All' ? null : system))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'bg-surface-card text-text-secondary border border-border-subtle hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                {system}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinical Pearls Grid */}
      {tips.length === 0 ? (
        <div className="p-12 text-center bg-surface-card border border-border-subtle rounded-2xl">
          <Lightbulb className="w-10 h-10 mx-auto text-text-muted mb-3 opacity-40" />
          <h3 className="text-base font-semibold text-text-primary">No Clinical Pearls Found</h3>
          <p className="text-sm text-text-secondary mt-1">
            Try adjusting your search query or selecting a different organ system filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => {
            const isBookmarked = bookmarkedIds.includes(tip.id);
            const badge = verificationBadgeMap[tip.verificationLevel] || {
              label: 'Verified',
              colorClass: 'bg-surface-subtle text-text-secondary border-border-subtle',
            };

            return (
              <div
                key={tip.id}
                className="bg-surface-card border border-border-subtle hover:border-primary-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <div>
                  {/* Top Bar: Remedy, Author, Verification */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-text-primary group-hover:text-primary-500 transition-colors">
                          {tip.remedyName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.colorClass}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary-500" />
                        {tip.author}
                      </span>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => dispatch(toggleBookmarkTip(tip.id))}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Pearl'}
                      className="text-text-muted hover:text-primary-500 p-1 rounded-lg hover:bg-surface-subtle transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-primary-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Clinical Condition Heading */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-subtle text-text-secondary border border-border-subtle inline-block">
                      {tip.clinicalCondition}
                    </span>
                  </div>

                  {/* Pearl Content */}
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {tip.tipContent}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-text-muted bg-surface-subtle px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(tip)}
                      className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-subtle rounded-lg transition-colors flex items-center gap-1"
                      title="Copy Clinical Pearl"
                    >
                      {copiedId === tip.id ? (
                        <Check className="w-3.5 h-3.5 text-status-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleInspectRemedy(tip.remedyName)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 border border-primary-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
