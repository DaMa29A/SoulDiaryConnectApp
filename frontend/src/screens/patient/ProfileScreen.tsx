import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import personalizzati
import { profileScreenStyles } from '../../styles/ProfileScreenStyles';
import Footer from '../../components/Footer';
import Logo from '../../components/Logo'; 
import { Colors } from '../../constants/Colors';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  // Dati Paziente (Mock)
  const patientInfo = {
    nome: 'Mario',
    cognome: 'Rossi',
    email: 'mario.rossi@email.com',
    dataNascita: '14/05/1980',
    codiceFiscale: 'RSSMRA80A01H501U',
    telefono: '333 1234567'
  };

  // Dati Medico Assegnato (Mock)
  const assignedDoctor = {
    nome: 'Dott. Giuseppe Veronesi',
    specializzazione: 'Psicoterapeuta'
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Sei sicuro di voler uscire?",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={profileScreenStyles.container} 
        contentContainerStyle={profileScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER */}
        <View style={profileScreenStyles.header}>
          <Text style={profileScreenStyles.title}>Il tuo profilo</Text>
          <Text style={profileScreenStyles.subtitle}>
            Le tue informazioni personali.
          </Text>
        </View>

        {/* --- SEZIONE 1: INFO PAZIENTE --- */}
        <Text style={profileScreenStyles.sectionLabel}>Dati Personali</Text>
        <View style={profileScreenStyles.card}>
          
          {/* Avatar */}
          <View style={profileScreenStyles.avatarContainer}>
            <Ionicons name="person" size={48} color="#BBB" />
          </View>

          {/* Nome e Email */}
          <Text style={profileScreenStyles.patientName}>{patientInfo.nome} {patientInfo.cognome}</Text>
          <Text style={profileScreenStyles.patientEmail}>{patientInfo.email}</Text>

          {/* Dettagli Lista */}
          <View style={profileScreenStyles.infoRow}>
            <Text style={profileScreenStyles.infoLabel}>Data di Nascita</Text>
            <Text style={profileScreenStyles.infoValue}>{patientInfo.dataNascita}</Text>
          </View>

          <View style={profileScreenStyles.infoRow}>
            <Text style={profileScreenStyles.infoLabel}>Codice Fiscale</Text>
            <Text style={profileScreenStyles.infoValue}>{patientInfo.codiceFiscale}</Text>
          </View>

          <View style={[profileScreenStyles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={profileScreenStyles.infoLabel}>Telefono</Text>
            <Text style={profileScreenStyles.infoValue}>{patientInfo.telefono}</Text>
          </View>
        </View>

        {/* --- SEZIONE 2: MEDICO ASSEGNATO --- */}
        <Text style={profileScreenStyles.sectionLabel}>Medico Assegnato</Text>
        <TouchableOpacity 
          style={profileScreenStyles.card} 
          onPress={() => navigation.navigate('Medico')} // Porta alla tab del medico
          activeOpacity={0.7}
        >
          <View style={profileScreenStyles.doctorRow}>
            <View style={profileScreenStyles.doctorAvatar}>
              <Ionicons name="medkit" size={24} color={Colors.primary || '#4A90E2'} />
            </View>
            <View style={profileScreenStyles.doctorInfo}>
              <Text style={profileScreenStyles.doctorLabel}>{assignedDoctor.specializzazione}</Text>
              <Text style={profileScreenStyles.doctorNameText}>{assignedDoctor.nome}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>

        {/* --- LOGOUT --- */}
        <TouchableOpacity style={profileScreenStyles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D93025" />
          <Text style={profileScreenStyles.logoutText}>Esci dal profilo</Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={{ marginTop: 30 }}>
          <Footer />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}