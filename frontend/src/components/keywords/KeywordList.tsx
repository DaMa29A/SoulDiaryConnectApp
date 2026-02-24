import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; 

// Definiamo la struttura di una singola parola chiave
export interface KeywordItem {
  id: string;
  word: string;
  emoji: string;
  description: string;
}

interface KeywordListProps {
  keywords: KeywordItem[];
}

export default function KeywordList({ keywords }: KeywordListProps) {
  
  const handleShowInfo = (word: string, description: string) => {
    Alert.alert(
      `${word}`, 
      description,
      [{ text: 'Ho capito', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      {keywords.map((item) => (
        <View key={item.id} style={styles.chip}>
          {/* Emoji e Parola */}
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.word}>{item.word}</Text>
          
          {/* Pulsante Informazioni */}
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => handleShowInfo(item.word, item.description)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta l'area cliccabile dell'icona
          >
            <Ionicons name="information-circle-outline" size={18} color={Colors.textGray || '#666'} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permette agli elementi di andare a capo
    gap: 10, // Spazio tra i vari rettangoli (funziona nelle versioni recenti di React Native)
    marginTop: 10,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundInput || '#F3F4F6', // Un grigio chiaro
    borderWidth: 1,
    borderColor: Colors.borderInput || '#E5E7EB',
    borderRadius: 20, // Rende il rettangolo smussato
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8, // Leggermente meno a destra per bilanciare l'icona
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  word: {
    fontSize: 14,
    color: Colors.textDark || '#1F2937',
    fontWeight: '500',
  },
  infoButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});