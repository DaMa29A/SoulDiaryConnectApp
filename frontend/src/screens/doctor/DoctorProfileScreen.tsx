import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { profileScreenStyles } from '../../styles/patient/ProfileScreenStyles'; // Riutilizziamo gli stili del profilo
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { commonStyles } from '../../styles/CommonStyles';

export default function DoctorProfileScreen() {
  const navigation = useNavigation<any>();

  const doctorData = {
    nome: 'Giuseppe',
    cognome: 'Veronesi',
    email: 'giuseppe.veronesi@studio.it',
    specializzazione: 'Psicoterapeuta',
    indirizzo: 'Via dei Mille 45, Roma',
    telefono: '06 12345678'
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Vuoi uscire dall'area medico?",
      [
        { text: "Annulla", style: "cancel" },
        { 
          text: "Esci", 
          style: "destructive", 
          onPress: () => navigation.replace('Login') 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.containerPage} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Navbar />

      <View style={commonStyles.containerPage}>
      
        <View style={[commonStyles.profileCard]}>
          
          {/* Avatar */}
          <View style={profileScreenStyles.avatarContainer}>
            <Ionicons name="medkit" size={40} color="#BBB" />
          </View>

          <Text style={profileScreenStyles.patientName}>Dott. {doctorData.nome} {doctorData.cognome}</Text>
          <Text style={profileScreenStyles.patientEmail}>{doctorData.specializzazione}</Text>

          <View style={profileScreenStyles.infoRow}>
            <Text style={profileScreenStyles.infoLabel}>Email</Text>
            <Text style={profileScreenStyles.infoValue}>{doctorData.email}</Text>
          </View>

          <View style={profileScreenStyles.infoRow}>
            <Text style={profileScreenStyles.infoLabel}>Indirizzo Studio</Text>
            <Text style={profileScreenStyles.infoValue}>{doctorData.indirizzo}</Text>
          </View>

          <View style={[profileScreenStyles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={profileScreenStyles.infoLabel}>Telefono</Text>
            <Text style={profileScreenStyles.infoValue}>{doctorData.telefono}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={profileScreenStyles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D93025" />
          <Text style={profileScreenStyles.logoutText}>Esci</Text>
        </TouchableOpacity>

      </View>
      <Footer />
    </SafeAreaView>
  );
}