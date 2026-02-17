import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../components/Navbar';
import NotesList from '../../components/NotesList';
import { patientHomeStyles } from '../../styles/patient/DiaryStyles'; 
import Footer from '../../components/Footer';
import NoteForm from '../../components/NoteForm';
import { Colors } from '../../constants/Colors';
import { commonStyles } from '../../styles/CommonStyles';

export default function DiaryScreen() {
  const navigation = useNavigation<any>();
  const [noteText, setNoteText] = useState('');
  const [isAiSupportEnabled, setIsAiSupportEnabled] = useState(false);
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

  const handleNotePress = (id: number | string) => {
    console.log('Hai cliccato sulla nota:', id);
    navigation.navigate('NoteDetail', { noteId: id });
  };

  return (
    <SafeAreaView style={commonStyles.containerPage} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Navbar />
      <ScrollView 
        style={patientHomeStyles.container} 
        contentContainerStyle={patientHomeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={patientHomeStyles.sectionHeaderContainer}>
            <Ionicons name="pencil" size={20} color={Colors.primary} />
            <Text style={patientHomeStyles.sectionTitle}>Come ti senti oggi?</Text>
        </View>
        
        <NoteForm 
          noteText={noteText}
          setNoteText={setNoteText}
          isAiSupportEnabled={isAiSupportEnabled}
          setIsAiSupportEnabled={setIsAiSupportEnabled}
          onSave={handleSaveNote}
          onVoiceInput={handleVoiceInput}
        />
        
        <Text style={patientHomeStyles.historyTitle}>Il mio diario</Text>

        <NotesList 
          notes={mockDiaryHistory} 
          onNotePress={handleNotePress} 
        />
        
        <Footer />
      </ScrollView>
      
    </SafeAreaView>
  );
}