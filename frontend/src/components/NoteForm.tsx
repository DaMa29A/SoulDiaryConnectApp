import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors'; // Assicurati del percorso

interface NoteFormProps {
  noteText: string;
  setNoteText: (text: string) => void;
  isAiSupportEnabled: boolean;
  setIsAiSupportEnabled: (enabled: boolean) => void;
  onSave: () => void;
  onVoiceInput: () => void;
}

const NoteForm = ({ 
  noteText, 
  setNoteText, 
  isAiSupportEnabled, 
  setIsAiSupportEnabled, 
  onSave, 
  onVoiceInput 
}: NoteFormProps) => {

  return (
    <View style={styles.container}>
      
      {/* AREA INPUT */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Scrivi qui..."
          placeholderTextColor="#999"
          multiline={true}
          value={noteText}
          onChangeText={setNoteText}
        />
        
        {/* Icona Microfono */}
        <TouchableOpacity 
          style={styles.micButton} 
          onPress={onVoiceInput}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={22} color={Colors.primary || '#4A90E2'} />
        </TouchableOpacity>
      </View>

      {/* CASELLA DI SELEZIONE (CHECKBOX) */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setIsAiSupportEnabled(!isAiSupportEnabled)}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isAiSupportEnabled ? "checkbox" : "square-outline"} 
          size={24} 
          color={isAiSupportEnabled ? (Colors.primary || '#4A90E2') : "#999"} 
        />
        <Text style={styles.checkboxLabel}>Genera automaticamente frasi di supporto</Text>
      </TouchableOpacity>
      
      {/* BOTTONE SALVA NOTA */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={onSave}
        activeOpacity={0.9}
      >
        <Text style={styles.saveButtonText}>Salva nota</Text>
      </TouchableOpacity>

    </View>
  );
};

export default NoteForm;

// Stili specifici del form
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 140,
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 15,
    paddingRight: 50, // Spazio per il microfono
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  micButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    // Ombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: Colors.primary || '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    // Ombra bottone
    shadowColor: Colors.primary || '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});