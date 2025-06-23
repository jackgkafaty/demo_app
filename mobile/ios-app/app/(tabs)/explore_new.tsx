import React from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const monthlyData = [
    { month: 'Jan', income: 4200, expenses: 3100, savings: 1100 },
    { month: 'Feb', income: 4200, expenses: 2800, savings: 1400 },
    { month: 'Mar', income: 4200, expenses: 3400, savings: 800 },
    { month: 'Apr', income: 4200, expenses: 2900, savings: 1300 },
    { month: 'May', income: 4200, expenses: 3200, savings: 1000 },
    { month: 'Jun', income: 4200, expenses: 2700, savings: 1500 },
  ];

  const categories = [
    { name: 'Housing', amount: 1200, percentage: 40, color: '#ef4444' },
    { name: 'Food', amount: 600, percentage: 20, color: '#f97316' },
    { name: 'Transportation', amount: 450, percentage: 15, color: '#eab308' },
    { name: 'Entertainment', amount: 300, percentage: 10, color: '#22c55e' },
    { name: 'Utilities', amount: 240, percentage: 8, color: '#3b82f6' },
    { name: 'Other', amount: 210, percentage: 7, color: '#8b5cf6' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Text style={styles.headerTitle}>📊 Analytics</Text>
        <Text style={styles.headerSubtitle}>Financial Insights & Trends</Text>
      </ThemedView>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>$1,500</Text>
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summarySubtitle}>Savings</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>$2,700</Text>
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summarySubtitle}>Expenses</Text>
        </View>
      </View>

      {/* Monthly Trend */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>6-Month Trend</ThemedText>
        <View style={styles.chartContainer}>
          {monthlyData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barChart}>
                <View 
                  style={[
                    styles.bar, 
                    styles.incomeBar,
                    { height: (item.income / 5000) * 100 }
                  ]} 
                />
                <View 
                  style={[
                    styles.bar, 
                    styles.expensesBar,
                    { height: (item.expenses / 5000) * 100 }
                  ]} 
                />
                <View 
                  style={[
                    styles.bar, 
                    styles.savingsBar,
                    { height: (item.savings / 5000) * 100 }
                  ]} 
                />
              </View>
              <Text style={styles.monthLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Expenses</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Savings</Text>
          </View>
        </View>
      </ThemedView>

      {/* Spending Categories */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Spending by Category</ThemedText>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <Text style={styles.categoryAmount}>${category.amount}</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.categoryPercentage}>{category.percentage}% of total</Text>
          </View>
        ))}
      </ThemedView>

      {/* Financial Goals */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Financial Goals</ThemedText>
        
        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalName}>🏠 House Down Payment</Text>
            <Text style={styles.goalAmount}>$15,000 / $50,000</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%', backgroundColor: '#10b981' }]} />
          </View>
          <Text style={styles.goalProgress}>30% complete • $35,000 remaining</Text>
        </View>

        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalName}>✈️ Vacation Fund</Text>
            <Text style={styles.goalAmount}>$2,800 / $5,000</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '56%', backgroundColor: '#f59e0b' }]} />
          </View>
          <Text style={styles.goalProgress}>56% complete • $2,200 remaining</Text>
        </View>

        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalName}>🚗 Emergency Fund</Text>
            <Text style={styles.goalAmount}>$8,500 / $10,000</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%', backgroundColor: '#3b82f6' }]} />
          </View>
          <Text style={styles.goalProgress}>85% complete • $1,500 remaining</Text>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#1e293b',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 2,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
  incomeBar: {
    backgroundColor: '#10b981',
  },
  expensesBar: {
    backgroundColor: '#ef4444',
  },
  savingsBar: {
    backgroundColor: '#3b82f6',
  },
  monthLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#64748b',
  },
  goalItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  goalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
  },
  goalProgress: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
});
