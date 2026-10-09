import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import sessionReducer from './slices/sessionSlice';
import preferencesReducer from './slices/preferencesSlice';
import repertorizationReducer from './slices/repertorizationSlice';
import materiaMedicaReducer from './slices/materiaMedicaSlice';
import expertSystemsReducer from './slices/expertSystemsSlice';
import clinicalGuidanceReducer from './slices/clinicalGuidanceSlice';
import patientReducer from './slices/patientSlice';
import { specialtyReducer } from './slices/specialtySlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    preferences: preferencesReducer,
    repertorization: repertorizationReducer,
    materiaMedica: materiaMedicaReducer,
    expertSystems: expertSystemsReducer,
    clinicalGuidance: clinicalGuidanceReducer,
    patients: patientReducer,
    specialty: specialtyReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
