import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from './src/screens/IndexScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; 
import PatientTabs from './src/screens/patient/PatientTabs';
import NoteDetailScreen from './src/screens/patient/NoteDetailScreen';
import DoctorTabs from './src/screens/doctor/DoctorTabs';
import DoctorPatientScreen from './src/screens/doctor/patient_details/DoctorPatientScreen';


export type RootStackParamList = {
  Index: undefined;
  Login: undefined;
  Register: undefined;
  PatientHome: undefined;
  DoctorHome: undefined;
  // Assicurati che il nome qui corrisponda a quello nel Stack.Screen sotto
  DoctorPatientScreen: { patientId: string; patientName: string };
  NoteDetail: { noteId: string | number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen 
          name="Index" 
          component={IndexScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PatientHome" 
          component={PatientTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DoctorHome" 
          component={DoctorTabs} 
          options={{ headerShown: false }} 
        />
        
        {/* AGGIUNTA ROTTA MANCANTE */}
        <Stack.Screen 
          name="DoctorPatientScreen" 
          component={DoctorPatientScreen} 
          options={{ headerShown: false }} // Usiamo l'header personalizzato interno
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}