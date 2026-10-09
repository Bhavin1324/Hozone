import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  Search,
  BookOpen,
  Copy,
  Check,
  Stethoscope,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  setSelectedSpecies,
  setSearchQuery,
} from '@/app/store/slices/specialtySlice';
import { getLocalVeterinaryCases } from '@/core/storage/indexedDbSpecialty';
import type { VeterinaryCase, VeterinarySpecies } from '../types';

const SPECIES_TABS: Array<VeterinarySpecies | 'ALL'> = [
  'ALL',
  'Canine',
  'Feline',
  'Equine',
  'Bovine',
  'Avian',
];

export const VeterinaryCasesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedSpecies = useAppSelector((state) => state.specialty.selectedSpecies);
  const searchQuery = useAppSelector((state) => state.specialty.searchQuery);

  const [cases, setCases] = useState<VeterinaryCase[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const sp = selectedSpecies === 'ALL' ? undefined : selectedSpecies;
    getLocalVeterinaryCases(sp, searchQuery).then((data) => {
      if (mounted) setCases(data);
    });
    return () => {
      mounted = false;
    };
  }, [selectedSpecies, searchQuery]);

  const handleCopy = (c: VeterinaryCase) => {
    const text = `[Veterinary Cured Case - ${c.species}] ${c.breedAgeGender}\nComplaint: ${c.chiefComplaint}\nRemedy: ${c.remedyPrescribed} (${c.potency})\nOutcome: ${c.outcomeNotes}\nAuthor: ${c.author}`;
    navigator.clipboard.writeText(text);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-7xl mx-auto">
      {/* Species Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {SPECIES_TABS.map((sp) => {
          const isSelected = selectedSpecies === sp;
          return (
            <button
              key={sp}
              type="button"
              onClick={() => dispatch(setSelectedSpecies(sp))}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-surface-card text-text-secondary border-border-subtle hover:border-primary-300'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>{sp === 'ALL' ? 'All Animal Cases' : `${sp} Cases`}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-surface-card p-3 rounded-xl border border-border-subtle">
        <Search className="w-4 h-4 text-text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search veterinary cured cases by diagnosis, symptom, remedy, or clinician..."
          value={searchQuery}
          aria-label="Search veterinary cured cases"
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* Cases Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>Showing {cases.length} verified clinical cured cases</span>
          <span>Archived from peer-reviewed veterinary literature</span>
        </div>

        {cases.length === 0 ? (
          <div className="p-12 text-center bg-surface-card rounded-xl border border-border-subtle">
            <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-text-secondary">No veterinary cases matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((c) => {
              const isCopied = copiedId === c.id;

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-surface-card border border-border-subtle hover:border-border-default transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                          {c.species}
                        </span>
                        <span className="text-xs font-medium text-text-secondary">
                          {c.breedAgeGender}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(c)}
                        title="Copy case summary"
                        className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-subtle text-text-muted hover:text-text-primary transition-colors"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-status-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                        Chief Complaint & Clinical Presentation
                      </h4>
                      <p className="text-xs text-text-primary leading-relaxed">{c.chiefComplaint}</p>
                    </div>

                    {/* Prescribed Remedy & Potency */}
                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-primary-500" />
                        <div>
                          <span className="text-[11px] text-text-muted block">Prescribed Similimum</span>
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            {c.remedyPrescribed}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                        {c.potency}
                      </span>
                    </div>

                    {/* Rubrics Used */}
                    <div>
                      <span className="text-[11px] text-text-muted block font-medium mb-1">
                        Repertory Rubrics Used:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {c.rubricsUsed.map((rubric) => (
                          <span
                            key={rubric}
                            className="text-[11px] px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle text-text-secondary"
                          >
                            {rubric}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outcome Notes */}
                    <div className="text-xs text-text-secondary bg-status-success/5 p-3 rounded-xl border border-status-success/20">
                      <span className="font-semibold text-status-success block mb-0.5">Clinical Response:</span>
                      <p className="leading-relaxed">{c.outcomeNotes}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                    <span>Clinician:</span>
                    <span className="font-medium text-text-secondary">{c.author}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
