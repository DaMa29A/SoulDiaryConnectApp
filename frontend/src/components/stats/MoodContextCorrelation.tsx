import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors'; // Assicurati che il percorso sia corretto

export default function MoodContextCorrelation() {
  const [chartWidth, setChartWidth] = useState(0);

  // Dati Mock per gli Highlight
  const positiveContext = { name: 'Amici', score: '3.8 / 4' };
  const criticalContext = { name: 'Solitudine', score: '1.2 / 4' };

  // Dati Mock per il Grafico a Barre
  // asse X: parole chiave (contesti)
  // asse Y: numero di note in cui appare quel contesto
  const barChartData = {
    labels: ['Studio', 'Solitudine', 'Lavoro', 'Amici', 'Famiglia'],
    datasets: [
      {
        data: [12, 18, 8, 15, 10], // Numero di note
      },
    ],
  };

  return (
    <View style={styles.cardContainer}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="account-group-outline" size={24} color={Colors.primary} />
          <Text style={styles.cardTitle}>Umore - Contesto Sociale</Text>
        </View>
      </View>

      {/* DESCRIZIONE */}
      <Text style={styles.descriptionText}>
        Questa analisi mostra come lo stato emotivo del paziente varia in base al contesto sociale. Permette di identificare quali contesti sono associati ad emozioni positive o negative.
      </Text>

      {/* HIGHLIGHTS: Contesto Positivo e Critico */}
      <View style={styles.highlightsContainer}>
        
        {/* Box Positivo */}
        <View style={[styles.highlightBox, styles.highlightPositive]}>
          <View style={styles.highlightHeader}>
            <Ionicons name="arrow-up-circle-outline" size={20} color="#388E3C" />
            <Text style={[styles.highlightTitle, { color: '#388E3C' }]}>Più positivo</Text>
          </View>
          <Text style={styles.contextName}>{positiveContext.name}</Text>
          <Text style={styles.contextScore}>Media: {positiveContext.score}</Text>
        </View>

        {/* Box Critico */}
        <View style={[styles.highlightBox, styles.highlightCritical]}>
          <View style={styles.highlightHeader}>
            <Ionicons name="warning-outline" size={20} color="#D32F2F" />
            <Text style={[styles.highlightTitle, { color: '#D32F2F' }]}>Più critico</Text>
          </View>
          <Text style={styles.contextName}>{criticalContext.name}</Text>
          <Text style={styles.contextScore}>Media: {criticalContext.score}</Text>
        </View>

      </View>

      {/* TITOLO GRAFICO */}
      <Text style={styles.chartTitle}>Frequenza note per contesto</Text>

      {/* GRAFICO A BARRE */}
      <View 
        style={styles.chartWrapper}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setChartWidth(width);
        }}
      >
        {chartWidth > 0 ? (
          <BarChart
            data={barChartData}
            width={chartWidth} // Occupa il 100% della View genitore
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero={true} // Fa partire l'asse Y da 0
            showValuesOnTopOfBars={true} // Mostra il numerino sopra la colonna
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0, // Sono numeri interi (quantità di note)
              color: (opacity = 1) => Colors.primary || `rgba(139, 92, 246, ${opacity})`,
              labelColor: (opacity = 1) => Colors.textGray || `rgba(107, 114, 128, ${opacity})`,
              barPercentage: 0.6, // Spessore delle colonne
              propsForLabels: {
                fontSize: 11, // Riduce un po' il font se ci sono tante parole chiave
              }
            }}
            style={{
              marginTop: 10,
              marginLeft: -20, // Tira il grafico a sinistra per compattare l'asse Y
            }}
          />
        ) : null}
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
    marginBottom: 20,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  highlightBox: {
    width: '48%', // Divide in due colonne
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  highlightPositive: {
    backgroundColor: '#F1F8E9', // Verde chiarissimo
    borderColor: '#C5E1A5',
  },
  highlightCritical: {
    backgroundColor: '#FFEBEE', // Rosso chiarissimo
    borderColor: '#FFCDD2',
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contextName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark || '#1F2937',
    marginBottom: 4,
  },
  contextScore: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textGray,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    overflow: 'hidden',
  }
});