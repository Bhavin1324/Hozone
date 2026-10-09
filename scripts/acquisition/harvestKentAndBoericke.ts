import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline';
import type { DatabaseSync } from 'node:sqlite';
import type { Remedy } from '../../src/features/repertory/types';

const CHAPTER_MAP: Record<string, string> = {
  '0': 'chap-abdomen',
  '1': 'chap-back',
  '2': 'chap-bladder',
  '3': 'chap-chest',
  '4': 'chap-chill',
  '5': 'chap-cough',
  '6': 'chap-ear',
  '7': 'chap-expectoration',
  '8': 'chap-external-throat',
  '9': 'chap-extremities',
  '10': 'chap-eye',
  '11': 'chap-face',
  '12': 'chap-fever',
  '13': 'chap-generalities',
  '14': 'chap-genitalia-female',
  '15': 'chap-genitalia-male',
  '16': 'chap-head',
  '17': 'chap-hearing',
  '18': 'chap-kidneys',
  '19': 'chap-larynx-trachea',
  '20': 'chap-mind',
  '21': 'chap-mouth',
  '22': 'chap-nose',
  '23': 'chap-perspiration',
  '24': 'chap-prostate',
  '25': 'chap-rectum',
  '26': 'chap-respiration',
  '27': 'chap-skin',
  '28': 'chap-sleep-dreams',
  '29': 'chap-stomach',
  '30': 'chap-stool',
  '31': 'chap-teeth',
  '32': 'chap-throat',
  '33': 'chap-urethra',
  '34': 'chap-urine',
  '35': 'chap-vertigo',
  '36': 'chap-vision',
  '-1': 'chap-chest',
};

export async function harvestKentAndBoericke(db: DatabaseSync): Promise<{
  rubricsCount: number;
  entriesCount: number;
  monographsCount: number;
  additionalRemediesCount: number;
}> {
  const dumpPath = path.resolve(process.cwd(), 'scripts/acquisition/cache/oorep.sql.gz');
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`OOREP dump not found at ${dumpPath}`);
  }

  // Load existing Hozone remedies to preserve IDs
  const remediesPath = path.resolve(process.cwd(), 'src/core/storage/data/remediesCatalog.json');
  const existingRemedies = JSON.parse(fs.readFileSync(remediesPath, 'utf8')) as Remedy[];
  const abbrToId = new Map<string, string>();
  const nameToId = new Map<string, string>();

  for (const r of existingRemedies) {
    abbrToId.set(r.abbreviation.toLowerCase().replace(/[^a-z0-9]/g, ''), r.id);
    nameToId.set(r.fullName.toLowerCase().replace(/[^a-z0-9]/g, ''), r.id);
  }

  const oorepRemedyMap = new Map<string, { id: string; abbreviation: string; fullName: string }>();
  const pathToRubricId = new Map<string, string>();
  type RawRubric = { oorepId: string; chapterId: string; fullPath: string; path: string; depth: number; parentPath: string | null };
  const rawRubrics: RawRubric[] = [];
  type RawEntry = { rubricId: string; remedyId: string; grade: number };
  const rawEntries: RawEntry[] = [];
  const mmChapters = new Map<string, { heading: string; remedyOorepId: string; sections: Record<string, string> }>();

  console.log('[HarvestKent] Streaming and extracting OOREP classical database...');
  const gunzip = zlib.createGunzip();
  const rl = readline.createInterface({
    input: fs.createReadStream(dumpPath).pipe(gunzip),
    crlfDelay: Infinity,
  });

  let currentCopyTable: string | null = null;
  const insertRemedyStmt = db.prepare(`
    INSERT OR IGNORE INTO remedies (id, abbreviation, full_name, common_name, kingdom, thermal, miasm, is_polychrest, short_keynotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let addedRemedies = 0;

  for await (const line of rl) {
    if (line.startsWith('COPY public.')) {
      const match = line.match(/COPY public\.(\w+)/);
      currentCopyTable = match ? match[1] : null;
      continue;
    }
    if (line === '\\.' && currentCopyTable) {
      currentCopyTable = null;
      continue;
    }

    if (!currentCopyTable) continue;

    // 1. Remedies
    if (currentCopyTable === 'remedy') {
      const [id, abbrev, fullname] = line.split('\t');
      if (!id || !abbrev) continue;
      const cleanAbbr = abbrev.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = (fullname || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      let matchedId = abbrToId.get(cleanAbbr) || nameToId.get(cleanName);
      if (!matchedId) {
        matchedId = `rem-kent-${cleanAbbr}`;
        insertRemedyStmt.run(
          matchedId,
          abbrev,
          fullname || abbrev,
          fullname || abbrev,
          'Plant',
          'Ambithermal',
          'Psora',
          0,
          `Classical remedy from Kent Repertory.`
        );
        addedRemedies++;
      }
      oorepRemedyMap.set(id, { id: matchedId, abbreviation: abbrev, fullName: fullname || abbrev });
    }

    // 2. Rubrics (Publicum / Kent)
    else if (currentCopyTable === 'rubric' && line.startsWith('publicum\t')) {
      const parts = line.split('\t');
      const oorepId = parts[1];
      const chapterNum = parts[4];
      const fullPath = parts[5];
      if (!oorepId || !fullPath) continue;

      const segments = fullPath.split(',').map((s) => s.trim());
      const depth = Math.max(0, segments.length - 2);
      const parentPath = depth > 0 ? segments.slice(0, -1).join(', ') : null;
      const pathText = segments.slice(1).join(', ') || fullPath;
      const rubricId = `rub-kent-${oorepId}`;

      pathToRubricId.set(fullPath, rubricId);
      rawRubrics.push({
        oorepId,
        chapterId: CHAPTER_MAP[chapterNum] || 'chap-generalities',
        fullPath,
        path: pathText,
        depth,
        parentPath,
      });
    }

    // 3. Rubric Entries (Publicum / Kent mappings)
    else if (currentCopyTable === 'rubricremedy' && line.startsWith('publicum\t')) {
      const parts = line.split('\t');
      const oorepRubricId = parts[1];
      const oorepRemedyId = parts[2];
      const weight = parts[3];

      const remedyInfo = oorepRemedyMap.get(oorepRemedyId);
      if (remedyInfo) {
        const grade = Math.max(1, Math.min(4, Number(weight) || 1));
        rawEntries.push({
          rubricId: `rub-kent-${oorepRubricId}`,
          remedyId: remedyInfo.id,
          grade,
        });
      }
    }

    // 4. Materia Medica Chapters (Boericke)
    else if (currentCopyTable === 'mmchapter') {
      const [id, , heading, remedyId] = line.split('\t');
      if (id && heading) {
        mmChapters.set(id, { heading, remedyOorepId: remedyId, sections: {} });
      }
    }

    // 5. Materia Medica Sections (Boericke)
    else if (currentCopyTable === 'mmsection') {
      const parts = line.split('\t');
      const chapterId = parts[1];
      const heading = parts[5];
      const content = parts[6];
      const ch = mmChapters.get(chapterId);
      if (ch && heading && content) {
        ch.sections[heading] = (ch.sections[heading] ? ch.sections[heading] + '\n' : '') + content.replace(/\\n/g, '\n');
      }
    }
  }

  console.log(`[HarvestKent] Parsed ${rawRubrics.length} rubrics, ${rawEntries.length} entries, ${mmChapters.size} Boericke monographs.`);

  // Ingest Rubrics
  console.log('[HarvestKent] Ingesting rubrics and full-text search indexes...');
  const insertRubric = db.prepare(`
    INSERT OR REPLACE INTO rubrics (id, chapter_id, repertory_id, parent_id, path, full_path, depth, remedy_count, cross_references)
    VALUES (?, ?, 'rep-kent', ?, ?, ?, ?, 0, NULL)
  `);
  const insertFts = db.prepare(`
    INSERT INTO rubrics_fts (id, full_path, path) VALUES (?, ?, ?)
  `);

  db.exec('BEGIN TRANSACTION;');
  for (const rub of rawRubrics) {
    const parentId = rub.parentPath ? pathToRubricId.get(rub.parentPath) || null : null;
    const rubricId = `rub-kent-${rub.oorepId}`;
    insertRubric.run(rubricId, rub.chapterId, parentId, rub.path, rub.fullPath, rub.depth);
    insertFts.run(rubricId, rub.fullPath, rub.path);
  }
  db.exec('COMMIT;');

  // Ingest Rubric Entries
  console.log('[HarvestKent] Ingesting rubric remedy entries...');
  const insertEntry = db.prepare(`
    INSERT OR REPLACE INTO rubric_entries (rubric_id, remedy_id, grade) VALUES (?, ?, ?)
  `);
  const rubricCountMap = new Map<string, number>();

  db.exec('BEGIN TRANSACTION;');
  for (const entry of rawEntries) {
    insertEntry.run(entry.rubricId, entry.remedyId, entry.grade);
    rubricCountMap.set(entry.rubricId, (rubricCountMap.get(entry.rubricId) || 0) + 1);
  }
  db.exec('COMMIT;');

  // Update remedy_count on rubrics
  console.log('[HarvestKent] Updating rubric remedy counts...');
  const updateCountStmt = db.prepare(`UPDATE rubrics SET remedy_count = ? WHERE id = ?`);
  db.exec('BEGIN TRANSACTION;');
  for (const [rId, count] of rubricCountMap.entries()) {
    updateCountStmt.run(count, rId);
  }
  db.exec('COMMIT;');

  // Ingest Boericke Monographs
  console.log('[HarvestKent] Ingesting Boericke Materia Medica monographs...');
  const insertMono = db.prepare(`
    INSERT OR REPLACE INTO monographs (
      id, remedy_id, book_id, abbreviation, full_name, book_title,
      mind, physical_generals, keynotes, modalities_agg, modalities_amel,
      organ_affinities, clinical_indications, comparisons
    ) VALUES (?, ?, 'book-boericke', ?, ?, 'Pocket Manual of Homeopathic Materia Medica', ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let monoCount = 0;
  db.exec('BEGIN TRANSACTION;');
  for (const [, ch] of mmChapters.entries()) {
    const remedyInfo = oorepRemedyMap.get(ch.remedyOorepId);
    if (!remedyInfo) continue;

    const sections = ch.sections;
    const mind = sections['Mind'] || '';
    const generals = sections['Generalities'] || sections['Modalities'] || '';
    const keynotes = sections[ch.heading] || '';
    const modalities = sections['Modalities'] || '';
    const affinities = Object.keys(sections).join('; ');
    const dose = sections['Dose'] || '';
    const relationship = sections['Relationship'] || '';

    insertMono.run(
      `mono-book-boericke-${remedyInfo.id}`,
      remedyInfo.id,
      remedyInfo.abbreviation,
      remedyInfo.fullName,
      mind,
      generals,
      keynotes,
      modalities,
      modalities,
      affinities,
      dose,
      relationship
    );
    monoCount++;
  }
  db.exec('COMMIT;');

  return {
    rubricsCount: rawRubrics.length,
    entriesCount: rawEntries.length,
    monographsCount: monoCount,
    additionalRemediesCount: addedRemedies,
  };
}
