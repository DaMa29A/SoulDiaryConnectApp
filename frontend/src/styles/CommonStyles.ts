import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.background,
    paddingVertical: 24,
    paddingHorizontal: 10,
    justifyContent: 'center', 
  },

  containerPage: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white,
  },

  // --- WHITE CARD ---
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 5,
  },
  welcomeSub: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    marginBottom: 24,
  },

  // --- FORM INPUTS ---
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 6,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundInput,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.textDark,
    fontSize: 16,
  },

  // --- LINK ---
  textLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  
});