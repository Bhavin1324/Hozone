import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useRouteError, isRouteErrorResponse } from 'react-router';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Hozone Clinical Error Boundary]:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-surface-bg">
          <Result
            status="error"
            title="Clinical Workspace Interruption"
            subTitle={
              this.state.error?.message ||
              'An unexpected runtime error occurred. Clinical data in active consultations is safeguarded.'
            }
            extra={[
              <Button
                key="reload"
                type="primary"
                icon={<RotateCcw className="w-4 h-4 inline-block mr-1.5" />}
                onClick={this.handleReset}
              >
                Reload Workspace
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Route-level error boundary for React Router 7 Data Mode
 */
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let title = 'Clinical View Unavailable';
  let message = 'An unexpected error occurred while loading this route.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} - ${error.statusText}`;
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="p-8 max-w-xl mx-auto my-12 bg-surface-card border border-border-default rounded-2xl shadow-sm text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-status-error-bg flex items-center justify-center text-status-error">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary text-sm mb-6">{message}</p>
      <Button
        type="primary"
        icon={<RotateCcw className="w-4 h-4 inline-block mr-1.5" />}
        onClick={() => window.history.back()}
      >
        Return to Previous View
      </Button>
    </div>
  );
};
