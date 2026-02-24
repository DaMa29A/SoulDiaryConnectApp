// TODO : RIVEDI DA CAPO
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { commonStyles } from '../../../../../styles/CommonStyles';
import { Colors } from '../../../../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../../../../../components/Footer';
import StatsCard from '../../../../../components/stats/StatsCard';
import EmotionLegendCard from '../../../../../components/stats/EmotionLegendCard';
import EmotionalTrendChart from '../../../../../components/stats/EmotionalTrendChart';
import MoodContextCorrelation from '../../../../../components/stats/MoodContextCorrelation';
import MoodContextAverage from '../../../../../components/stats/MoodContextAverage';

export default function MoodScreen() {

  const mockStats = {
    totalNotes: 42,
    averageScore: "7.5 / 10",
    topEmotion: "Serenità",
    topEmotionCount: 15,
    isCritical: true
  };

  const chartData = [
    { day: 'Lun', val: 3, color: '#4FC3F7' }, 
    { day: 'Mar', val: 2, color: '#FFB74D' }, 
    { day: 'Mer', val: 1, color: '#EF5350' }, 
    { day: 'Gio', val: 2, color: '#FFB74D' }, 
    { day: 'Ven', val: 3, color: '#4FC3F7' }, 
    { day: 'Sab', val: 4, color: '#66BB6A' }, 
    { day: 'Dom', val: 4, color: '#66BB6A' }, 
  ];

  const legend = [
    { label: 'Positive', color: '#66BB6A', value: '4' },
    { label: 'Neutre', color: '#4FC3F7', value: '3' },
    { label: 'Ansiose', color: '#FFB74D', value: '2' },
    { label: 'Negative', color: '#EF5350', value: '1' },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: Colors.white }}
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[commonStyles.page_left, { marginTop: 20 }]}>
        
        {/* --- SEZIONE STATISTICHE --- */}
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Statistiche Periodo</Text>
        </View>

        <StatsCard stats={mockStats} />

        {/* --- NOTA STATO CRITICO --- */}
        {mockStats.isCritical && (
          <View style={styles.criticalCard}>
            <View style={styles.criticalHeader}>
              <MaterialCommunityIcons name="alert-decagram" size={20} color="#D32F2F" />
              <Text style={styles.criticalTitle}>Rilevato Stato Critico</Text>
            </View>
            <Text style={styles.criticalBody}>
              Il periodo selezionato mostra una flessione marcata. Si consiglia un colloquio di approfondimento immediato.
            </Text>
          </View>
        )}

        <EmotionLegendCard />

        {/* --- GRAFICO --- */}
        <View style={[styles.sectionHeader, { marginTop: 30 }]}>
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={22} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Andamento Emotivo</Text>
        </View>

        <EmotionalTrendChart />
        <MoodContextCorrelation />
        <MoodContextAverage />

      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.textDark,
    letterSpacing: -0.5,
  },

  // --- Nota Critica ---
  criticalCard: {
    width: '100%', // <-- AGGIUNTO per forzare l'occupazione dell'intero spazio orizzontale
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE3E3',
    marginBottom: 10, // Aggiunto un leggero margine inferiore
  },
  criticalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  criticalTitle: {
    color: '#C62828',
    fontWeight: '800',
    fontSize: 15,
  },
  criticalBody: {
    color: '#555',
    fontSize: 13,
    lineHeight: 19,
  },

  // --- Grafico ---
  chartContainer: {
    width: '100%', // <-- Assicuriamoci che anche il grafico occupi il 100%
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    paddingBottom: 8,
  },
  barColumn: {
    alignItems: 'center',
    width: '12%',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
    minHeight: 8,
  },
  barDay: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    fontWeight: '700',
  },
  legendWrapper: {
    marginTop: 20,
    paddingTop: 15,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '46%',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  }
});