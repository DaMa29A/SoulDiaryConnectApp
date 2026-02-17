import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/Colors'; 
import PatientNoteCard from './../patient/note/PatientNoteCard';
import AiInsightCard from './../patient/note/AiInsightCard';
import Footer from '../../components/Footer';
import { commonStyles } from '../../styles/CommonStyles';
import { noteStyles } from '../../styles/NoteStyles';
import { patientHomeStyles } from '../../styles/patient/DiaryStyles';
import NoteForm from '../../components/NoteForm';

type ParamList = {
  NoteDetail: { noteId: string | number };
};

const MOCK_NOTE_DETAIL = {
  id: 1,
  fullDate: 'Lunedì, 14 Ottobre 2023',
  time: '18:30',
  patientNote: {
    text: "Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco e il sole mi ha aiutato a schiarirmi le idee. L'ansia era presente stamattina, ma l'ho gestita con gli esercizi di respirazione.",
    moodIcon: 'sunny-outline' 
  },

  aiInsight: {
    hasInsight: true,
    text: "È fantastico notare come l'esposizione alla natura e l'uso attivo delle tecniche di respirazione abbiano avuto un impatto positivo immediato. Hai dimostrato un'ottima capacità di auto-regolazione emotiva.",
  },

  doctorComment: {
    hasComment: true,
    doctorName: 'Dott. G. Veronesi',
    date: '15 Ott, 10:15',
    text: "Ottimo lavoro Mario. L'applicazione degli esercizi di respirazione nel momento del bisogno è un passo fondamentale. Ne parleremo nella prossima seduta.",
  }
};

export default function NoteDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'NoteDetail'>>();
    const data = MOCK_NOTE_DETAIL; 
    const [isAiSupportEnabled, setIsAiSupportEnabled] = useState(false);
    const [noteText, setNoteText] = useState('');

    const handleSaveNote = () => {
        if (noteText.trim() === '') {
            Alert.alert("Attenzione", "La nota non può essere vuota.");
            return;
        }
        // Qui aggiungerai la logica di salvataggio
        console.log("Nota salvata:", noteText);
    }; // <--- PRIMA CORREZIONE: Chiusura della funzione handleSaveNote

  return (
    <SafeAreaView style={commonStyles.containerPage} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={noteStyles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={noteStyles.backButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.grey} />
        </TouchableOpacity>

        <View>
          <Text style={noteStyles.headerTitle}>Diario</Text>
          <Text style={noteStyles.headerSubtitle}>{data.fullDate}</Text>
        </View>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView 
        contentContainerStyle={noteStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= SECTION 1: NOTE ================= */}
        <PatientNoteCard 
            text={data.patientNote.text} 
            time={data.time} 
        />

        {/* ================= SECTION 2: INSIGHT AI ================= */}
        {data.aiInsight.hasInsight && (
          <AiInsightCard 
            text={data.aiInsight.text} 
            primaryColor={Colors.primary}
          />
        )}

        {/* ================= SECTION 3: DOCTOR COMMENT & FORM ================= */}
        {data.doctorComment.hasComment && (
          <View>
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
                onVoiceInput={() => {}}
            />
          </View> // <--- SECONDA CORREZIONE: rimossa la '>' extra
        )}

        <View style={{ height: 40 }} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}