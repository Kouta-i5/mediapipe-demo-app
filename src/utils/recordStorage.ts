import * as FileSystem from 'expo-file-system';
import { RecordSchema, RecordCreateSchema } from '../types/models';
import { generateUUID } from './generateId';
import { readJsonFile, writeJsonFile } from './storageUtils';

const RECORDS_PATH = `${FileSystem.documentDirectory}records.json`;

export async function getRecords(): Promise<RecordSchema[]> {
  return readJsonFile<RecordSchema>(RECORDS_PATH);
}

export async function addRecord(input: RecordCreateSchema): Promise<RecordSchema> {
  const uuid = generateUUID();
  const newRecord: RecordSchema = {
    uuid,
    createdAt: new Date().toISOString(),
    ...input,
  };

  const records = await getRecords();
  records.push(newRecord);
  await writeJsonFile(RECORDS_PATH, records);
  return newRecord;
}

export async function deleteRecord(uuid: string): Promise<void> {
  const records = await getRecords();
  const updated = records.filter((r) => r.uuid !== uuid);
  await writeJsonFile(RECORDS_PATH, updated);
}
