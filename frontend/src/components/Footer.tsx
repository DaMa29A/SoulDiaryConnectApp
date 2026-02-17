import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

// Definiamo l'interfaccia per accettare il colore di sfondo della schermata
interface FooterProps {
  backgroundColor?: string;
}

export default function Footer({ backgroundColor }: FooterProps) {
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || '#fff' }]}>
      <Text style={styles.text}>
        <Ionicons name="alert-circle-outline" size={13} color={Colors.textGray} />
        {'  '}L'IA può commettere errori.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5', // Linea sottile per staccarlo dalle Tabs
  },
  text: {
    fontSize: 12,
    color: Colors.textGray || '#999',
  },
});