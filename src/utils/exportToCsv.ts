import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function exportToCsv(filename: string, headers: string[], rows: string[][]) {
  const csvContent =
    [headers.join(',')]
    .concat(rows.map((row) => row.map(v => `"${v}"`).join(',')))
    .join('\n');

  const path = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(path, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path);
  }

  return path;
}