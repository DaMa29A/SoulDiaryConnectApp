import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';


export const indexStyles = StyleSheet.create({
  contentContainer: {
    flex: 1, // GET FULL HEIGHT
    justifyContent: 'center', // VERTICAL CENTER
    alignItems: 'center',
    width: '100%',
  },

  // --- TAGLINE ---
  tagline: {
    fontSize: 16,
    color: Colors.textGray,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },

  // --- BUTTONS ---
  buttonsContainer: {
    width: '100%',
    gap: 16,
  }
});