import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { RawRemedy, RemedyKingdom, ThermalState, MiasmType } from './types';
import { getPlantsLexiconA_L } from './lexiconPlantsA_L';
import { getPlantsLexiconM_Z } from './lexiconPlantsM_Z';
import { getMineralLexicon } from './lexiconMinerals';
import { getAnimalsAndOthersLexicon } from './lexiconAnimalsAndOthers';
import { getExtendedCatalogLexicon } from './lexiconExtendedCatalog';
import { getPharmacopoeiaExpansionLexicon } from './lexiconPharmacopoeiaExpansion';
import { getRemedyRelationshipsList } from './lexiconRelationships';

export interface FinalRemedy {
  id: string;
  abbreviation: string;
  fullName: string;
  commonName: string;
  kingdom: RemedyKingdom;
  thermal: ThermalState;
  miasm: MiasmType;
  isPolychrest: boolean;
  shortKeynotes: string;
}

// 1. Existing 20 Polychrest remedies mapped to their exact remote Supabase UUIDs & client-side IDs
const EXISTING_SUPABASE_MAP: Record<string, { id: string; clientKey: string; fullName: string; commonName: string; kingdom: RemedyKingdom; thermal: ThermalState; miasm: MiasmType; polychrest: boolean; keynotes: string }> = {
  'Sulph.': { id: '33333333-0001-0000-0000-000000000001', clientKey: 'rem-sulph', fullName: 'Sulphur', commonName: 'Brimstone / Sublimed Sulphur', kingdom: 'Mineral', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Burning heats, vertex heat, 11 AM hunger, aversion to bathing, ragged philosopher.' },
  'Calc.': { id: '33333333-0002-0000-0000-000000000002', clientKey: 'rem-calc', fullName: 'Calcarea Carbonica', commonName: 'Calcium carbonate / Oyster shell', kingdom: 'Mineral', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Cold damp feet, head sweats sleeping, craving boiled eggs, apprehension of insanity.' },
  'Lyc.': { id: '33333333-0003-0000-0000-000000000003', clientKey: 'rem-lyc', fullName: 'Lycopodium Clavatum', commonName: 'Club Moss spores', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Right-sided complaints, 4-8 PM aggravation, anticipatory anxiety, gas and flatulence.' },
  'Nat-m.': { id: '33333333-0004-0000-0000-000000000004', clientKey: 'rem-nat-m', fullName: 'Natrum Muriaticum', commonName: 'Sodium chloride / Sea salt', kingdom: 'Mineral', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Grief ailments, headache sunrise to sunset, mapped tongue, craving salt, aversion to sympathy.' },
  'Phos.': { id: '33333333-0005-0000-0000-000000000005', clientKey: 'rem-phos', fullName: 'Phosphorus', commonName: 'Phosphorus (Yellow element)', kingdom: 'Mineral', thermal: 'Chilly', miasm: 'Tubercular', polychrest: true, keynotes: 'Sympathetic, fearful in dark and thunderstorms, desires icy cold drinks, bleeding tendency.' },
  'Puls.': { id: '33333333-0006-0000-0000-000000000006', clientKey: 'rem-puls', fullName: 'Pulsatilla Pratensis', commonName: 'Wind flower', kingdom: 'Plant', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Weeping easily, yielding mild disposition, thirstless, ameliorated cool open air, wandering pains.' },
  'Sep.': { id: '33333333-0007-0000-0000-000000000007', clientKey: 'rem-sep', fullName: 'Sepia Officinalis', commonName: 'Cuttlefish inky juice', kingdom: 'Animal', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Indifference to loved ones, pelvic bearing down, worse standing, better vigorous exercise.' },
  'Ars.': { id: '33333333-0008-0000-0000-000000000008', clientKey: 'rem-ars', fullName: 'Arsenicum Album', commonName: 'White arsenic trioxide', kingdom: 'Mineral', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Midnight aggravation (1-2 AM), burning pains relieved by heat, extreme anxiety, fastidious.' },
  'Lach.': { id: '33333333-0009-0000-0000-000000000009', clientKey: 'rem-lach', fullName: 'Lachesis Muta', commonName: 'Bushmaster snake venom', kingdom: 'Animal', thermal: 'Hot', miasm: 'Syphilis', polychrest: true, keynotes: 'Left-sided, worse after sleep, intolerance of constricting collars/neckbands, loquacious.' },
  'Nux-v.': { id: '33333333-0010-0000-0000-000000000010', clientKey: 'rem-nux-v', fullName: 'Nux Vomica', commonName: 'Poison nut', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sedentary, ambitious, hyper-irritable, chilly, ineffectual urging for stool, hangover state.' },
  'Bell.': { id: '33333333-0011-0000-0000-000000000011', clientKey: 'rem-bell', fullName: 'Belladonna', commonName: 'Deadly nightshade', kingdom: 'Plant', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Sudden violent onset, flushed red face, throbbing carotids, dilated pupils, delirium.' },
  'Bry.': { id: '33333333-0012-0000-0000-000000000012', clientKey: 'rem-bry', fullName: 'Bryonia Alba', commonName: 'White bryony', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Worse slightest motion, better absolute rest and hard pressure, dry mucous membranes.' },
  'Acon.': { id: '33333333-0013-0000-0000-000000000013', clientKey: 'rem-acon', fullName: 'Aconitum Napellus', commonName: 'Monkshood', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sudden acute onset from dry cold wind exposure, extreme panic and fear of death, restlessness.' },
  'Rhus-t.': { id: '33333333-0014-0000-0000-000000000014', clientKey: 'rem-rhus-t', fullName: 'Rhus Toxicodendron', commonName: 'Poison ivy', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Restless, stiffness on initial motion, better continuous motion and warmth, red tongue tip.' },
  'Sil.': { id: '33333333-0015-0000-0000-000000000015', clientKey: 'rem-sil', fullName: 'Silicea Terra', commonName: 'Pure flint / Silica', kingdom: 'Mineral', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Yielding yet obstinate, chilly, offensive foot sweat, suppuration tendency, lack of grit.' },
  'Thuj.': { id: '33333333-0016-0000-0000-000000000016', clientKey: 'rem-thuj', fullName: 'Thuja Occidentalis', commonName: 'Arbor vitae', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Hydrogenoid constitution, warts and sycotic excrescences, fixed ideas, split urinary stream.' },
  'Med.': { id: '33333333-0017-0000-0000-000000000017', clientKey: 'rem-med', fullName: 'Medorrhinum', commonName: 'Gonorrheal discharge nosode', kingdom: 'Nosode', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Hurried, time passes too slowly, wild feeling, better by seaside and knee-chest position.' },
  'Syph.': { id: '33333333-0018-0000-0000-000000000018', clientKey: 'rem-syph', fullName: 'Syphilinum', commonName: 'Syphilitic chancre nosode', kingdom: 'Nosode', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Nightly bone pains sunset to sunrise, compulsive hand-washing, linear destructive ulceration.' },
  'Tub.': { id: '33333333-0019-0000-0000-000000000019', clientKey: 'rem-tub', fullName: 'Tuberculinum Bovinum', commonName: 'Tuberculous lymph nosode', kingdom: 'Nosode', thermal: 'Ambithermal', miasm: 'Tubercular', polychrest: true, keynotes: 'Cosmopolitan wanderlust, desire to travel, changing symptoms, frequent colds, night sweats.' },
  'Carb-v.': { id: '33333333-0020-0000-0000-000000000020', clientKey: 'rem-carb-v', fullName: 'Carbo Vegetabilis', commonName: 'Vegetable charcoal', kingdom: 'Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Air hunger, wants to be fanned rapidly from close range, collapse state with icy breath.' }
};

function generateDeterministicUuid(key: string): string {
  const hash = crypto.createHash('sha256').update(key.toLowerCase().trim()).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

export function compileMasterCatalog(): {
  remediesForJson: FinalRemedy[];
  remediesForSql: FinalRemedy[];
  sqlPart1: string;
  sqlPart2: string;
  sqlPart3: string;
  sqlPart4: string;
  sqlRel: string;
} {
  const remedyMap = new Map<string, FinalRemedy>();
  const clientKeyMap = new Map<string, string>();

  // A. Inject existing 20 remedies with their exact Supabase UUIDs
  for (const [abbr, entry] of Object.entries(EXISTING_SUPABASE_MAP)) {
    remedyMap.set(abbr, {
      id: entry.id,
      abbreviation: abbr,
      fullName: entry.fullName,
      commonName: entry.commonName,
      kingdom: entry.kingdom,
      thermal: entry.thermal,
      miasm: entry.miasm,
      isPolychrest: entry.polychrest,
      shortKeynotes: entry.keynotes
    });
    clientKeyMap.set(abbr, entry.clientKey);
  }

  // B. Merge all modular lexicons
  const rawSources: RawRemedy[] = [
    ...getPlantsLexiconA_L(),
    ...getPlantsLexiconM_Z(),
    ...getMineralLexicon(),
    ...getAnimalsAndOthersLexicon(),
    ...getExtendedCatalogLexicon(),
    ...getPharmacopoeiaExpansionLexicon()
  ];

  for (const r of rawSources) {
    if (!remedyMap.has(r.abbreviation)) {
      const uuid = generateDeterministicUuid(r.abbreviation);
      remedyMap.set(r.abbreviation, {
        id: uuid,
        abbreviation: r.abbreviation,
        fullName: r.fullName,
        commonName: r.commonName,
        kingdom: r.kingdom,
        thermal: r.thermal,
        miasm: r.miasm,
        isPolychrest: r.isPolychrest,
        shortKeynotes: r.shortKeynotes
      });
      clientKeyMap.set(r.abbreviation, uuid);
    }
  }

  const sortedRemedies = Array.from(remedyMap.values()).sort((a, b) =>
    a.abbreviation.localeCompare(b.abbreviation, undefined, { sensitivity: 'base' })
  );

  console.log(`[Acquisition] Compiled total unique remedies: ${sortedRemedies.length}`);

  // Create JSON catalog where client keys for the first 20 are preserved (rem-sulph, etc.)
  const remediesForJson: FinalRemedy[] = sortedRemedies.map((r) => ({
    ...r,
    id: clientKeyMap.get(r.abbreviation) || r.id
  }));

  // C. Split remedies into 4 balanced alphabetical chunks for Supabase SQL seeds
  const chunk1: FinalRemedy[] = []; // A - C
  const chunk2: FinalRemedy[] = []; // D - H
  const chunk3: FinalRemedy[] = []; // I - P
  const chunk4: FinalRemedy[] = []; // Q - Z

  for (const rem of sortedRemedies) {
    const firstLetter = rem.abbreviation.charAt(0).toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'C') {
      chunk1.push(rem);
    } else if (firstLetter >= 'D' && firstLetter <= 'H') {
      chunk2.push(rem);
    } else if (firstLetter >= 'I' && firstLetter <= 'P') {
      chunk3.push(rem);
    } else {
      chunk4.push(rem);
    }
  }

  function buildChunkSql(items: FinalRemedy[], partName: string): string {
    const lines = [
      `-- ==============================================================================`,
      `-- SEED REMEDIES CATALOG: ${partName}`,
      `-- Database: PostgreSQL 17 (Supabase) | Total Rows: ${items.length}`,
      `-- ==============================================================================`,
      `INSERT INTO public.remedies (id, abbreviation, full_name, common_name, kingdom, thermal, miasm, is_polychrest, short_keynotes)`,
      `VALUES`
    ];
    const valRows = items.map((r) => {
      const idStr = `'${r.id}'`;
      const abbrStr = `'${escapeSql(r.abbreviation)}'`;
      const fnStr = `'${escapeSql(r.fullName)}'`;
      const cnStr = `'${escapeSql(r.commonName)}'`;
      const kgStr = `'${r.kingdom}'`;
      const thStr = r.thermal ? `'${r.thermal}'` : 'NULL';
      const miStr = r.miasm ? `'${r.miasm}'` : 'NULL';
      const polyStr = r.isPolychrest ? 'true' : 'false';
      const knStr = `'${escapeSql(r.shortKeynotes)}'`;
      return `  (${idStr}, ${abbrStr}, ${fnStr}, ${cnStr}, ${kgStr}, ${thStr}, ${miStr}, ${polyStr}, ${knStr})`;
    });
    lines.push(valRows.join(',\n'));
    lines.push(`ON CONFLICT (abbreviation) DO UPDATE SET`);
    lines.push(`  full_name = EXCLUDED.full_name,`);
    lines.push(`  common_name = EXCLUDED.common_name,`);
    lines.push(`  kingdom = EXCLUDED.kingdom,`);
    lines.push(`  thermal = EXCLUDED.thermal,`);
    lines.push(`  miasm = EXCLUDED.miasm,`);
    lines.push(`  is_polychrest = EXCLUDED.is_polychrest,`);
    lines.push(`  short_keynotes = EXCLUDED.short_keynotes,`);
    lines.push(`  updated_at = NOW();`);
    return lines.join('\n');
  }

  const sqlPart1 = buildChunkSql(chunk1, `Part 1 (A - C: ${chunk1.length} remedies)`);
  const sqlPart2 = buildChunkSql(chunk2, `Part 2 (D - H: ${chunk2.length} remedies)`);
  const sqlPart3 = buildChunkSql(chunk3, `Part 3 (I - P: ${chunk3.length} remedies)`);
  const sqlPart4 = buildChunkSql(chunk4, `Part 4 (Q - Z: ${chunk4.length} remedies)`);

  // D. Generate Relationships SQL
  const relDefs = getRemedyRelationshipsList();
  const validRelRows: string[] = [];

  for (const rel of relDefs) {
    const primary = remedyMap.get(rel.primaryAbbr);
    const related = remedyMap.get(rel.relatedAbbr);
    if (primary && related) {
      const relId = `'${generateDeterministicUuid(`${primary.id}_${related.id}_${rel.type}`)}'`;
      const primId = `'${primary.id}'`;
      const relRemId = `'${related.id}'`;
      const typeStr = `'${rel.type}'`;
      const noteStr = `'${escapeSql(rel.notes)}'`;
      validRelRows.push(`  (${relId}, ${primId}, ${relRemId}, ${typeStr}, ${noteStr})`);
    }
  }

  const sqlRel = [
    `-- ==============================================================================`,
    `-- SEED REMEDY RELATIONSHIPS FULL MATRIX`,
    `-- Database: PostgreSQL 17 (Supabase) | Total Relationships: ${validRelRows.length}`,
    `-- ==============================================================================`,
    `INSERT INTO public.remedy_relationships (id, primary_remedy_id, related_remedy_id, relationship_type, notes)`,
    `VALUES`,
    validRelRows.join(',\n'),
    `ON CONFLICT (primary_remedy_id, related_remedy_id, relationship_type) DO UPDATE SET`,
    `  notes = EXCLUDED.notes,`,
    `  updated_at = NOW();`
  ].join('\n');

  return {
    remediesForJson,
    remediesForSql: sortedRemedies,
    sqlPart1,
    sqlPart2,
    sqlPart3,
    sqlPart4,
    sqlRel
  };
}

// Execution Entrypoint
async function run() {
  const result = compileMasterCatalog();

  // 1. Output src/core/storage/data/remediesCatalog.json
  const jsonPath = path.resolve(process.cwd(), 'src/core/storage/data/remediesCatalog.json');
  fs.writeFileSync(jsonPath, JSON.stringify(result.remediesForJson, null, 2), 'utf-8');
  console.log(`[Acquisition] Saved JSON catalog to: ${jsonPath} (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);

  // 2. Output chunked SQL files
  const seedsDir = path.resolve(process.cwd(), 'supabase/seeds/remedies');
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(seedsDir, 'seed_remedies_part_1.sql'), result.sqlPart1, 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'seed_remedies_part_2.sql'), result.sqlPart2, 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'seed_remedies_part_3.sql'), result.sqlPart3, 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'seed_remedies_part_4.sql'), result.sqlPart4, 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'seed_remedy_relationships_full.sql'), result.sqlRel, 'utf-8');

  console.log(`[Acquisition] Saved 4 remedy SQL seed chunks + full relationships SQL to: ${seedsDir}`);
}

// Run if directly executed
if (process.argv[1]?.endsWith('harvestRemedies.ts')) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
