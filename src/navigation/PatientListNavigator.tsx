import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientListScreen from '../screens/PatientListScreen';
import PatientDetailScreen from '../screens/PatientDetailScreen';
import { PatientListStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<PatientListStackParamList>();

    export default function PatientListNavigator() {
  return (
    <Stack.Navigator initialRouteName="PatientList">
      <Stack.Screen name="PatientList" options={{ headerShown: false }} component={PatientListScreen} />
      <Stack.Screen name="PatientDetail" options={{ headerShown: false }} component={PatientDetailScreen} />
    </Stack.Navigator>
  );
}