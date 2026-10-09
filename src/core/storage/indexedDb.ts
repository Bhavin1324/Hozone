import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  Chapter,
  Remedy,
  Rubric,
  PolarSymptomPair,
  RepertoryCatalogItem,
} from '@/features/repertory/types';
import type {
  MateriaMedicaBook,
  RemedyMonograph,
  RemedyRelationship,
} from '@/features/materia-medica/types';
import type {
  AcuteDecisionNode,
  TemperamentProfile,
  SehgalScript,
  ScholtenElement,
  KentObservationRule,
} from '@/features/expert-systems/types';
import type {
  ClinicalTip,
  CuredCase,
  DiseaseNutritionGuidance,
  MotherTincture,
} from '@/features/clinical-guidance/types';
import type {
  Patient,
  Consultation,
  Prescription,
  Appointment,
} from '@/features/patients/types';
import type {
  SpecialtyRepertory,
  SpecialtyRubric,
  VeterinarySpeciesGuidance,
  VeterinaryCase,
} from '@/features/specialty/types';
import { hydrateInitialDomainFixtures } from './indexedDbFixtures';
import {
  hydrateRemediesCatalog,
  hydrateMateriaMedicaCatalog,
  hydrateRepertoriesCatalog,
} from './indexedDbHydration';

export interface HozoneDbSchema extends DBSchema {
  repertories: {
    key: string;
    value: RepertoryCatalogItem;
    indexes: { byCode: string; byCategory: string };
  };
  chapters: {
    key: string;
    value: Chapter;
    indexes: { byOrder: number };
  };
  remedies: {
    key: string;
    value: Remedy;
    indexes: { byAbbr: string; byKingdom: string };
  };
  rubrics: {
    key: string;
    value: Rubric;
    indexes: { byChapter: string; byParent: string };
  };
  books: {
    key: string;
    value: MateriaMedicaBook;
  };
  monographs: {
    key: string;
    value: RemedyMonograph;
    indexes: {
      byRemedy: string;
      byBook: string;
      byRemedyAndBook: [string, string];
    };
  };
  relationships: {
    key: string;
    value: RemedyRelationship;
    indexes: { byPrimary: string; byRelated: string };
  };
  acute_nodes: {
    key: string;
    value: AcuteDecisionNode;
  };
  temperaments: {
    key: string;
    value: TemperamentProfile;
  };
  sehgal_scripts: {
    key: string;
    value: SehgalScript;
  };
  element_mappings: {
    key: string;
    value: ScholtenElement;
    indexes: { bySeries: number };
  };
  polar_pairs: {
    key: string;
    value: PolarSymptomPair;
    indexes: { byCode: string; byCategory: string };
  };
  kent_observations: {
    key: string;
    value: KentObservationRule;
    indexes: { byNumber: number };
  };
  clinical_tips: {
    key: string;
    value: ClinicalTip;
    indexes: {
      byRemedy: string;
      byAuthor: string;
      byOrganSystem: string;
      byCondition: string;
    };
  };
  cured_cases: {
    key: string;
    value: CuredCase;
    indexes: {
      byAuthor: string;
      byRemedy: string;
      byDiagnosis: string;
      byOrganSystem: string;
    };
  };
  disease_nutrition: {
    key: string;
    value: DiseaseNutritionGuidance;
    indexes: {
      byCategory: string;
      byCondition: string;
    };
  };
  mother_tinctures: {
    key: string;
    value: MotherTincture;
    indexes: {
      byName: string;
    };
  };
  patients: {
    key: string;
    value: Patient;
    indexes: { byReg: string; byStatus: string };
  };
  consultations: {
    key: string;
    value: Consultation;
    indexes: { byPatient: string; byDate: string };
  };
  prescriptions: {
    key: string;
    value: Prescription;
    indexes: { byPatient: string; byRemedy: string };
  };
  appointments: {
    key: string;
    value: Appointment;
    indexes: { byPatient: string; byDate: string };
  };
  specialty_repertories: {
    key: string;
    value: SpecialtyRepertory;
    indexes: { byCode: string };
  };
  specialty_rubrics: {
    key: string;
    value: SpecialtyRubric;
    indexes: { byRepertory: string; bySection: string };
  };
  veterinary_guidance: {
    key: string;
    value: VeterinarySpeciesGuidance;
    indexes: { bySpecies: string };
  };
  veterinary_cases: {
    key: string;
    value: VeterinaryCase;
    indexes: { bySpecies: string; byRemedy: string };
  };
}

const DB_NAME = 'hozone_clinical_db';
const DB_VERSION = 11;

let dbPromise: Promise<IDBPDatabase<HozoneDbSchema>> | null = null;

export async function getDb(): Promise<IDBPDatabase<HozoneDbSchema>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available in non-browser environment');
  }

  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await openDB<HozoneDbSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        // v1 Stores
        if (!db.objectStoreNames.contains('chapters')) {
          const chStore = db.createObjectStore('chapters', { keyPath: 'id' });
          chStore.createIndex('byOrder', 'displayOrder');
        }
        if (!db.objectStoreNames.contains('remedies')) {
          const remStore = db.createObjectStore('remedies', { keyPath: 'id' });
          remStore.createIndex('byAbbr', 'abbreviation');
          remStore.createIndex('byKingdom', 'kingdom');
        }
        if (!db.objectStoreNames.contains('rubrics')) {
          const rubStore = db.createObjectStore('rubrics', { keyPath: 'id' });
          rubStore.createIndex('byChapter', 'chapterId');
        }
        // v2 Stores
        if (!db.objectStoreNames.contains('books')) {
          db.createObjectStore('books', { keyPath: 'id' });
        }
        // v5 Store
        if (oldVersion < 5 && db.objectStoreNames.contains('monographs')) {
          db.deleteObjectStore('monographs');
        }
        if (!db.objectStoreNames.contains('monographs')) {
          const mStore = db.createObjectStore('monographs', { keyPath: 'id' });
          mStore.createIndex('byRemedy', 'remedyId');
          mStore.createIndex('byBook', 'bookId');
          mStore.createIndex('byRemedyAndBook', ['remedyId', 'bookId']);
        }
        if (!db.objectStoreNames.contains('relationships')) {
          const relStore = db.createObjectStore('relationships', { keyPath: 'id' });
          relStore.createIndex('byPrimary', 'primaryRemedyId');
          relStore.createIndex('byRelated', 'relatedRemedyId');
        }
        // v3 Stores: Expert Systems
        if (!db.objectStoreNames.contains('acute_nodes')) {
          db.createObjectStore('acute_nodes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('temperaments')) {
          db.createObjectStore('temperaments', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sehgal_scripts')) {
          db.createObjectStore('sehgal_scripts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('element_mappings')) {
          const elStore = db.createObjectStore('element_mappings', { keyPath: 'id' });
          elStore.createIndex('bySeries', 'series');
        }
        // v4 Stores: Polarity & Kent
        if (!db.objectStoreNames.contains('polar_pairs')) {
          const pStore = db.createObjectStore('polar_pairs', { keyPath: 'id' });
          pStore.createIndex('byCode', 'polarCode');
          pStore.createIndex('byCategory', 'category');
        }
        if (!db.objectStoreNames.contains('kent_observations')) {
          const kStore = db.createObjectStore('kent_observations', { keyPath: 'id' });
          kStore.createIndex('byNumber', 'observationNumber');
        }
        // v6 Stores: Clinical Guidance
        if (!db.objectStoreNames.contains('clinical_tips')) {
          const ctStore = db.createObjectStore('clinical_tips', { keyPath: 'id' });
          ctStore.createIndex('byRemedy', 'remedyName');
          ctStore.createIndex('byAuthor', 'author');
          ctStore.createIndex('byOrganSystem', 'organSystem');
          ctStore.createIndex('byCondition', 'clinicalCondition');
        }
        if (!db.objectStoreNames.contains('cured_cases')) {
          const ccStore = db.createObjectStore('cured_cases', { keyPath: 'id' });
          ccStore.createIndex('byAuthor', 'author');
          ccStore.createIndex('byRemedy', 'remedyPrescribed');
          ccStore.createIndex('byDiagnosis', 'diagnosis');
          ccStore.createIndex('byOrganSystem', 'organSystem');
        }
        if (!db.objectStoreNames.contains('disease_nutrition')) {
          const dnStore = db.createObjectStore('disease_nutrition', { keyPath: 'id' });
          dnStore.createIndex('byCategory', 'category');
          dnStore.createIndex('byCondition', 'diseaseCondition');
        }
        if (!db.objectStoreNames.contains('mother_tinctures')) {
          const mtStore = db.createObjectStore('mother_tinctures', { keyPath: 'id' });
          mtStore.createIndex('byName', 'latinBinomial');
        }
        // v7 Stores: Patient Management System
        if (!db.objectStoreNames.contains('patients')) {
          const ptStore = db.createObjectStore('patients', { keyPath: 'id' });
          ptStore.createIndex('byReg', 'registrationId');
          ptStore.createIndex('byStatus', 'status');
        }
        if (!db.objectStoreNames.contains('consultations')) {
          const conStore = db.createObjectStore('consultations', { keyPath: 'id' });
          conStore.createIndex('byPatient', 'patientId');
          conStore.createIndex('byDate', 'consultationDate');
        }
        if (!db.objectStoreNames.contains('prescriptions')) {
          const rxStore = db.createObjectStore('prescriptions', { keyPath: 'id' });
          rxStore.createIndex('byPatient', 'patientId');
          rxStore.createIndex('byRemedy', 'remedyAbbreviation');
        }
        if (!db.objectStoreNames.contains('appointments')) {
          const appStore = db.createObjectStore('appointments', { keyPath: 'id' });
          appStore.createIndex('byPatient', 'patientId');
          appStore.createIndex('byDate', 'appointmentDate');
        }
        // v9 Stores: Specialty & Veterinary
        if (!db.objectStoreNames.contains('specialty_repertories')) {
          const srStore = db.createObjectStore('specialty_repertories', { keyPath: 'id' });
          srStore.createIndex('byCode', 'code');
        }
        if (!db.objectStoreNames.contains('specialty_rubrics')) {
          const srubStore = db.createObjectStore('specialty_rubrics', { keyPath: 'id' });
          srubStore.createIndex('byRepertory', 'repertoryCode');
          srubStore.createIndex('bySection', 'section');
        }
        if (!db.objectStoreNames.contains('veterinary_guidance')) {
          const vgStore = db.createObjectStore('veterinary_guidance', { keyPath: 'id' });
          vgStore.createIndex('bySpecies', 'species');
        }
        if (!db.objectStoreNames.contains('veterinary_cases')) {
          const vcStore = db.createObjectStore('veterinary_cases', { keyPath: 'id' });
          vcStore.createIndex('bySpecies', 'species');
          vcStore.createIndex('byRemedy', 'remedyPrescribed');
        }
        // v11 Stores: 43+ Repertories & Hierarchical Rubrics
        if (!db.objectStoreNames.contains('repertories')) {
          const repStore = db.createObjectStore('repertories', { keyPath: 'id' });
          repStore.createIndex('byCode', 'code');
          repStore.createIndex('byCategory', 'category');
        }
        if (db.objectStoreNames.contains('rubrics')) {
          const rubStore = transaction.objectStore('rubrics');
          if (!rubStore.indexNames.contains('byParent')) {
            rubStore.createIndex('byParent', 'parentId');
          }
        }
      },
    });

    // Hydrate initial domain fallback fixtures once
    await hydrateInitialDomainFixtures(db);

    // Hydrate catalogs once (3,400+ remedies, 132 books, 44 repertories)
    void hydrateRemediesCatalog(db);
    await hydrateMateriaMedicaCatalog(db);
    await hydrateRepertoriesCatalog(db);

    return db;
  })();
  }

  return dbPromise;
}

// Modular query sub-domains
export * from './indexedDbRepertory';
export * from './indexedDbMateriaMedica';
export * from './indexedDbExpertSystems';
export * from './indexedDbPatients';
export * from './indexedDbSpecialty';
