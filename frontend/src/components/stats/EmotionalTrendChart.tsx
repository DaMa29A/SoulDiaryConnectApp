import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  FlatList,
  Alert,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors'; 
import { commonStyles } from '../../styles/CommonStyles';
import Chip from '../buttons/Chip';

const screenWidth = Dimensions.get('window').width;

// Etichette complete per l'asse Y
const yAxisLabels: { [key: number]: string } = {
  1: 'Negative', 
  2: 'Ansiose', 
  3: 'Neutre', 
  4: 'Positive', 
};

const fullEmotionNames: { [key: number]: string } = {
  1: 'Emotività Negativa', 
  2: 'Stato Ansioso', 
  3: 'Emotività Neutra', 
  4: 'Emotività Positiva', 
};

const quickFilters = [
  { id: 'all', label: 'Tutti', emoji: '' },
  { id: '7d', label: 'Ultimi 7 giorni', emoji: '' },
  { id: '1m', label: 'Ultimo mese', emoji: '' },
  { id: '3m', label: 'Ultimi 3 mesi', emoji: '' },
  { id: '1y', label: 'Ultimo anno', emoji: '' },
];

const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const anni = ['2023', '2024', '2025']; 

export default function EmotionalTrendChart() {
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('7d');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'month' | 'year' | null>(null);

  const handleReset = () => {
    setSelectedQuickFilter('7d');
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const openModal = (type: 'month' | 'year') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectItem = (item: string) => {
    setSelectedQuickFilter(''); 
    if (modalType === 'month') {
      setSelectedMonth(item);
    } else {
      setSelectedYear(item);
    }
    setModalVisible(false);
  };

  const handleDataPointClick = (data: any) => {
    const val = Math.round(data.value);
    const emotionName = fullEmotionNames[val] || 'Sconosciuta';
    const dateLabel = chartData.labels[data.index];
    
    Alert.alert(
      "Dettaglio Rilevazione",
      `Data: ${dateLabel}\nStato: ${emotionName}`,
      [{ text: "Chiudi", style: "cancel" }]
    );
  };

  // GRAPH DATA
  const chartData = {
    labels: ['1 Ott', '5 Ott', '10 Ott', '15 Ott', '20 Ott', '25 Ott', '30 Ott'],
    datasets: [
      {
        // TODO: IMPORTANTE: I dati devono contenere almeno un 1 e un 4 per scalare correttamente
        data: [3, 2, 4, 1, 2, 4, 3],
        color: (opacity = 1) => Colors.primary, 
        strokeWidth: 3,
      }
    ],
  };

  // Calculating width for scrolling
  const dynamicWidth = Math.max(screenWidth, chartData.labels.length * 80);

  return (
    <View style={commonStyles.border_card}>
      
      {/* --- Period: Fast --- */}
      <Text style={styles.sectionLabel}>Periodo rapido</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.quickFilterContainer}
        contentContainerStyle={{ gap: 8 }}
      >
        {quickFilters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.label}
            emoji={filter.emoji}
            isActive={selectedQuickFilter === filter.id}
            onPress={() => {
              setSelectedQuickFilter(filter.id);
              setSelectedMonth(null);
              setSelectedYear(null);
            }}
          />
        ))}
      </ScrollView>
      
      {/* --- Period: Specific --- */}
      <Text style={styles.sectionLabel}>Periodo specifico</Text>
      
      <View style={styles.specificPeriodRow}>
        <TouchableOpacity 
          style={[styles.dropdownButton, selectedMonth ? styles.dropdownActive : null]} 
          onPress={() => openModal('month')}
        >
          <Text style={styles.dropdownText}>{selectedMonth || 'Mese'}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textGray} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dropdownButton, selectedYear ? styles.dropdownActive : null]} 
          onPress={() => openModal('year')}
        >
          <Text style={styles.dropdownText}>{selectedYear || 'Anno'}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.textGray} />
        </TouchableOpacity>
      </View>
      
      {/* --- Reset Button --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={16} color={Colors.red} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
      {/* --- Graph --- */}
      <View style={styles.chartWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingLeft: 10, paddingRight: 30 }}
        >
          <LineChart
            data={chartData}
            width={dynamicWidth} 
            height={280}
            segments={3} // Divides the Y axis into 3 segments (4 ticks: 1, 2, 3, 4)
            fromZero={false} 
            onDataPointClick={handleDataPointClick}
            formatYLabel={(yValue) => {
              const val = Math.round(parseFloat(yValue));
              return yAxisLabels[val] || '';
            }}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 0, 
              color: (opacity = 1) => Colors.primary, 
              labelColor: () => Colors.textGray,
              propsForDots: { r: '6', strokeWidth: '2', stroke: Colors.white },
              fillShadowGradient: Colors.primary, 
              fillShadowGradientOpacity: 0.3,     
              fillShadowGradientTo: Colors.white, 
              fillShadowGradientToOpacity: 0.0,   
              useShadowColorFromDataset: false,
              propsForBackgroundLines: {
                strokeDasharray: "6",
                stroke: Colors.borderInput,
              },
            }}
            bezier
            style={{ 
              marginTop: 10,
              borderRadius: 16 
            }}
          />
        </ScrollView>
      </View>
      
      {/* --- Modal --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleziona {modalType === 'month' ? 'Mese' : 'Anno'}</Text>
            <FlatList
              data={modalType === 'month' ? mesi : anni}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectItem(item)}>
                  <Text style={[
                    styles.modalItemText, 
                    ((modalType === 'month' && selectedMonth === item) || (modalType === 'year' && selectedYear === item)) && styles.modalItemTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textGray,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightRed,
    borderWidth: 1,
    borderColor: Colors.borderRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.red,
  },
  quickFilterContainer: {
    marginBottom: 20,
  },
  specificPeriodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundInput,
  },
  dropdownActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.textDark,
  },
  chartWrapper: {
    width: '100%', 
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.textDark,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInput,
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.textDark,
  },
  modalItemTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  }
});