import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigator from './HomeStackNavigator';
import PatientListNavigator from './PatientListNavigator';
import VideoListScreen from '../screens/VideoListScreen';
import { TabParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<TabParamList>();

const iconMap: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  PatientsTab: 'people',
  VideosTab: 'videocam',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconMap[route.name]} size={size} color={color} />
          ),
          headerShown: false,
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
        <Tab.Screen name="PatientsTab" component={PatientListNavigator} />
        <Tab.Screen name="VideosTab" component={VideoListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}