import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getCompleteBooksCatalog } from './lexiconBooks130';
import { getExtendedMonographsList } from './lexiconMonographsExtended';
import type { MateriaMedicaBook, RemedyMonograph } from '../../src/features/materia-medica/types';
import type { Remedy } from '../../src/features/repertory/types';

interface FinalBook extends MateriaMedicaBook {
  dbId: string;
}

const EXISTING_SUPABASE_BOOKS: Record<string, { id: string; clientKey: string }> = {
  BOERICKE_MM: { id: '44444444-0001-0000-0000-000000000001', clientKey: 'book-boericke' },
  KENT_LECTURES: { id: '44444444-0002-0000-0000-000000000002', clientKey: 'book-kent' },
  ALLEN_KEYNOTES: { id: '44444444-0003-0000-0000-000000000003', clientKey: 'book-allen' },
  CLARKE_DICT: { id: '44444444-0004-0000-0000-000000000004', clientKey: 'book-clarke' },
};

const POLYCHREST_DB_IDS: Record<string, string> = {
  'Sulph.': '33333333-0001-0000-0000-000000000001',
  'Calc.': '33333333-0002-0000-0000-000000000002',
  'Lyc.': '33333333-0003-0000-0000-000000000003',
  'Nat-m.': '33333333-0004-0000-0000-000000000004',
  'Phos.': '33333333-0005-0000-0000-000000000005',
  'Puls.': '33333333-0006-0000-0000-000000000006',
  'Sep.': '33333333-0007-0000-0000-000000000007',
  'Ars.': '33333333-0008-0000-0000-000000000008',
  'Lach.': '33333333-0009-0000-0000-000000000009',
  'Nux-v.': '33333333-0010-0000-0000-000000000010',
  'Bell.': '33333333-0011-0000-0000-000000000011',
  'Bry.': '33333333-0012-0000-0000-000000000012',
  'Acon.': '33333333-0013-0000-0000-000000000013',
  'Rhus-t.': '33333333-0014-0000-0000-000000000014',
  'Sil.': '33333333-0015-0000-0000-000000000015',
  'Thuj.': '33333333-0016-0000-0000-000000000016',
  'Med.': '33333333-0017-0000-0000-000000000017',
  'Syph.': '33333333-0018-0000-0000-000000000018',
  'Tub.': '33333333-0019-0000-0000-000000000019',
  'Carb-v.': '33333333-0020-0000-0000-000000000020',
};

function generateDeterministicUuid(key: string): string {
  const hash = crypto.createHash('sha256').update(key.toLowerCase().trim()).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function escapeSqlArray(arr: string[]): string {
  if (!arr || arr.length === 0) return "'{}'::text[]";
  const items = arr.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(',');
  return `'${escapeSql(`{${items}}`)}'::text[]`;
}

export function harvestMateriaMedicaCorpus(): {
  booksJson: MateriaMedicaBook[];
  monographsJson: RemedyMonograph[];
  booksSql: string;
  monographsSql: string;
} {
  // 1. Compile 132 Books
  const rawBooks = getCompleteBooksCatalog();
  const bookMapByCode = new Map<string, FinalBook>();
  const booksJson: MateriaMedicaBook[] = [];

  for (const rb of rawBooks) {
    const existing = EXISTING_SUPABASE_BOOKS[rb.code];
    const dbId = existing ? existing.id : generateDeterministicUuid(`book-${rb.code}`);
    const clientKey = existing ? existing.clientKey : `book-${rb.code.toLowerCase().replace(/_/g, '-')}`;

    const bookObj: FinalBook = {
      id: clientKey,
      dbId,
      code: rb.code,
      title: rb.title,
      author: rb.author,
      editionYear: rb.editionYear,
      category: rb.category,
      description: rb.description,
    };

    bookMapByCode.set(rb.code, bookObj);
    booksJson.push({
      id: bookObj.id,
      code: bookObj.code,
      title: bookObj.title,
      author: bookObj.author,
      editionYear: bookObj.editionYear,
      category: bookObj.category,
      description: bookObj.description,
    });
  }

  // 2. Load Remedy Catalog for Foreign Key Resolution
  const remediesCatalogPath = path.resolve(process.cwd(), 'src/core/storage/data/remediesCatalog.json');
  const rawRemedies = JSON.parse(fs.readFileSync(remediesCatalogPath, 'utf8')) as Remedy[];
  const remedyMapByAbbr = new Map<string, Remedy>();
  for (const rem of rawRemedies) {
    remedyMapByAbbr.set(rem.abbreviation, rem);
  }

  // 3. Compile Multi-Author Monographs
  const rawMonographs = getExtendedMonographsList();
  const monographsJson: RemedyMonograph[] = [];
  const monographsSqlRows: string[] = [];

  for (const rm of rawMonographs) {
    const remedy = remedyMapByAbbr.get(rm.remedyAbbr);
    const book = bookMapByCode.get(rm.bookCode);

    if (!remedy || !book) {
      console.warn(`[HarvestMM] Skipping monograph: missing remedy (${rm.remedyAbbr}) or book (${rm.bookCode})`);
      continue;
    }

    const remedyDbId = POLYCHREST_DB_IDS[remedy.abbreviation] || remedy.id;
    const monographId = `mono-${book.id}-${remedy.abbreviation.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const monographUuid = generateDeterministicUuid(`${remedyDbId}-${book.dbId}`);

    monographsJson.push({
      id: monographId,
      remedyId: remedy.id, // client ID
      abbreviation: remedy.abbreviation,
      fullName: remedy.fullName,
      bookId: book.id, // client ID
      bookTitle: book.title,
      mind: rm.mind,
      physicalGenerals: rm.physicalGenerals,
      keynotes: rm.keynotes,
      modalitiesAgg: rm.modalitiesAgg,
      modalitiesAmel: rm.modalitiesAmel,
      organAffinities: rm.organAffinities,
      clinicalIndications: rm.clinicalIndications || [],
      comparisons: rm.comparisons || '',
    });

    const sqlRow = `(
      '${monographUuid}',
      '${remedyDbId}',
      '${book.dbId}',
      '${escapeSql(rm.mind)}',
      '${escapeSql(rm.physicalGenerals)}',
      '${escapeSql(rm.keynotes)}',
      ${escapeSqlArray(rm.modalitiesAgg)},
      ${escapeSqlArray(rm.modalitiesAmel)},
      ${escapeSqlArray(rm.organAffinities)},
      ${escapeSqlArray(rm.clinicalIndications || [])},
      '${escapeSql(rm.comparisons || '')}'
    )`;
    monographsSqlRows.push(sqlRow);
  }

  // 4. Build Books SQL
  const booksSqlRows = Array.from(bookMapByCode.values()).map(
    (b) => `(
      '${b.dbId}',
      '${escapeSql(b.code)}',
      '${escapeSql(b.title)}',
      '${escapeSql(b.author)}',
      ${b.editionYear},
      '${escapeSql(b.description)}',
      '${escapeSql(b.category || '')}'
    )`
  );

  const booksSql = `-- Hozone Clinical Intelligence — 132-Volume Materia Medica Library Catalog Seed
INSERT INTO public.books (id, code, title, author, edition_year, description, category)
VALUES
${booksSqlRows.join(',\n')}
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  edition_year = EXCLUDED.edition_year,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();
`;

  // 5. Build Monographs SQL
  const monographsSql = `-- Hozone Clinical Intelligence — Multi-Author Remedy Monographs Seed
INSERT INTO public.remedy_monographs (
  id, remedy_id, book_id, mind, physical_generals, keynotes,
  modalities_agg, modalities_amel, organ_affinities, clinical_indications, comparisons
)
VALUES
${monographsSqlRows.join(',\n')}
ON CONFLICT (remedy_id, book_id) DO UPDATE SET
  mind = EXCLUDED.mind,
  physical_generals = EXCLUDED.physical_generals,
  keynotes = EXCLUDED.keynotes,
  modalities_agg = EXCLUDED.modalities_agg,
  modalities_amel = EXCLUDED.modalities_amel,
  organ_affinities = EXCLUDED.organ_affinities,
  clinical_indications = EXCLUDED.clinical_indications,
  comparisons = EXCLUDED.comparisons,
  updated_at = NOW();
`;

  return {
    booksJson,
    monographsJson,
    booksSql,
    monographsSql,
  };
}

// Execution block when invoked directly
async function run() {
  const { booksJson, monographsJson, booksSql, monographsSql } = harvestMateriaMedicaCorpus();

  // Paths
  const booksJsonPath = path.resolve(process.cwd(), 'src/core/storage/data/materiaMedicaBooksCatalog.json');
  const monographsJsonPath = path.resolve(process.cwd(), 'src/core/storage/data/remedyMonographsCatalog.json');
  const seedsDir = path.resolve(process.cwd(), 'supabase/seeds/materia-medica');
  const booksSqlPath = path.join(seedsDir, 'seed_books_130_catalog.sql');
  const monographsSqlPath = path.join(seedsDir, 'seed_monographs_full.sql');

  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  fs.writeFileSync(booksJsonPath, JSON.stringify(booksJson, null, 2), 'utf8');
  fs.writeFileSync(monographsJsonPath, JSON.stringify(monographsJson, null, 2), 'utf8');
  fs.writeFileSync(booksSqlPath, booksSql, 'utf8');
  fs.writeFileSync(monographsSqlPath, monographsSql, 'utf8');

  console.log(`[HarvestMM] Successfully generated:`);
  console.log(`  - 132 Books in JSON: ${booksJsonPath} (${booksJson.length} entries)`);
  console.log(`  - Extended Monographs in JSON: ${monographsJsonPath} (${monographsJson.length} entries)`);
  console.log(`  - Books SQL Seed: ${booksSqlPath}`);
  console.log(`  - Monographs SQL Seed: ${monographsSqlPath}`);
}

if (process.argv[1]?.includes('harvestMateriaMedica')) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
