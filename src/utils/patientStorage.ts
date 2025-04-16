import * as FileSystem from 'expo-file-system';
import { PatientSchema, PatientCreateSchema } from '../types/models';
import { generateUUID, generatePatientId } from './generateId';
import { readJsonFile, writeJsonFile } from './storageUtils';

const PATIENTS_PATH = `${FileSystem.documentDirectory}patients.json`;

export async function getPatients(): Promise<PatientSchema[]> {
  return readJsonFile<PatientSchema>(PATIENTS_PATH);
}

// 患者を追加する
export async function addPatient(input: PatientCreateSchema): Promise<PatientSchema> {
  const uuid = generateUUID();
  const newPatient: PatientSchema = {
    uuid,
    patientId: generatePatientId(uuid),
    createdAt: new Date().toISOString(),
    ...input,
  };

  const patients = await getPatients();
  patients.push(newPatient);
  await writeJsonFile(PATIENTS_PATH, patients);
  return newPatient;
}

// 患者を削除する
export async function deletePatient(uuid: string): Promise<void> {
  const patients = await getPatients();
  const updated = patients.filter((p) => p.uuid !== uuid);
  await writeJsonFile(PATIENTS_PATH, updated);
}

// 患者を更新する
export async function updatePatient(uuid: string, input: PatientCreateSchema): Promise<PatientSchema> {
  const patients = await getPatients();
  const index = patients.findIndex((p) => p.uuid === uuid);
  if (index === -1) {
    throw new Error('患者が見つかりません');
  }
  const updatedPatient = { ...patients[index], ...input };
  patients[index] = updatedPatient;
  await writeJsonFile(PATIENTS_PATH, patients);
  return updatedPatient;
}
