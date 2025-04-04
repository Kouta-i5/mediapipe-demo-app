import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './HomeStackNavigator';
import PatientListScreen from '../screens/PatientListScreen';
import VideoListScreen from '../screens/VideoListScreen';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="HomeTab">
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'ホーム' }} />
        <Tab.Screen name="PatientsTab" component={PatientListScreen} options={{ title: '患者一覧' }} />
        <Tab.Screen name="VideosTab" component={VideoListScreen} options={{ title: '動画一覧' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
