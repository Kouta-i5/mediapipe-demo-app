//VideoCaptureScreen_mediapipe.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import {
  MediapipeCamera,
  useObjectDetection,
  RunningMode,
} from 'react-native-mediapipe';
import { Camera } from 'react-native-vision-camera';

export default function VideoCaptureScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const solution = useObjectDetection(
    (result) => {
      if (recording) {
        console.log('検出結果:', result);
      }
    },
    (error) => console.error('エラー:', error),
    RunningMode.VIDEO,
    'efficientdet_lite0.tflite'
  );

   //カメラ許可の取得
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'denied') {
        console.warn('カメラのアクセス許可がありません');
      }
    })();
  }, []);

  const startRecording = () => {
    setRecording(true);
    setTimer(30);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    console.log('録画終了');
  };

  return (
    <View style={styles.container}>
      {hasPermission && (
        <View style={styles.mediapipe}>
          <MediapipeCamera style={styles.mediapipe} solution={solution} />
        </View>
      )}
      <View style={styles.controls}>
        {recording ? (
          <Text style={styles.timer}>残り: {timer}秒</Text>
        ) : (
          <Button title="30秒録画開始" onPress={startRecording} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mediapipe: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});