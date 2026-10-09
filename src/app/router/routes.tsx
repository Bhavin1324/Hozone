import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { RouteErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { withSuspenseBoundary } from '@/core/hoc/withSuspenseBoundary';
import { ROUTES } from '@/core/config/constants';

// Lazy-loaded route views
const DashboardView = withSuspenseBoundary(
  lazy(() => import('@/features/dashboard/DashboardView'))
);
const RepertoryContainer = withSuspenseBoundary(
  lazy(() => import('@/features/repertory/RepertoryContainer'))
);
const MateriaMedicaContainer = withSuspenseBoundary(
  lazy(() => import('@/features/materia-medica/MateriaMedicaContainer'))
);
const ExpertSystemsHub = withSuspenseBoundary(
  lazy(() => import('@/features/expert-systems/ExpertSystemsHub'))
);
const ClinicalGuidanceContainer = withSuspenseBoundary(
  lazy(() => import('@/features/clinical-guidance/ClinicalGuidanceContainer'))
);
const PatientsContainer = withSuspenseBoundary(
  lazy(() => import('@/features/patients/PatientsContainer'))
);
const SpecialtyContainer = withSuspenseBoundary(
  lazy(() => import('@/features/specialty/SpecialtyContainer'))
);
const AuthContainer = withSuspenseBoundary(
  lazy(() => import('@/features/auth/AuthContainer'))
);

/**
 * React Router 7 Data Mode route configuration
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD.replace('/', ''),
        element: <DashboardView />,
      },
      {
        path: ROUTES.REPERTORY.replace('/', ''),
        element: <RepertoryContainer />,
      },
      {
        path: ROUTES.MATERIA_MEDICA.replace('/', ''),
        element: <MateriaMedicaContainer />,
      },
      {
        path: ROUTES.EXPERT_SYSTEMS.replace('/', ''),
        element: <ExpertSystemsHub />,
      },
      {
        path: ROUTES.CLINICAL_GUIDANCE.replace('/', ''),
        element: <ClinicalGuidanceContainer />,
      },
      {
        path: ROUTES.PATIENTS.replace('/', ''),
        element: <PatientsContainer />,
      },
      {
        path: ROUTES.SPECIALTY.replace('/', ''),
        element: <SpecialtyContainer />,
      },
      {
        path: ROUTES.SETTINGS.replace('/', ''),
        element: <AuthContainer />,
      },
      {
        path: ROUTES.AUTH.replace('/', ''),
        element: <AuthContainer />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
]);
