import React from 'react';
import { Skeleton } from 'antd';

export const RouteSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 w-full animate-fade-in" role="status" aria-label="Loading clinical view">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="space-y-2">
          <Skeleton.Input active size="large" style={{ width: 280 }} />
          <Skeleton.Input active size="small" style={{ width: 420 }} />
        </div>
        <div className="flex space-x-3">
          <Skeleton.Button active size="default" />
          <Skeleton.Button active size="default" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border-subtle bg-surface-card space-y-3"
          >
            <Skeleton.Input active size="small" style={{ width: 100 }} />
            <Skeleton.Input active size="large" style={{ width: 140 }} />
          </div>
        ))}
      </div>

      {/* Main Content Workspace Skeleton */}
      <div className="p-6 rounded-xl border border-border-subtle bg-surface-card space-y-4">
        <Skeleton.Input active size="default" style={{ width: 200 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    </div>
  );
};
