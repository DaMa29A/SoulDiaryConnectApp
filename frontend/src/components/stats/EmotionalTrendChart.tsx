import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors'; 

const yAxisLabels: { [key: number]: string } = {
  1: 'Neg', 
  2: 'Ans', 
  3: 'Neu', 
  4: 'Pos', 
};

const fullEmotionNames: { [key: number]: string } = {
  1: 'Emotività Negativa', 
  2: 'Stato Ansioso', 
  3: 'Emotività Neutra', 
  4: 'Emotività Positiva', 
};

const quickFilters = [
  { id: 'all', label: 'Tutti' },
  { id: '7d', label: 'Ultimi 7 gg' },
  { id: '1m', label: 'Ultimo mese' },
  { id: '3m', label: 'Ultimi 3 mesi' },
  { id: '1y', label: 'Ultimo anno' },
];

const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const anni = ['2023', '2024', '2025']; 

export default function EmotionalTrendChart() {
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('7d');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'month' | 'year' | null>(null);
  
  const [chartWidth, setChartWidth] = useState(0);

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

  const handleDataPointClick = (data: { index: number; value: number; x: number; y: number; dataset: any; getColor: (opacity: number) => string }) => {
    // Ignoriamo i click sul dataset fantasma (quello invisibile usato per scalare l'asse Y)
    if (data.dataset.withDots === false) return;

    const val = Math.round(data.value);
    const emotionName = fullEmotionNames[val] || 'Sconosciuta';
    const dateLabel = chartData.labels[data.index];
    
    Alert.alert(
      "Dettaglio Rilevazione",
      `Data: ${dateLabel}\nStato: ${emotionName}`,
      [{ text: "Chiudi", style: "cancel" }]
    );
  };

  const chartData = {
    labels: ['1 Ott', '5 Ott', '10 Ott', '15 Ott', '20 Ott', '25 Ott', '30 Ott'],
    datasets: [
      {
        // I dati reali (7 date)
        data: [3, 2, 4, 1, 2, 4, 3],
        color: (opacity = 1) => Colors.primary || `rgba(139, 92, 246, ${opacity})`, 
        strokeWidth: 3,
      },
      {
        // TRUCCO: Dataset fantasma per forzare l'asse Y ad avere esattamente un range 1-4
        data: [1, 4], 
        color: () => 'transparent', // Invisibile
        strokeWidth: 0,
        withDots: false, // Niente pallini
      }
    ],
  };

  return (
    <View style={styles.cardContainer}>
      
      <View style={styles.header}>
        <View />
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Ionicons name="refresh" size={16} color={Colors.textGray} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Periodo rapido</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.quickFilterContainer}
        contentContainerStyle={{ gap: 8, paddingRight: 20 }}
      >
        {quickFilters.map((filter) => {
          const isActive = selectedQuickFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, isActive ? styles.filterChipActive : null]}
              onPress={() => {
                setSelectedQuickFilter(filter.id);
                setSelectedMonth(null);
                setSelectedYear(null);
              }}
            >
              <Text style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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

      <View 
        style={styles.chartWrapper}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          // Salviamo la larghezza esatta disponibile all'interno della card
          setChartWidth(width); 
        }}
      >
        {chartWidth > 0 ? (
          <LineChart
            data={chartData}
            // Aggiungiamo 40 pixel (per assorbire il padding della card) per spalmarlo a tutto schermo
            width={chartWidth + 40} 
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} 
            segments={3} // Il trucco: tra 1 e 4 ci sono esattamente 3 "spazi"
            withInnerLines={true}
            fromZero={false} // IMPORTANTE: Messo a false così parte da 1 (definito nel dataset fantasma)
            onDataPointClick={handleDataPointClick}
            formatYLabel={(yValue) => {
              const val = Math.round(parseFloat(yValue));
              return yAxisLabels[val] || '';
            }}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0, 
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.1})`, 
              labelColor: (opacity = 1) => Colors.textGray || `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 0,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: Colors.white,
              },
              // Permette al grafico di estendersi interamente fino al bordo destro
              paddingRight: 10,
            }}
            bezier
            style={{
              marginTop: 10,
              // Spinge il grafico verso sinistra per annullare il paddingLeft del genitore e nascondere la Y-axis padding
              marginLeft: -35, 
            }}
          />
        ) : null}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleziona {modalType === 'month' ? 'Mese' : 'Anno'}</Text>
            <FlatList
              data={modalType === 'month' ? mesi : anni}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = (modalType === 'month' && selectedMonth === item) || (modalType === 'year' && selectedYear === item);
                return (
                  <TouchableOpacity style={styles.modalItem} onPress={() => selectItem(item)}>
                    <Text style={[styles.modalItemText, isSelected ? styles.modalItemTextActive : null]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 0,
    paddingHorizontal: 20, // Il padding orizzontale rimane, lo aggiriamo col marginLeft nel grafico
    borderWidth: 1,
    borderColor: Colors.borderInput || '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundInput || '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textGray,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textGray,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickFilterContainer: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundInput || '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primary + '1A', 
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.textGray,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
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
    borderColor: Colors.borderInput || '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.white,
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
    alignItems: 'flex-start',
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
    borderBottomColor: '#F3F4F6',
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