import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { specialtyReducer } from '@/app/store/slices/specialtySlice';
import repertorizationReducer from '@/app/store/slices/repertorizationSlice';
import { getDb } from '@/core/storage/indexedDb';
import { SpecialtyRepertoryView } from '../components/SpecialtyRepertoryView';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      specialty: specialtyReducer,
      repertorization: repertorizationReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <SpecialtyRepertoryView />
      </Provider>
    ),
  };
}

describe('SpecialtyRepertoryView Component', () => {
  beforeEach(async () => {
    await getDb();
  });

  it('renders repertory cards and seeded clinical rubrics', async () => {
    renderWithProviders();

    // Wait for repertory cards to render from async IndexedDB
    await waitFor(
      () => {
        expect(screen.getByText(/Douglas M. Borland/i)).toBeDefined();
        expect(screen.getByText(/John Henry Clarke/i)).toBeDefined();
        expect(screen.getByText(/Bönninghausen/i)).toBeDefined();
        expect(screen.getByText(/Cyrus Maxwell Boger/i)).toBeDefined();
      },
      { timeout: 4000 }
    );

    // Verify rubrics loaded from IndexedDB (may appear in both section pills and card header)
    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Pneumonia - Incipient Stage/i).length
        ).toBeGreaterThanOrEqual(1);
      },
      { timeout: 4000 }
    );
  }, 15000);

  it('filters rubrics when typing in search input', async () => {
    renderWithProviders();

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Pneumonia - Incipient Stage/i).length
        ).toBeGreaterThanOrEqual(1);
      },
      { timeout: 4000 }
    );

    const searchInput = screen.getByPlaceholderText(/Search specialty rubrics/i);
    fireEvent.change(searchInput, { target: { value: 'stitching' } });

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Pneumonia - Consolidation/i).length
        ).toBeGreaterThanOrEqual(1);
      },
      { timeout: 4000 }
    );
  }, 15000);

  it('adds a specialty rubric to the active case clipboard upon clicking Add to Case', async () => {
    const { store } = renderWithProviders();

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Pneumonia - Incipient Stage/i).length
        ).toBeGreaterThanOrEqual(1);
      },
      { timeout: 4000 }
    );

    const addButtons = screen.getAllByRole('button', { name: /Add to Case/i });
    expect(addButtons.length).toBeGreaterThan(0);

    // Initial state: 0 active rubrics
    expect(store.getState().repertorization.activeRubrics.length).toBe(0);

    // Click Add to Case
    fireEvent.click(addButtons[0]);

    // Active rubrics in Redux store should now have 1 rubric
    await waitFor(
      () => {
        expect(store.getState().repertorization.activeRubrics.length).toBe(1);
      },
      { timeout: 4000 }
    );
  }, 15000);
});
