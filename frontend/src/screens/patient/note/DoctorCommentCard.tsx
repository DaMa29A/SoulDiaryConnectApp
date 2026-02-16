import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface DoctorCommentCardProps {
  doctorName: string;
  date: string;
  text: string;
}

const DoctorCommentCard = ({ 
  doctorName, 
  date, 
  text 
}: DoctorCommentCardProps) => {

  return (
    <View style={styles.sectionContainer}>
       <View style={styles.sectionHeader}>
          <Ionicons name="medkit-outline" size={20} color="#2ECC71" style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Dallo specialista</Text>
      </View>

      <View style={styles.doctorCard}>
        {/* Header del Dottore */}
        <View style={styles.doctorHeader}>
          <View style={styles.doctorAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.doctorDate}>{date}</Text>
          </View>
        </View>
        
        <View style={styles.doctorDivider} />
        
        <Text style={styles.doctorText}>
          <MaterialCommunityIcons name="format-quote-open" size={16} color="#ccc" /> 
          {" "}{text}
        </Text>
      </View>
    </View>
  );
};

export default DoctorCommentCard;

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
  doctorCard: {
    backgroundColor: '#F9FBFD', // Grigio/Azzurro molto chiaro professionale
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
    backgroundColor: '#2ECC71', // Verde medico
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