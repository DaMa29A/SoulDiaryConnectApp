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
import { AlertCard } from '../../../../../components/AlertCard';

export default function MoodScreen() {
  const mockStats = {
    totalNotes: 42,
    averageScore: "7.5 / 10",
    topEmotion: "Serenità",
    topEmotionCount: 15,
    isCritical: true
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: Colors.white }}
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[commonStyles.page_left, { marginTop: 20 }]}>

        {/* --- CRITIC --- */}
        {mockStats.isCritical && (
          <AlertCard 
            isCritic= {true}
            title="Rilevato Stato Critico"
            iconName="alert-decagram"
            text="Il periodo selezionato mostra una flessione marcata. Si consiglia un colloquio di approfondimento immediato."
          />
        )}
        

        {/* --- LEGEND SECTION --- */}
        <EmotionLegendCard />


        {/* --- STATS SECTION --- */}
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Statistiche Periodo</Text>
        </View>

        <StatsCard stats={mockStats} />

        {/* --- GRAPHS SECTION --- */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Andamento Emotivo</Text>
        </View>

        <EmotionalTrendChart />

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="account-group-outline" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Umore - Contesto Sociale</Text>
        </View>

        <MoodContextCorrelation />

        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-bar" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Media emotiva per contesto</Text>
        </View>

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
    fontWeight: 'bold',
    color: Colors.textDark,
  }
});