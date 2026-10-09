import { getDb } from './indexedDb';
import type {
  ClinicalTip,
  ClinicalTipFilter,
  CuredCase,
  CuredCaseFilter,
  DiseaseNutritionGuidance,
  DiseaseNutritionFilter,
  MotherTincture,
  MotherTinctureFilter,
} from '@/features/clinical-guidance/types';

/**
 * Domain-specific IndexedDB queries for Clinical Guidance
 */

export async function getLocalClinicalTips(
  filter?: ClinicalTipFilter
): Promise<ClinicalTip[]> {
  const db = await getDb();
  let tips: ClinicalTip[];

  if (filter?.organSystem && filter.organSystem !== 'All') {
    tips = await db.getAllFromIndex('clinical_tips', 'byOrganSystem', filter.organSystem);
  } else if (filter?.author) {
    tips = await db.getAllFromIndex('clinical_tips', 'byAuthor', filter.author);
  } else if (filter?.remedyName) {
    tips = await db.getAllFromIndex('clinical_tips', 'byRemedy', filter.remedyName);
  } else {
    tips = await db.getAll('clinical_tips');
  }

  if (filter?.searchQuery?.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    tips = tips.filter(
      (t) =>
        t.remedyName.toLowerCase().includes(q) ||
        t.clinicalCondition.toLowerCase().includes(q) ||
        t.tipContent.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filter?.verificationLevel) {
    tips = tips.filter((t) => t.verificationLevel === filter.verificationLevel);
  }

  return tips;
}

export async function getLocalCuredCases(
  filter?: CuredCaseFilter
): Promise<CuredCase[]> {
  const db = await getDb();
  let cases: CuredCase[];

  if (filter?.organSystem && filter.organSystem !== 'All') {
    cases = await db.getAllFromIndex('cured_cases', 'byOrganSystem', filter.organSystem);
  } else if (filter?.author) {
    cases = await db.getAllFromIndex('cured_cases', 'byAuthor', filter.author);
  } else if (filter?.remedyName) {
    cases = await db.getAllFromIndex('cured_cases', 'byRemedy', filter.remedyName);
  } else {
    cases = await db.getAll('cured_cases');
  }

  if (filter?.searchQuery?.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    cases = cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.clinicalDiagnosis.toLowerCase().includes(q) ||
        c.remedyPrescribed.toLowerCase().includes(q) ||
        c.keyPrescribingClue.toLowerCase().includes(q) ||
        c.initialSymptoms.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q)
    );
  }

  return cases;
}

export async function getLocalDiseaseNutrition(
  filter?: DiseaseNutritionFilter
): Promise<DiseaseNutritionGuidance[]> {
  const db = await getDb();
  let items: DiseaseNutritionGuidance[];

  if (filter?.category && filter.category !== 'All') {
    items = await db.getAllFromIndex('disease_nutrition', 'byCategory', filter.category);
  } else {
    items = await db.getAll('disease_nutrition');
  }

  if (filter?.searchQuery?.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    items = items.filter(
      (n) =>
        n.conditionName.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.recommendedFoods.some((f) => f.toLowerCase().includes(q)) ||
        n.restrictedFoods.some((f) => f.toLowerCase().includes(q)) ||
        n.homeopathicDietaryCautions.toLowerCase().includes(q) ||
        n.associatedRemedies.some((r) => r.toLowerCase().includes(q))
    );
  }

  return items;
}

export async function getLocalMotherTinctures(
  filter?: MotherTinctureFilter
): Promise<MotherTincture[]> {
  const db = await getDb();
  let tinctures = await db.getAll('mother_tinctures');

  if (filter?.organAffinity && filter.organAffinity !== 'All') {
    const aff = filter.organAffinity.toLowerCase();
    tinctures = tinctures.filter((t) =>
      t.organAffinities.some((a) => a.toLowerCase().includes(aff))
    );
  }

  if (filter?.searchQuery?.trim()) {
    const q = filter.searchQuery.toLowerCase().trim();
    tinctures = tinctures.filter(
      (t) =>
        t.remedyName.toLowerCase().includes(q) ||
        t.commonName.toLowerCase().includes(q) ||
        t.clinicalIndications.some((i) => i.toLowerCase().includes(q)) ||
        t.organAffinities.some((a) => a.toLowerCase().includes(q)) ||
        t.pharmacologicalActions.toLowerCase().includes(q)
    );
  }

  return tinctures;
}
