import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text } from 'react-native';

// Importa la schermata principale
// Nota: Se il file si trova in '../screens/DiaryScreen', aggiusta il percorso
import DiaryScreen from './DiaryScreen';
import DoctorScreen from './DoctorScreen';
import ProfileScreen from './ProfileScreen';

// Placeholder per le pagine non ancora create
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Pagina {name}</Text>
    <Text style={{ color: '#666', marginTop: 10 }}>In costruzione</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Diario" // Imposta la tab di apertura
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        // Logica per le icone personalizzata per le 3 tab richieste
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help'; // Default

          if (route.name === 'Diario') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Medico') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          } else if (route.name === 'Profilo') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 1. DIARIO (Uso la PatientHome qui come dashboard principale) */}
      <Tab.Screen 
        name="Diario" 
        component={DiaryScreen} 
      />

      {/* 2. MEDICO */}
      <Tab.Screen 
        name="Medico" 
        component={DoctorScreen} 
      />

      {/* 3. PROFILO */}
      <Tab.Screen 
        name="Profilo" 
        component={ProfileScreen} 
      />
      
    </Tab.Navigator>
  );
}