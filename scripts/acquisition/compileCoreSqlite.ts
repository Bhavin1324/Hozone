import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

import type { Remedy, Chapter, Rubric, RepertoryCatalogItem } from '../../src/features/repertory/types';
import type { MateriaMedicaBook, RemedyMonograph, RemedyRelationship } from '../../src/features/materia-medica/types';
import { INITIAL_MONOGRAPHS, INITIAL_RELATIONSHIPS } from '../../src/core/storage/materiaMedicaData';
import { EXTENDED_MONOGRAPHS, EXTENDED_RELATIONSHIPS } from '../../src/core/storage/materiaMedicaExtendedData';
import { INITIAL_POLAR_PAIRS } from '../../src/core/storage/polarityData';
import { harvestKentAndBoericke } from './harvestKentAndBoericke';

export async function buildCoreSqliteDatabase(): Promise<{
  dbPath: string;
  gzPath: string;
  manifestPath: string;
  stats: Record<string, number>;
}> {
  const rootDir = process.cwd();
  const outputDir = path.resolve(rootDir, 'public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const dbPath = path.resolve(outputDir, 'hozone_core_v1.db');
  const gzPath = path.resolve(outputDir, 'hozone_core_v1.db.gz');
  const manifestPath = path.resolve(outputDir, 'manifest.json');

  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  if (fs.existsSync(gzPath)) fs.unlinkSync(gzPath);

  console.log(`[CompileSqlite] Initializing SQLite file at: ${dbPath}`);
  const db = new DatabaseSync(dbPath);

  // Performance Pragmas
  db.exec('PRAGMA page_size = 4096;');
  db.exec('PRAGMA synchronous = OFF;');
  db.exec('PRAGMA journal_mode = MEMORY;');

  // 1. Schema Definitions
  db.exec(`
    CREATE TABLE remedies (
      id TEXT PRIMARY KEY,
      abbreviation TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      common_name TEXT,
      kingdom TEXT,
      thermal TEXT,
      miasm TEXT,
      is_polychrest INTEGER DEFAULT 0,
      short_keynotes TEXT
    );
    CREATE INDEX idx_remedies_abbr ON remedies(abbreviation);
    CREATE INDEX idx_remedies_kingdom ON remedies(kingdom);
    CREATE INDEX idx_remedies_thermal ON remedies(thermal);
    CREATE INDEX idx_remedies_miasm ON remedies(miasm);

    CREATE TABLE repertories (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      edition_year INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      is_default INTEGER DEFAULT 0
    );
    CREATE INDEX idx_repertories_code ON repertories(code);
    CREATE INDEX idx_repertories_category ON repertories(category);

    CREATE TABLE chapters (
      id TEXT PRIMARY KEY,
      repertory_id TEXT,
      name TEXT NOT NULL,
      display_order INTEGER NOT NULL,
      icon TEXT,
      rubric_count INTEGER DEFAULT 0
    );
    CREATE INDEX idx_chapters_rep ON chapters(repertory_id);
    CREATE INDEX idx_chapters_order ON chapters(display_order);

    CREATE TABLE rubrics (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      repertory_id TEXT,
      parent_id TEXT,
      path TEXT NOT NULL,
      full_path TEXT NOT NULL,
      depth INTEGER NOT NULL DEFAULT 0,
      remedy_count INTEGER NOT NULL DEFAULT 0,
      cross_references TEXT
    );
    CREATE INDEX idx_rubrics_chap ON rubrics(chapter_id);
    CREATE INDEX idx_rubrics_parent ON rubrics(parent_id);
    CREATE INDEX idx_rubrics_depth ON rubrics(depth);
    CREATE INDEX idx_rubrics_path ON rubrics(path);

    CREATE TABLE rubric_entries (
      rubric_id TEXT NOT NULL,
      remedy_id TEXT NOT NULL,
      grade INTEGER NOT NULL,
      PRIMARY KEY (rubric_id, remedy_id)
    );
    CREATE INDEX idx_entries_rubric ON rubric_entries(rubric_id);
    CREATE INDEX idx_entries_remedy ON rubric_entries(remedy_id);
    CREATE INDEX idx_entries_grade ON rubric_entries(remedy_id, grade);

    CREATE TABLE books (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      edition_year INTEGER NOT NULL,
      category TEXT,
      description TEXT
    );
    CREATE INDEX idx_books_code ON books(code);
    CREATE INDEX idx_books_category ON books(category);

    CREATE TABLE monographs (
      id TEXT PRIMARY KEY,
      remedy_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      full_name TEXT NOT NULL,
      book_title TEXT NOT NULL,
      mind TEXT,
      physical_generals TEXT,
      keynotes TEXT,
      modalities_agg TEXT,
      modalities_amel TEXT,
      organ_affinities TEXT,
      clinical_indications TEXT,
      comparisons TEXT
    );
    CREATE INDEX idx_monographs_rem ON monographs(remedy_id);
    CREATE INDEX idx_monographs_book ON monographs(book_id);
    CREATE INDEX idx_monographs_rem_book ON monographs(remedy_id, book_id);

    CREATE TABLE relationships (
      id TEXT PRIMARY KEY,
      primary_remedy_id TEXT NOT NULL,
      related_remedy_id TEXT NOT NULL,
      related_abbr TEXT,
      related_full_name TEXT,
      type TEXT NOT NULL,
      notes TEXT
    );
    CREATE INDEX idx_rel_primary ON relationships(primary_remedy_id);
    CREATE INDEX idx_rel_related ON relationships(related_remedy_id);

    CREATE TABLE polar_pairs (
      id TEXT PRIMARY KEY,
      polar_code TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      positive_label TEXT NOT NULL,
      opposite_label TEXT NOT NULL,
      positive_rubric_path TEXT NOT NULL,
      opposite_rubric_path TEXT NOT NULL,
      positive_rubric_id TEXT,
      opposite_rubric_id TEXT
    );
    CREATE INDEX idx_polar_code ON polar_pairs(polar_code);

    CREATE VIRTUAL TABLE rubrics_fts USING fts5(
      id UNINDEXED,
      full_path,
      path
    );

    CREATE VIRTUAL TABLE monographs_fts USING fts5(
      id UNINDEXED,
      remedy_id UNINDEXED,
      abbreviation,
      full_name,
      mind,
      physical_generals,
      keynotes
    );
  `);

  // 2. Ingest Remedies
  const remediesPath = path.resolve(rootDir, 'src/core/storage/data/remediesCatalog.json');
  const remedies = JSON.parse(fs.readFileSync(remediesPath, 'utf8')) as Remedy[];
  const insertRemedy = db.prepare(`
    INSERT INTO remedies (id, abbreviation, full_name, common_name, kingdom, thermal, miasm, is_polychrest, short_keynotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const r of remedies) {
    insertRemedy.run(
      r.id,
      r.abbreviation,
      r.fullName,
      r.commonName || '',
      r.kingdom,
      r.thermal,
      r.miasm,
      r.isPolychrest ? 1 : 0,
      r.shortKeynotes || ''
    );
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${remedies.length} remedies.`);

  // 3. Ingest Repertories
  const repsPath = path.resolve(rootDir, 'src/core/storage/data/repertoriesCatalog.json');
  const reps = JSON.parse(fs.readFileSync(repsPath, 'utf8')) as RepertoryCatalogItem[];
  const insertRep = db.prepare(`
    INSERT INTO repertories (id, code, title, author, edition_year, category, description, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const rep of reps) {
    insertRep.run(
      rep.id,
      rep.code,
      rep.title,
      rep.author,
      rep.editionYear,
      rep.category,
      rep.description || '',
      rep.isDefault ? 1 : 0
    );
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${reps.length} repertories.`);

  // 4. Ingest Chapters
  const chapsPath = path.resolve(rootDir, 'src/core/storage/data/chaptersCatalog.json');
  const chaps = JSON.parse(fs.readFileSync(chapsPath, 'utf8')) as Chapter[];
  const insertChap = db.prepare(`
    INSERT INTO chapters (id, repertory_id, name, display_order, icon, rubric_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const ch of chaps) {
    insertChap.run(
      ch.id,
      ch.repertoryId || 'rep-kent',
      ch.name,
      ch.displayOrder,
      ch.icon || 'BookOpen',
      ch.rubricCount || 0
    );
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${chaps.length} chapters.`);

  // 5. Ingest Rubrics & Rubric Entries
  const rubricsPath = path.resolve(rootDir, 'src/core/storage/data/rubricsCatalog.json');
  const rubrics = JSON.parse(fs.readFileSync(rubricsPath, 'utf8')) as Rubric[];
  const insertRubric = db.prepare(`
    INSERT INTO rubrics (id, chapter_id, repertory_id, parent_id, path, full_path, depth, remedy_count, cross_references)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertFts = db.prepare(`
    INSERT INTO rubrics_fts (id, full_path, path) VALUES (?, ?, ?)
  `);
  const insertEntry = db.prepare(`
    INSERT OR REPLACE INTO rubric_entries (rubric_id, remedy_id, grade) VALUES (?, ?, ?)
  `);

  db.exec('BEGIN TRANSACTION;');
  for (const rub of rubrics) {
    insertRubric.run(
      rub.id,
      rub.chapterId,
      rub.repertoryId || 'rep-kent',
      rub.parentId || null,
      rub.path,
      rub.fullPath,
      rub.depth,
      rub.remedyCount,
      rub.crossReferences ? JSON.stringify(rub.crossReferences) : null
    );
    insertFts.run(rub.id, rub.fullPath, rub.path);

    if (rub.entries && rub.entries.length > 0) {
      for (const e of rub.entries) {
        insertEntry.run(rub.id, e.remedyId, e.grade);
      }
    }
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${rubrics.length} initial rubrics.`);

  console.log('[CompileSqlite] Harvesting full Classical Kent Repertory and Boericke monographs from OOREP...');
  await harvestKentAndBoericke(db);

  // 6. Ingest Reference Books
  const booksPath = path.resolve(rootDir, 'src/core/storage/data/materiaMedicaBooksCatalog.json');
  const books = JSON.parse(fs.readFileSync(booksPath, 'utf8')) as MateriaMedicaBook[];
  const insertBook = db.prepare(`
    INSERT INTO books (id, code, title, author, edition_year, category, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const b of books) {
    insertBook.run(b.id, b.code, b.title, b.author, b.editionYear, b.category || '', b.description || '');
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${books.length} reference books.`);

  // 7. Ingest Monographs (Catalog + Initial + Extended)
  const monoCatalogPath = path.resolve(rootDir, 'src/core/storage/data/remedyMonographsCatalog.json');
  const monoCatalog = JSON.parse(fs.readFileSync(monoCatalogPath, 'utf8')) as RemedyMonograph[];
  const allMonographs = [...INITIAL_MONOGRAPHS, ...EXTENDED_MONOGRAPHS, ...monoCatalog];

  const monoMap = new Map<string, RemedyMonograph>();
  for (const m of allMonographs) {
    monoMap.set(m.id, m);
  }

  const insertMono = db.prepare(`
    INSERT OR REPLACE INTO monographs (id, remedy_id, book_id, abbreviation, full_name, book_title, mind, physical_generals, keynotes, modalities_agg, modalities_amel, organ_affinities, clinical_indications, comparisons)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMonoFts = db.prepare(`
    INSERT OR REPLACE INTO monographs_fts (id, remedy_id, abbreviation, full_name, mind, physical_generals, keynotes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec('BEGIN TRANSACTION;');
  for (const m of monoMap.values()) {
    const monoId = `mono-${m.bookId}-${m.remedyId}`;
    insertMono.run(
      monoId,
      m.remedyId,
      m.bookId,
      m.abbreviation,
      m.fullName,
      m.bookTitle,
      m.mind || '',
      m.physicalGenerals || '',
      m.keynotes || '',
      Array.isArray(m.modalitiesAgg) ? m.modalitiesAgg.join('; ') : m.modalitiesAgg || '',
      Array.isArray(m.modalitiesAmel) ? m.modalitiesAmel.join('; ') : m.modalitiesAmel || '',
      Array.isArray(m.organAffinities) ? m.organAffinities.join('; ') : m.organAffinities || '',
      Array.isArray(m.clinicalIndications) ? m.clinicalIndications.join('; ') : m.clinicalIndications || '',
      m.comparisons || ''
    );
    insertMonoFts.run(m.id, m.remedyId, m.abbreviation, m.fullName, m.mind || '', m.physicalGenerals || '', m.keynotes || '');
  }
  db.exec('COMMIT;');
  console.log(`[CompileSqlite] Ingested ${monoMap.size} monographs.`);

  // 8. Ingest Relationships & Polar Pairs
  const allRels = [...INITIAL_RELATIONSHIPS, ...EXTENDED_RELATIONSHIPS];
  const relMap = new Map<string, RemedyRelationship>();
  for (const r of allRels) relMap.set(r.id, r);

  const insertRel = db.prepare(`
    INSERT INTO relationships (id, primary_remedy_id, related_remedy_id, related_abbr, related_full_name, type, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const r of relMap.values()) {
    insertRel.run(r.id, r.primaryRemedyId, r.relatedRemedyId, r.relatedAbbr || '', r.relatedFullName || '', r.type, r.notes || '');
  }
  db.exec('COMMIT;');

  const insertPolar = db.prepare(`
    INSERT INTO polar_pairs (id, polar_code, name, category, positive_label, opposite_label, positive_rubric_path, opposite_rubric_path, positive_rubric_id, opposite_rubric_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  db.exec('BEGIN TRANSACTION;');
  for (const pp of INITIAL_POLAR_PAIRS) {
    insertPolar.run(
      pp.id,
      pp.polarCode,
      pp.name,
      pp.category,
      pp.positiveLabel,
      pp.oppositeLabel,
      pp.positiveRubricPath,
      pp.oppositeRubricPath,
      pp.positiveRubricId || null,
      pp.oppositeRubricId || null
    );
  }
  db.exec('COMMIT;');

  // Update dynamic rubric count per chapter from actual ingested rubrics
  db.exec(`
    UPDATE chapters SET rubric_count = (
      SELECT COUNT(*) FROM rubrics WHERE rubrics.chapter_id = chapters.id
    );
  `);
  console.log('[CompileSqlite] Updated dynamic rubric counts on chapters.');


  const remediesCount = (db.prepare('SELECT COUNT(*) as c FROM remedies;').get() as { c: number }).c;
  const repsCount = (db.prepare('SELECT COUNT(*) as c FROM repertories;').get() as { c: number }).c;
  const chapsCount = (db.prepare('SELECT COUNT(*) as c FROM chapters;').get() as { c: number }).c;
  const rubricsCount = (db.prepare('SELECT COUNT(*) as c FROM rubrics;').get() as { c: number }).c;
  const entriesCount = (db.prepare('SELECT COUNT(*) as c FROM rubric_entries;').get() as { c: number }).c;
  const booksCount = (db.prepare('SELECT COUNT(*) as c FROM books;').get() as { c: number }).c;
  const monographsCount = (db.prepare('SELECT COUNT(*) as c FROM monographs;').get() as { c: number }).c;

  // Optimize & Close SQLite
  db.exec('PRAGMA optimize;');
  db.exec('VACUUM;');
  db.close();

  // 9. Compress via GZIP
  const rawBytes = fs.readFileSync(dbPath);
  const gzBytes = zlib.gzipSync(rawBytes, { level: 9 });
  fs.writeFileSync(gzPath, gzBytes);

  const sha256 = crypto.createHash('sha256').update(gzBytes).digest('hex');

  const stats = {
    remedies: remediesCount,
    repertories: repsCount,
    chapters: chapsCount,
    rubrics: rubricsCount,
    rubricEntries: entriesCount,
    books: booksCount,
    monographs: monographsCount,
    polarPairs: INITIAL_POLAR_PAIRS.length,
    uncompressedBytes: rawBytes.length,
    compressedBytes: gzBytes.length,
    compressionRatio: Number((gzBytes.length / rawBytes.length).toFixed(3)),
  };

  const manifest = {
    version: '1.0.0',
    dbFile: 'hozone_core_v1.db',
    gzFile: 'hozone_core_v1.db.gz',
    sha256,
    generatedAt: new Date().toISOString(),
    stats,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[CompileSqlite] SQLite build complete: ${rawBytes.length} bytes -> ${gzBytes.length} bytes compressed (ratio: ${stats.compressionRatio}).`);

  return { dbPath, gzPath, manifestPath, stats };
}

// Auto-execute if invoked as CLI script
if (process.argv[1]?.includes('compileCoreSqlite')) {
  void buildCoreSqliteDatabase();
}
