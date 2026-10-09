import React from 'react';
import { Input, Tag, Tooltip } from 'antd';
import { Search, Plus, Check } from 'lucide-react';
import type { Remedy } from '@/features/repertory/types';

interface MateriaMedicaBrowserProps {
  remedies: Remedy[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeRemedyId: string | null;
  onSelectRemedy: (id: string) => void;
  selectedComparisonIds: string[];
  onToggleCompare: (id: string) => void;
}

export const MateriaMedicaBrowser: React.FC<MateriaMedicaBrowserProps> = ({
  remedies,
  searchTerm,
  onSearchChange,
  activeRemedyId,
  onSelectRemedy,
  selectedComparisonIds,
  onToggleCompare,
}) => {
  const filteredRemedies = React.useMemo(() => {
    if (!searchTerm.trim()) return remedies;
    const term = searchTerm.toLowerCase().trim();
    return remedies.filter(
      (r) =>
        r.abbreviation.toLowerCase().includes(term) ||
        r.fullName.toLowerCase().includes(term) ||
        r.commonName.toLowerCase().includes(term) ||
        r.kingdom.toLowerCase().includes(term)
    );
  }, [remedies, searchTerm]);

  const displayedRemedies = React.useMemo(() => {
    return filteredRemedies.slice(0, 100);
  }, [filteredRemedies]);

  return (
    <div className="w-80 shrink-0 border-r border-border-subtle bg-surface-card flex flex-col h-full select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-border-subtle bg-surface-card space-y-2">
        <Input
          prefix={<Search className="w-4 h-4 text-text-muted mr-1.5" />}
          placeholder="Filter remedies or text..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="rounded-lg text-sm"
        />
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <span>
            {searchTerm.trim()
              ? `${filteredRemedies.length} matching`
              : `${remedies.length} remedies`}
          </span>
          <span className="font-mono text-[11px]">Compare ({selectedComparisonIds.length}/4)</span>
        </div>
      </div>

      {/* Remedy List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredRemedies.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted">
            No remedies matching &quot;{searchTerm}&quot;
          </div>
        ) : (
          displayedRemedies.map((rem) => {
            const isComparing = selectedComparisonIds.includes(rem.id);
            const isActive = activeRemedyId === rem.id;

            return (
              <div
                key={rem.id}
                onClick={() => onSelectRemedy(rem.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-border-subtle hover:border-border-default bg-surface-card'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-text-primary truncate">
                        {rem.abbreviation}
                      </span>
                      <span className="text-[11px] text-text-muted truncate">
                        {rem.fullName}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      <Tag className="text-[10px] m-0 bg-surface-subtle text-text-secondary border-border-subtle">
                        {rem.kingdom}
                      </Tag>
                      <Tag className="text-[10px] m-0 bg-surface-subtle text-text-secondary border-border-subtle">
                        {rem.thermal}
                      </Tag>
                      <Tag className="text-[10px] m-0 bg-surface-subtle text-text-secondary border-border-subtle">
                        {rem.miasm}
                      </Tag>
                    </div>
                  </div>

                  <Tooltip
                    title={
                      isComparing
                        ? 'Remove from comparison'
                        : selectedComparisonIds.length >= 4
                        ? 'Max 4 comparison slots full'
                        : 'Add to side-by-side comparison'
                    }
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(rem.id);
                      }}
                      disabled={!isComparing && selectedComparisonIds.length >= 4}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                        isComparing
                          ? 'bg-primary-500 text-white border-primary-500'
                          : selectedComparisonIds.length >= 4
                          ? 'opacity-40 cursor-not-allowed border-border-subtle bg-surface-subtle'
                          : 'border-border-default hover:border-primary-500 text-text-muted hover:text-primary-500 bg-surface-subtle'
                      }`}
                    >
                      {isComparing ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })
        )}
        {filteredRemedies.length > 100 && (
          <div className="py-2 text-center text-[11px] text-text-muted border-t border-border-subtle bg-surface-subtle/50 rounded-lg">
            Showing top 100 of {filteredRemedies.length} {searchTerm.trim() ? 'matches' : 'remedies'}
          </div>
        )}
      </div>
    </div>
  );
};
