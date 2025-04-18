//HomeStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import VideoCaptureScreen from '../screens/VideoCaptureScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import ConditionInputScreen from '../screens/ConditionInputScreen';
import VideoListScreen from '../screens/VideoListScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PatientForm" component={PatientFormScreen} />
      <Stack.Screen name="ConditionInput" component={ConditionInputScreen} />
      <Stack.Screen name="VideoCapture" component={VideoCaptureScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
      <Stack.Screen name="VideoList" component={VideoListScreen} />
    </Stack.Navigator>
  );
}
