import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BudgetScreen() {
  const budgetData = {
    totalBudget: 4500,
    totalSpent: 3200,
    categories: [
      { name: 'Groceries', budget: 800, spent: 650, color: '#10B981' },
      { name: 'Dining Out', budget: 400, spent: 320, color: '#F59E0B' },
      { name: 'Transportation', budget: 300, spent: 280, color: '#3B82F6' },
      { name: 'Entertainment', budget: 200, spent: 150, color: '#8B5CF6' },
      { name: 'Shopping', budget: 300, spent: 400, color: '#EF4444' },
    ]
  };

  const getPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const isOverBudget = (spent: number, budget: number) => {
    return spent > budget;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget Tracking</Text>
        <TouchableOpacity style={styles.addButton}>
          <IconSymbol name="plus" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Monthly Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Budget</Text>
              <Text style={styles.statValue}>${budgetData.totalBudget.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Spent</Text>
              <Text style={[
                styles.statValue,
                { color: budgetData.totalSpent > budgetData.totalBudget ? '#EF4444' : '#10B981' }
              ]}>
                ${budgetData.totalSpent.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${getPercentage(budgetData.totalSpent, budgetData.totalBudget)}%`,
                    backgroundColor: budgetData.totalSpent > budgetData.totalBudget ? '#EF4444' : '#10B981'
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {getPercentage(budgetData.totalSpent, budgetData.totalBudget).toFixed(0)}% used
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {budgetData.categories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                {isOverBudget(category.spent, category.budget) && (
                  <View style={styles.warningBadge}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#EF4444" />
                  </View>
                )}
              </View>
              
              <View style={styles.categoryStats}>
                <Text style={styles.categoryAmount}>
                  ${category.spent} / ${category.budget}
                </Text>
                <Text style={[
                  styles.categoryPercentage,
                  { color: isOverBudget(category.spent, category.budget) ? '#EF4444' : '#6B7280' }
                ]}>
                  {getPercentage(category.spent, category.budget).toFixed(0)}%
                </Text>
              </View>
              
              <View style={styles.categoryProgressBar}>
                <View 
                  style={[
                    styles.categoryProgressFill,
                    { 
                      width: `${Math.min(getPercentage(category.spent, category.budget), 100)}%`,
                      backgroundColor: isOverBudget(category.spent, category.budget) ? '#EF4444' : category.color
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="plus.circle" size={24} color="#10B981" />
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="target" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Set Budget Goals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="chart.bar" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  warningBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
  },
  categoryProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
  },
});
