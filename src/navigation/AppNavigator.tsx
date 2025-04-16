import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './HomeStackNavigator';
import PatientListNavigator from './PatientListNavigator';
import VideoListScreen from '../screens/VideoListScreen';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="HomeTab">
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="PatientsTab" component={PatientListNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="VideosTab" component={VideoListScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
