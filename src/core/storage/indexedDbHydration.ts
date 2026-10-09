import type { IDBPDatabase } from 'idb';
import type { HozoneDbSchema } from './indexedDb';
import type { Remedy, Chapter, Rubric, RepertoryCatalogItem } from '@/features/repertory/types';
import type { MateriaMedicaBook, RemedyMonograph } from '@/features/materia-medica/types';
import catalogData from './data/remediesCatalog.json';
import booksCatalogData from './data/materiaMedicaBooksCatalog.json';
import monographsCatalogData from './data/remedyMonographsCatalog.json';
import repertoriesCatalogData from './data/repertoriesCatalog.json';
import chaptersCatalogData from './data/chaptersCatalog.json';
import rubricsCatalogData from './data/rubricsCatalog.json';

/**
 * Hydrates the complete master remedy directory (3,400+ entries)
 * into the local browser IndexedDB store if empty or sparsely populated.
 * Uses batch transaction without per-row microtask roundtrips for maximum performance.
 */
export async function hydrateRemediesCatalog(db: IDBPDatabase<HozoneDbSchema>): Promise<void> {
  const remCount = await db.count('remedies');
  if (remCount < 100) {
    const tx = db.transaction('remedies', 'readwrite');
    const store = tx.objectStore('remedies');
    for (const r of catalogData as Remedy[]) {
      store.put(r);
    }
    await tx.done;
  }
}

/**
 * Hydrates the 132-volume Materia Medica Library and extended multi-author monographs
 * into local IndexedDB for instantaneous offline browsing and search.
 */
export async function hydrateMateriaMedicaCatalog(db: IDBPDatabase<HozoneDbSchema>): Promise<void> {
  const booksCount = await db.count('books');
  if (booksCount < 100) {
    const tx = db.transaction('books', 'readwrite');
    const store = tx.objectStore('books');
    for (const b of booksCatalogData as MateriaMedicaBook[]) {
      store.put(b);
    }
    await tx.done;
  }

  const monoCount = await db.count('monographs');
  if (monoCount < 30) {
    const tx = db.transaction('monographs', 'readwrite');
    const store = tx.objectStore('monographs');
    for (const m of monographsCatalogData as RemedyMonograph[]) {
      store.put(m);
    }
    await tx.done;
  }
}

/**
 * Hydrates the 43+ Authoritative Repertories, 37 Classical Chapters, and
 * Hierarchical Rubrics into local IndexedDB v11.
 */
export async function hydrateRepertoriesCatalog(db: IDBPDatabase<HozoneDbSchema>): Promise<void> {
  if (db.objectStoreNames.contains('repertories')) {
    const repCount = await db.count('repertories');
    if (repCount < 30) {
      const tx = db.transaction('repertories', 'readwrite');
      const store = tx.objectStore('repertories');
      for (const r of repertoriesCatalogData as RepertoryCatalogItem[]) {
        store.put(r);
      }
      await tx.done;
    }
  }

  const chCount = await db.count('chapters');
  if (chCount < 30) {
    const tx = db.transaction('chapters', 'readwrite');
    const store = tx.objectStore('chapters');
    for (const c of chaptersCatalogData as Chapter[]) {
      store.put(c);
    }
    await tx.done;
  }

  const rubCount = await db.count('rubrics');
  if (rubCount < 30) {
    const tx = db.transaction('rubrics', 'readwrite');
    const store = tx.objectStore('rubrics');
    for (const rub of rubricsCatalogData as Rubric[]) {
      store.put(rub);
    }
    await tx.done;
  }
}
