import { getDb } from './indexedDb';
import type {
  SpecialtyRepertory,
  SpecialtyRubric,
  VeterinarySpeciesGuidance,
  VeterinaryCase,
  VeterinarySpecies,
} from '@/features/specialty/types';

export async function getLocalSpecialtyRepertories(): Promise<SpecialtyRepertory[]> {
  const db = await getDb();
  return db.getAll('specialty_repertories');
}

export async function getLocalSpecialtyRubrics(
  repertoryCode?: string,
  searchQuery?: string
): Promise<SpecialtyRubric[]> {
  const db = await getDb();
  let rubrics: SpecialtyRubric[];

  if (repertoryCode && repertoryCode !== 'ALL') {
    rubrics = await db.getAllFromIndex('specialty_rubrics', 'byRepertory', repertoryCode);
  } else {
    rubrics = await db.getAll('specialty_rubrics');
  }

  if (!searchQuery?.trim()) {
    return rubrics;
  }

  const terms = searchQuery.toLowerCase().trim().split(/\s+/);
  return rubrics.filter((r) => {
    const remedyText = r.remedies.map((rem) => `${rem.remedy} ${rem.abbr}`).join(' ');
    const haystack = `${r.section} ${r.rubricPath} ${r.clinicalNotes || ''} ${remedyText}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export async function getLocalVeterinarySpeciesGuidance(
  species?: VeterinarySpecies
): Promise<VeterinarySpeciesGuidance[]> {
  const db = await getDb();
  if (species) {
    return db.getAllFromIndex('veterinary_guidance', 'bySpecies', species);
  }
  return db.getAll('veterinary_guidance');
}

export async function getLocalVeterinaryCases(
  species?: VeterinarySpecies,
  searchQuery?: string
): Promise<VeterinaryCase[]> {
  const db = await getDb();
  let cases: VeterinaryCase[];

  if (species) {
    cases = await db.getAllFromIndex('veterinary_cases', 'bySpecies', species);
  } else {
    cases = await db.getAll('veterinary_cases');
  }

  if (!searchQuery?.trim()) {
    return cases;
  }

  const terms = searchQuery.toLowerCase().trim().split(/\s+/);
  return cases.filter((c) => {
    const haystack = `${c.species} ${c.breedAgeGender} ${c.chiefComplaint} ${c.remedyPrescribed} ${c.potency} ${c.outcomeNotes} ${c.author}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

export async function saveLocalVeterinaryCase(c: VeterinaryCase): Promise<VeterinaryCase> {
  const db = await getDb();
  await db.put('veterinary_cases', c);
  return c;
}

export async function saveLocalSpecialtyRubric(r: SpecialtyRubric): Promise<SpecialtyRubric> {
  const db = await getDb();
  await db.put('specialty_rubrics', r);
  return r;
}
