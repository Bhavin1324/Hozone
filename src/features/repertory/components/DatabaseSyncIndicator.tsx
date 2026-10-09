import React, { useEffect } from 'react';
import { Database, CheckCircle2, DownloadCloud, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSqliteSyncProgress } from '@/app/store/slices/repertorizationSlice';
import { sqliteClient } from '@/core/workers/sqliteDatabaseClient';

export const DatabaseSyncIndicator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sqliteSync } = useAppSelector((state) => state.repertorization);

  useEffect(() => {
    // Subscribe to client progress updates
    const unsubscribe = sqliteClient.onProgress((status, percent) => {
      dispatch(
        setSqliteSyncProgress({
          status,
          progressPercent: percent,
        })
      );
    });

    // Auto-initiate SQLite WASM sync in background if uninitialized
    if (sqliteSync.status === 'uninitialized') {
      sqliteClient.init().catch((err) => {
        console.warn('[DatabaseSyncIndicator] Background SQLite init fallback:', err);
        dispatch(
          setSqliteSyncProgress({
            status: 'fallback',
            progressPercent: 0,
            error: err?.message,
          })
        );
      });
    }

    return () => {
      unsubscribe();
    };
  }, [dispatch, sqliteSync.status]);

  if (sqliteSync.status === 'ready') {
    return (
      <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-status-success/10 border border-status-success/20 text-xs font-medium text-status-success">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
        </span>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Offline SQLite Engine</span>
        <span className="font-mono text-[10px] opacity-80">v{sqliteSync.dbVersion}</span>
      </div>
    );
  }

  if (sqliteSync.status === 'downloading' || sqliteSync.status === 'decompressing' || sqliteSync.status === 'mounting') {
    return (
      <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-xs text-primary-500 font-medium">
        {sqliteSync.status === 'downloading' ? (
          <DownloadCloud className="w-3.5 h-3.5 animate-bounce" />
        ) : (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        )}
        <span className="hidden sm:inline capitalize">{sqliteSync.status}...</span>
        <span className="font-mono text-[11px] font-bold">{sqliteSync.progressPercent}%</span>
        <div className="w-12 h-1.5 bg-primary-500/20 rounded-full overflow-hidden hidden md:block">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${sqliteSync.progressPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-surface-subtle border border-border-subtle text-xs text-text-muted">
      <Database className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Local IndexedDB Mode</span>
    </div>
  );
};
