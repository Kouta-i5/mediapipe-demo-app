import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Text, Alert } from 'react-native';
import {
  MediapipeCamera,
  useObjectDetection,
  RunningMode,
} from 'react-native-mediapipe';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { HomeStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const DURATION_SECONDS = 30;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'VideoCapture'>;
type RouteType = RouteProp<HomeStackParamList, 'VideoCapture'>;

export default function VideoCaptureScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { patientId, condition } = route.params;

  const [hasPermission, setHasPermission] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(DURATION_SECONDS);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: 30 },
  ]);

  const solution = useObjectDetection(
    (result) => {
      if (recording) {
        console.log('検出結果:', result);
      }
    },
    (error) => console.error('Mediapipe エラー:', error),
    RunningMode.VIDEO,
    'efficientdet_lite0.tflite'
  );

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const micPermission = await Camera.requestMicrophonePermission();
      setHasPermission(
        cameraPermission === 'granted' && micPermission === 'granted'
      );
    })();
  }, []);

  const startRecording = async () => {
    if (!camera.current || recording) return;

    setRecording(true);
    setTimer(DURATION_SECONDS);
    setRecordedVideo(null);

    try {
      await camera.current.startRecording({
        onRecordingFinished: (video) => {
          setRecordedVideo(video.path);
          Alert.alert('録画完了', '動画の録画が完了しました。', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Confirm', {
                  videoUri: video.path,
                  patientId,
                  condition,
                });
              },
            },
          ]);
        },
        onRecordingError: (error) => {
          console.error('録画エラー:', error);
          setRecording(false);
          Alert.alert('エラー', '録画中にエラーが発生しました。');
        },
      });

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('録画開始エラー:', error);
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      Alert.alert('エラー', '録画を開始できませんでした。');
    }
  };

  const stopRecording = async () => {
    if (!camera.current) return;

    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      await camera.current.stopRecording();
    } catch (error) {
      console.error('録画停止エラー:', error);
      Alert.alert('エラー', '録画を停止できませんでした。');
    }
  };

  const handleNewRecording = () => {
    setRecordedVideo(null);
    startRecording();
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>カメラとマイクのアクセス許可が必要です</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>カメラデバイスが見つかりません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        isActive={true}
        video={true}
        audio={true}
      />
      <View style={styles.controls}>
        {recording ? (
          <Text style={styles.timerText}>⏱️ 残り: {timer}秒</Text>
        ) : recordedVideo ? (
          <View style={styles.postControls}>
            <Button title="再撮影" onPress={handleNewRecording} />
            <Button
              title="動画を確認"
              onPress={() =>
                navigation.navigate('Confirm', {
                  videoUri: recordedVideo,
                  patientId,
                  condition,
                })
              }
            />
          </View>
        ) : (
          <Button title="30秒録画開始" onPress={startRecording} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  postControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
});