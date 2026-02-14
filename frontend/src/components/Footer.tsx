import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function Footer() {
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>
        <Ionicons name="alert-circle-outline" size={13} color={Colors.textGray} />
        {'  '}L'IA può commettere errori.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    bottom: 20,  // distance from the bottom of the screen   
    left: 0,  // align to the left edge
    right: 0, // align to the right edge
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    opacity: 0.8,
    zIndex: 10,
    backgroundColor: Colors.white
  },
  text: {
    fontSize: 13,
    color: Colors.textGray
  },
});