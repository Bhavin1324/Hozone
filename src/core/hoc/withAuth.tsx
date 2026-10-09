import React, { type ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppSelector } from '@/app/store';
import { ROUTES } from '@/core/config/constants';

/**
 * Higher-Order Component enforcing practitioner authentication for protected routes.
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>
): React.FC<P> {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const isAuthenticated = useAppSelector((state) => state.session.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || 'Component'
  })`;

  return AuthenticatedComponent;
}
