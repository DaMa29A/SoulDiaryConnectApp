import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import AuthButton from '../buttons/AuthButton';

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
      
      {/* INPUT AREA */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="Scrivi qui..."
          placeholderTextColor="#999"
          multiline={true}
          value={noteText}
          onChangeText={setNoteText}
        />
        
        {/* Microphone Icon */}
        <TouchableOpacity 
          style={styles.micButton} 
          onPress={onVoiceInput}
          activeOpacity={0.8}
        >
          <Ionicons name="mic" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* CHECKBOX */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => setIsAiSupportEnabled(!isAiSupportEnabled)}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isAiSupportEnabled ? "checkbox" : "square-outline"} 
          size={24} 
          color={isAiSupportEnabled ? (Colors.primary) : Colors.grey} 
        />
        <Text style={styles.checkboxLabel}>Genera automaticamente frasi di supporto</Text>
      </TouchableOpacity>
      
      {/* Save Note Button */}
      <AuthButton 
        title="Salva nota" 
        onPress={onSave}
        variant="primary"
      />
    </View>
  );
};

export default NoteForm;


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  textInput: {
    fontSize: 16,
    color: Colors.textDark,
    minHeight: 140,
    textAlignVertical: 'top',
    backgroundColor: Colors.backgroundInput,
    borderRadius: 16,
    padding: 15,
    paddingRight: 50, 
    borderWidth: 1,
    borderColor: Colors.borderInput,
  },
  micButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 20,
    shadowColor: Colors.shadow,
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
    color: Colors.grey,
    marginLeft: 10,
  }
});