import React from 'react';
import { Button } from 'antd';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Clinical Records Found',
  description = 'No matching data found for current filters or query criteria.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-subtle flex items-center justify-center text-text-muted mb-4 border border-border-subtle">
        {icon || <FolderSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
