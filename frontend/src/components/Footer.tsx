import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Ionicons name="alert-circle-outline" size={13} color={Colors.textGray} />
        {'  '}L'IA può commettere errori.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Rimosso absolute, bottom, left, right
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Un po' di spazio
    backgroundColor: '#fff', // Sfondo bianco per coprire il contenuto che scorre sotto (opzionale)
    borderTopWidth: 1, // Opzionale: linea separatrice sottile
    borderTopColor: '#F5F5F5',
  },
  text: {
    fontSize: 12,
    color: Colors.textGray || '#999',
  },
});