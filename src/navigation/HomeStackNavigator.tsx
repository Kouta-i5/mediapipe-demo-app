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
      <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      <Stack.Screen name="PatientForm" options={{ headerShown: false }} component={PatientFormScreen} />
      <Stack.Screen name="ConditionInput" options={{ headerShown: false }} component={ConditionInputScreen} />
      <Stack.Screen name="VideoCapture" options={{ headerShown: false }} component={VideoCaptureScreen} />
      <Stack.Screen name="Confirm" options={{ headerShown: false }} component={ConfirmScreen} />
      <Stack.Screen name="VideoList" options={{ headerShown: false }} component={VideoListScreen} />
    </Stack.Navigator>
  );
}
