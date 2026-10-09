import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { specialtyReducer } from '@/app/store/slices/specialtySlice';
import { getDb } from '@/core/storage/indexedDb';
import { VeterinaryCasesView } from '../components/VeterinaryCasesView';

function renderWithProviders() {
  const store = configureStore({
    reducer: {
      specialty: specialtyReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <VeterinaryCasesView />
      </Provider>
    ),
  };
}

describe('VeterinaryCasesView Component', () => {
  beforeEach(async () => {
    await getDb();
  });
  it('renders species filter tabs and seeded veterinary cured cases', async () => {
    renderWithProviders();

    expect(screen.getByText(/All Animal Cases/i)).toBeDefined();
    expect(screen.getByText(/Canine Cases/i)).toBeDefined();
    expect(screen.getByText(/Feline Cases/i)).toBeDefined();
    expect(screen.getByText(/Equine Cases/i)).toBeDefined();

    await waitFor(
      () => {
        expect(screen.getByText(/Phosphorus/i)).toBeDefined();
        expect(screen.getAllByText(/thunderstorms/i).length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 4000 }
    );
  }, 15000);

  it('filters cases when selecting Equine species tab', async () => {
    renderWithProviders();

    await waitFor(
      () => {
        expect(screen.getByText(/Phosphorus/i)).toBeDefined();
      },
      { timeout: 4000 }
    );

    const equineBtn = screen.getByRole('button', { name: /Equine Cases/i });
    fireEvent.click(equineBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/Colocynthis/i)).toBeDefined();
        expect(screen.queryByText(/Phosphorus/i)).toBeNull();
      },
      { timeout: 4000 }
    );
  }, 15000);

  it('searches cases by text query', async () => {
    renderWithProviders();

    await waitFor(
      () => {
        expect(screen.getByText(/Phosphorus/i)).toBeDefined();
      },
      { timeout: 4000 }
    );

    const searchInput = screen.getByPlaceholderText(/Search veterinary cured cases/i);
    fireEvent.change(searchInput, { target: { value: 'mastitis' } });

    await waitFor(
      () => {
        expect(screen.getByText(/Phytolacca Decandra/i)).toBeDefined();
        expect(screen.getByText(/Holstein Dairy Cow/i)).toBeDefined();
      },
      { timeout: 4000 }
    );
  }, 15000);
});
