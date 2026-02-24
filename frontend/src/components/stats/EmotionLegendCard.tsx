import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors'; // Assicurati che il percorso sia corretto

export default function EmotionLegendCard() {
  
  const legendData = [
    {
      score: '4',
      category: 'Positive',
      color: '#66BB6A', // Verde
      emotions: 'Gioia, felicità, speranza, gratitudine, amore, serenità, entusiasmo, calma, orgoglio.'
    },
    {
      score: '3',
      category: 'Neutre / Ambivalenti',
      color: '#BA68C8', // Viola chiaro
      emotions: 'Sorpresa, confusione, nostalgia.'
    },
    {
      score: '2',
      category: 'Ansiose',
      color: '#FFA726', // Arancione
      emotions: 'Ansia, preoccupazione, nervosismo, paura.'
    },
    {
      score: '1',
      category: 'Negative',
      color: '#EF5350', // Rosso
      emotions: 'Tristezza, rabbia, disgusto, frustrazione, solitudine, delusione, malinconia, disperazione, inadeguatezza, vergogna, colpa, imbarazzo, stanchezza.'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Legenda Emozioni</Text>
      
      <View style={styles.legendList}>
        {legendData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            
            {/* Header dell'elemento: Quadratino, Punteggio e Categoria */}
            <View style={styles.itemHeader}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={styles.categoryTitle}>
                <Text style={styles.scoreText}>{item.score}</Text> - {item.category}
              </Text>
            </View>
            
            {/* Lista delle emozioni associate */}
            <Text style={styles.emotionsList}>
              {item.emotions}
            </Text>
            
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.textDark || '#1F2937',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  legendList: {
    flexDirection: 'column',
    gap: 16, // Spazio verticale tra ogni blocco di categoria
  },
  legendItem: {
    flexDirection: 'column',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 4, // Lascialo a 0 se vuoi un quadrato netto, 4 lo smussa leggermente
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark || '#374151',
  },
  scoreText: {
    fontWeight: '900',
  },
  emotionsList: {
    fontSize: 13,
    color: Colors.textGray || '#6B7280',
    lineHeight: 18,
    paddingLeft: 24, // Allinea il testo con la parola della categoria, saltando il quadratino
  }
});