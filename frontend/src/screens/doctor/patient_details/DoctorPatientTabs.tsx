import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

const Tab = createMaterialTopTabNavigator();

// --- SCHERMATA NOTE ---
function PatientNotesScreen() {
  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Ultimi Diari</Text>
      <View style={styles.noteCard}>
        <Text style={styles.noteDate}>16 Ottobre, 14:30</Text>
        <Text style={styles.noteText}>Oggi mi sento un po' meglio rispetto a ieri. Ho fatto una passeggiata e l'ansia è diminuita.</Text>
      </View>
      <View style={[styles.noteCard, { borderLeftColor: '#FFD166' }]}>
        <Text style={styles.noteDate}>15 Ottobre, 09:15</Text>
        <Text style={styles.noteText}>Risveglio difficile, tachicardia leggera. Ho praticato la respirazione.</Text>
      </View>
      <View style={styles.noteCard}>
        <Text style={styles.noteDate}>12 Ottobre, 21:00</Text>
        <Text style={styles.noteText}>Giornata tranquilla. Ho incontrato un amico.</Text>
      </View>
    </ScrollView>
  );
}

// --- SCHERMATA CASO ---
function PatientCaseScreen() {
  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.sectionTitle}>Scheda Clinica</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Diagnosi Principale</Text>
        <Text style={styles.value}>Disturbo d'Ansia Generalizzata (GAD)</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Terapia Farmacologica</Text>
        <Text style={styles.value}>Sertralina 50mg (1 cp/die)</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Note Anamnestiche</Text>
        <Text style={styles.value}>Il paziente riferisce episodi di insonnia frequenti. In trattamento da 6 mesi.</Text>
      </View>
    </ScrollView>
  );
}

// --- SCHERMATA GRAFICO ---
function PatientMoodScreen() {
  const data = [
    { day: 'Lun', value: 40, color: '#FF6B6B' },
    { day: 'Mar', value: 60, color: '#FFD166' },
    { day: 'Mer', value: 50, color: '#FFD166' },
    { day: 'Gio', value: 80, color: '#4CD964' },
    { day: 'Ven', value: 90, color: '#4CD964' },
    { day: 'Sab', value: 70, color: '#4CD964' },
    { day: 'Dom', value: 55, color: '#FFD166' },
  ];

  return (
    <ScrollView style={styles.tabContainer}>
      <Text style={styles.sectionTitle}>Andamento Settimanale</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.moodLabel}>{item.value}</Text>
            <View style={[styles.bar, { height: item.value * 1.5, backgroundColor: item.color }]} />
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Ionicons name="trending-up" size={20} color="#4CD964" />
          <Text style={styles.aiTitle}>Analisi AI</Text>
        </View>
        <Text style={styles.aiText}>L'umore mostra un trend positivo verso il fine settimana.</Text>
      </View>
    </ScrollView>
  );
}

// --- NAVIGATORE EXPORT ---
export default function DoctorPatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600', textTransform: 'none' },
        tabBarIndicatorStyle: { backgroundColor: Colors.primary || '#4A90E2', height: 3 },
        tabBarActiveTintColor: Colors.primary || '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen name="Note" component={PatientNotesScreen} options={{ title: 'Diario' }} />
      <Tab.Screen name="Caso" component={PatientCaseScreen} options={{ title: 'Dati Clinici' }} />
      <Tab.Screen name="Grafico" component={PatientMoodScreen} options={{ title: 'Umore' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  noteCard: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#4A90E2' },
  noteDate: { fontSize: 12, color: '#888', marginBottom: 4 },
  noteText: { fontSize: 14, color: '#444', lineHeight: 20 },
  infoBox: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15 },
  label: { fontSize: 12, color: '#999', fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#333', marginTop: 4 },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, marginTop: 30, paddingHorizontal: 10 },
  barContainer: { alignItems: 'center', width: 40 },
  bar: { width: 12, borderRadius: 6 },
  dayLabel: { marginTop: 8, fontSize: 12, color: '#666' },
  moodLabel: { marginBottom: 4, fontSize: 10, color: '#666' },
  aiCard: { marginTop: 40, padding: 15, backgroundColor: '#F5F7FA', borderRadius: 12 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  aiTitle: { marginLeft: 10, fontWeight: 'bold', color: '#333' },
  aiText: { color: '#555', fontSize: 13 }
});