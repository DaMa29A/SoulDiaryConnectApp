import React from 'react';
import { 
  Image,
  Text,
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Importa i Colori
import { Colors } from '../constants/Colors';

export default function Navbar() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      
      {/* LATO SINISTRO: SCRITTA E LOGO AFFIANCATI */}
      <View style={styles.leftContainer}>
          {/* SCRITTA */}
          <Text style={styles.appTitle}>SoulDiary</Text>
        
          {/* LOGO */}
          <Image 
            source={require('../../assets/logo2.png')} 
            style={styles.logo}
            resizeMode="contain" 
          />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Platform.OS === 'ios' ? 60 : 60, // Altezza standard
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: Platform.OS === 'ios' ? 0 : 0, // Aggiusta se la status bar copre
    zIndex: 10, 
  },
  leftContainer: {
    flexDirection: 'row', // <--- CAMBIATO IN ROW (AFFIANCATI)
    alignItems: 'center', // Centra verticalmente testo e immagine
    justifyContent: 'flex-start',
  },
  appTitle: {
    fontSize: 17, // Leggermente più grande per visibilità
    fontWeight: 'bold',
    color: Colors.primary || '#4A90E2',
    marginRight: 5, // <--- SPAZIO TRA SCRITTA E LOGO
    marginBottom: 0, // Rimosso margine sotto
  },
  logo: {
    width: 80,  // Adatta la larghezza secondo necessità
    height: 30, 
  }
});