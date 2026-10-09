import { getDb } from './indexedDb';
import type {
  AcuteDecisionNode,
  TemperamentProfile,
  SehgalScript,
  ScholtenElement,
  KentObservationRule,
} from '@/features/expert-systems/types';
import type { PolarSymptomPair } from '@/features/repertory/types';

export async function getLocalAcuteNodes(): Promise<AcuteDecisionNode[]> {
  const db = await getDb();
  return db.getAll('acute_nodes');
}

export async function getLocalAcuteNodeByKey(
  nodeKey: string
): Promise<AcuteDecisionNode | undefined> {
  const all = await getLocalAcuteNodes();
  return all.find((n) => n.nodeKey === nodeKey);
}

export async function getLocalTemperaments(): Promise<TemperamentProfile[]> {
  const db = await getDb();
  return db.getAll('temperaments');
}

export async function getLocalSehgalScripts(): Promise<SehgalScript[]> {
  const db = await getDb();
  return db.getAll('sehgal_scripts');
}

export async function getLocalScholtenElements(): Promise<ScholtenElement[]> {
  const db = await getDb();
  return db.getAll('element_mappings');
}

export async function getLocalPolarPairs(): Promise<PolarSymptomPair[]> {
  const db = await getDb();
  return db.getAll('polar_pairs');
}

export async function getLocalKentObservations(): Promise<KentObservationRule[]> {
  const db = await getDb();
  return db.getAllFromIndex('kent_observations', 'byNumber');
}
