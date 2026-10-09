# AGENTS.md — Architectural Governance & Coding Guardrails

Welcome to **Hozone Clinical Intelligence**. This document defines the non-negotiable architectural contracts, design tokens, styling engine, state boundaries, and coding standards for all autonomous agents and engineers working in this repository.

---

## 1. THE 500-LINE FILE LIMIT

- **Strict Constraint**: No single file may exceed **500 lines of code**.
- If a file approaches 400 lines, proactively decompose it into:
  - Custom domain hooks (`use<Feature>.ts`)
  - Subcomponents (`<Feature>Header.tsx`, `<Feature>Table.tsx`, `<Feature>Dialog.tsx`)
  - Configuration/type constants (`types.ts`, `constants.ts`).

---

## 2. STATE MANAGEMENT TRIAD

Never mix server state with client state or UI state:

| Layer | Responsibility | Technology | Where to Put It |
| :--- | :--- | :--- | :--- |
| **Server State** | Asynchronous data from Supabase/APIs, caching, deduplication, background refetching, mutations | **TanStack React Query v5** | `src/core/query/hooks/` or `src/features/<feature>/api/` using `queryKeys` |
| **Global Client State** | Cross-feature state, active clinical case workspace, practitioner session, client preferences | **Redux Toolkit (RTK)** | `src/app/store/slices/` |
| **Localized UI State** | Theme toggles, sidebar collapse, active modals/drawers | **React Context / local state** | `src/theme/ThemeContext.tsx`, local `useState` |

---

## 3. ZERO-HARDCODED COLOR SYSTEM & STYLING RULES

- **Never write ad-hoc hex codes** (e.g., `#0F766E`, `#1E293B`, `#FFFFFF`) in CSS or Tailwind utility classes.
- All colors must flow through the dynamic token engine:
  - `src/theme/colorGenerator.ts` derives 10-step tonal ramps (`--color-primary-50` through `--color-primary-950`), surface neutrals (`--color-surface-*`), borders (`--color-border-*`), text (`--color-text-*`), and semantic statuses (`--color-status-*`).
  - Ant Design receives these computed tokens via `<ConfigProvider theme={antdTheme}>`.
  - Tailwind CSS v4 receives these variables via `@theme` in `src/styles/globals.css`.
- Use Tailwind utility classes that reference these tokens:
  - `bg-primary-500`, `text-primary-700`, `bg-surface-card`, `border-border-subtle`, `text-text-primary`.

---

## 4. REACT 19 & COMPONENT ARCHITECTURE

- **Hooks Hygiene**:
  - Never call `setState` synchronously within a `useEffect` body. Use `useSyncExternalStore` for external subscriptions (media queries, browser storage, window events).
  - Use `useDeferredValue` when generating intensive color palettes or filtering large lists.
- **Routing**:
  - Always use React Router 7 in **Data Mode** (`createBrowserRouter`).
  - Lazy load all top-level route views with `React.lazy()` wrapped in `withSuspenseBoundary(lazyView)`.
- **Icons & Animations**:
  - Use `lucide-react` for all system iconography.
  - Use `motion/react` for layout transitions and micro-interactions.

---

## 5. SUPABASE & DATABASE INTEGRITY

- All new tables must:
  - Reside in the `public` schema.
  - Have a `UUID` primary key (`DEFAULT gen_random_uuid()`).
  - Have an `updated_at` column with the `handle_updated_at()` trigger.
  - Enable **Row Level Security (RLS)** immediately upon creation with explicit policies for authenticated users.
  - Write audit trails to `public.audit_logs` for critical case actions.
- Migrations must be named sequentially in `supabase/migrations/` (e.g., `00001_initial_core_schema.sql`).

---

## 6. VERIFICATION GATE

Before declaring any sprint or task complete:
1. `cmd.exe /c npm run build` must compile cleanly without TypeScript errors.
2. `cmd.exe /c npm run lint` must pass with 0 errors and 0 warnings.
