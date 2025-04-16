import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getRecords, deleteRecordAndFile } from '../utils/recordStorage';
import { RecordSchema } from '../types/models';
import VideoCard from './VideoCard';

export default function VideoListScreen() {
  const [records, setRecords] = useState<RecordSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error('記録一覧の取得に失敗しました', error);
    }
    setLoading(false);
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
            fetchRecords(); // 一覧を再取得して更新
          } catch (error) {
            console.error('削除に失敗しました', error);
            Alert.alert('エラー', '動画の削除に失敗しました');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <VideoCard record={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  list: { paddingBottom: 40 },
  buttonContainer: {
    marginTop: 16,
  },
});




