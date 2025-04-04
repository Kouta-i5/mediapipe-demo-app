import * as FileSystem from 'expo-file-system';
import { Patient, Record } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

// ファイルパス定義
const PATIENTS_PATH = `${FileSystem.documentDirectory}patients.json`;
const RECORDS_PATH = `${FileSystem.documentDirectory}records.json`;

// ヘルパー：ファイル読み込み
async function readJsonFile<T>(path: string): Promise<T[]> {
  const file = await FileSystem.getInfoAsync(path);
  if (!file.exists) {
    await FileSystem.writeAsStringAsync(path, JSON.stringify([]));
    return [];
  }

  const content = await FileSystem.readAsStringAsync(path);
  return JSON.parse(content) as T[];
}

// ヘルパー：ファイル書き込み
async function writeJsonFile<T>(path: string, data: T[]): Promise<void> {
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
}

//
// ==== Patients ====
//

// 全患者データを取得
export async function getPatients(): Promise<Patient[]> {
  return readJsonFile<Patient>(PATIENTS_PATH);
}

// 新しい患者を追加（UUIDや日時も自動生成）
export async function addPatient(
  input: Omit<Patient, 'id' | 'patientId' | 'createdAt'>
): Promise<Patient> {
  const uuid = uuidv4();
  const newPatient: Patient = {
    id: uuid,
    patientId: `PT-${uuid.slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };

  const patients = await getPatients();
  patients.push(newPatient);
  await writeJsonFile(PATIENTS_PATH, patients);

  return newPatient;
}

//
// ==== Records ====
//

// 全記録データを取得
export async function getRecords(): Promise<Record[]> {
  return readJsonFile<Record>(RECORDS_PATH);
}

// 新しい記録を追加（UUIDと撮影日時を自動生成）
export async function addRecord(
  input: Omit<Record, 'id' | 'timestamp'>
): Promise<Record> {
  const newRecord: Record = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...input,
  };

  const records = await getRecords();
  records.push(newRecord);
  await writeJsonFile(RECORDS_PATH, records);

  return newRecord;
}

