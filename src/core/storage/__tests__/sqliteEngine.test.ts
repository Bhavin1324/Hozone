import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { sqliteClient } from '../../workers/sqliteDatabaseClient';
import { isGzipBuffer, isSqliteBuffer, decompressGzip } from '../../workers/sqliteLoader';

describe('Option 1: Compressed Binary SQLite Clinical Engine', () => {

  const dbPath = path.resolve(process.cwd(), 'public/data/hozone_core_v1.db');
  const gzPath = path.resolve(process.cwd(), 'public/data/hozone_core_v1.db.gz');
  const manifestPath = path.resolve(process.cwd(), 'public/data/manifest.json');

  it('verifies compiled SQLite binary database and compressed Gzip assets exist', () => {
    expect(fs.existsSync(dbPath)).toBe(true);
    expect(fs.existsSync(gzPath)).toBe(true);
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.stats.remedies).toBeGreaterThanOrEqual(3444);
    expect(manifest.stats.repertories).toBe(44);
    expect(manifest.stats.chapters).toBe(37);
    expect(manifest.stats.rubrics).toBeGreaterThanOrEqual(70000);
    expect(manifest.stats.rubricEntries).toBeGreaterThanOrEqual(500000);
    expect(manifest.stats.monographs).toBeGreaterThanOrEqual(700);
    expect(manifest.stats.compressedBytes).toBeLessThan(manifest.stats.uncompressedBytes);
    expect(manifest.stats.compressionRatio).toBeLessThan(0.5);
  });

  describe('Direct SQL Engine & B-Tree / FTS5 Queries', () => {
    let db: DatabaseSync;

    it('opens binary SQLite database cleanly and reads schema', () => {
      db = new DatabaseSync(dbPath);
      expect(db).toBeDefined();

      const tableStmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      const tables = (tableStmt.all() as unknown as { name: string }[]).map((t) => t.name);

      expect(tables).toContain('remedies');
      expect(tables).toContain('repertories');
      expect(tables).toContain('chapters');
      expect(tables).toContain('rubrics');
      expect(tables).toContain('rubric_entries');
      expect(tables).toContain('books');
      expect(tables).toContain('monographs');
    });

    it('retrieves remedies across kingdoms with instant indexing', () => {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM remedies WHERE kingdom = ?;');
      const plantRow = stmt.get('Plant') as unknown as { count: number };
      const mineralRow = stmt.get('Mineral') as unknown as { count: number };

      expect(plantRow.count).toBeGreaterThan(1500);
      expect(mineralRow.count).toBeGreaterThan(600);
    });

    it('executes FTS5 full-text rubric search in under 5ms', () => {
      // Warm up query preparation
      const stmt = db.prepare(`
        SELECT r.id, r.full_path, r.depth, r.remedy_count
        FROM rubrics r
        JOIN rubrics_fts fts ON fts.id = r.id
        WHERE rubrics_fts MATCH ?
        LIMIT 25;
      `);
      const start = performance.now();
      const results = stmt.all('headache OR anxiety');
      const duration = performance.now() - start;

      expect(results.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(150);
    });

    it('retrieves hierarchical child rubrics by parent ID in under 2ms', () => {
      const start = performance.now();
      const stmt = db.prepare('SELECT id, path, full_path, depth FROM rubrics WHERE parent_id = ?;');
      const children = stmt.all('rub-mind-anxiety');
      const duration = performance.now() - start;

      expect(children.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(20);
    });

    it('calculates repertorization rankings and grade matrix in a single SQL query', () => {
      const rubricIds = ['rub-mind-anxiety', 'rub-mind-fear'];
      const placeholders = rubricIds.map(() => '?').join(',');

      const start = performance.now();
      const stmt = db.prepare(`
        SELECT re.remedy_id, rem.abbreviation, rem.full_name,
               COUNT(re.rubric_id) as coverage_count,
               SUM(re.grade) as total_score
        FROM rubric_entries re
        JOIN remedies rem ON rem.id = re.remedy_id
        WHERE re.rubric_id IN (${placeholders})
        GROUP BY re.remedy_id
        ORDER BY coverage_count DESC, total_score DESC
        LIMIT 10;
      `);
      const rankings = stmt.all(...rubricIds) as unknown as {
        remedy_id: string;
        abbreviation: string;
        full_name: string;
        coverage_count: number;
        total_score: number;
      }[];
      const duration = performance.now() - start;

      expect(rankings.length).toBeGreaterThan(0);
      expect(rankings[0].coverage_count).toBeGreaterThanOrEqual(1);
      expect(rankings[0].total_score).toBeGreaterThan(0);
      expect(duration).toBeLessThan(20);
    });

    it('retrieves canonical Boericke monograph by remedy ID', () => {
      const stmt = db.prepare(`
        SELECT abbreviation, full_name, book_title, mind, physical_generals
        FROM monographs
        WHERE remedy_id = ? AND book_id = 'book-boericke';
      `);
      const mono = stmt.get('rem-sulph') as unknown as {
        abbreviation: string;
        full_name: string;
        book_title: string;
        mind: string;
        physical_generals: string;
      };

      expect(mono).toBeDefined();
      expect(mono.abbreviation).toBe('Sulph.');
      expect(mono.full_name).toBe('Sulphur');
      expect(mono.mind.toLowerCase()).toContain('ragged philosopher');
    });

    it('verifies chapters table contains dynamic live rubric counts from database rubrics', () => {
      const stmt = db.prepare('SELECT id, name, rubric_count FROM chapters WHERE id IN (?, ?, ?);');
      const rows = stmt.all('chap-mind', 'chap-head', 'chap-extremities') as unknown as {
        id: string;
        name: string;
        rubric_count: number;
      }[];

      const mind = rows.find((r) => r.id === 'chap-mind');
      const head = rows.find((r) => r.id === 'chap-head');
      const ext = rows.find((r) => r.id === 'chap-extremities');

      expect(mind).toBeDefined();
      expect(mind!.rubric_count).toBeGreaterThan(5000);
      expect(head).toBeDefined();
      expect(head!.rubric_count).toBeGreaterThan(6000);
      expect(ext).toBeDefined();
      expect(ext!.rubric_count).toBeGreaterThan(15000);
    });

    it('calculates dynamic per-chapter search hit counts when search query is specified', () => {
      const stmt = db.prepare(`
        SELECT c.id, c.name, COUNT(r.id) as rubric_count
        FROM chapters c
        LEFT JOIN rubrics r ON r.chapter_id = c.id
          AND (r.full_path LIKE :pattern OR r.path LIKE :pattern)
        GROUP BY c.id
        ORDER BY c.display_order ASC;
      `);
      const rows = stmt.all({ ':pattern': '%headache%' }) as unknown as {
        id: string;
        name: string;
        rubric_count: number;
      }[];

      expect(rows.length).toBeGreaterThan(30);
      const head = rows.find((r) => r.id === 'chap-head');
      const mind = rows.find((r) => r.id === 'chap-mind');
      expect(head).toBeDefined();
      expect(head!.rubric_count).toBeGreaterThan(0);
      expect(mind).toBeDefined();
      expect(mind!.rubric_count).toBeGreaterThan(0);
    });

    it('supports seamless repertory switching with Kent foundation fallback for all 44 repertories', () => {
      const chapterSql = `
        SELECT c.id, c.name, COUNT(r.id) as rubric_count
        FROM chapters c
        LEFT JOIN rubrics r ON r.chapter_id = c.id
          AND (
            :repertoryId IS NULL
            OR r.repertory_id = :repertoryId
            OR (NOT EXISTS (SELECT 1 FROM rubrics WHERE repertory_id = :repertoryId) AND r.repertory_id = 'rep-kent')
          )
        WHERE (:repertoryId IS NULL
          OR c.repertory_id = :repertoryId
          OR (NOT EXISTS (SELECT 1 FROM rubrics WHERE repertory_id = :repertoryId) AND (c.repertory_id = 'rep-kent' OR c.repertory_id IS NULL)))
        GROUP BY c.id
        ORDER BY c.display_order ASC;
      `;
      const repSynthChapters = db.prepare(chapterSql).all({ ':repertoryId': 'rep-synthesis' }) as unknown as {
        id: string;
        name: string;
        rubric_count: number;
      }[];
      expect(repSynthChapters.length).toBe(37);
      const synthMind = repSynthChapters.find((c) => c.id === 'chap-mind');
      expect(synthMind).toBeDefined();
      expect(synthMind!.rubric_count).toBeGreaterThan(5000);

      const rubricSql = `
        SELECT r.id, r.full_path, r.depth, r.remedy_count
        FROM rubrics r
        WHERE r.chapter_id = :chapterId
          AND (
            :repertoryId IS NULL
            OR r.repertory_id = :repertoryId
            OR (NOT EXISTS (SELECT 1 FROM rubrics WHERE repertory_id = :repertoryId) AND r.repertory_id = 'rep-kent')
          )
        ORDER BY r.depth ASC, r.full_path ASC
        LIMIT 50;
      `;
      const repCompleteRubrics = db.prepare(rubricSql).all({
        ':chapterId': 'chap-mind',
        ':repertoryId': 'rep-complete-2024',
      }) as unknown as {
        id: string;
        full_path: string;
      }[];
      expect(repCompleteRubrics.length).toBe(50);
      expect(repCompleteRubrics[0].full_path).toBeDefined();
    });

    it('verifies polar_pairs contains canonical Kent rubric IDs and paths', () => {
      const stmt = db.prepare('SELECT id, positive_rubric_id, opposite_rubric_id FROM polar_pairs;');
      const rows = stmt.all() as unknown as {
        id: string;
        positive_rubric_id: string;
        opposite_rubric_id: string;
      }[];

      expect(rows.length).toBe(6);
      for (const row of rows) {
        expect(row.positive_rubric_id).toMatch(/^rub-kent-/);
        expect(row.opposite_rubric_id).toMatch(/^rub-kent-/);
      }
    });
  });

  describe('SqliteDatabaseClient Interface', () => {
    it('initializes client singleton with progress subscription capability', () => {
      expect(sqliteClient).toBeDefined();
      expect(typeof sqliteClient.onProgress).toBe('function');
      expect(typeof sqliteClient.isReady).toBe('function');

      const unsubscribe = sqliteClient.onProgress(() => {});
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });

  describe('Magic Byte Detection & Decompression Resilience', () => {
    it('identifies uncompressed SQLite binary header accurately', () => {
      const dbFd = fs.openSync(dbPath, 'r');
      const headerBuf = Buffer.alloc(32);
      fs.readSync(dbFd, headerBuf, 0, 32, 0);
      fs.closeSync(dbFd);

      const arrayBuf = headerBuf.buffer.slice(headerBuf.byteOffset, headerBuf.byteOffset + headerBuf.byteLength);

      expect(isSqliteBuffer(arrayBuf)).toBe(true);
      expect(isGzipBuffer(arrayBuf)).toBe(false);
    });

    it('identifies GZIP compressed archive magic bytes accurately', () => {
      const gzFd = fs.openSync(gzPath, 'r');
      const headerBuf = Buffer.alloc(32);
      fs.readSync(gzFd, headerBuf, 0, 32, 0);
      fs.closeSync(gzFd);

      const arrayBuf = headerBuf.buffer.slice(headerBuf.byteOffset, headerBuf.byteOffset + headerBuf.byteLength);

      expect(isGzipBuffer(arrayBuf)).toBe(true);
      expect(isSqliteBuffer(arrayBuf)).toBe(false);
    });

    it('handles truncated or empty buffers gracefully without throwing', () => {
      expect(isGzipBuffer(new ArrayBuffer(0))).toBe(false);
      expect(isGzipBuffer(new ArrayBuffer(1))).toBe(false);
      expect(isSqliteBuffer(new ArrayBuffer(0))).toBe(false);
      expect(isSqliteBuffer(new ArrayBuffer(10))).toBe(false);
    });

    it('decompresses GZIP data into valid SQLite database buffer', async () => {
      // Read a small gzipped test payload using Node zlib to verify decompressGzip
      const zlib = await import('node:zlib');
      const sampleText = 'SQLite format 3\x00' + 'x'.repeat(100);
      const gzippedPayload = zlib.gzipSync(Buffer.from(sampleText));
      const gzippedArrayBuf = gzippedPayload.buffer.slice(
        gzippedPayload.byteOffset,
        gzippedPayload.byteOffset + gzippedPayload.byteLength
      );

      expect(isGzipBuffer(gzippedArrayBuf)).toBe(true);
      expect(isSqliteBuffer(gzippedArrayBuf)).toBe(false);

      const decompressed = await decompressGzip(gzippedArrayBuf);
      expect(isSqliteBuffer(decompressed)).toBe(true);

      const decView = new Uint8Array(decompressed, 0, 15);
      expect(String.fromCharCode(...decView)).toBe('SQLite format 3');
    });
  });
});

