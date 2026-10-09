import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MateriaMedicaBrowser } from '../components/MateriaMedicaBrowser';
import type { Remedy } from '@/features/repertory/types';

describe('MateriaMedicaBrowser Component', () => {
  const sampleRemedies: Remedy[] = [
    {
      id: 'rem-abies-c',
      abbreviation: 'Abies-c.',
      fullName: 'Abies Canadensis',
      commonName: 'Hemlock Spruce',
      kingdom: 'Plant',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: 'Canine hunger with sensation of cold water.',
    },
    {
      id: 'rem-sulph',
      abbreviation: 'Sulph.',
      fullName: 'Sulphur',
      commonName: 'Sublimed Sulphur',
      kingdom: 'Mineral',
      thermal: 'Hot',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Burning heat of vertex, 11 AM hunger.',
    },
    {
      id: 'rem-bell',
      abbreviation: 'Bell.',
      fullName: 'Belladonna',
      commonName: 'Deadly Nightshade',
      kingdom: 'Plant',
      thermal: 'Hot',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Throbbing congestions, flushed face.',
    },
  ];

  it('renders remedies and calls onSearchChange on typing', () => {
    const handleSearchChange = vi.fn();
    const handleSelectRemedy = vi.fn();
    const handleToggleCompare = vi.fn();

    render(
      <MateriaMedicaBrowser
        remedies={sampleRemedies}
        searchTerm=""
        onSearchChange={handleSearchChange}
        activeRemedyId="rem-sulph"
        onSelectRemedy={handleSelectRemedy}
        selectedComparisonIds={[]}
        onToggleCompare={handleToggleCompare}
      />
    );

    expect(screen.getByText('Abies-c.')).toBeDefined();
    expect(screen.getByText('Sulph.')).toBeDefined();
    expect(screen.getByText('Bell.')).toBeDefined();
    expect(screen.getByText('3 remedies')).toBeDefined();

    const input = screen.getByPlaceholderText('Filter remedies or text...');
    fireEvent.change(input, { target: { value: 'Sulph' } });
    expect(handleSearchChange).toHaveBeenCalledWith('Sulph');
  });

  it('filters remedies based on active searchTerm', () => {
    render(
      <MateriaMedicaBrowser
        remedies={sampleRemedies}
        searchTerm="sulph"
        onSearchChange={vi.fn()}
        activeRemedyId="rem-sulph"
        onSelectRemedy={vi.fn()}
        selectedComparisonIds={[]}
        onToggleCompare={vi.fn()}
      />
    );

    expect(screen.getByText('Sulph.')).toBeDefined();
    expect(screen.queryByText('Abies-c.')).toBeNull();
    expect(screen.queryByText('Bell.')).toBeNull();
    expect(screen.getByText('1 matching')).toBeDefined();
  });

  it('displays empty message when search matches nothing', () => {
    render(
      <MateriaMedicaBrowser
        remedies={sampleRemedies}
        searchTerm="nonexistent_xyz"
        onSearchChange={vi.fn()}
        activeRemedyId={null}
        onSelectRemedy={vi.fn()}
        selectedComparisonIds={[]}
        onToggleCompare={vi.fn()}
      />
    );

    expect(screen.getByText(/No remedies matching "nonexistent_xyz"/)).toBeDefined();
    expect(screen.getByText('0 matching')).toBeDefined();
  });
});
