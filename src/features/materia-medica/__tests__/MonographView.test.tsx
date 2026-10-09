import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonographView } from '../components/MonographView';
import { deriveClinicalMonograph } from '@/core/materia-medica/monographSynthesizer';
import type { Remedy } from '@/features/repertory/types';
import type { MateriaMedicaBook, RemedyMonograph } from '../types';

describe('MonographView Component', () => {
  const books: MateriaMedicaBook[] = [
    {
      id: 'book-boericke',
      code: 'BOERICKE_MM',
      title: 'Pocket Manual of Homeopathic Materia Medica',
      author: 'Dr. William Boericke',
      editionYear: 1927,
      description: 'Classic clinical compendium',
    },
  ];

  const abiesRemedy: Remedy = {
    id: 'rem-abies-c',
    abbreviation: 'Abies-c.',
    fullName: 'Abies Canadensis',
    commonName: 'Hemlock Spruce',
    kingdom: 'Plant',
    thermal: 'Chilly',
    miasm: 'Psora',
    isPolychrest: false,
    shortKeynotes: 'Canine hunger with sensation of cold water dripping down back between shoulders.',
  };

  const authorMonograph: RemedyMonograph = {
    id: 'mono-sulph',
    remedyId: 'rem-sulph',
    abbreviation: 'Sulph.',
    fullName: 'Sulphur',
    bookId: 'book-boericke',
    bookTitle: 'Boericke Materia Medica',
    mind: 'Philosophical, speculative, ragged philosopher.',
    physicalGenerals: 'Burning heat in vertex, palms, and soles.',
    keynotes: 'Empty gone feeling at 11 AM.',
    modalitiesAgg: ['Warmth of bed', '11 AM hunger'],
    modalitiesAmel: ['Dry warm weather'],
    organAffinities: ['Skin', 'Venous system'],
  };

  it('renders author edition badge for authentic database monographs', () => {
    const sulphRemedy: Remedy = {
      id: 'rem-sulph',
      abbreviation: 'Sulph.',
      fullName: 'Sulphur',
      commonName: 'Sublimed Sulphur',
      kingdom: 'Mineral',
      thermal: 'Hot',
      miasm: 'Psora',
      isPolychrest: true,
      shortKeynotes: 'Empty gone feeling at 11 AM.',
    };

    render(
      <MonographView
        remedy={sulphRemedy}
        monograph={authorMonograph}
        relationships={[]}
        availableBooks={books}
        selectedBookId="book-boericke"
      />
    );

    expect(screen.getByText('Sulphur')).toBeDefined();
    expect(screen.getByText('Original Author Edition')).toBeDefined();
    expect(screen.getByText('Empty gone feeling at 11 AM.')).toBeDefined();
  });

  it('renders clinical compendium badge and synthesized parameters for rare remedies', () => {
    const synthMonograph = deriveClinicalMonograph(abiesRemedy, 'book-boericke', books);

    render(
      <MonographView
        remedy={abiesRemedy}
        monograph={synthMonograph}
        relationships={[]}
        availableBooks={books}
        selectedBookId="book-boericke"
      />
    );

    expect(screen.getByText('Abies Canadensis')).toBeDefined();
    expect(screen.getByText('Clinical Compendium Profile')).toBeDefined();
    expect(
      screen.getByText('Canine hunger with sensation of cold water dripping down back between shoulders.')
    ).toBeDefined();

    // Switch to Physical Generals tab
    const physTab = screen.getByText('Physical Generals');
    fireEvent.click(physTab);
    expect(screen.getByText(/Pronounced lack of vital heat/)).toBeDefined();

    // Switch to Modalities tab
    const modalTab = screen.getByText(/Modalities/);
    fireEvent.click(modalTab);
    expect(screen.getByText('Cold air, drafts, and becoming chilled')).toBeDefined();
    expect(screen.getByText('Warm external applications and wraps')).toBeDefined();

    // Switch to Organ Affinities tab
    const affTab = screen.getByText('Organ Affinities');
    fireEvent.click(affTab);
    expect(screen.getByText('Locomotor System & Bones')).toBeDefined();
    expect(screen.getByText('Gastrointestinal & Stomach')).toBeDefined();
  });
});
