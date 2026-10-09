import React, { useState, useMemo } from 'react';
import { Card, Tag, Tabs, Empty, Button, Select } from 'antd';
import {
  BookOpen,
  Brain,
  Activity,
  Flame,
  Layers,
  Sparkles,
  ArrowRightLeft,
  CheckCircle,
} from 'lucide-react';
import type { Remedy } from '@/features/repertory/types';
import type {
  MateriaMedicaBook,
  RemedyMonograph,
  RemedyRelationship,
} from '../types';
import { RelationshipBadges } from './RelationshipBadges';
import { getQuickReferenceBooks, getBookPillLabel } from '../utils';

interface MonographViewProps {
  remedy: Remedy | null;
  monograph?: RemedyMonograph;
  relationships: RemedyRelationship[];
  availableBooks?: MateriaMedicaBook[];
  selectedBookId?: string | null;
  onSelectBook?: (bookId: string) => void;
  onSelectRemedy?: (remedyId: string) => void;
  onAddToCompare?: (remedyId: string) => void;
  isComparing?: boolean;
}

export const MonographView: React.FC<MonographViewProps> = ({
  remedy,
  monograph,
  relationships,
  availableBooks = [],
  selectedBookId,
  onSelectBook,
  onSelectRemedy,
  onAddToCompare,
  isComparing = false,
}) => {
  const [activeTab, setActiveTab] = useState('keynotes');

  const bookSelectOptions = useMemo(() => {
    const categories = Array.from(
      new Set(availableBooks.map((b) => b.category || 'General Reference'))
    );
    return categories.map((cat) => ({
      label: cat,
      options: availableBooks
        .filter((b) => (b.category || 'General Reference') === cat)
        .map((b) => ({
          label: `${b.title} (${b.author})`,
          value: b.id,
        })),
    }));
  }, [availableBooks]);

  const quickBooks = useMemo(() => {
    return getQuickReferenceBooks(availableBooks);
  }, [availableBooks]);

  if (!remedy) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-surface-card">
        <Empty description="Select a remedy from the catalog to review its Materia Medica monograph" />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'keynotes',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" /> Keynotes
        </span>
      ),
      children: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle leading-relaxed text-sm text-text-primary">
            {monograph?.keynotes || remedy.shortKeynotes}
          </div>
        </div>
      ),
    },
    {
      key: 'mind',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" /> Mind
        </span>
      ),
      children: (
        <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle leading-relaxed text-sm text-text-primary">
          {monograph?.mind || 'No mental symptoms recorded for this monograph.'}
        </div>
      ),
    },
    {
      key: 'physicals',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" /> Physical Generals
        </span>
      ),
      children: (
        <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle leading-relaxed text-sm text-text-primary">
          {monograph?.physicalGenerals || 'No physical generalities recorded.'}
        </div>
      ),
    },
    {
      key: 'modalities',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5" /> Modalities (&lt; / &gt;)
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
              &lt; Aggravation (Worse from)
            </span>
            <ul className="space-y-1.5 text-xs text-text-primary">
              {(monograph?.modalitiesAgg || []).length > 0 ? (
                (monograph?.modalitiesAgg || []).map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-text-muted">No specific aggravations recorded.</li>
              )}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              &gt; Amelioration (Better from)
            </span>
            <ul className="space-y-1.5 text-xs text-text-primary">
              {(monograph?.modalitiesAmel || []).length > 0 ? (
                (monograph?.modalitiesAmel || []).map((m, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-text-muted">No specific ameliorations recorded.</li>
              )}
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: 'affinities',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> Organ Affinities
        </span>
      ),
      children: (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-surface-subtle border border-border-subtle">
          {(monograph?.organAffinities || []).length > 0 ? (
            (monograph?.organAffinities || []).map((aff, idx) => (
              <Tag key={idx} color="cyan" className="text-xs py-1 px-2.5 rounded-lg font-medium">
                {aff}
              </Tag>
            ))
          ) : (
            <span className="text-xs text-text-muted">No specific organ affinities recorded.</span>
          )}
        </div>
      ),
    },
    ...(monograph?.comparisons
      ? [
          {
            key: 'comparisons',
            label: (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Comparisons (Allen)
              </span>
            ),
            children: (
              <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 leading-relaxed text-sm text-text-primary space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                  Allen's Keynotes &amp; Characteristics Comparison Notes:
                </span>
                <p>{monograph.comparisons}</p>
              </div>
            ),
          },
        ]
      : []),
    ...(monograph?.clinicalIndications && monograph.clinicalIndications.length > 0
      ? [
          {
            key: 'indications',
            label: (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-blue-500" /> Clinical Indications (Clarke)
              </span>
            ),
            children: (
              <div className="space-y-3 p-4 rounded-xl bg-surface-subtle border border-border-subtle">
                <p className="text-xs text-text-secondary">
                  Clarke's Dictionary of Practical Materia Medica Clinical Rubrics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {monograph.clinicalIndications.map((ind, idx) => (
                    <Tag key={idx} color="geekblue" className="text-xs py-1 px-2.5 rounded-lg font-medium">
                      {ind}
                    </Tag>
                  ))}
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      key: 'relationships',
      label: (
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Remedy Relationships
        </span>
      ),
      children: (
        <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-3">
          <p className="text-xs text-text-secondary">
            Verified antidotes, complementary follow-ups, and inimical incompatibilities:
          </p>
          <RelationshipBadges relationships={relationships} onSelectRemedy={onSelectRemedy} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-card overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Remedy Header Profile */}
      <Card className="border-border-subtle shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">
                {remedy.fullName}
              </h2>
              <Tag color="geekblue" className="font-mono font-bold text-xs m-0">
                {remedy.abbreviation}
              </Tag>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-text-muted">
                Common Origin: {remedy.commonName} • Source: {monograph?.bookTitle || 'Boericke Materia Medica'}
              </p>
              {monograph && (
                <Tag
                  color={monograph.id.startsWith('synth-') ? 'cyan' : 'green'}
                  className="text-[10px] m-0 font-medium"
                >
                  {monograph.id.startsWith('synth-')
                    ? 'Clinical Compendium Profile'
                    : 'Original Author Edition'}
                </Tag>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag color="blue">{remedy.kingdom}</Tag>
              <Tag color={remedy.thermal === 'Hot' ? 'orange' : 'cyan'}>{remedy.thermal}</Tag>
              <Tag color="purple">{remedy.miasm}</Tag>
              {remedy.isPolychrest && <Tag color="gold">Polychrest</Tag>}
            </div>

            {onAddToCompare && (
              <Button
                size="small"
                type={isComparing ? 'default' : 'primary'}
                icon={isComparing ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowRightLeft className="w-3.5 h-3.5" />}
                onClick={() => onAddToCompare(remedy.id)}
                className="text-xs"
              >
                {isComparing ? 'In Compare' : 'Add to Compare'}
              </Button>
            )}
          </div>
        </div>

        {/* Multi-Book Reference Text Selector */}
        {availableBooks.length > 0 && onSelectBook && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-subtle mt-4">
            <span className="text-xs font-semibold text-text-secondary flex items-center gap-1 mr-1">
              <BookOpen className="w-3.5 h-3.5 text-primary-500" /> Reference Author:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {quickBooks.map((b) => {
                const isSelected =
                  selectedBookId === b.id || (!selectedBookId && b.id === 'book-boericke');
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBook(b.id)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white border-primary-600 shadow-xs'
                        : 'bg-surface-subtle text-text-primary border-border-subtle hover:border-primary-400'
                    }`}
                  >
                    {getBookPillLabel(b)}
                  </button>
                );
              })}

              {selectedBookId && !quickBooks.some((qb) => qb.id === selectedBookId) && (() => {
                const activeBook = availableBooks.find((x) => x.id === selectedBookId);
                if (!activeBook) return null;
                return (
                  <button
                    key={activeBook.id}
                    type="button"
                    onClick={() => onSelectBook(activeBook.id)}
                    className="px-2.5 py-1 rounded-lg border text-xs font-semibold bg-primary-500 text-white border-primary-600 shadow-xs"
                  >
                    {getBookPillLabel(activeBook)}
                  </button>
                );
              })()}
            </div>

            {availableBooks.length > 6 && (
              <div className="w-56 min-w-[200px]">
                <Select
                  size="small"
                  showSearch
                  placeholder="Browse 130+ Library..."
                  value={selectedBookId || 'book-boericke'}
                  onChange={onSelectBook}
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
          </div>
        )}
      </Card>

      {/* Clinical Section Tabs */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 shadow-xs">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </div>
    </div>
  );
};
