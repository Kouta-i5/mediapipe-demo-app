// navigation/VideoListNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoListScreen from '../screens/VideoListScreen';
import { VideoListStackParamList } from '../types/navigation';
import VideoDetailScreen from '../screens/VideoDetailScreen';

const Stack = createNativeStackNavigator<VideoListStackParamList>();

export default function VideoListNavigator() {
  return (
    <Stack.Navigator initialRouteName="VideoList">
      <Stack.Screen
        name="VideoList"
        component={VideoListScreen} 
      />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
      />
    </Stack.Navigator>
  );
}