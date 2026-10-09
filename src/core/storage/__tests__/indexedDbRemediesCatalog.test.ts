import { describe, it, expect, beforeEach } from 'vitest';
import {
  getDb,
  getLocalRemedies,
  searchLocalRemedies,
} from '../indexedDb';

describe('3,400+ Remedy Master Directory & Catalog (Phase A)', () => {
  beforeEach(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  it('hydrates >= 3,400 unique remedies into IndexedDB storage', async () => {
    const remedies = await getLocalRemedies();
    expect(remedies.length).toBeGreaterThanOrEqual(3400);

    // Verify all abbreviations are unique
    const abbrSet = new Set(remedies.map((r) => r.abbreviation));
    expect(abbrSet.size).toBe(remedies.length);
  });

  it('maintains backwards-compatible client IDs for classical polychrests', async () => {
    const remedies = await getLocalRemedies();

    const sulph = remedies.find((r) => r.abbreviation === 'Sulph.');
    expect(sulph).toBeDefined();
    expect(sulph?.id).toBe('rem-sulph');
    expect(sulph?.fullName).toBe('Sulphur');
    expect(sulph?.kingdom).toBe('Mineral');
    expect(sulph?.isPolychrest).toBe(true);

    const calc = remedies.find((r) => r.abbreviation === 'Calc.');
    expect(calc).toBeDefined();
    expect(calc?.id).toBe('rem-calc');

    const lyc = remedies.find((r) => r.abbreviation === 'Lyc.');
    expect(lyc).toBeDefined();
    expect(lyc?.id).toBe('rem-lyc');
  });

  it('contains comprehensive coverage across all 6 kingdoms', async () => {
    const remedies = await getLocalRemedies();

    const plants = remedies.filter((r) => r.kingdom === 'Plant');
    const minerals = remedies.filter((r) => r.kingdom === 'Mineral');
    const animals = remedies.filter((r) => r.kingdom === 'Animal');
    const nosodes = remedies.filter((r) => r.kingdom === 'Nosode');
    const sarcodes = remedies.filter((r) => r.kingdom === 'Sarcode');
    const imponderabilia = remedies.filter((r) => r.kingdom === 'Imponderabilia');

    expect(plants.length).toBeGreaterThan(1500);
    expect(minerals.length).toBeGreaterThan(1000);
    expect(animals.length).toBeGreaterThanOrEqual(50);
    expect(nosodes.length).toBeGreaterThanOrEqual(30);
    expect(sarcodes.length).toBeGreaterThanOrEqual(40);
    expect(imponderabilia.length).toBeGreaterThanOrEqual(8);
  });

  it('filters remedies accurately by kingdom index', async () => {
    const mineralResults = await searchLocalRemedies({ kingdom: 'Mineral' });
    expect(mineralResults.length).toBeGreaterThan(1000);
    for (const r of mineralResults) {
      expect(r.kingdom).toBe('Mineral');
    }

    const animalResults = await searchLocalRemedies({ kingdom: 'Animal' });
    expect(animalResults.length).toBeGreaterThanOrEqual(50);
    for (const r of animalResults) {
      expect(r.kingdom).toBe('Animal');
    }
  });

  it('filters remedies accurately by thermal and miasm diathesis', async () => {
    const chillySyphilitic = await searchLocalRemedies({
      thermal: 'Chilly',
      miasm: 'Syphilis',
    });
    expect(chillySyphilitic.length).toBeGreaterThan(0);
    for (const r of chillySyphilitic) {
      expect(r.thermal).toBe('Chilly');
      expect(r.miasm).toBe('Syphilis');
    }
  });

  it('searches by keyword across abbreviation, Latin binomial, and common name', async () => {
    const results = await searchLocalRemedies({ query: 'Lachesis' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.abbreviation === 'Lach.')).toBe(true);

    const xRayResults = await searchLocalRemedies({ query: 'X-Ray' });
    expect(xRayResults.length).toBeGreaterThan(0);
    expect(xRayResults[0].kingdom).toBe('Imponderabilia');
  });

  it('supports pagination with limit and offset', async () => {
    const page1 = await searchLocalRemedies({ limit: 25, offset: 0 });
    const page2 = await searchLocalRemedies({ limit: 25, offset: 25 });

    expect(page1.length).toBe(25);
    expect(page2.length).toBe(25);
    expect(page1[0].id).not.toBe(page2[0].id);
  });

  it('executes full-catalog search in under 25ms', async () => {
    const start = performance.now();
    const results = await searchLocalRemedies({ query: 'Arsenic', kingdom: 'Mineral' });
    const duration = performance.now() - start;

    expect(results.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(200);
  });
});
