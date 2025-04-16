import * as FileSystem from 'expo-file-system';

export async function readJsonFile<T>(path: string): Promise<T[]> {
  const file = await FileSystem.getInfoAsync(path);
  if (!file.exists) {
    await FileSystem.writeAsStringAsync(path, JSON.stringify([]));
    return [];
  }

  const content = await FileSystem.readAsStringAsync(path);
  return JSON.parse(content) as T[];
}

export async function writeJsonFile<T>(path: string, data: T[]): Promise<void> {
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
}