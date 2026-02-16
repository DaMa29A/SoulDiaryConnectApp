import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../../constants/Colors'; 
import PatientNoteCard from './note/PatientNoteCard';
import AiInsightCard from './note/AiInsightCard';
import DoctorCommentCard from './note/DoctorCommentCard';
// --- TIPO PER I PARAMETRI DELLA ROTTA ---
type ParamList = {
  NoteDetail: { noteId: string | number };
};

// --- DATI MOCK ---
const MOCK_NOTE_DETAIL = {
  id: 1,
  fullDate: 'Lunedì, 14 Ottobre 2023',
  time: '18:30',
  // 1. NOTA DEL PAZIENTE
  patientNote: {
    text: "Oggi mi sento molto meglio rispetto a ieri. Ho fatto una passeggiata al parco e il sole mi ha aiutato a schiarirmi le idee. L'ansia era presente stamattina, ma l'ho gestita con gli esercizi di respirazione.",
    moodIcon: 'sunny-outline' 
  },
  // 2. INSIGHT AI
  aiInsight: {
    hasInsight: true,
    text: "È fantastico notare come l'esposizione alla natura e l'uso attivo delle tecniche di respirazione abbiano avuto un impatto positivo immediato. Hai dimostrato un'ottima capacità di auto-regolazione emotiva.",
  },
  // 3. COMMENTO SPECIALISTA
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
  // const { noteId } = route.params; // In futuro userai questo ID per fetchare i dati

  const data = MOCK_NOTE_DETAIL; 
  const primaryColor = Colors.primary || '#4A90E2';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Diario</Text>
          <Text style={styles.headerSubtitle}>{data.fullDate}</Text>
        </View>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* ================= SEZIONE 1: LA TUA NOTA ================= */}
        <PatientNoteCard 
            text={data.patientNote.text} 
            time={data.time} 
        />

        {/* ================= SEZIONE 2: INSIGHT AI ================= */}
        {data.aiInsight.hasInsight && (
          <AiInsightCard 
            text={data.aiInsight.text} 
        />
        )}


        {/* ================= SEZIONE 3: COMMENTO SPECIALISTA ================= */}
        {data.doctorComment.hasComment && (
          <DoctorCommentCard 
            doctorName={data.doctorComment.doctorName}
            date={data.doctorComment.date}
            text={data.doctorComment.text}
        />
        )}

        <View style={{ height: 40 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
  },
  
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 15,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },

  // --- SEZIONI ---
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  timeBadge: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontWeight: '600',
  },

  // --- CARD PAZIENTE ---
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative',
  },
  patientText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  moodContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    opacity: 0.8,
  },

  // --- CARD AI ---
  aiCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  aiAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  aiText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
    paddingLeft: 10,
  },
  aiSparkleIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.5,
  },

  // --- CARD DOTTORE ---
  doctorCard: {
    backgroundColor: '#F9FBFD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorDate: {
    fontSize: 12,
    color: '#999',
  },
  doctorDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  doctorText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
});