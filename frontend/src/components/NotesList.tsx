import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors'; // Assicurati del percorso

// Definiamo il tipo per una singola nota
export interface Note {
  id: number | string;
  day: string;
  month: string;
  text: string;
  time: string;
}

interface NotesListProps {
  notes: Note[];
  onNotePress?: (id: number | string) => void;
}

const NotesList = ({ notes, onNotePress }: NotesListProps) => {
  return (
    <>
      {notes.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.diaryCard}
          onPress={() => onNotePress && onNotePress(item.id)}
          activeOpacity={0.7}
        >
          {/* Badge Data */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{item.day}</Text>
            <Text style={styles.dateMonth}>{item.month}</Text>
          </View>

          {/* Contenuto Nota */}
          <View style={styles.diaryContent}>
            <Text style={styles.diaryText} numberOfLines={2} ellipsizeMode="tail">
              {item.text}
            </Text>
            
            {/* Riga Orario */}
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#999" style={{ marginRight: 4 }} /> 
              <Text style={styles.diaryTime}>{item.time}</Text>
            </View>
          </View>

          {/* Freccia Dettaglio (Solo visiva ora, il click è sulla card) */}
          <View>
             <Ionicons name="chevron-forward" size={20} color="#D0D0D0" />
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default NotesList;

// Stili incapsulati nel componente
const styles = StyleSheet.create({
  diaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Ombra leggera
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#F0F8FF', // Azzurro chiarissimo
    borderRadius: 12,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E6F0FA',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary || '#4A90E2',
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary || '#4A90E2',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  diaryContent: {
    flex: 1,
    paddingRight: 10,
  },
  diaryText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Nuovo stile contenitore per allineare perfettamente icona e testo
  timeContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 6 
  },
  diaryTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    // Rimosso marginTop: 6 che causava il disallineamento
    // Aggiunto lineHeight per centrare verticalmente col testo
    lineHeight: 14, 
  },
});