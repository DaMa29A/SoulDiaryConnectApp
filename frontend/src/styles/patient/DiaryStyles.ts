import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';

export const patientHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // HEADER CENTRALE
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    alignItems: 'center', // Centra tutto orizzontalmente
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    paddingHorizontal: 20,
    lineHeight: 22,
  },

  // TITOLO SEZIONE CON ICONA (Nuova Nota)
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8, // Spazio dall'icona
  },

  // AREA INPUT E MICROFONO
  newNoteContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative', // Necessario per posizionare il microfono
    marginBottom: 15,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 140, // Altezza generosa
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 15,
    paddingRight: 50, // Spazio extra a destra per non scrivere sopra il microfono
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  micButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // CHECKBOX ROW
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },

  // BOTTONE SALVA
  saveButton: {
    backgroundColor: Colors.primary || '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: Colors.primary || '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // CARD CRONOLOGIA DIARIO
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 24,
    marginTop: 10,
    marginBottom: 15,
  },
  diaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E6F0FA',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary || '#4A90E2',
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary || '#4A90E2',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  diaryContent: {
    flex: 1,
    paddingRight: 10,
  },
  diaryText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    fontWeight: '500',
  },
  diaryTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontWeight: '500',
  },
});