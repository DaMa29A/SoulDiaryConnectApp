import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Platform } from 'react-native';

// Schermate
import DoctorHomeScreen from './DoctorHomeScreen';
import DoctorProfileScreen from './DoctorProfileScreen';

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary || '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'ListaPazienti') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ProfiloMedico') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="ListaPazienti" 
        component={DoctorHomeScreen} 
        options={{ title: 'Pazienti' }} 
      />
      <Tab.Screen 
        name="ProfiloMedico" 
        component={DoctorProfileScreen} 
        options={{ title: 'Profilo' }} 
      />
    </Tab.Navigator>
  );
}