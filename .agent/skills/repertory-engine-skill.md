# Skill: Repertory Engine Implementation Protocol

This skill guides agents when implementing subsequent repertory and materia medica calculation sprints.

---

## 1. Domain Overview
In clinical homeopathy, a repertory is an indexed cross-reference of symptoms (rubrics) mapped to remedies with grading weights (1 to 4):
- Grade 1: Mentioned in proving.
- Grade 2: Confirmed in multiple provings.
- Grade 3: Cured clinical symptoms.
- Grade 4: Keynote / characteristic symptom verified repeatedly.

---

## 2. Architecture & Data Structures

### Rubric Model:
```ts
export interface Rubric {
  id: string;
  chapterId: string;
  name: string;
  fullPath: string; // e.g. "MIND > ANXIETY > twilight, in"
  remedyCount: number;
}

export interface RubricRemedyGrading {
  rubricId: string;
  remedyAbbr: string;
  grade: 1 | 2 | 3 | 4;
}
```

### Analysis Working Set (Redux Slice):
Store active rubrics in Redux Toolkit state (`repertorySlice`):
```ts
export interface RepertoryAnalysisState {
  activeRubricIds: string[];
  rubricWeights: Record<string, number>; // Practitioner priority multipliers (1 to 5)
  eliminationRemedies: string[];
}
```

---

## 3. Calculation & Performance Optimization
- **Web Worker Offloading**: For analyses with >30 rubrics and >3,000 remedies, offload matrix summation and remedy scoring to a Web Worker (`repertoryCalculator.worker.ts`).
- **TanStack Query Caching**:
  - Rubric indexes are read-heavy and static.
  - Set `staleTime: 1000 * 60 * 60` (1 hour) and cache locally in IndexedDB if offline support is required.
- **Search Performance**:
  - Use `pg_trgm` GIN indexes in Supabase for fuzzy rubric querying (`similarity(name, query) > 0.3`).
