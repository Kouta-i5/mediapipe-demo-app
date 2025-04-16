import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getRecords } from '../utils/recordStorage';
import { RecordSchema } from '../types/models';

export default function VideoListScreen() {
  const [records, setRecords] = useState<RecordSchema[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchRecords();
  }, []);

  const renderItem = ({ item }: { item: RecordSchema }) => {
    const condition = item.conditions?.[0];

    return (
      <View style={styles.card}>
        <Text style={styles.label}>患者ID: {item.patientId}</Text>
        <Text style={styles.label}>撮影日: {new Date(item.createdAt).toLocaleDateString()}</Text>
        {condition && (
          <>
            <Text style={styles.conditionText}>足場: {condition.footCondition}</Text>
            <Text style={styles.conditionText}>立ち方: {condition.standingCondition}</Text>
            <Text style={styles.conditionText}>開脚幅: {condition.legWidth} cm</Text>
          </>
        )}
        <Video
          style={styles.video}
          source={{ uri: item.videoPath }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="再読み込み" onPress={fetchRecords} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  list: { paddingBottom: 40 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  label: { fontSize: 16, fontWeight: 'bold' },
  conditionText: { fontSize: 14, marginTop: 2 },
  video: {
    height: 200,
    width: '100%',
    marginTop: 12,
    backgroundColor: '#000',
  },
  buttonContainer: {
    marginTop: 16,
  },
});



