import { useEffect } from 'react';

/**
 * Listens for key chords such as Ctrl+K or Cmd+K.
 */
export function useShortcut(
  key: string,
  callback: () => void,
  options: { ctrlOrCmd?: boolean; alt?: boolean; shift?: boolean } = {}
): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrlOrCmd = options.ctrlOrCmd ? event.metaKey || event.ctrlKey : true;
      const matchAlt = options.alt ? event.altKey : !event.altKey;
      const matchShift = options.shift ? event.shiftKey : !event.shiftKey;

      if (matchKey && matchCtrlOrCmd && matchAlt && matchShift) {
        event.preventDefault();
        callback();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}
