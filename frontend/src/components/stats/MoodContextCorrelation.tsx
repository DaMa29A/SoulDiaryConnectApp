import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors'; 
import { commonStyles } from '../../styles/CommonStyles';

const screenWidth = Dimensions.get('window').width;

export default function MoodContextCorrelation() {
  const positiveContext = { name: 'Amici', score: '3.8 / 4' };
  const criticalContext = { name: 'Solitudine', score: '1.2 / 4' };

  // Mock Data for the Bar Chart
  const barChartData = {
    labels: ['Study', 'Loneliness', 'Work', 'Friends', 'Family', 'Travel', 'Hobbies'],
    datasets: [{ data: [12, 18, 8, 15, 10, 7, 11] }],
  };

  // Calculate dynamic width based on labels to enable horizontal scrolling
  const dynamicChartWidth = Math.max(screenWidth - 60, barChartData.labels.length * 70);

  return (
    <View style={[commonStyles.border_card]}>
      
      {/* DESCRIPTION SECTION */}
      <Text style={styles.descriptionText}>
        Questa analisi mostra come lo stato emotivo del paziente varia in base al contesto sociale. 
        Permette di identificare quali contesti sono associati ad emozioni positive o negative.
      </Text>

      {/* HIGHLIGHTS SECTION */}
      <View style={styles.highlightsContainer}>
        <View style={[styles.highlightBox, styles.highlightPositive]}>
          <View style={styles.highlightHeader}>
            <Ionicons name="arrow-up-circle-outline" size={20} color={Colors.darkGreen} />
            <Text style={[styles.highlightTitle, { color: Colors.darkGreen }]}>Più positivo</Text>
          </View>
          <Text style={styles.contextName}>{positiveContext.name}</Text>
          <Text style={styles.contextScore}>Media: {positiveContext.score}</Text>
        </View>

        <View style={[styles.highlightBox, styles.highlightCritical]}>
          <View style={styles.highlightHeader}>
            <Ionicons name="warning-outline" size={20} color={Colors.red} />
            <Text style={[styles.highlightTitle, { color: Colors.red }]}>Più critico</Text>
          </View>
          <Text style={styles.contextName}>{criticalContext.name}</Text>
          <Text style={styles.contextScore}>Media: {criticalContext.score}</Text>
        </View>
      </View>
      
      {/* GRAPH  */}
      <Text style={styles.chartTitle}>Frequenza note per contesto</Text>

      <View style={styles.chartMainContainer}>
        {/* VERTICAL Y-AXIS LABEL */}
        <View style={styles.verticalTextWrapper}>
          <Text style={styles.verticalText}>NOTES COUNT</Text>
        </View>

        {/* HORIZONTAL SCROLL FOR THE CHART */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.horizontalScroll}
        >
          <BarChart
            data={barChartData}
            width={dynamicChartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero={true}
            showValuesOnTopOfBars={true}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => Colors.primary,
              labelColor: () => Colors.textGray,
              barPercentage: 0.6,
              propsForLabels: { 
                fontSize: 10 },
              propsForBackgroundLines: {
                stroke: Colors.borderInput,
                strokeDasharray: "0",
              }
            }}
            style={styles.barChartStyle}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardResize: {
    flex: 0, 
    alignSelf: 'stretch',
    paddingBottom: 20,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textGray,
    lineHeight: 18,
    marginBottom: 15,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  highlightBox: {
    width: '48%',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  highlightPositive: {
    backgroundColor: '#F1F8E9', //green
    borderColor: '#C5E1A5',
  },
  highlightCritical: {
    backgroundColor: '#FFEBEE', //red
    borderColor: '#FFCDD2',
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  highlightTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contextName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textDark,
  },
  contextScore: {
    fontSize: 12,
    color: Colors.textGray,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 240,
  },
  verticalTextWrapper: {
    width: 30,             
    height: 220,           
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalText: {
    position: 'absolute',
    width: 220,
    height: 30,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    left: -95, //// (Container Width / 2) - (Text Width / 2) -> (15 - 110)
    alignSelf: 'center', 
    fontWeight: 'bold',
    fontSize: 10,
    color: Colors.textGray,
  },
  horizontalScroll: {
    flex: 1,
  },
  barChartStyle: {
    marginTop: 10,
    paddingRight: 50, 
    marginLeft: -25,
  }
});