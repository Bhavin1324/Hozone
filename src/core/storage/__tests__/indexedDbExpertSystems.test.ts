import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDb,
  getLocalAcuteNodes,
  getLocalAcuteNodeByKey,
  getLocalTemperaments,
  getLocalSehgalScripts,
  getLocalScholtenElements,
  getLocalKentObservations,
} from '../indexedDb';

describe('Local-First IndexedDB Expert Systems Storage (v6)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  describe('Vijayakar Acute Nodes Store', () => {
    it('retrieves all seeded acute decision nodes', async () => {
      const nodes = await getLocalAcuteNodes();
      expect(nodes.length).toBeGreaterThanOrEqual(8);
      expect(nodes.some((n) => n.nodeKey === 'hot_thirsty_restless')).toBe(true);
      expect(nodes.some((n) => n.nodeKey === 'chilly_thirstless_dull')).toBe(true);
    });

    it('retrieves an acute node by its unique triad key', async () => {
      const node = await getLocalAcuteNodeByKey('chilly_thirsty_restless');
      expect(node).toBeDefined();
      expect(node?.primaryRemedy).toBe('Arsenicum Album');
      expect(node?.remedyAbbreviation).toBe('Ars.');
    });
  });

  describe('Tempraz Profiles Store', () => {
    it('retrieves all 5 core temperaments', async () => {
      const profiles = await getLocalTemperaments();
      expect(profiles).toHaveLength(5);
      const temps = profiles.map((p) => p.temperament);
      expect(temps).toContain('sanguine');
      expect(temps).toContain('melancholic');
      expect(temps).toContain('choleric');
      expect(temps).toContain('phlegmatic');
      expect(temps).toContain('nervous');
    });
  });

  describe('Sehgal Scripts Store', () => {
    it('retrieves all seeded Sehgal behavioral scripts', async () => {
      const scripts = await getLocalSehgalScripts();
      expect(scripts.length).toBeGreaterThanOrEqual(8);
      expect(scripts.some((s) => s.patientPhrase.includes('floating'))).toBe(true);
      expect(scripts.some((s) => s.rubricPath.includes('QUIET'))).toBe(true);
    });
  });

  describe('Scholten Element Mappings Store', () => {
    it('retrieves all periodic table element mappings', async () => {
      const elements = await getLocalScholtenElements();
      expect(elements.length).toBeGreaterThanOrEqual(12);
      expect(elements.some((el) => el.elementSymbol === 'Na')).toBe(true);
      expect(elements.some((el) => el.elementSymbol === 'Fe')).toBe(true);
      expect(elements.some((el) => el.elementSymbol === 'Au')).toBe(true);
    });
  });

  describe("Kent's 12 Prognostic Observations Store", () => {
    it('retrieves all 12 classical prognostic observation rules', async () => {
      const rules = await getLocalKentObservations();
      expect(rules).toHaveLength(12);
      const numbers = rules.map((r) => r.observationNumber);
      expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      expect(rules[2].category).toBe('Curable_Ideal');
      expect(rules[10].title).toContain('Old Symptoms');
      expect(rules[11].category).toBe('Suppression_Danger');
    });
  });
});

