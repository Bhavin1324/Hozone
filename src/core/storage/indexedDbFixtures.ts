import type { IDBPDatabase } from 'idb';
import type { HozoneDbSchema } from './indexedDb';
import {
  INITIAL_CHAPTERS,
  INITIAL_REMEDIES,
  INITIAL_RUBRICS,
} from './initialData';
import {
  INITIAL_BOOKS,
  INITIAL_MONOGRAPHS,
  INITIAL_RELATIONSHIPS,
} from './materiaMedicaData';
import {
  EXTENDED_BOOKS,
  EXTENDED_MONOGRAPHS,
  EXTENDED_RELATIONSHIPS,
} from './materiaMedicaExtendedData';
import {
  INITIAL_ACUTE_NODES,
  INITIAL_TEMPERAMENTS,
  INITIAL_SEHGAL_SCRIPTS,
  INITIAL_SCHOLTEN_ELEMENTS,
} from './expertSystemsData';
import { INITIAL_POLAR_PAIRS } from './polarityData';
import { INITIAL_KENT_OBSERVATIONS } from './kentObservationsData';
import { INITIAL_CLINICAL_TIPS } from './clinicalTipsData';
import { INITIAL_CURED_CASES } from './curedCasesData';
import { INITIAL_DISEASE_NUTRITION } from './diseaseNutritionData';
import { INITIAL_MOTHER_TINCTURES } from './motherTincturesData';
import {
  INITIAL_PATIENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_APPOINTMENTS,
} from './patientsInitialData';
import {
  INITIAL_SPECIALTY_REPERTORIES,
  INITIAL_SPECIALTY_RUBRICS,
  INITIAL_VETERINARY_GUIDANCE,
  INITIAL_VETERINARY_CASES,
} from './specialtyInitialData';

/**
 * Hydrates baseline fallback domain fixtures into IndexedDB if stores are empty.
 * Extracted from indexedDb.ts to preserve strict AGENTS.md 500-line modularity.
 */
export async function hydrateInitialDomainFixtures(
  db: IDBPDatabase<HozoneDbSchema>
): Promise<void> {
  // 1. Initial Repertory Core Fixtures
  const chCount = await db.count('chapters');
  if (chCount === 0) {
    const tx = db.transaction(['chapters', 'remedies', 'rubrics'], 'readwrite');
    for (const c of INITIAL_CHAPTERS) await tx.objectStore('chapters').put(c);
    for (const r of INITIAL_REMEDIES) await tx.objectStore('remedies').put(r);
    for (const rub of INITIAL_RUBRICS) await tx.objectStore('rubrics').put(rub);
    await tx.done;
  }

  // 2. Initial Materia Medica Fixtures
  const bkCount = await db.count('books');
  if (bkCount === 0) {
    const tx = db.transaction(['books', 'monographs', 'relationships'], 'readwrite');
    for (const b of [...INITIAL_BOOKS, ...EXTENDED_BOOKS]) await tx.objectStore('books').put(b);
    for (const m of [...INITIAL_MONOGRAPHS, ...EXTENDED_MONOGRAPHS]) await tx.objectStore('monographs').put(m);
    for (const rel of [...INITIAL_RELATIONSHIPS, ...EXTENDED_RELATIONSHIPS]) await tx.objectStore('relationships').put(rel);
    await tx.done;
  }

  // 3. Expert Systems Fixtures
  const expCount = await db.count('acute_nodes');
  if (expCount === 0) {
    const expTx = db.transaction(
      ['acute_nodes', 'temperaments', 'sehgal_scripts', 'element_mappings'],
      'readwrite'
    );
    for (const n of INITIAL_ACUTE_NODES) await expTx.objectStore('acute_nodes').put(n);
    for (const t of INITIAL_TEMPERAMENTS) await expTx.objectStore('temperaments').put(t);
    for (const s of INITIAL_SEHGAL_SCRIPTS) await expTx.objectStore('sehgal_scripts').put(s);
    for (const e of INITIAL_SCHOLTEN_ELEMENTS) await expTx.objectStore('element_mappings').put(e);
    await expTx.done;
  }

  // 4. Polarity Pairs
  const polarCount = await db.count('polar_pairs');
  if (polarCount === 0) {
    const pTx = db.transaction('polar_pairs', 'readwrite');
    for (const p of INITIAL_POLAR_PAIRS) await pTx.objectStore('polar_pairs').put(p);
    await pTx.done;
  }

  // 5. Kent Observations
  const kentCount = await db.count('kent_observations');
  if (kentCount === 0) {
    const kTx = db.transaction('kent_observations', 'readwrite');
    for (const k of INITIAL_KENT_OBSERVATIONS) await kTx.objectStore('kent_observations').put(k);
    await kTx.done;
  }

  // 6. Clinical Guidance Fixtures
  const cgCount = await db.count('clinical_tips');
  if (cgCount === 0) {
    const cgTx = db.transaction(
      ['clinical_tips', 'cured_cases', 'disease_nutrition', 'mother_tinctures'],
      'readwrite'
    );
    for (const tip of INITIAL_CLINICAL_TIPS) await cgTx.objectStore('clinical_tips').put(tip);
    for (const c of INITIAL_CURED_CASES) await cgTx.objectStore('cured_cases').put(c);
    for (const d of INITIAL_DISEASE_NUTRITION) await cgTx.objectStore('disease_nutrition').put(d);
    for (const mt of INITIAL_MOTHER_TINCTURES) await cgTx.objectStore('mother_tinctures').put(mt);
    await cgTx.done;
  }

  // 7. Patient Management System Fixtures
  const ptCount = await db.count('patients');
  if (ptCount === 0) {
    const pmsTx = db.transaction(
      ['patients', 'consultations', 'prescriptions', 'appointments'],
      'readwrite'
    );
    for (const p of INITIAL_PATIENTS) await pmsTx.objectStore('patients').put(p);
    for (const c of INITIAL_CONSULTATIONS) await pmsTx.objectStore('consultations').put(c);
    for (const rx of INITIAL_PRESCRIPTIONS) await pmsTx.objectStore('prescriptions').put(rx);
    for (const a of INITIAL_APPOINTMENTS) await pmsTx.objectStore('appointments').put(a);
    await pmsTx.done;
  }

  // 8. Specialty & Veterinary Fixtures
  const specCount = await db.count('specialty_repertories');
  if (specCount === 0) {
    const svTx = db.transaction(
      ['specialty_repertories', 'specialty_rubrics', 'veterinary_guidance', 'veterinary_cases'],
      'readwrite'
    );
    for (const r of INITIAL_SPECIALTY_REPERTORIES) await svTx.objectStore('specialty_repertories').put(r);
    for (const rb of INITIAL_SPECIALTY_RUBRICS) await svTx.objectStore('specialty_rubrics').put(rb);
    for (const g of INITIAL_VETERINARY_GUIDANCE) await svTx.objectStore('veterinary_guidance').put(g);
    for (const c of INITIAL_VETERINARY_CASES) await svTx.objectStore('veterinary_cases').put(c);
    await svTx.done;
  }
}
