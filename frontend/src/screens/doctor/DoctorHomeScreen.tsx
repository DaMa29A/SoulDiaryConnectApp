import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doctorHomeStyles } from '../../styles/doctor/DoctorHomeStyles';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Colors } from '../../constants/Colors';

// Mock Data Pazienti
const MOCK_PATIENTS = [
  { id: '1', name: 'Mario Rossi', lastUpdate: 'Oggi, 14:30', hasNew: true },
  { id: '2', name: 'Luigi Verdi', lastUpdate: 'Ieri, 09:15', hasNew: false },
  { id: '3', name: 'Anna Bianchi', lastUpdate: '12 Ott, 18:00', hasNew: false },
  { id: '4', name: 'Giulia Neri', lastUpdate: '10 Ott, 11:20', hasNew: true },
  { id: '5', name: 'Francesco Gialli', lastUpdate: '05 Ott, 16:45', hasNew: false },
];

export default function DoctorHomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');

  // Filtra pazienti in base alla ricerca
  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F8' }} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Navbar />

      <ScrollView 
        style={doctorHomeStyles.container} 
        contentContainerStyle={doctorHomeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intestazione */}
        <View style={doctorHomeStyles.pageHeader}>
          <Text style={doctorHomeStyles.pageTitle}>I tuoi Pazienti</Text>
          <Text style={doctorHomeStyles.pageSubtitle}>Gestisci le cartelle cliniche e i diari</Text>
        </View>

        {/* Barra di Ricerca */}
        <View style={doctorHomeStyles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            style={doctorHomeStyles.searchInput}
            placeholder="Cerca paziente..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Lista Pazienti */}
        <View style={doctorHomeStyles.listContainer}>
          {filteredPatients.map((patient) => (
            <TouchableOpacity 
              key={patient.id} 
              style={doctorHomeStyles.patientCard}
              onPress={() => navigation.navigate('DoctorPatientScreen', { patientId: patient.id, patientName: patient.name })}
            >
              {/* Avatar con iniziali */}
              <View style={doctorHomeStyles.avatar}>
                <Text style={doctorHomeStyles.avatarText}>
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>

              {/* Info */}
              <View style={doctorHomeStyles.patientInfo}>
                <Text style={doctorHomeStyles.patientName}>{patient.name}</Text>
                <Text style={doctorHomeStyles.lastUpdate}>Ultimo diario: {patient.lastUpdate}</Text>
              </View>

              {/* Indicatore novità o freccia */}
              {patient.hasNew && (
                <View style={doctorHomeStyles.statusIndicator} />
              )}
              <Ionicons name="chevron-forward" size={20} color="#CCC" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ))}
          
          {filteredPatients.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
              Nessun paziente trovato.
            </Text>
          )}
        </View>
        <Footer />

      </ScrollView>
      
    </SafeAreaView>
  );
}