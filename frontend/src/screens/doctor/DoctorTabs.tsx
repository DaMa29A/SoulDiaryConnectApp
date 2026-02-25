import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Colors } from '../../constants/Colors';
import DoctorListPatientsScreen from './tabs/DoctorListPatientsScreen';
import DoctorProfileScreen from './tabs/DoctorProfileScreen';

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Pazienti" 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textGray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';
          if (route.name === 'Pazienti') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profilo') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Pazienti" 
        component={DoctorListPatientsScreen} 
      />

      <Tab.Screen 
        name="Profilo" 
        component={DoctorProfileScreen} 
      />

    </Tab.Navigator>
  );
}