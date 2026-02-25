import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import { Colors } from '../../constants/Colors'; 
import { commonStyles } from '../../styles/CommonStyles';

export default function MoodContextAverage() {
  const contextAverages = [
    { id: '1', context: 'Amici', score: 3.8 },
    { id: '2', context: 'Famiglia', score: 3.1 },
    { id: '3', context: 'Lavoro', score: 2.5 },
    { id: '4', context: 'Studio', score: 2.0 },
    { id: '5', context: 'Solitudine', score: 1.2 },
  ];

  const LABEL_WIDTH = 80;

  return (
    <View style={commonStyles.border_card}>
      <Text style={styles.descriptionText}>
        Questo grafico mostra la media emotiva per ogni contesto sociale, permettendo un confronto diretto 
        tra i diversi ambiti della vita del paziente.   
      </Text>

      <View style={styles.chartWrapper}>
        {/* DASHED BACKGROUND GRID */}
        <View style={[styles.gridOverlay, { marginLeft: LABEL_WIDTH }]}>
          {[0, 1, 2, 3, 4].map((line) => (
            <View 
              key={`grid-${line}`} 
              style={[styles.gridLine, { left: `${(line / 4) * 100}%` }]} 
            />
          ))}
        </View>

        {/* GRAPH LINES */}
        {contextAverages.map((item) => {
          const barWidthPercentage = `${(item.score / 4) * 100}%` as DimensionValue;
          return (
            <View key={item.id} style={styles.barRow}>
              <Text style={[styles.yAxisLabel, { width: LABEL_WIDTH }]} numberOfLines={1}>
                {item.context}
              </Text>
              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { width: barWidthPercentage, backgroundColor: Colors.primary }
                  ]} 
                />
                <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
              </View>
            </View>
          );
        })}

        {/* X-AXIS (NUMBERS) */}
        <View style={[styles.xAxisContainer, { marginLeft: LABEL_WIDTH }]}>
          {[1, 2, 3, 4].map(num => (
            <Text key={num} style={styles.xAxisLabel}>{num}</Text>
          ))}
        </View>

        {/* LEGEND */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}><Text style={styles.legendBold}>1</Text> Negativo</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}><Text style={styles.legendBold}>2</Text> Ansioso</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}><Text style={styles.legendBold}>3</Text> Neutro</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendText}><Text style={styles.legendBold}>4</Text> Positivo</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionText: {
    fontSize: 13,
    color: Colors.textGray,
    marginBottom: 20,
  },
  chartWrapper: {
    width: '100%',
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: 80,
    flexDirection: 'row',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftWidth: 1,
    borderColor: Colors.borderInput,
    borderStyle: 'dashed',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  yAxisLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark,
    paddingRight: 10,
  },
  barTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  scoreText: {
    position: 'absolute',
    right: 10,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textGray,
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderInput,
  },
  xAxisLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textGray,
    width: 20,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderInput,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textGray,
  },
  legendBold: {
    fontWeight: '800',
    color: Colors.textDark,
  }
});