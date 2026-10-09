import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../indexedDb';
import {
  getLocalSpecialtyRepertories,
  getLocalSpecialtyRubrics,
  getLocalVeterinarySpeciesGuidance,
  getLocalVeterinaryCases,
  saveLocalVeterinaryCase,
  saveLocalSpecialtyRubric,
} from '../indexedDbSpecialty';
import type { SpecialtyRubric, VeterinaryCase } from '@/features/specialty/types';

describe('Local-First IndexedDB Specialty & Veterinary Storage (v9)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe('Specialty Repertories Store', () => {
    it('retrieves all 5 seeded specialty clinical repertories', async () => {
      const repertories = await getLocalSpecialtyRepertories();
      expect(repertories.length).toBeGreaterThanOrEqual(5);

      const codes = repertories.map((r) => r.code);
      expect(codes).toContain('BORLAND');
      expect(codes).toContain('CLARKE_CLINICAL');
      expect(codes).toContain('BOENNINGHAUSEN_TPB');
      expect(codes).toContain('BOGER_SYNOPTIC');
      expect(codes).toContain('VETERINARY');
    });
  });

  describe('Specialty Rubrics Store', () => {
    it('retrieves all seeded rubrics or filters by repertory code', async () => {
      const allRubrics = await getLocalSpecialtyRubrics();
      expect(allRubrics.length).toBeGreaterThanOrEqual(20);

      const borlandRubrics = await getLocalSpecialtyRubrics('BORLAND');
      expect(borlandRubrics.length).toBeGreaterThanOrEqual(4);
      expect(borlandRubrics.every((r) => r.repertoryCode === 'BORLAND')).toBe(true);
    });

    it('searches rubrics by text query across path and remedies', async () => {
      const results = await getLocalSpecialtyRubrics(undefined, 'pneumonia');
      expect(results.length).toBeGreaterThanOrEqual(1);

      const arsenicumResults = await getLocalSpecialtyRubrics(undefined, 'Arsenicum');
      expect(arsenicumResults.length).toBeGreaterThanOrEqual(1);
    });

    it('saves and retrieves a custom specialty rubric', async () => {
      const customRubric: SpecialtyRubric = {
        id: 'test-custom-rubric-999',
        repertoryCode: 'BORLAND',
        section: 'Lungs - Consolidations',
        rubricPath: 'Lungs > Crepitations > Fine end-inspiratory',
        remedies: [
          { remedy: 'Phosphorus', abbr: 'phos', grade: 4 },
          { remedy: 'Bryonia Alba', abbr: 'bry', grade: 3 },
        ],
        clinicalNotes: 'Distinct fine rales in early stage hepatization',
      };

      await saveLocalSpecialtyRubric(customRubric);
      const search = await getLocalSpecialtyRubrics('BORLAND', 'Crepitations');
      expect(search.some((r) => r.id === 'test-custom-rubric-999')).toBe(true);
    });
  });

  describe('Veterinary Species Guidance Store', () => {
    it('retrieves all 5 veterinary species guidance records', async () => {
      const guidance = await getLocalVeterinarySpeciesGuidance();
      expect(guidance.length).toBeGreaterThanOrEqual(5);

      const species = guidance.map((g) => g.species);
      expect(species).toContain('Canine');
      expect(species).toContain('Feline');
      expect(species).toContain('Equine');
      expect(species).toContain('Bovine');
      expect(species).toContain('Avian');
    });

    it('filters guidance by specific species', async () => {
      const canineGuidance = await getLocalVeterinarySpeciesGuidance('Canine');
      expect(canineGuidance.length).toBe(1);
      expect(canineGuidance[0].species).toBe('Canine');
      expect(canineGuidance[0].commonAcuteConditions).toContain('Kennel cough');

      const felineGuidance = await getLocalVeterinarySpeciesGuidance('Feline');
      expect(felineGuidance.length).toBe(1);
      expect(felineGuidance[0].species).toBe('Feline');
      expect(felineGuidance[0].contraindications).toContain('alcohol');
    });
  });

  describe('Veterinary Cases Store', () => {
    it('retrieves seeded veterinary cured cases', async () => {
      const cases = await getLocalVeterinaryCases();
      expect(cases.length).toBeGreaterThanOrEqual(6);

      const canineCases = await getLocalVeterinaryCases('Canine');
      expect(canineCases.length).toBeGreaterThanOrEqual(2);
      expect(canineCases.every((c) => c.species === 'Canine')).toBe(true);
    });

    it('searches veterinary cases by remedy or complaint', async () => {
      const cantharisResults = await getLocalVeterinaryCases(undefined, 'Cantharis');
      expect(cantharisResults.length).toBeGreaterThanOrEqual(1);
      expect(cantharisResults[0].species).toBe('Feline');

      const colicResults = await getLocalVeterinaryCases(undefined, 'colic');
      expect(colicResults.length).toBeGreaterThanOrEqual(1);
      expect(colicResults[0].species).toBe('Equine');
    });

    it('saves a new veterinary cured case', async () => {
      const newCase: VeterinaryCase = {
        id: 'test-vet-case-999',
        species: 'Canine',
        breedAgeGender: 'Golden Retriever, 3y M',
        chiefComplaint: 'Acute gastrointestinal upset from dietary indiscretion',
        rubricsUsed: ['Stomach > Vomiting > Food', 'Abdomen > Sensitive to pressure'],
        remedyPrescribed: 'Nux vomica',
        potency: '30C',
        outcomeNotes: 'Complete recovery within 12 hours after 2 doses',
        author: 'Dr. Christopher Day',
      };

      await saveLocalVeterinaryCase(newCase);
      const retrieved = await getLocalVeterinaryCases('Canine', 'dietary indiscretion');
      expect(retrieved.some((c) => c.id === 'test-vet-case-999')).toBe(true);
    });
  });
});
