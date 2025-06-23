import React from 'react';
import { ScrollView, View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BudgetTrackingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const budgetData = [
    { category: 'Food', budget: 1000, actual: 850, percentage: 85 },
    { category: 'Transport', budget: 400, actual: 320, percentage: 80 },
    { category: 'Entertainment', budget: 300, actual: 280, percentage: 93 },
    { category: 'Shopping', budget: 500, actual: 620, percentage: 124 },
  ];

  const getColor = (percentage: number) => {
    if (percentage <= 80) return isDark ? '#10d493' : '#10b981';
    if (percentage <= 100) return isDark ? '#fbbf24' : '#f59e0b';
    return isDark ? '#f87171' : '#ef4444';
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.actual, 0);

  const GlassCard = ({ children, style = {} }) => (
    <View style={[
      styles.glassCard,
      isDark ? styles.glassCardDark : styles.glassCardLight,
      style
    ]}>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Budget Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Budget:</Text>
          <Text style={styles.summaryValue}>${totalBudget}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Spent:</Text>
          <Text style={styles.summaryValue}>${totalSpent}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Difference:</Text>
          <Text style={[styles.summaryValue, { color: totalSpent > totalBudget ? '#ef4444' : '#10b981' }]}>
            ${Math.abs(totalBudget - totalSpent)}
          </Text>
        </View>
      </View>

      {budgetData.map((item, index) => (
        <View key={index} style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.categoryName}>{item.category}</Text>
            <Text style={[styles.percentage, { color: getColor(item.percentage) }]}>
              {item.percentage}%
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: getColor(item.percentage)
                }
              ]} 
            />
          </View>

          <View style={styles.budgetDetails}>
            <Text style={styles.detailText}>${item.actual} / ${item.budget}</Text>
            <Text style={[styles.difference, { color: getColor(item.percentage) }]}>
              {item.percentage > 100 ? '+' : '-'}${Math.abs(item.actual - item.budget)} 
              {item.percentage > 100 ? ' over' : ' under'}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.suggestionsCard}>
        <Text style={styles.suggestionsTitle}>💡 Suggestions</Text>
        <Text style={styles.suggestion}>• Consider reducing shopping expenses next month</Text>
        <Text style={styles.suggestion}>• You're doing well with food budget management</Text>
        <Text style={styles.suggestion}>• Transport costs are under control</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  difference: {
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionsCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e40af',
  },
  suggestion: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
  },
});
