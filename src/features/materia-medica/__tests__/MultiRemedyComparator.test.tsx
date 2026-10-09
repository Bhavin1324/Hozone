import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiRemedyComparator } from '../components/MultiRemedyComparator';
import type { RemedyComparisonSlot } from '../types';

describe('MultiRemedyComparator Component', () => {
  const mockSlots: RemedyComparisonSlot[] = [
    {
      remedy: {
        id: 'rem-acon',
        abbreviation: 'Acon.',
        fullName: 'Aconitum Napellus (Monkshood)',
        commonName: 'Monkshood',
        kingdom: 'Plant',
        thermal: 'Hot',
        miasm: 'Psora',
        isPolychrest: true,
        shortKeynotes: 'Sudden onset of fever and acute restlessness with death anxiety.',
      },
      monograph: {
        id: 'mono-acon',
        remedyId: 'rem-acon',
        abbreviation: 'Acon.',
        fullName: 'Aconitum Napellus',
        bookId: 'boericke',
        bookTitle: "Boericke's Materia Medica",
        mind: 'Fear of death with great restlessness.',
        physicalGenerals: 'Sudden high fever, intense thirst.',
        keynotes: 'Sudden intense fever following dry cold wind.',
        modalitiesAgg: ['Cold dry wind', 'Night'],
        modalitiesAmel: ['Open air', 'Rest'],
        organAffinities: ['Cardiovascular', 'Central Nervous System'],
      },
      relationships: [
        {
          id: 'rel-acon-bell',
          primaryRemedyId: 'rem-acon',
          relatedRemedyId: 'rem-bell',
          relatedAbbr: 'Bell.',
          relatedFullName: 'Belladonna',
          type: 'complement',
          notes: 'Follows well in acute inflammations',
        },
      ],
    },
    {
      remedy: {
        id: 'rem-bell',
        abbreviation: 'Bell.',
        fullName: 'Atropa Belladonna (Deadly Nightshade)',
        commonName: 'Deadly Nightshade',
        kingdom: 'Plant',
        thermal: 'Hot',
        miasm: 'Psora',
        isPolychrest: true,
        shortKeynotes: 'Violent congestion, throbbing headache, dilated pupils.',
      },
      monograph: {
        id: 'mono-bell',
        remedyId: 'rem-bell',
        abbreviation: 'Bell.',
        fullName: 'Atropa Belladonna',
        bookId: 'boericke',
        bookTitle: "Boericke's Materia Medica",
        mind: 'Delirium with rage.',
        physicalGenerals: 'Heat, redness, throbbing.',
        keynotes: 'Violent throbbing congestions, flushed red face.',
        modalitiesAgg: ['Draft of air', 'Jarring motion'],
        modalitiesAmel: ['Quiet room', 'Resting upright'],
        organAffinities: ['Brain', 'Meninges'],
      },
      relationships: [
        {
          id: 'rel-bell-acon',
          primaryRemedyId: 'rem-bell',
          relatedRemedyId: 'rem-acon',
          relatedAbbr: 'Acon.',
          relatedFullName: 'Aconitum Napellus',
          type: 'complement',
          notes: 'Synergistic in high grade inflammatory crises',
        },
      ],
    },
  ];

  it('renders standby screen when fewer than 2 remedies are supplied', () => {
    const handleRemove = vi.fn();
    const handleClear = vi.fn();

    render(
      <MultiRemedyComparator
        slots={[mockSlots[0]]}
        onRemoveSlot={handleRemove}
        onClearAll={handleClear}
      />
    );

    expect(screen.getByText('Multi-Remedy Comparator Standby')).toBeDefined();
    expect(screen.getByText(/Currently comparing: 1 \/ 4 remedies/i)).toBeDefined();
  });

  it('renders side-by-side comparison matrix with 2 remedies', () => {
    const handleRemove = vi.fn();
    const handleClear = vi.fn();

    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={handleRemove}
        onClearAll={handleClear}
      />
    );

    expect(screen.getByText('Differential Remedy Comparator (2 of 4)')).toBeDefined();
    expect(screen.getAllByText('Acon.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bell.').length).toBeGreaterThan(0);
    expect(screen.getByText('Keynotes')).toBeDefined();
    expect(screen.getByText('Mind & Emotion')).toBeDefined();
    expect(screen.getByText('< Aggravation')).toBeDefined();
    expect(screen.getByText('> Amelioration')).toBeDefined();
    expect(screen.getByText('Organ Affinities')).toBeDefined();
  });

  it('displays sticky Clinical Section headers and scroll hints', () => {
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    expect(screen.getByText(/Scroll horizontally or use arrows above to inspect remedies/i)).toBeDefined();
  });

  it('calls onRemoveSlot when remedy removal button is clicked', () => {
    const handleRemove = vi.fn();
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={handleRemove}
        onClearAll={vi.fn()}
      />
    );

    const removeButtons = screen.getAllByTitle('Remove from comparison');
    expect(removeButtons.length).toBe(2);

    fireEvent.click(removeButtons[0]);
    expect(handleRemove).toHaveBeenCalledWith('rem-acon');
  });

  it('calls onClearAll when Clear Comparison button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={vi.fn()}
        onClearAll={handleClear}
      />
    );

    const clearBtn = screen.getByText('Clear Comparison');
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleSidebar when Maximize/Catalog toggle button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={vi.fn()}
        onClearAll={vi.fn()}
        isSidebarOpen={true}
        onToggleSidebar={handleToggle}
      />
    );

    const toggleBtn = screen.getByTitle('Maximize Comparison View');
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('renders complementary relationship alert when synergism is present', () => {
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    expect(screen.getByText('Complementary Follow-Up Relationship Present')).toBeDefined();
  });

  it('renders horizontal column scroll navigation buttons without throwing', () => {
    render(
      <MultiRemedyComparator
        slots={mockSlots}
        onRemoveSlot={vi.fn()}
        onClearAll={vi.fn()}
      />
    );

    const scrollLeftBtn = screen.getByTitle('Scroll Columns Left');
    const scrollRightBtn = screen.getByTitle('Scroll Columns Right');
    expect(scrollLeftBtn).toBeDefined();
    expect(scrollRightBtn).toBeDefined();

    // Clicking scroll buttons executes smoothly with fallback
    fireEvent.click(scrollLeftBtn);
    fireEvent.click(scrollRightBtn);
  });
});
