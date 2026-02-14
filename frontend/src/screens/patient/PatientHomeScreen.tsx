import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import personalizzati
import { patientHomeStyles } from '../../styles/PatientHomeStyles';
import Footer from '../../components/Footer';
import Logo from '../../components/Logo'; 
import { Colors } from '../../constants/Colors';

export default function PatientHomeScreen() {
  const navigation = useNavigation<any>();
  const [noteText, setNoteText] = useState('');
  const [isAiSupportEnabled, setIsAiSupportEnabled] = useState(false); // Stato per la checkbox

  // Dati finti per la cronologia
  const mockDiaryHistory = [
    { id: 1, day: '14', month: 'OTT', text: 'Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco.', time: '18:30' },
    { id: 2, day: '12', month: 'OTT', text: 'Ho avuto un momento di ansia nel pomeriggio, ma è passato dopo aver parlato con Laura.', time: '09:15' },
    { id: 3, day: '10', month: 'OTT', text: 'Iniziato il nuovo piano terapeutico prescritto dal Dott. Veronesi.', time: '21:00' },
  ];

  const handleSaveNote = () => {
    if (noteText.trim() === '') {
        Alert.alert("Attenzione", "La nota non può essere vuota.");
        return;
    }
    
    console.log("Nota salvata:", noteText);
    console.log("AI Support:", isAiSupportEnabled);
    
    Alert.alert("Salvato", "La tua nota è stata aggiunta al diario.");
    setNoteText('');
  };

  const handleVoiceInput = () => {
      Alert.alert("Dettatura", "Funzionalità di dettatura vocale in arrivo.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={patientHomeStyles.container} 
        contentContainerStyle={patientHomeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. HEADER CENTRALE */}
        <View style={patientHomeStyles.header}>
          
          {/* Saluto */}
          <Text style={patientHomeStyles.greeting}>Ciao, Mario Rossi</Text>
          
          {/* Sottotitolo */}
          <Text style={patientHomeStyles.subGreeting}>
            Come ti senti oggi? Scrivi i tuoi pensieri nel diario.
          </Text>
        </View>

        {/* 2. TITOLO SEZIONE "NUOVA NOTA" + ICONA PENNA */}
        <View style={patientHomeStyles.sectionHeaderContainer}>
            <Ionicons name="pencil" size={20} color={Colors.primary || '#4A90E2'} />
            <Text style={patientHomeStyles.sectionTitle}>Nuova nota</Text>
        </View>
        
        {/* 3. AREA INPUT */}
        <View style={patientHomeStyles.newNoteContainer}>
          
          <View style={patientHomeStyles.inputWrapper}>
            {/* Campo di testo */}
            <TextInput
                style={patientHomeStyles.textInput}
                placeholder="Scrivi qui..."
                placeholderTextColor="#999"
                multiline={true}
                value={noteText}
                onChangeText={setNoteText}
            />
            
            {/* Icona Microfono (in basso a destra dentro l'input) */}
            <TouchableOpacity 
                style={patientHomeStyles.micButton} 
                onPress={handleVoiceInput}
            >
                <Ionicons name="mic" size={22} color={Colors.primary || '#4A90E2'} />
            </TouchableOpacity>
          </View>

          {/* 4. CASELLA DI SELEZIONE (CHECKBOX) */}
          <TouchableOpacity 
            style={patientHomeStyles.checkboxContainer}
            onPress={() => setIsAiSupportEnabled(!isAiSupportEnabled)}
            activeOpacity={0.8}
          >
            <Ionicons 
                name={isAiSupportEnabled ? "checkbox" : "square-outline"} 
                size={24} 
                color={isAiSupportEnabled ? (Colors.primary || '#4A90E2') : "#999"} 
            />
            <Text style={patientHomeStyles.checkboxLabel}>Genera automaticamente frasi di supporto</Text>
          </TouchableOpacity>
          
          {/* 5. BOTTONE SALVA NOTA */}
          <TouchableOpacity 
            style={patientHomeStyles.saveButton} 
            onPress={handleSaveNote}
            activeOpacity={0.8}
          >
            <Text style={patientHomeStyles.saveButtonText}>Salva nota</Text>
          </TouchableOpacity>

        </View>

        {/* 6. CRONOLOGIA DIARIO (Il mio diario) */}
        <Text style={patientHomeStyles.historyTitle}>Il mio diario</Text>

        {mockDiaryHistory.map((item) => (
          <View key={item.id} style={patientHomeStyles.diaryCard}>
            {/* Badge Data */}
            <View style={patientHomeStyles.dateBadge}>
              <Text style={patientHomeStyles.dateDay}>{item.day}</Text>
              <Text style={patientHomeStyles.dateMonth}>{item.month}</Text>
            </View>

            {/* Contenuto Nota */}
            <View style={patientHomeStyles.diaryContent}>
              <Text style={patientHomeStyles.diaryText} numberOfLines={2} ellipsizeMode="tail">
                {item.text}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Ionicons name="time-outline" size={12} color="#999" style={{ marginRight: 4 }} /> 
                <Text style={patientHomeStyles.diaryTime}>{item.time}</Text>
              </View>
            </View>

            {/* Freccia Dettaglio */}
            <TouchableOpacity onPress={() => console.log('Dettaglio nota', item.id)}>
               <Ionicons name="chevron-forward" size={20} color="#D0D0D0" />
            </TouchableOpacity>
          </View>
        ))}

        {/* FOOTER */}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Footer />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}