/**
 * Strongly typed Query Key Factories for TanStack Query v5.
 * Prevents magic strings and ensures deterministic cache invalidations across features.
 */

export const queryKeys = {
  system: {
    all: ['system'] as const,
    status: () => [...queryKeys.system.all, 'status'] as const,
    connection: () => [...queryKeys.system.all, 'connection'] as const,
  },
  profile: {
    all: ['profile'] as const,
    current: () => [...queryKeys.profile.all, 'current'] as const,
    byId: (id: string) => [...queryKeys.profile.all, id] as const,
  },
  settings: {
    all: ['settings'] as const,
    list: () => [...queryKeys.settings.all, 'list'] as const,
    byKey: (key: string) => [...queryKeys.settings.all, key] as const,
  },
  repertory: {
    all: ['repertory'] as const,
    chapters: () => [...queryKeys.repertory.all, 'chapters'] as const,
    rubrics: (filter?: { chapterId?: string; search?: string }) =>
      [...queryKeys.repertory.all, 'rubrics', filter] as const,
    rubricDetail: (id: string) => [...queryKeys.repertory.all, 'rubric', id] as const,
  },
  materiaMedica: {
    all: ['materiaMedica'] as const,
    remedies: (filter?: { search?: string }) =>
      [...queryKeys.materiaMedica.all, 'remedies', filter] as const,
    remedyDetail: (id: string) => [...queryKeys.materiaMedica.all, 'remedy', id] as const,
  },
  patients: {
    all: ['patients'] as const,
    list: (filter?: { query?: string; page?: number }) =>
      [...queryKeys.patients.all, 'list', filter] as const,
    detail: (id: string) => [...queryKeys.patients.all, 'detail', id] as const,
  },
} as const;
