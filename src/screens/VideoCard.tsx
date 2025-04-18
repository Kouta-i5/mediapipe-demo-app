//VideoCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VideoListStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecordSchema } from '../types/models';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';

type NavigationProp = NativeStackNavigationProp<VideoListStackParamList, 'VideoDetail'>;

type Props = {
  record: RecordSchema;
  onDelete: (uuid: string) => void;
  onShare: (uuid: string) => void;
};

export default function VideoCard({ record, onDelete, onShare }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const uri = record.videoPath.startsWith('file://') ? record.videoPath : FileSystem.documentDirectory + record.videoPath;
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  const handleDetailPress = () => {
    console.log('Navigating to VideoDetail with recordId:', record.recordId);
    navigation.navigate('VideoDetail', { recordId: record.recordId });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.label}>患者ID: {record.patientId}</Text>
          <Text style={styles.conditionText}>
            撮影日: {new Date(record.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={handleDetailPress}
          >
            <Text style={styles.detailButtonText}>詳細</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(record.uuid)}
          >
            <Text style={styles.deleteButtonText}>削除</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => onShare(record.uuid)}
          >
            <Text style={styles.downloadButtonText}>共有</Text>
          </TouchableOpacity>
        </View>
      </View>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  label: { fontSize: 16, fontWeight: 'bold' },
  conditionText: { fontSize: 14, marginTop: 2 },
  video: {
    height: 200,
    width: '100%',
    backgroundColor: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

