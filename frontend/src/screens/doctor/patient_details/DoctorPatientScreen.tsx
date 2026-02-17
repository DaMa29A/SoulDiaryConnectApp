import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../constants/Colors';
import { RootStackParamList } from '../../../../App';

// IMPORTIAMO IL COMPONENTE DELLE TABS CREATO SOPRA
import DoctorPatientTabs from './DoctorPatientTabs';

type ScreenRouteProp = RouteProp<RootStackParamList, 'DoctorPatientScreen'>;

export default function DoctorPatientScreen() {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { patientName } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* --- HEADER SUPERIORE (FISSO) --- */}
      <View style={styles.headerContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cartella Clinica</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <View style={styles.profileSummary}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {patientName ? patientName.split(' ').map(n => n[0]).join('') : 'P'}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.patientName}>{patientName}</Text>
            <Text style={styles.patientDetails}>Paziente in carico • Ultimo accesso: Oggi</Text>
          </View>
        </View>
      </View>

      {/* --- CONTENUTO TABS --- */}
      <DoctorPatientTabs />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  profileSummary: { flexDirection: 'row', paddingHorizontal: 24, alignItems: 'center', marginTop: 5 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E6F0FA',
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: Colors.primary || '#4A90E2' },
  infoContainer: { flex: 1 },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  patientDetails: { fontSize: 13, color: '#666' },
});