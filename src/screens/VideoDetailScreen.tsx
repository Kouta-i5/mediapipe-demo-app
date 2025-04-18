//VideoDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import { getRecords } from '../utils/recordStorage';
import { RecordSchema } from '../types/models';
import { VideoListStackParamList } from '../types/navigation';

type RouteType = RouteProp<VideoListStackParamList, 'VideoDetail'>;

export default function VideoDetailScreen() {
  const route = useRoute<RouteType>();
  const { recordId } = route.params;
  const [record, setRecord] = useState<RecordSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string>('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        console.log('Fetching record with ID:', recordId);
        const all = await getRecords();
        console.log('All records:', all);
        const target = all.find((r) => r.recordId === recordId) || null;
        console.log('Found record:', target);
        if (!target) {
          setError('該当する動画が見つかりませんでした。');
          return;
        }
        setRecord(target);
        const uri = target.videoPath.startsWith('file://') || target.videoPath.startsWith('http')
          ? target.videoPath
          : FileSystem.documentDirectory + target.videoPath;
        setVideoUri(uri);
        console.log('Video URI:', uri);
      } catch (err) {
        console.error('動画の取得に失敗しました:', err);
        setError('動画の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [recordId]);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.debugText}>Loading record ID: {recordId}</Text>
      </View>
    );
  }

  if (error || !record) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || '該当する動画が見つかりませんでした。'}</Text>
        <Text style={styles.debugText}>Record ID: {recordId}</Text>
      </View>
    );
  }

  const condition = record.conditions?.[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>動画詳細</Text>
      <Text style={styles.debugText}>Record ID: {recordId}</Text>

      {videoUri && (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      )}

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
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  debugText: { fontSize: 12, color: '#666', marginTop: 8 },
});