// navigation/VideoListNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoListScreen from '../screens/VideoListScreen';
import { VideoListStackParamList } from '../types/navigation';

export type VideoStackParamList = {
  VideoList: undefined;
  // VideoDetail: { videoId: string }; ← 必要に応じて
};

const Stack = createNativeStackNavigator<VideoStackParamList>();

export default function VideoListNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VideoList"
        component={VideoListScreen}
        options={{ title: '動画一覧' }}
      />
      {/* 
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{ title: '動画詳細' }}
      />
      */}
    </Stack.Navigator>
  );
}