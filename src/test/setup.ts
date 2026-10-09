import 'fake-indexeddb/auto';

// Mock window.matchMedia for JSDOM environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  const origGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
    try {
      return origGetComputedStyle(elt, pseudoElt);
    } catch {
      return origGetComputedStyle(elt);
    }
  };
}
