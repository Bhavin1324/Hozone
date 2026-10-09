import type {
  ActiveCaseRubric,
  Chapter,
  CombinedRubric,
  FilterCriteria,
  RepertorizationComputeOutput,
  Rubric,
  ScoringModel,
} from '@/features/repertory/types';
import type { RemedyMonograph } from '@/features/materia-medica/types';
import type { SqliteWorkerMessage, SqliteWorkerResponse } from './sqliteEngineTypes';

type ProgressListener = (status: 'downloading' | 'decompressing' | 'mounting' | 'ready', percent: number) => void;

export class SqliteDatabaseClient {
  private worker: Worker | null = null;
  private currentRequestId = 0;
  private pendingRequests = new Map<number, { resolve: (data: unknown) => void; reject: (err: unknown) => void }>();
  private progressListeners = new Set<ProgressListener>();
  private ready = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') return;

    try {
      this.worker = new Worker(
        new URL('./sqliteEngineWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<SqliteWorkerResponse>) => {
        const { id, type, status, progressPercent, data, error } = event.data;

        if (type === 'PROGRESS' && status !== undefined && progressPercent !== undefined) {
          if (status === 'ready') this.ready = true;
          for (const listener of this.progressListeners) {
            listener(status, progressPercent);
          }
          return;
        }

        if (id !== undefined && this.pendingRequests.has(id)) {
          const { resolve, reject } = this.pendingRequests.get(id)!;
          this.pendingRequests.delete(id);
          if (error) {
            reject(new Error(error));
          } else {
            resolve(data);
          }
        }
      };

      this.worker.onerror = (e) => {
        console.warn('[SqliteClient] Worker error:', e);
      };
    } catch (err) {
      console.warn('[SqliteClient] Web Worker not supported or failed to create:', err);
      this.worker = null;
    }
  }

  public isReady(): boolean {
    return this.ready;
  }

  public onProgress(listener: ProgressListener): () => void {
    this.progressListeners.add(listener);
    return () => this.progressListeners.delete(listener);
  }

  public async init(forceRefresh = false): Promise<void> {
    if (this.ready && !forceRefresh) return;
    if (this.initPromise && !forceRefresh) return this.initPromise;

    if (!this.worker) {
      throw new Error('SQLite Web Worker is not available in this environment');
    }

    this.initPromise = this.send<unknown>('INIT_DATABASE', { forceRefresh }).then(() => {
      this.ready = true;
    });

    return this.initPromise;
  }

  private send<T>(type: SqliteWorkerMessage['type'], payload?: unknown): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new Error('SQLite worker unavailable'));
    }

    const id = ++this.currentRequestId;
    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve: resolve as (data: unknown) => void, reject });
      this.worker!.postMessage({ id, type, payload } as SqliteWorkerMessage);
    });
  }

  public async getChapters(repertoryId?: string, searchQuery?: string): Promise<Chapter[]> {
    return this.send<Chapter[]>('GET_CHAPTERS', { repertoryId, searchQuery });
  }

  public async getRubricsByIds(rubricIds: string[]): Promise<Rubric[]> {
    return this.send<Rubric[]>('GET_RUBRICS_BY_IDS', { rubricIds });
  }

  public async searchRubrics(
    query?: string,
    chapterId?: string,
    repertoryId?: string,
    limit = 50,
    offset = 0
  ): Promise<Rubric[]> {
    return this.send<Rubric[]>('SEARCH_RUBRICS', { query, chapterId, repertoryId, limit, offset });
  }

  public async getRubricChildren(parentId: string): Promise<Rubric[]> {
    return this.send<Rubric[]>('GET_RUBRIC_CHILDREN', { parentId });
  }

  public async executeRepertorization(payload: {
    activeRubrics: ActiveCaseRubric[];
    filters: FilterCriteria;
    scoringModel: ScoringModel;
    combinedRubrics?: CombinedRubric[];
  }): Promise<RepertorizationComputeOutput> {
    return this.send<RepertorizationComputeOutput>('EXECUTE_REPERTORIZATION', payload);
  }

  public async getMonograph(remedyId: string, bookId?: string): Promise<RemedyMonograph | undefined> {
    return this.send<RemedyMonograph | undefined>('GET_MONOGRAPH', { remedyId, bookId });
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
      this.initPromise = null;
    }
  }
}

export const sqliteClient = new SqliteDatabaseClient();
