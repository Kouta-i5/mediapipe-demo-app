import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function escapeCSVValue(value: any): string {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replace(/"/g, '""'); // " → ""
  return `"${escaped}"`; // 常にダブルクォートで囲む
}

export async function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): Promise<string | null> {
  try {
    // 拡張子強制
    const fullFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;

    // 1. ヘッダー行 + データ行
    const csvLines = [headers.map(escapeCSVValue).join(',')];
    rows.forEach(row => {
      csvLines.push(row.map(escapeCSVValue).join(','));
    });

    // 2. UTF-8 with BOM 対応（Excel用）
    const BOM = '\uFEFF'; // Byte Order Mark
    const csvContent = BOM + csvLines.join('\n');

    // 3. ファイル書き出し
    const path = `${FileSystem.documentDirectory}${fullFilename}`;
    await FileSystem.writeAsStringAsync(path, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 4. 共有
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path);
    } else {
      console.warn('共有できるアプリが見つかりませんでした');
    }

    return path;
  } catch (error) {
    console.error('CSV出力エラー:', error);
    return null;
  }
}