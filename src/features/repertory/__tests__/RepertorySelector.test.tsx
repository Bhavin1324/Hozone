import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RepertorySelector } from '../components/RepertorySelector';
import type { RepertoryCatalogItem } from '../types';

describe('RepertorySelector Component (Phase C)', () => {
  const sampleRepertories: RepertoryCatalogItem[] = [
    {
      id: 'rep-kent',
      code: 'KENT_CORE',
      title: "Kent's Repertory of the Homoeopathic Materia Medica",
      author: 'Dr. James Tyler Kent',
      editionYear: 1957,
      category: 'Master General & Classical',
      description: 'Standard classical repertory',
      isDefault: true,
    },
    {
      id: 'rep-complete-2024',
      code: 'COMPLETE_2024',
      title: 'Complete Repertory 2024',
      author: 'Dr. Roger van Zandvoort',
      editionYear: 2024,
      category: 'Master General & Classical',
      description: 'Comprehensive modern repertory',
    },
    {
      id: 'rep-borland-pneumonia',
      code: 'BORLAND_PNEUMONIA',
      title: "Borland's Pneumonias Specialty Repertory",
      author: 'Dr. Douglas M. Borland',
      editionYear: 1939,
      category: 'Regional & Organ Therapeutics',
      description: 'Pneumonia rubrics',
    },
  ];

  it('renders active repertory title, author, and year badge', () => {
    render(
      <RepertorySelector
        repertories={sampleRepertories}
        selectedRepertoryId="rep-kent"
        onSelectRepertory={vi.fn()}
      />
    );

    const titleMatches = screen.getAllByText("Kent's Repertory of the Homoeopathic Materia Medica");
    expect(titleMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Dr\. James Tyler Kent/i)).toBeDefined();
    expect(screen.getByText('1957')).toBeDefined();
  });

  it('displays the 44 Repertories parity badge', () => {
    render(
      <RepertorySelector
        repertories={sampleRepertories}
        selectedRepertoryId="rep-kent"
        onSelectRepertory={vi.fn()}
      />
    );

    expect(screen.getByText('44 Repertories')).toBeDefined();
  });
});
