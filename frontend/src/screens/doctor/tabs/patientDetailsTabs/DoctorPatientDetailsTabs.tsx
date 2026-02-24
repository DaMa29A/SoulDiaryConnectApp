import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../../constants/Colors'; 
import { commonStyles } from '../../../../styles/CommonStyles';
import { Ionicons } from '@expo/vector-icons';
import NoteListScreen from './tabs/NoteListScreen';
import Navbar from '../../../../components/nav/Navbar';
import SummaryScreen from './tabs/SummaryScreen';
import MoodScreen from './tabs/MoodScreen';
import Avatar from '../../../../components/avatar/Avatar';

const Tab = createMaterialTopTabNavigator();

function PatientTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Note"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          if (route.name === 'Note') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Summary') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Mood') {
            iconName = focused ? 'happy' : 'happy-outline';
          }

          return <Ionicons name={iconName} size={18} color={color} />;
        },
        tabBarShowIcon: true,
        tabBarItemStyle: { 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center' 
        },
        tabBarLabelStyle: { 
          fontSize: 13, 
          fontWeight: '600', 
          textTransform: 'none',
          marginLeft: 8,
        },
        tabBarIndicatorStyle: { 
          backgroundColor: Colors.primary, 
          height: 3,
          borderRadius: 3
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: { 
          elevation: 0, 
          shadowOpacity: 0, 
          borderBottomWidth: 1, 
          borderBottomColor: Colors.borderInput, 
          backgroundColor: Colors.white 
        },
      })}
    >
      <Tab.Screen 
        name="Note" 
        component={NoteListScreen} 
        options={{ title: 'Diario' }} 
      />
      <Tab.Screen 
        name="Summary" 
        component={SummaryScreen}
        options={{ title: 'Riassunto' }} 
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodScreen} 
        options={{ title: 'Umore' }} 
      />
    </Tab.Navigator>
  );
}

export default function DoctorPatientDetailsTabs() {
  const patient = {
    firstName: "Mario",
    lastName: "Rossi",
    codiceFiscale: "RSSMRA80A01H501U",
    dataDiNascita: "01/01/1980"
  };

  return (
    <SafeAreaView style={commonStyles.safe_container_log} edges={['top', 'bottom']}>
        <Navbar showBackArrow={true}/>
        
        {/* --- HEADER PATIENT --- */}
        <View style={styles.patientHeader}>
          <Avatar 
            firstName={patient.firstName} 
            lastName={patient.lastName} 
          />

          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>
              {patient.firstName} {patient.lastName}
            </Text>
            
            <View style={styles.badgeContainer}>
              
              {/* Badge CF */}
              <View style={[styles.badge, { backgroundColor: Colors.background }]}>
                <Text style={[styles.badgeText, { color: Colors.primary, marginLeft: 0, marginRight: 4 }]}>CF: </Text>
                <Text style={[styles.badgeText, { color: Colors.grey, marginLeft: 0 }]}>
                  {patient.codiceFiscale}
                </Text>
              </View>

              {/* Badge Date */}
              <View style={[styles.badge, { backgroundColor: Colors.background }]}>
                <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                <Text style={[styles.badgeText, { color: Colors.grey }]}>
                  {patient.dataDiNascita}
                </Text>
              </View>

            </View>
          </View>
        </View>

        {/* --- TABS --- */}
        <View style={commonStyles.container_log}>
          <PatientTabsNavigator />
        </View>
        
        <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInput,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap', 
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase', 
  }
});