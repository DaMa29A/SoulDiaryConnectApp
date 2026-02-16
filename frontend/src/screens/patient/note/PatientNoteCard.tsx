import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors'; 

interface PatientNoteCardProps {
  text: string;
  time: string;
  primaryColor?: string; // Opzionale, se vuoi passare un colore diverso dal default
}

const PatientNoteCard = ({ 
  text, 
  time, 
  primaryColor = Colors.primary || '#4A90E2' 
}: PatientNoteCardProps) => {
  
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons 
          name="person-outline" 
          size={20} 
          color={primaryColor} 
          style={styles.sectionIcon} 
        />
        <Text style={styles.sectionTitle}>La tua riflessione</Text>
        <Text style={styles.timeBadge}>{time}</Text>
      </View>
      
      <View style={styles.patientCard}>
        <Text style={styles.patientText}>{text}</Text>
      </View>
    </View>
  );
};

export default PatientNoteCard;

const styles = StyleSheet.create({
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
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    // Ombra "Soul Diary"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  patientText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});