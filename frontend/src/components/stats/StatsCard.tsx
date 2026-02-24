import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; 

export interface StatsData {
  totalNotes: number | string;
  averageScore: number | string;
  topEmotion: string;
  topEmotionCount: number;
}

interface StatsCardProps {
  stats: StatsData;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <View style={styles.statsWrapper}>
          
      {/* Riga Note Totali */}
      <View style={styles.statRow}>
        <View style={styles.labelGroup}>
          <Ionicons name="document-text-outline" size={20} color={Colors.textGray || '#6b7280'} />
          <Text style={styles.rowLabel}>Note totali</Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.valueTextMain}>{stats.totalNotes}</Text>
        </View>
      </View>

      {/* Riga Media Emotività */}
      <View style={styles.statRow}>
        <View style={styles.labelGroup}>
          <Ionicons name="analytics-outline" size={20} color={Colors.textGray || '#6b7280'} />
          <Text style={styles.rowLabel}>Media emotività</Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.valueTextScore}>{stats.averageScore}</Text>
        </View>
      </View>

      {/* Riga Emozione Prevalente */}
      <View style={[styles.statRow, styles.lastRow]}>
        <View style={styles.labelGroup}>
          <Ionicons name="trending-down-outline" size={20} color={Colors.textGray || '#6b7280'} />
          <Text style={styles.rowLabel}>Emozione prevalente</Text>
        </View>
        <View style={[styles.valueBox, { minWidth: 140 }]}>
          <Text style={styles.valueTextEmotion}>
            {stats.topEmotion} <Text style={styles.countText}>({stats.topEmotionCount}x)</Text>
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  statsWrapper: {
    width: '100%', 
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderInput || '#f3f4f6',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInput || '#f3f4f6', 
  },
  lastRow: {
    borderBottomWidth: 0, 
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    color: Colors.textDark || '#374151',
    fontWeight: '500',
    marginLeft: 12, 
  },
  valueBox: {
    backgroundColor: Colors.backgroundInput || '#f3f4f6', 
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueTextMain: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  valueTextScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.violet || '#8b5cf6', 
  },
  valueTextEmotion: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark || '#374151',
  },
  countText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.textGray || '#6b7280',
  }
});