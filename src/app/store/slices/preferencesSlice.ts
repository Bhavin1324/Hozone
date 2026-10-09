import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
  sidebarCollapsed: boolean;
  compactTableMode: boolean;
  commandBarOpen: boolean;
  soundEnabled: boolean;
  recentSearches: string[];
}

const STORAGE_KEY = 'hozone_client_preferences';

function loadStoredPreferences(): Partial<PreferencesState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const stored = loadStoredPreferences();

const initialState: PreferencesState = {
  sidebarCollapsed: stored.sidebarCollapsed ?? false,
  compactTableMode: stored.compactTableMode ?? false,
  commandBarOpen: false,
  soundEnabled: stored.soundEnabled ?? true,
  recentSearches: stored.recentSearches ?? [],
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      persistState(state);
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      persistState(state);
    },
    toggleCompactTableMode: (state) => {
      state.compactTableMode = !state.compactTableMode;
      persistState(state);
    },
    setCommandBarOpen: (state, action: PayloadAction<boolean>) => {
      state.commandBarOpen = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      persistState(state);
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim();
      if (!term) return;
      state.recentSearches = [term, ...state.recentSearches.filter((s) => s !== term)].slice(
        0,
        10
      );
      persistState(state);
    },
  },
});

function persistState(state: PreferencesState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sidebarCollapsed: state.sidebarCollapsed,
        compactTableMode: state.compactTableMode,
        soundEnabled: state.soundEnabled,
        recentSearches: state.recentSearches,
      })
    );
  } catch {
    // Storage quota or private browsing safeguard
  }
}

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleCompactTableMode,
  setCommandBarOpen,
  toggleSound,
  addRecentSearch,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
