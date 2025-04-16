import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { getRecords } from '../utils/recordStorage';
import { RecordSchema } from '../types/models';
import { VideoListStackParamList } from '../types/navigation';

type RouteType = RouteProp<VideoListStackParamList, 'VideoDetail'>;

export default function VideoDetailScreen() {
  const route = useRoute<RouteType>();
  const { recordId } = route.params;
  const [record, setRecord] = useState<RecordSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      const all = await getRecords();
      const target = all.find((r) => r.uuid === recordId) || null;
      setRecord(target);
      setLoading(false);
    };
    fetchRecord();
  }, [recordId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.centered}>
        <Text>該当する動画が見つかりませんでした。</Text>
      </View>
    );
  }

  const condition = record.conditions?.[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>動画詳細</Text>

      <Video
        style={styles.video}
        source={{ uri: record.videoPath }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />

      <View style={styles.info}>
        <Text style={styles.label}>患者ID: {record.patientId}</Text>
        <Text style={styles.label}>撮影日時: {new Date(record.createdAt).toLocaleString()}</Text>
        {condition && (
          <>
            <Text style={styles.label}>足場の条件: {condition.footCondition}</Text>
            <Text style={styles.label}>立ち方の条件: {condition.standingCondition}</Text>
            <Text style={styles.label}>開脚幅: {condition.legWidth} cm</Text>
          </>
        )}
        <Text style={styles.label}>動画パス: {record.videoPath}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  info: { marginTop: 8 },
  label: { fontSize: 16, marginBottom: 8 },
});