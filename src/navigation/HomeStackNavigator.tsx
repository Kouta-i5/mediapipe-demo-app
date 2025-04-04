import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import VideoCaptureScreen from '../screens/VideoListScreen';
import ConfirmScreen from '../screens/ConfirmScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PatientForm" component={PatientFormScreen} />
      <Stack.Screen name="VideoCapture" component={VideoCaptureScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
    </Stack.Navigator>
  );
}

