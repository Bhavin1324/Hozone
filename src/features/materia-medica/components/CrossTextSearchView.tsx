import React, { useMemo } from 'react';
import { Input, Tag, Button, Segmented, Empty, Select } from 'antd';
import {
  Search,
  BookOpen,
  Filter,
  ArrowRightLeft,
  Sparkles,
  ExternalLink,
  Layers,
  RotateCcw,
} from 'lucide-react';
import type {
  CrossTextSearchMode,
  CrossTextSearchResult,
  CrossTextSearchSection,
  MateriaMedicaBook,
} from '../types';
import { getQuickReferenceBooks, getBookPillLabel } from '../utils';

interface CrossTextSearchViewProps {
  searchResult: CrossTextSearchResult;
  books: MateriaMedicaBook[];
  query: string;
  onQueryChange: (q: string) => void;
  matchMode: CrossTextSearchMode;
  onMatchModeChange: (mode: CrossTextSearchMode) => void;
  selectedBookFilters: string[];
  onToggleBookFilter: (bookId: string) => void;
  selectedSectionFilters: CrossTextSearchSection[];
  onToggleSectionFilter: (sec: CrossTextSearchSection) => void;
  onResetFilters: () => void;
  selectedRemedyIds: string[];
  onAddToCompare: (remedyId: string) => void;
  onOpenInReader: (remedyId: string, bookId: string) => void;
}

const SECTION_LABELS: Record<CrossTextSearchSection, string> = {
  keynotes: 'Keynotes',
  mind: 'Mind',
  physicals: 'Physicals',
  modalitiesAgg: 'Aggravations (<)',
  modalitiesAmel: 'Ameliorations (>)',
  organAffinities: 'Affinities',
  clinicalIndications: 'Clinical Indications',
  comparisons: 'Allen Comparisons',
};

export const CrossTextSearchView: React.FC<CrossTextSearchViewProps> = ({
  searchResult,
  books,
  query,
  onQueryChange,
  matchMode,
  onMatchModeChange,
  selectedBookFilters,
  onToggleBookFilter,
  selectedSectionFilters,
  onToggleSectionFilter,
  onResetFilters,
  selectedRemedyIds,
  onAddToCompare,
  onOpenInReader,
}) => {
  const hasActiveFilters =
    selectedBookFilters.length > 0 ||
    selectedSectionFilters.length > 0 ||
    matchMode !== 'all';

  const sectionsList: CrossTextSearchSection[] = useMemo(
    () => [
      'keynotes',
      'mind',
      'physicals',
      'modalitiesAgg',
      'modalitiesAmel',
      'organAffinities',
      'clinicalIndications',
      'comparisons',
    ],
    []
  );

  const bookSelectOptions = useMemo(() => {
    const categories = Array.from(
      new Set(books.map((b) => b.category || 'General Reference'))
    );
    return categories.map((cat) => ({
      label: cat,
      options: books
        .filter((b) => (b.category || 'General Reference') === cat)
        .map((b) => ({
          label: `${b.title} (${b.author})`,
          value: b.id,
        })),
    }));
  }, [books]);

  const quickBooks = useMemo(() => {
    return getQuickReferenceBooks(books);
  }, [books]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-subtle">
      {/* Top Search Controls Bar */}
      <div className="p-4 bg-surface-card border-b border-border-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <Input
              size="large"
              prefix={<Search className="w-4 h-4 text-text-secondary mr-2" />}
              placeholder="Search symptom, modality, or keynote across all Materia Medicas (e.g. 'burning relief heat', '11 AM gone')..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              allowClear
              className="rounded-xl border-border-subtle bg-surface-subtle"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-text-secondary font-medium">Match:</span>
            <Segmented
              size="middle"
              value={matchMode}
              onChange={(v) => onMatchModeChange(v as CrossTextSearchMode)}
              options={[
                { value: 'all', label: 'All Words (AND)' },
                { value: 'any', label: 'Any Word (OR)' },
                { value: 'phrase', label: 'Exact Phrase' },
              ]}
            />

            {hasActiveFilters && (
              <Button
                size="middle"
                icon={<RotateCcw className="w-3.5 h-3.5 mr-1" />}
                onClick={onResetFilters}
                className="border-border-subtle text-xs"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Chips: Books & Sections */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-text-secondary font-semibold flex items-center gap-1 mr-1">
            <BookOpen className="w-3.5 h-3.5" /> Books:
          </span>
          {quickBooks.map((b) => {
            const isSelected = selectedBookFilters.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onToggleBookFilter(b.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white border-primary-600 shadow-xs'
                    : 'bg-surface-subtle text-text-primary border-border-subtle hover:border-primary-400'
                }`}
              >
                {getBookPillLabel(b)}
              </button>
            );
          })}

          {selectedBookFilters
            .filter((id) => !quickBooks.some((qb) => qb.id === id))
            .map((id) => {
              const b = books.find((x) => x.id === id);
              if (!b) return null;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onToggleBookFilter(b.id)}
                  className="px-2.5 py-1 rounded-lg border text-xs font-medium bg-primary-500 text-white border-primary-600 shadow-xs"
                >
                  {getBookPillLabel(b)} ✕
                </button>
              );
            })}

          {books.length > 6 && (
            <div className="w-44 min-w-[160px]">
              <Select
                size="small"
                showSearch
                placeholder="+ Add from 130+ Books"
                value={null}
                onChange={(bId) => {
                  if (bId) onToggleBookFilter(bId);
                }}
                options={bookSelectOptions}
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-full text-xs"
              />
            </div>
          )}

          <div className="h-4 w-px bg-border-subtle mx-1 hidden sm:block" />

          <span className="text-text-secondary font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Sections:
          </span>
          {sectionsList.map((sec) => {
            const isSelected = selectedSectionFilters.includes(sec);
            return (
              <button
                key={sec}
                type="button"
                onClick={() => onToggleSectionFilter(sec)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white border-primary-600'
                    : 'bg-surface-subtle text-text-secondary border-border-subtle hover:border-primary-400'
                }`}
              >
                {SECTION_LABELS[sec]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left / Top: Remedy Frequency Density Column */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border-subtle bg-surface-card p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              Remedy Frequency Ranking
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-secondary">
              {searchResult.frequencyRanking.length} remedies
            </span>
          </div>

          {searchResult.frequencyRanking.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-secondary">
              {query ? 'No matching remedies found.' : 'Enter a clinical query to view occurrence rankings.'}
            </div>
          ) : (
            <div className="space-y-2">
              {searchResult.frequencyRanking.map((item, idx) => {
                const isComparing = selectedRemedyIds.includes(item.remedyId);
                return (
                  <div
                    key={item.remedyId}
                    className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle hover:border-primary-400 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text-secondary">#{idx + 1}</span>
                        <span className="font-bold text-sm text-text-primary truncate">
                          {item.remedyAbbr}
                        </span>
                        <Tag color="cyan" className="text-[10px] py-0 px-1.5 m-0 font-semibold">
                          {item.totalHits} hit{item.totalHits > 1 ? 's' : ''}
                        </Tag>
                      </div>
                      <div className="text-[11px] text-text-secondary truncate mt-0.5">
                        {item.remedyFullName} • {item.booksCount} book{item.booksCount > 1 ? 's' : ''}
                      </div>
                    </div>

                    <Button
                      size="small"
                      type={isComparing ? 'default' : 'primary'}
                      icon={<ArrowRightLeft className="w-3 h-3" />}
                      onClick={() => onAddToCompare(item.remedyId)}
                      title={isComparing ? 'Remove from compare' : 'Add to compare'}
                      className="text-xs shrink-0"
                    >
                      {isComparing ? 'Comparing' : 'Compare'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Search Hits Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary-500" />
              Symptom Provings & Matches ({searchResult.totalHits})
            </h3>
            {searchResult.totalHits > 0 && (
              <span className="text-xs text-text-secondary">
                Displaying {searchResult.matches.length} context citations
              </span>
            )}
          </div>

          {searchResult.matches.length === 0 ? (
            <div className="py-20 flex items-center justify-center bg-surface-card rounded-2xl border border-border-subtle">
              <Empty
                description={
                  query
                    ? `No Materia Medica citations found matching "${query}" with current filters.`
                    : 'Search across Boericke, Kent, Allen Keynotes, and Clarke Dictionary.'
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {searchResult.matches.map((match, idx) => {
                const isComparing = selectedRemedyIds.includes(match.remedyId);
                return (
                  <div
                    key={`${match.monographId}-${match.section}-${idx}`}
                    className="p-4 rounded-2xl bg-surface-card border border-border-subtle shadow-xs hover:border-primary-400 transition-all space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Tag color="blue" className="font-bold text-xs py-0.5 px-2 m-0">
                          {match.remedyAbbr}
                        </Tag>
                        <span className="text-xs font-semibold text-text-primary">
                          {match.remedyFullName}
                        </span>
                        <Tag className="text-[10px] m-0 bg-surface-subtle border-border-subtle text-text-secondary">
                          {match.bookTitle}
                        </Tag>
                        <Tag color="purple" className="text-[10px] m-0">
                          {SECTION_LABELS[match.section]}
                        </Tag>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="small"
                          icon={<BookOpen className="w-3 h-3 mr-1" />}
                          onClick={() => onOpenInReader(match.remedyId, match.bookId)}
                          className="text-xs border-border-subtle"
                        >
                          Read Monograph
                        </Button>
                        <Button
                          size="small"
                          type={isComparing ? 'default' : 'primary'}
                          icon={<ExternalLink className="w-3 h-3 mr-1" />}
                          onClick={() => onAddToCompare(match.remedyId)}
                          className="text-xs"
                        >
                          {isComparing ? 'In Compare' : 'Add to Compare'}
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-primary leading-relaxed">
                      <p className="italic">{match.snippet}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
