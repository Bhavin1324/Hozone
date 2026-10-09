# State Management Architecture: Query vs. Redux vs. Context

Hozone enforces a strict separation of concerns for application state across three specialized tiers:

---

## 1. Asynchronous Server State: TanStack React Query v5

**Use TanStack Query for any data originating from or persisting to Supabase/REST endpoints.**

### Rules:
1. **Never copy server data into Redux store.** Use TanStack Query's cache directly via custom hooks (`usePatient(id)`, `useRubrics(filter)`).
2. **Query Key Factories**: Always define query keys in `src/core/query/queryKeys.ts` using hierarchical tuples:
   ```ts
   queryKeys.patients.list({ search }) // -> ['patients', 'list', { search }]
   ```
3. **Cache Policy**:
   - Dynamic clinical records: `staleTime: 5 * 60 * 1000` (5 minutes).
   - Static taxonomy (repertory rubrics, remedies, kingdom classifications): `staleTime: 30 * 60 * 1000` (30 minutes).
   - Clinical note taking: `refetchOnWindowFocus: false` to safeguard uncommitted practitioner input.
4. **Mutations & Invalidation**:
   - Always invalidate affected query keys on successful mutations using `queryClient.invalidateQueries({ queryKey: ... })`.
   - Use optimistic updates for high-frequency actions like rubric weight adjustments.

---

## 2. Global Client State: Redux Toolkit (RTK)

**Use Redux Toolkit strictly for complex, multi-step, client-side workflows and persistent session state.**

### Scope:
- Active consultation working set (selected rubrics, temporary symptom weightings before saving).
- Practitioner session metadata (`sessionSlice`).
- User persistent preferences (`preferencesSlice`: collapsed rail, compact view).

### Rules:
- Keep slices granular under `src/app/store/slices/`.
- Use typed hooks: `useAppDispatch` and `useAppSelector`.
- Do not store ephemeral form values in Redux; use React Hook Form or local state.

---

## 3. Localized UI State: React Context & Local State

**Use React Context for low-frequency presentation state that spans multiple component boundaries.**

### Scope:
- `ThemeContext`: Active theme mode (`light`, `dark`, `high-contrast`, `system`) and active seed color (`#0F766E`).
- Local `useState`: Modal open/closed toggles, hover states, accordion expansions.
