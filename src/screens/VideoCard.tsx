import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';
import { RecordSchema } from '../types/models';

export default function VideoCard({ record }: { record: RecordSchema }) {
  const uri = record.videoPath.startsWith('file://') ? record.videoPath : FileSystem.documentDirectory + record.videoPath;
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
  });

  const condition = record.conditions?.[0];

  return (
    <View style={styles.card}>
      <Text style={styles.label}>患者ID: {record.patientId}</Text>
      <Text style={styles.label}>撮影日: {new Date(record.createdAt).toLocaleDateString()}</Text>
      {condition && (
        <>
          <Text style={styles.conditionText}>足場: {condition.footCondition}</Text>
          <Text style={styles.conditionText}>立ち方: {condition.standingCondition}</Text>
          <Text style={styles.conditionText}>開脚幅: {condition.legWidth} cm</Text>
        </>
      )}
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
  label: { fontSize: 16, fontWeight: 'bold' },
  conditionText: { fontSize: 14, marginTop: 2 },
  video: {
    height: 200,
    width: '100%',
    marginTop: 12,
    backgroundColor: '#000',
  },
});
