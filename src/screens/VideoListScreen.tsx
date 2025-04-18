//VideoListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { getRecords, deleteRecordAndFile } from '../utils/recordStorage';
import { getPatients } from '../utils/patientStorage'; 
import { exportToCsv } from '../utils/exportToCsv';
import { RecordSchema, PatientSchema } from '../types/models';
import VideoCard from './VideoCard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'VideoList'>;

export default function VideoListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [records, setRecords] = useState<RecordSchema[]>([]);
  const [patients, setPatients] = useState<PatientSchema[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const recs = await getRecords();
      const pats = await getPatients();
      setRecords(recs);
      setPatients(pats);
    } catch (error) {
      console.error('記録一覧の取得に失敗しました', error);
      Alert.alert(
        'エラー',
        '記録一覧の取得に失敗しました。アプリを再起動してください。'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (uuid: string) => {
    Alert.alert('削除確認', 'この動画を削除しますか？', [
      { text: 'キャンセル' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRecordAndFile(uuid);
            fetchData();
          } catch (error) {
            console.error('削除に失敗しました', error);
            Alert.alert('エラー', '動画の削除に失敗しました');
          }
        },
      },
    ]);
  };

  const handleExportCsv = async () => {
    if (records.length === 0) {
      Alert.alert('出力できるデータがありません');
      return;
    }

    const headers = [
      'patientId', 'name', 'age', 'gender', 'height', 'weight',
      'recordUUID', 'createdAt', 'videoPath',
      'conditionIndex', 'footCondition', 'standingCondition', 'legWidth',
    ];

    const rows: (string | number)[][] = records.flatMap((record) => {
      const patient = patients.find(p => p.uuid === record.patientId);
      return record.conditions.map((cond, index) => [
        patient?.patientId ?? '',
        patient?.name ?? '',
        patient?.age ?? '',
        patient?.gender ?? '',
        patient?.height ?? '',
        patient?.weight ?? '',
        record.uuid,
        record.createdAt,
        record.videoPath,
        index + 1,
        cond.footCondition,
        cond.standingCondition,
        cond.legWidth,
      ]);
    });

    const fileName = `record_export_${new Date().toISOString()}`;
    const result = await exportToCsv(fileName, headers, rows);

    if (!result) {
      Alert.alert('エクスポート失敗', 'CSV出力に失敗しました。');
    }
  };

  const handleShare = async (uuid: string) => {
    try {
      // 1. 対象のレコードを取得
      const record = records.find(r => r.uuid === uuid);
      if (!record) {
        Alert.alert('エラー', '動画が見つかりませんでした');
        return;
      }

      // 2. 保存対象パスを整形
      const uri = record.videoPath.startsWith('file://')
        ? record.videoPath
        : FileSystem.documentDirectory + record.videoPath;
  
      // 3. ファイルが存在するか確認
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        Alert.alert('エラー', '動画ファイルが見つかりませんでした');
        return;
      }

      // 4. ファイルのコピーを作成
      const fileName = `video_${record.uuid}.mp4`;
      const copyPath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: copyPath,
      });
  
      // 5. 共有ダイアログを表示
      await Sharing.shareAsync(copyPath, {
        mimeType: 'video/mp4',
        dialogTitle: '動画を共有',
        UTI: 'public.mpeg-4',
      });
    } catch (error) {
      console.error('共有エラー:', error);
      Alert.alert('エラー', '動画の共有中にエラーが発生しました。');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <>
          <View style={styles.header}>
            <Button title="CSVを出力して共有" onPress={handleExportCsv} />
          </View>
          <FlatList
            data={records}
            keyExtractor={(item) => item.uuid}
            renderItem={({ item }) => (
              <VideoCard 
                record={item} 
                onDelete={handleDelete} 
                onShare={handleShare}
              />
            )}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  list: { padding: 16, paddingBottom: 40 },
});




