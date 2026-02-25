import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { commonStyles } from '../../../../../styles/CommonStyles';
import { Colors } from '../../../../../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from '../../../../../components/Footer';
import AuthButton from '../../../../../components/buttons/AuthButton';
// 1. IMPORTA IL COMPONENTE CHIP
import Chip from '../../../../../components/buttons/Chip'; 

export default function SummaryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('7_days');

  const lastGeneration = {
    date: '20 Feb 2026',
    time: '14:30',
    periodLabel: 'Ultimi 7 giorni'
  };

  const periods = [
    { id: '7_days', label: 'Ultimi 7 giorni', emoji: '' },
    { id: '1_month', label: 'Ultimo mese', emoji: '' },
    { id: '3_months', label: 'Ultimi 3 mesi', emoji: '' },
    { id: '1_year', label: 'Ultimo anno', emoji: '' },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: Colors.white }}
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={Colors.primary} />
          <Text style={styles.aiBadgeText}>Generato con IA</Text>
        </View>

        <Text style={styles.mainTitle}>Riassunto Caso Clinico</Text>

        <View style={styles.headerTopRow}>
          <View style={styles.brainWrapper}>
             <MaterialCommunityIcons name="head-cog-outline" size={26} color={Colors.primary} />
          </View>
          <View style={styles.generationInfo}>
             <Text style={styles.lastGenLabel}>Ultima generazione</Text>
             <Text style={styles.lastGenDate}>
                {lastGeneration.date} • {lastGeneration.time} ({lastGeneration.periodLabel})
             </Text>
          </View>
        </View>
      </View>

      <View style={[commonStyles.page_left, { marginTop: 10 }]}>
        
        {/* --- FORM --- */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Seleziona intervallo temporale</Text>
          
          <View style={styles.chipsContainer}>
            {periods.map((period) => (
              <Chip
                key={period.id}
                label={period.label}
                emoji={period.emoji}
                isActive={selectedPeriod === period.id}
                onPress={() => setSelectedPeriod(period.id)}
                hasInfo={false} 
              />
            ))}
          </View>

          {/* --- BUTTON --- */}
          <View style={styles.buttonWrapper}>
            <AuthButton 
              title="Genera Nuovo Riassunto" 
              onPress={() => {}} 
              iconFamily="material" 
              iconName="auto-fix" 
              variant="primary"
            />
          </View>
        </View>

        {/* --- RESULT --- */}
        <View style={styles.resultHeader}>
           <Ionicons name="document-text-outline" size={20} color={Colors.grey} />
           <Text style={styles.resultTitle}>Risultato Analisi</Text>
        </View>

        <View style={commonStyles.border_card}>
          <Text style={styles.summaryText}>
            Il paziente Mario Rossi mostra un quadro clinico in progressivo miglioramento. 
            Dall'analisi del periodo selezionato, si evince una riduzione dei picchi d'ansia del 30% grazie alla 
            costanza negli esercizi di respirazione. 
            La qualità del sonno risulta stabile, con un incremento della vitalità nelle ore pomeridiane.
          </Text>
        </View>

      </View>
      
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.backgroundInput,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInput,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0ecf2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  aiBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textDark,
    marginBottom: 15,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brainWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderInput,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  generationInfo: {
    marginLeft: 15,
  },
  lastGenLabel: {
    fontSize: 11,
    color: Colors.grey,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  lastGenDate: {
    fontSize: 13,
    color: Colors.textGray,
    marginTop: 2,
  },
  formSection: {
    paddingVertical: 10,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15, 
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
    gap: 8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 26,
  },
});