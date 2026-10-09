# Code Standards & React 19 Guidelines

## 1. File Structure & Boundaries
- **500-Line Limit**: Every file must stay under 500 lines. Monolithic components must be refactored into atomic parts.
- **Directory Placement**:
  - `src/features/<feature>/`: Feature-specific views, components, and local hooks.
  - `src/components/ui/`: Reusable dumb presentation primitives.
  - `src/components/layout/`: App shell, navigation rails, headers.
  - `src/components/feedback/`: Skeletons, error boundaries, empty states.
  - `src/core/`: Application-wide singletons, config, global hooks, HOCs.

## 2. React 19 Hook Hygiene
- **No Synchronous SetState in Effects**:
  - Do not call `setState` directly inside a `useEffect` execution path to avoid cascading renders.
  - For browser APIs or external subscriptions (e.g., media queries, network status, storage), use `useSyncExternalStore`.
- **Layout Synchronization**:
  - Use `useLayoutEffect` strictly when synchronous DOM measurement is required before paint.
  - Use `useDeferredValue` for high-frequency input to avoid blocking the main thread during heavy list or rubric filtering.

## 3. Component Design & Composition
- **Atomic & Compound Patterns**: For widgets with multiple interchangeable pieces (e.g., `PatientCard`, `RubricSelector`), use compound component exports: `<RubricSelector.Header>`, `<RubricSelector.List>`, `<RubricSelector.Footer>`.
- **HOCs for Cross-Cutting Concerns**:
  - `withAuth`: Protects routes requiring practitioner authentication.
  - `withSuspenseBoundary`: Encapsulates lazy route components with `<RouteSkeleton />`.
  - `withResponsiveLayout`: Injects viewport adaptation properties.

## 4. TypeScript Strictness
- Never use `any`. Use `unknown` and type guards where dynamic schemas are accepted.
- All database entities must mirror their PostgreSQL definitions with strict nullable types.
