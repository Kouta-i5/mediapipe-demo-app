import uuid from 'react-native-uuid';

export function generateUUID(): string {
  return uuid.v4() as string;
}

export function generatePatientId(uuid: string): string {
  return `PT-${uuid.slice(0, 8)}`;
}

export function generateRecordId(uuid: string): string {
  return `RC-${uuid.slice(0, 8)}`;
}