import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

interface AiInsightCardProps {
  text: string;
  primaryColor?: string;
}

const AiInsightCard = ({ 
  text, 
  primaryColor = Colors.primary || '#4A90E2' 
}: AiInsightCardProps) => {

  return (
    <View style={styles.sectionContainer}>
       <View style={styles.sectionHeader}>
          {/* Icona "Scintille/AI" */}
          <MaterialCommunityIcons 
            name="robot-excited-outline" 
            size={22} 
            color={primaryColor} 
            style={styles.sectionIcon} 
          />
          <Text style={styles.sectionTitle}>Supporto AI</Text>
      </View>
      
      {/* Card con gradiente o stile distintivo */}
      <View style={[styles.aiCard, { backgroundColor: `${primaryColor}10` }]}> 
        {/* Barra laterale colorata */}
        <View style={[styles.aiAccentBar, { backgroundColor: primaryColor }]} />
        
        <Text style={styles.aiText}>{text}</Text>
        <Ionicons 
          name="sparkles" 
          size={18} 
          color={primaryColor} 
          style={styles.aiSparkleIcon} 
        />
      </View>
    </View>
  );
};

export default AiInsightCard;

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
  aiCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)', // Puoi rendere dinamico anche questo se vuoi
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
});