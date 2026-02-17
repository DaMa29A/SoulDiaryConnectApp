import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import NotesList from '../../../components/NotesList';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function PatientNotesScreen() {
  
  const navigation = useNavigation<any>();
  const mockDiaryHistory = [
    { id: 1, day: '14', month: 'OTT', text: 'Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco.', time: '18:30' },
    { id: 2, day: '12', month: 'OTT', text: 'Ho avuto un momento di ansia nel pomeriggio, ma è passato dopo aver parlato con Laura.', time: '09:15' },
    { id: 3, day: '10', month: 'OTT', text: 'Iniziato il nuovo piano terapeutico prescritto dal Dott. Veronesi.', time: '21:00' },
  ];

    const handleNotePress = (id: number | string) => {
    console.log('Hai cliccato sulla nota:', id);
    navigation.navigate('NoteDetail', { noteId: id });
  };

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Ultimi Diari</Text>
      <NotesList 
          notes={mockDiaryHistory} 
          onNotePress={handleNotePress} 
        />
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
  tabContainer: { flex: 1, backgroundColor: Colors.white },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginHorizontal: 12, marginTop: 20 },
  noteCard: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#4A90E2' },
  noteDate: { fontSize: 12, color: '#888', marginBottom: 4 },
  noteText: { fontSize: 14, color: '#444', lineHeight: 20 },
  infoBox: { marginBottom: 20, marginHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15 },
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