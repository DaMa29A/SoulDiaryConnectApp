import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; 

export default function MoodContextAverage() {
  
  // Dati Mock: le parole chiave e la loro media emotiva (da 1 a 4)
  const contextAverages = [
    { id: '1', context: 'Amici', score: 3.8 },
    { id: '2', context: 'Famiglia', score: 3.1 },
    { id: '3', context: 'Lavoro', score: 2.5 },
    { id: '4', context: 'Studio', score: 2.0 },
    { id: '5', context: 'Solitudine', score: 1.2 },
  ];

  // Funzione per assegnare il colore in base alla media (come nella tua legenda)
  const getBarColor = (score: number) => {
    if (score >= 3.5) return '#66BB6A'; // Positive (Verde)
    if (score >= 2.5) return '#BA68C8'; // Neutre (Viola)
    if (score >= 1.5) return '#FFA726'; // Ansiose (Arancione)
    return '#EF5350';                   // Negative (Rosso)
  };

  return (
    <View style={styles.cardContainer}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="chart-bar" size={24} color={Colors.primary} />
          <Text style={styles.cardTitle}>Media emotiva per contesto</Text>
        </View>
      </View>

      {/* DESCRIZIONE */}
      <Text style={styles.descriptionText}>
        Questo grafico mostra la media emotiva per ogni contesto sociale, permettendo un confronto diretto tra i diversi ambiti della vita del paziente.
      </Text>

      {/* GRAFICO A BARRE ORIZZONTALI CUSTOM */}
      <View style={styles.chartContainer}>
        
        {/* Righe delle barre */}
        {contextAverages.map((item) => {
          // Calcoliamo la larghezza della barra in percentuale (max 4 punti = 100%)
          const barWidthPercentage = `${(item.score / 4) * 100}%`;
          
          return (
            <View key={item.id} style={styles.barRow}>
              {/* Etichetta Asse Y (Keyword) */}
              <Text style={styles.yAxisLabel} numberOfLines={1}>
                {item.context}
              </Text>
              
              {/* Contenitore della Barra */}
              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      width: barWidthPercentage as any, 
                      backgroundColor: getBarColor(item.score) 
                    }
                  ]} 
                />
                {/* Punteggio numerico stampato alla fine della barra */}
                <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
              </View>
            </View>
          );
        })}

        {/* Asse X (Le 4 Emozioni) */}
        <View style={styles.xAxisContainer}>
          <View style={styles.xAxisLabelBox}><Text style={styles.xAxisLabel}>1 - Neg</Text></View>
          <View style={styles.xAxisLabelBox}><Text style={styles.xAxisLabel}>2 - Ans</Text></View>
          <View style={styles.xAxisLabelBox}><Text style={styles.xAxisLabel}>3 - Neu</Text></View>
          <View style={styles.xAxisLabelBox}><Text style={[styles.xAxisLabel, { textAlign: 'right' }]}>4 - Pos</Text></View>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderInput || '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textDark || '#1F2937',
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textGray || '#6B7280',
    lineHeight: 20,
    marginBottom: 25,
  },
  chartContainer: {
    width: '100%',
    marginTop: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Spazio tra una riga e l'altra
  },
  yAxisLabel: {
    width: 80, // Larghezza fissa per le parole chiave, così le barre partono tutte allineate
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark || '#374151',
    paddingRight: 10,
  },
  barTrack: {
    flex: 1, // Prende tutto lo spazio rimanente a destra
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Sfondo grigio chiaro della "pista"
    height: 24,
    borderRadius: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
  },
  scoreText: {
    position: 'absolute',
    right: 10, // Posiziona il numero all'interno del tracciato, a destra
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textGray || '#6B7280',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 80, // Deve saltare lo spazio occupato dalle etichette (80px) per allinearsi alle barre
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  xAxisLabelBox: {
    flex: 1,
  },
  xAxisLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  }
});