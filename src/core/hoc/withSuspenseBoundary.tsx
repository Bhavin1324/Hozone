import React, { Suspense, type ComponentType } from 'react';
import { RouteSkeleton } from '@/components/feedback/RouteSkeleton';

/**
 * Higher-Order Component wrapping lazy views in an accessible Suspense boundary with a RouteSkeleton fallback.
 */
export function withSuspenseBoundary<P extends object>(
  Component: ComponentType<P>,
  Fallback: ComponentType = RouteSkeleton
): React.FC<P> {
  const WrappedWithSuspense: React.FC<P> = (props) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );

  WrappedWithSuspense.displayName = `withSuspenseBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedWithSuspense;
}
