import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { REPERTORIES_43_CATALOG, type RawRepertoryItem } from './lexiconRepertories43';
import { CHAPTERS_37_CATALOG, type RawChapterItem } from './lexiconChaptersClassical';
import { getCompleteHierarchicalRubricsList } from './lexiconRubricsHierarchical';
import type { Remedy, Chapter, Rubric, RubricRemedyEntry } from '../../src/features/repertory/types';

export interface FinalRepertoryItem extends RawRepertoryItem {
  dbId: string;
}

export interface FinalChapterItem extends RawChapterItem {
  dbId: string;
  repertoryId: string;
  repertoryDbId: string;
}

export interface FinalRubricItem extends Rubric {
  dbId: string;
  repertoryCode: string;
  repertoryDbId: string;
  chapterDbId: string;
}

const KNOWN_REPERTORY_UUIDS: Record<string, string> = {
  KENT_CORE: '11111111-1111-1111-1111-111111111111',
};

const KNOWN_CHAPTER_UUIDS: Record<string, string> = {
  'chap-mind': '22222222-1111-0001-0000-000000000001',
  'chap-vertigo': '22222222-1111-0002-0000-000000000002',
  'chap-head': '22222222-1111-0003-0000-000000000003',
  'chap-eye': '22222222-1111-0004-0000-000000000004',
  'chap-stomach': '22222222-1111-0005-0000-000000000005',
  'chap-abdomen': '22222222-1111-0006-0000-000000000006',
  'chap-respiration': '22222222-1111-0007-0000-000000000007',
  'chap-generalities': '22222222-1111-0008-0000-000000000008',
};

function generateDeterministicUuid(key: string): string {
  const hash = crypto.createHash('sha256').update(key.toLowerCase().trim()).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function escapeSqlArray(arr?: string[]): string {
  if (!arr || arr.length === 0) return "'{}'::text[]";
  const items = arr.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(',');
  return `'${escapeSql(`{${items}}`)}'::text[]`;
}

export function harvestRepertoryCorpus(): {
  repertoriesJson: RawRepertoryItem[];
  chaptersJson: Chapter[];
  rubricsJson: Rubric[];
  repertoriesSql: string;
  chaptersSql: string;
  rubricsSql: string;
} {
  // 1. Process 43+ Repertories
  const repertoriesMap = new Map<string, FinalRepertoryItem>();
  const repertoriesJson: RawRepertoryItem[] = [];

  for (const item of REPERTORIES_43_CATALOG) {
    const dbId = KNOWN_REPERTORY_UUIDS[item.code] || generateDeterministicUuid(`rep-${item.code}`);
    const finalRep: FinalRepertoryItem = {
      ...item,
      dbId,
    };
    repertoriesMap.set(item.code, finalRep);
    repertoriesJson.push(item);
  }

  // 2. Process 37 Classical Chapters
  const defaultRep = repertoriesMap.get('KENT_CORE')!;
  const chaptersMap = new Map<string, FinalChapterItem>();
  const chaptersJson: Chapter[] = [];

  for (const ch of CHAPTERS_37_CATALOG) {
    const dbId = KNOWN_CHAPTER_UUIDS[ch.id] || generateDeterministicUuid(`chap-${ch.id}`);
    const finalChap: FinalChapterItem = {
      ...ch,
      dbId,
      repertoryId: defaultRep.id,
      repertoryDbId: defaultRep.dbId,
    };
    chaptersMap.set(ch.id, finalChap);
    chaptersJson.push({
      id: ch.id,
      name: ch.name,
      displayOrder: ch.displayOrder,
      icon: ch.icon,
    });
  }

  // 3. Load Remedy Catalog for Foreign Key Validation & ID resolution
  const remediesCatalogPath = path.resolve(process.cwd(), 'src/core/storage/data/remediesCatalog.json');
  const rawRemedies = JSON.parse(fs.readFileSync(remediesCatalogPath, 'utf8')) as Remedy[];
  const remedyMapByAbbr = new Map<string, Remedy>();
  for (const r of rawRemedies) {
    remedyMapByAbbr.set(r.abbreviation.toLowerCase(), r);
  }

  // 4. Process Hierarchical Rubrics
  const rawRubrics = getCompleteHierarchicalRubricsList();
  const rubricsJson: Rubric[] = [];
  const finalRubrics: FinalRubricItem[] = [];

  for (const node of rawRubrics) {
    const rep = repertoriesMap.get(node.repertoryCode) || defaultRep;
    const chap = chaptersMap.get(node.chapterId);
    const chapterName = chap ? chap.name : node.chapterName;
    const chapterDbId = chap ? chap.dbId : generateDeterministicUuid(`chap-${node.chapterId}`);

    const entries: RubricRemedyEntry[] = [];
    for (const entry of node.entries) {
      const match = remedyMapByAbbr.get(entry.abbreviation.toLowerCase());
      if (match) {
        entries.push({
          remedyId: match.id,
          abbreviation: match.abbreviation,
          grade: entry.grade,
        });
      } else {
        // Fallback deterministic client ID if remedy not directly indexed
        entries.push({
          remedyId: `rem-${entry.abbreviation.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          abbreviation: entry.abbreviation,
          grade: entry.grade,
        });
      }
    }

    const dbId = generateDeterministicUuid(`rubric-${node.id}`);
    const rubricObj: FinalRubricItem = {
      id: node.id,
      dbId,
      repertoryCode: rep.code,
      repertoryDbId: rep.dbId,
      chapterId: node.chapterId,
      chapterDbId,
      chapterName,
      parentId: node.parentId || null,
      path: node.path,
      fullPath: node.fullPath,
      depth: node.depth,
      remedyCount: entries.length,
      crossReferences: node.crossReferences || [],
      entries,
    };

    finalRubrics.push(rubricObj);
    rubricsJson.push({
      id: rubricObj.id,
      chapterId: rubricObj.chapterId,
      chapterName: rubricObj.chapterName,
      parentId: rubricObj.parentId,
      path: rubricObj.path,
      fullPath: rubricObj.fullPath,
      depth: rubricObj.depth,
      remedyCount: rubricObj.remedyCount,
      crossReferences: rubricObj.crossReferences,
      entries: rubricObj.entries,
    });
  }

  // Update rubricCount on chapters
  for (const c of chaptersJson) {
    c.rubricCount = rubricsJson.filter((r) => r.chapterId === c.id).length;
  }

  // 5. Build SQL Seeding Scripts
  // 5a. Repertories SQL
  const repSqlLines: string[] = [
    '-- ==============================================================================',
    '-- HOZONE CLINICAL DATABASE: 43+ REPERTORIES CATALOG SEED',
    '-- Database: PostgreSQL 17 (Supabase)',
    '-- ==============================================================================',
    '',
    'INSERT INTO public.repertories (id, code, title, author, edition_year, description, is_default)',
    'VALUES',
  ];

  const repValues = Array.from(repertoriesMap.values()).map(
    (r) =>
      `  ('${r.dbId}', '${escapeSql(r.code)}', '${escapeSql(r.title)}', '${escapeSql(r.author)}', ${r.editionYear}, '${escapeSql(r.description)}', ${r.isDefault ? 'true' : 'false'})`
  );

  repSqlLines.push(repValues.join(',\n'));
  repSqlLines.push('ON CONFLICT (code) DO UPDATE SET');
  repSqlLines.push('  title = EXCLUDED.title,');
  repSqlLines.push('  author = EXCLUDED.author,');
  repSqlLines.push('  edition_year = EXCLUDED.edition_year,');
  repSqlLines.push('  description = EXCLUDED.description,');
  repSqlLines.push('  is_default = EXCLUDED.is_default,');
  repSqlLines.push('  updated_at = NOW();\n');

  // 5b. Chapters SQL
  const chapSqlLines: string[] = [
    '-- ==============================================================================',
    '-- HOZONE CLINICAL DATABASE: 37 CLASSICAL CHAPTERS SEED',
    '-- Database: PostgreSQL 17 (Supabase)',
    '-- ==============================================================================',
    '',
    'INSERT INTO public.chapters (id, repertory_id, name, display_order, icon)',
    'VALUES',
  ];

  const chapValues = Array.from(chaptersMap.values()).map(
    (c) =>
      `  ('${c.dbId}', '${c.repertoryDbId}', '${escapeSql(c.name)}', ${c.displayOrder}, '${escapeSql(c.icon)}')`
  );

  chapSqlLines.push(chapValues.join(',\n'));
  chapSqlLines.push('ON CONFLICT (id) DO UPDATE SET');
  chapSqlLines.push('  name = EXCLUDED.name,');
  chapSqlLines.push('  display_order = EXCLUDED.display_order,');
  chapSqlLines.push('  icon = EXCLUDED.icon,');
  chapSqlLines.push('  updated_at = NOW();\n');

  // 5c. Rubrics & Rubric_Remedies SQL
  const rubricSqlLines: string[] = [
    '-- ==============================================================================',
    '-- HOZONE CLINICAL DATABASE: HIERARCHICAL CLINICAL RUBRICS SEED',
    '-- Database: PostgreSQL 17 (Supabase)',
    '-- ==============================================================================',
    '',
    'INSERT INTO public.rubrics (id, repertory_id, chapter_id, parent_id, path, full_path, depth, remedy_count, cross_references)',
    'VALUES',
  ];

  const rubricValues = finalRubrics.map((r) => {
    const parentDbId = r.parentId
      ? finalRubrics.find((item) => item.id === r.parentId)?.dbId || 'NULL'
      : 'NULL';
    const parentSql = parentDbId === 'NULL' ? 'NULL' : `'${parentDbId}'`;
    return `  ('${r.dbId}', '${r.repertoryDbId}', '${r.chapterDbId}', ${parentSql}, '${escapeSql(r.path)}', '${escapeSql(r.fullPath)}', ${r.depth}, ${r.remedyCount}, ${escapeSqlArray(r.crossReferences)})`;
  });

  rubricSqlLines.push(rubricValues.join(',\n'));
  rubricSqlLines.push('ON CONFLICT (id) DO UPDATE SET');
  rubricSqlLines.push('  path = EXCLUDED.path,');
  rubricSqlLines.push('  full_path = EXCLUDED.full_path,');
  rubricSqlLines.push('  depth = EXCLUDED.depth,');
  rubricSqlLines.push('  remedy_count = EXCLUDED.remedy_count,');
  rubricSqlLines.push('  cross_references = EXCLUDED.cross_references,');
  rubricSqlLines.push('  updated_at = NOW();\n');

  return {
    repertoriesJson,
    chaptersJson,
    rubricsJson,
    repertoriesSql: repSqlLines.join('\n'),
    chaptersSql: chapSqlLines.join('\n'),
    rubricsSql: rubricSqlLines.join('\n'),
  };
}

async function run() {
  console.log('⚡ Starting Phase C Repertory Corpus Harvesting...');
  const {
    repertoriesJson,
    chaptersJson,
    rubricsJson,
    repertoriesSql,
    chaptersSql,
    rubricsSql,
  } = harvestRepertoryCorpus();

  // Paths
  const dataDir = path.resolve(process.cwd(), 'src/core/storage/data');
  const seedsDir = path.resolve(process.cwd(), 'supabase/seeds/repertory');

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(seedsDir)) fs.mkdirSync(seedsDir, { recursive: true });

  // Write JSON catalogs
  fs.writeFileSync(path.join(dataDir, 'repertoriesCatalog.json'), JSON.stringify(repertoriesJson, null, 2), 'utf8');
  fs.writeFileSync(path.join(dataDir, 'chaptersCatalog.json'), JSON.stringify(chaptersJson, null, 2), 'utf8');
  fs.writeFileSync(path.join(dataDir, 'rubricsCatalog.json'), JSON.stringify(rubricsJson, null, 2), 'utf8');

  // Write SQL seed files
  fs.writeFileSync(path.join(seedsDir, 'seed_repertories_43_catalog.sql'), repertoriesSql, 'utf8');
  fs.writeFileSync(path.join(seedsDir, 'seed_chapters_37_catalog.sql'), chaptersSql, 'utf8');
  fs.writeFileSync(path.join(seedsDir, 'seed_rubrics_hierarchical.sql'), rubricsSql, 'utf8');

  console.log(`✅ Harvested ${repertoriesJson.length} authoritative repertories.`);
  console.log(`✅ Harvested ${chaptersJson.length} classical chapters.`);
  console.log(`✅ Harvested ${rubricsJson.length} hierarchical rubrics.`);
  console.log('🎉 Phase C data artifacts emitted successfully.');
}

if (process.argv[1]?.includes('harvestRepertories')) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

