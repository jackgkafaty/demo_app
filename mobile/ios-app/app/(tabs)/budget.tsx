import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BudgetScreen() {
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

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

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    Alert.alert('AI Response', `This is a demo response to: "${aiQuery}"\n\nIn the full app, this would analyze your budget and provide personalized recommendations.`);
    setAiQuery('');
    setAiModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.titleText}>Budget Tracker</Text>
            <Text style={styles.subtitleText}>Monitor spending & goals</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus" size={24} color="#10B981" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

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

        {/* Bottom padding for floating button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.floatingAiButton}
        onPress={() => setAiModalVisible(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667EEA', '#764BA2', '#F093FB']}
          style={styles.aiButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="brain.head.profile" size={32} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* AI Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aiModalVisible}
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Budget AI Assistant</Text>
              <TouchableOpacity 
                onPress={() => setAiModalVisible(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.aiPrompt}>
                Ask me about your budget and spending optimization!
              </Text>
              <TextInput
                style={styles.aiInput}
                placeholder="e.g., How can I reduce my dining expenses?"
                value={aiQuery}
                onChangeText={setAiQuery}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity 
                style={styles.askButton}
                onPress={handleAiQuery}
              >
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.askButtonGradient}
                >
                  <Text style={styles.askButtonText}>Get Budget Tips</Text>
                  <IconSymbol name="target" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
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
  floatingAiButton: {
    position: 'absolute',
    bottom: 115,
    right: 20,
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
    zIndex: 1000,
  },
  aiButtonGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 20,
  },
  aiPrompt: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  aiInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  askButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  askButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  askButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
