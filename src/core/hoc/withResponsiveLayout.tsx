import React, { type ComponentType } from 'react';
import { useIsMobile } from '@/core/hooks/useMediaQuery';

export interface ResponsiveInjectedProps {
  isMobile: boolean;
}

/**
 * Higher-Order Component injecting responsive viewport flags.
 */
export function withResponsiveLayout<P extends ResponsiveInjectedProps>(
  Component: ComponentType<P>
): React.FC<Omit<P, keyof ResponsiveInjectedProps>> {
  const ResponsiveComponent: React.FC<Omit<P, keyof ResponsiveInjectedProps>> = (props) => {
    const isMobile = useIsMobile();
    return <Component {...(props as P)} isMobile={isMobile} />;
  };

  ResponsiveComponent.displayName = `withResponsiveLayout(${
    Component.displayName || Component.name || 'Component'
  })`;

  return ResponsiveComponent;
}
