// ConfirmScreen.tsx
import React from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addRecord } from '../utils/recordStorage';
import * as FileSystem from 'expo-file-system';
import { useVideoPlayer, VideoView } from 'expo-video';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Confirm'>;

export default function ConfirmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { videoUri, patientId, condition } = route.params as HomeStackParamList['Confirm'];

  const resolvedUri =
    videoUri.startsWith('file://') || videoUri.startsWith('http')
      ? videoUri
      : FileSystem.documentDirectory + videoUri;

  const player = useVideoPlayer(resolvedUri, (player) => {
    player.loop = true;
    player.play();
  });

  const handleSave = async () => {
    try {
      await addRecord({
        patientId,
        videoPath: videoUri, // 相対パスで保存
        conditions: [condition],
      });

      Alert.alert('保存完了', '動画の保存が完了しました。', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('VideoList'),
        },
      ]);
    } catch (error) {
      console.error('保存エラー:', error);
      Alert.alert('エラー', '動画の保存に失敗しました。');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientText}>患者ID: {patientId}</Text>
        <Text style={styles.patientText}>足場の条件: {condition.footCondition}</Text>
        <Text style={styles.patientText}>立ち方の条件: {condition.standingCondition}</Text>
        <Text style={styles.patientText}>開脚幅: {condition.legWidth} cm</Text>
      </View>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View style={styles.buttonContainer}>
        <Button title="動画を保存" onPress={handleSave} />
        <Button
          title="録画画面に戻る"
          onPress={() =>
            navigation.navigate('VideoCapture', {
              patientId,
              condition,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  patientInfo: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  patientText: {
    fontSize: 16,
    marginBottom: 8,
  },
  video: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 12,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
});