import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import { RecordSchema } from '../types/models';
type Props = {
  record: RecordSchema;
  onShare: (uuid: string) => void;
  onDelete: (uuid: string) => void;
};

export default function VideoCard({ record, onDelete, onShare }: Props) {
  const uri = record.videoPath.startsWith('file://') ? record.videoPath : FileSystem.documentDirectory + record.videoPath;
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  const condition = record.conditions?.[0];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.label}>動画ID: {record.uuid}</Text>
          <Text style={styles.label}>患者ID: {record.patientId}</Text>
          <Text style={styles.label}>撮影日: {new Date(record.createdAt).toLocaleDateString()}</Text>
          {condition && (
            <>
              <Text style={styles.conditionText}>足場: {condition.footCondition}</Text>
              <Text style={styles.conditionText}>立ち方: {condition.standingCondition}</Text>
              <Text style={styles.conditionText}>開脚幅: {condition.legWidth} cm</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => onShare(record.uuid)}
        >
          <Text style={styles.downloadButtonText}>共有</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(record.uuid)}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
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

