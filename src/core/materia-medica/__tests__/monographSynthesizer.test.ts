import { describe, it, expect } from 'vitest';
import {
  deriveClinicalMonograph,
  extractOrganAffinities,
  deriveModalities,
} from '../monographSynthesizer';
import type { Remedy } from '@/features/repertory/types';
import type { MateriaMedicaBook } from '@/features/materia-medica/types';

describe('monographSynthesizer Domain Engine', () => {
  const sampleBooks: MateriaMedicaBook[] = [
    {
      id: 'book-boericke',
      code: 'BOERICKE_MM',
      title: 'Pocket Manual of Homeopathic Materia Medica',
      author: 'Dr. William Boericke',
      editionYear: 1927,
      description: 'Classic clinical compendium',
    },
    {
      id: 'book-kent',
      code: 'KENT_LECTURES',
      title: 'Lectures on Homeopathic Materia Medica',
      author: 'Dr. James Tyler Kent',
      editionYear: 1905,
      description: 'Philosophical portraits',
    },
  ];

  const abiesRemedy: Remedy = {
    id: '86bf91ef-a7d8-408a-ac27-354013802cbc',
    abbreviation: 'Abies-c.',
    fullName: 'Abies Canadensis',
    commonName: 'Hemlock Spruce',
    kingdom: 'Plant',
    thermal: 'Chilly',
    miasm: 'Psora',
    isPolychrest: false,
    shortKeynotes: 'Canine hunger with sensation of cold water dripping down back between shoulders.',
  };

  it('synthesizes a complete monograph with all required parameters for a rare remedy', () => {
    const mono = deriveClinicalMonograph(abiesRemedy, 'book-boericke', sampleBooks);

    expect(mono.id).toBe(`synth-${abiesRemedy.id}-book-boericke`);
    expect(mono.remedyId).toBe(abiesRemedy.id);
    expect(mono.abbreviation).toBe('Abies-c.');
    expect(mono.fullName).toBe('Abies Canadensis');
    expect(mono.bookTitle).toContain('Pocket Manual of Homeopathic Materia Medica');
    expect(mono.mind).toBeDefined();
    expect(mono.mind.length).toBeGreaterThan(20);
    expect(mono.physicalGenerals).toContain('Pronounced lack of vital heat');
    expect(mono.physicalGenerals).toContain('Canine hunger');
    expect(mono.keynotes).toBe(abiesRemedy.shortKeynotes);
    expect(mono.modalitiesAgg.length).toBeGreaterThan(0);
    expect(mono.modalitiesAmel.length).toBeGreaterThan(0);
    expect(mono.organAffinities.length).toBeGreaterThan(0);
    expect(mono.clinicalIndications).toBeDefined();
    expect(mono.comparisons).toBeDefined();
  });

  it('correctly maps organ affinities from clinical keynotes text', () => {
    const affinities = extractOrganAffinities(
      'Severe gastric pain, vomiting of bile, liver enlargement with jaundice and headache.',
      'Plant'
    );

    expect(affinities).toContain('Gastrointestinal & Stomach');
    expect(affinities).toContain('Abdominal Organs & Liver');
    expect(affinities).toContain('Head & Cerebral Circulation');
  });

  it('falls back to kingdom-based organ affinities when keynotes contain no anatomical keywords', () => {
    const animalAffinities = extractOrganAffinities('A rare obscure remedy.', 'Animal');
    expect(animalAffinities).toContain('Blood & Circulation');
    expect(animalAffinities).toContain('Central Nervous System');

    const mineralAffinities = extractOrganAffinities('Another obscure remedy.', 'Mineral');
    expect(mineralAffinities).toContain('Cellular Nutrition');
    expect(mineralAffinities).toContain('Glands & Lymphatics');
  });

  it('derives contrasting modalities according to thermal diathesis', () => {
    const chillyModalities = deriveModalities('Chilly', 'Aggravated by motion');
    expect(chillyModalities.modalitiesAgg).toContain('Cold air, drafts, and becoming chilled');
    expect(chillyModalities.modalitiesAgg).toContain('Physical motion and exertion');
    expect(chillyModalities.modalitiesAmel).toContain('Warm external applications and wraps');

    const hotModalities = deriveModalities('Hot', 'Rest amel');
    expect(hotModalities.modalitiesAgg).toContain('Warm stuffy rooms');
    expect(hotModalities.modalitiesAmel).toContain('Cool open air and fresh breeze');
    expect(hotModalities.modalitiesAmel).toContain('Quiet rest and lying still');
  });
});
