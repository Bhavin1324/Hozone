import type { RepertorizationComputeOutput } from '@/features/repertory/types';
import { executeRepertorization, type ComputePayload } from './repertoryWorker';

class RepertoryComputeClient {
  private worker: Worker | null = null;
  private currentRequestId = 0;

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof window === 'undefined') return;

    try {
      this.worker = new Worker(
        new URL('./repertoryWorker.ts', import.meta.url),
        { type: 'module' }
      );
    } catch (e) {
      console.warn('[Hozone]: Web Worker creation failed, using main-thread fallback.', e);
      this.worker = null;
    }
  }

  public async compute(payload: ComputePayload): Promise<RepertorizationComputeOutput> {
    if (!this.worker) {
      // Synchronous fallback
      return executeRepertorization(payload);
    }

    const requestId = ++this.currentRequestId;

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent<RepertorizationComputeOutput>) => {
        // Discard responses from older queries
        if (requestId === this.currentRequestId) {
          this.worker?.removeEventListener('message', handleMessage);
          resolve(event.data);
        }
      };

      this.worker!.addEventListener('message', handleMessage);
      this.worker!.postMessage(payload);
    });
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const repertoryClient = new RepertoryComputeClient();
