import { useSyncExternalStore } from 'react';

/**
 * Tracks match status of a CSS media query string using useSyncExternalStore.
 * Avoids cascading re-renders and aligns with React 19 concurrent standards.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => {};
      }
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => {
        mediaQueryList.removeEventListener('change', onStoreChange);
      };
    },
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    },
    () => false
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}
