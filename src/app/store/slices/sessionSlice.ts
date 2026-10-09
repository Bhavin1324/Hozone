import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  isAuthenticated: boolean;
  practitionerId: string | null;
  practitionerName: string | null;
  practitionerEmail: string | null;
  activeCaseId: string | null;
  lastActiveTimestamp: string;
}

const initialState: SessionState = {
  isAuthenticated: true, // Defaulting to demo clinical session
  practitionerId: 'demo-practitioner-01',
  practitionerName: 'Dr. Evelyn Vance, MD (Hom.)',
  practitionerEmail: 'evelyn.vance@hozone.clinic',
  activeCaseId: null,
  lastActiveTimestamp: new Date().toISOString(),
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setPractitioner: (
      state,
      action: PayloadAction<{ id: string; name: string; email: string }>
    ) => {
      state.isAuthenticated = true;
      state.practitionerId = action.payload.id;
      state.practitionerName = action.payload.name;
      state.practitionerEmail = action.payload.email;
      state.lastActiveTimestamp = new Date().toISOString();
    },
    setActiveCase: (state, action: PayloadAction<string | null>) => {
      state.activeCaseId = action.payload;
      state.lastActiveTimestamp = new Date().toISOString();
    },
    clearSession: (state) => {
      state.isAuthenticated = false;
      state.practitionerId = null;
      state.practitionerName = null;
      state.practitionerEmail = null;
      state.activeCaseId = null;
      state.lastActiveTimestamp = new Date().toISOString();
    },
    updateActivity: (state) => {
      state.lastActiveTimestamp = new Date().toISOString();
    },
  },
});

export const { setPractitioner, setActiveCase, clearSession, updateActivity } =
  sessionSlice.actions;

export default sessionSlice.reducer;
