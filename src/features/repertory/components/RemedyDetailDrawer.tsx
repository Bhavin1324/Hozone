import React from 'react';
import { Drawer, Tag, Button } from 'antd';
import { FlaskConical, BookOpen, Thermometer, Shield } from 'lucide-react';
import type { Remedy } from '../types';

interface RemedyDetailDrawerProps {
  remedy: Remedy | null;
  onClose: () => void;
}

export const RemedyDetailDrawer: React.FC<RemedyDetailDrawerProps> = ({
  remedy,
  onClose,
}) => {
  if (!remedy) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center space-x-2">
          <FlaskConical className="w-5 h-5 text-primary-500" />
          <span className="font-bold text-base text-text-primary">
            {remedy.fullName} ({remedy.abbreviation})
          </span>
        </div>
      }
      placement="right"
      width={460}
      open={Boolean(remedy)}
      onClose={onClose}
      className="[&_.ant-drawer-body]:p-5"
    >
      <div className="space-y-5">
        {/* Classification Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
              Kingdom
            </span>
            <span className="text-sm font-semibold text-text-primary">{remedy.kingdom}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
              Common Origin
            </span>
            <span className="text-sm font-semibold text-text-primary truncate block">
              {remedy.commonName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-primary-500" /> Thermal State
            </span>
            <span className="text-sm font-semibold text-text-primary">{remedy.thermal}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary-500" /> Miasmatic Core
            </span>
            <span className="text-sm font-semibold text-text-primary">{remedy.miasm}</span>
          </div>
        </div>

        {/* Polychrest Badge */}
        {remedy.isPolychrest && (
          <div className="flex items-center space-x-2">
            <Tag color="purple" className="text-xs font-semibold px-2 py-0.5">
              Major Classical Polychrest
            </Tag>
            <span className="text-xs text-text-muted">High deep-acting constitutional breadth</span>
          </div>
        )}

        {/* Keynotes Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary-500" />
            Verified Clinical Keynotes
          </h4>
          <div className="p-4 rounded-xl border border-border-subtle bg-surface-subtle text-sm text-text-primary leading-relaxed">
            {remedy.shortKeynotes}
          </div>
        </div>

        {/* Quick Action */}
        <div className="pt-4 border-t border-border-subtle">
          <Button type="primary" block onClick={onClose}>
            Back to Repertorization Matrix
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
