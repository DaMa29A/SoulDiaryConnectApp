import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/Colors';

export const doctorScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1, // Fondamentale per il centramento
    justifyContent: 'center', // Centra la card verticalmente
    paddingBottom: 24, // Spazio standard dal footer
  },
  
  // HEADER (Opzionale, lasciato per compatibilità)
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
    alignItems: 'center',
  },

  // CARD PROFILO MEDICO
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 24,
    // marginTop: 30, // RIMOSSO per permettere il centramento automatico
    padding: 24,
    alignItems: 'center',
    // Ombra stile "Soul Diary"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  
  // Avatar/Icona
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF', // Azzurro chiarissimo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E6F0FA',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialization: {
    fontSize: 16,
    color: Colors.primary || '#4A90E2',
    fontWeight: '600',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // DIVISORE
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EEE',
    marginBottom: 24,
  },

  // RIGHE CONTATTI
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});