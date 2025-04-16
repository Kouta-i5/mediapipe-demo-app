import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addRecord } from '../utils/recordStorage'; // ← 必要に応じて
import { Condition } from '../types/models';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Confirm'>;

export default function ConfirmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { videoUri, patientId, condition } = route.params as HomeStackParamList['Confirm'];
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);

  const handleSave = async () => {
    try {
      await addRecord({
        patientId,
        videoPath: videoUri,
        conditions: [condition],
      });

      Alert.alert('保存完了', '動画の保存が完了しました。', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
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

      <Video
        style={styles.video}
        source={{ uri: videoUri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
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
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
  },
});

