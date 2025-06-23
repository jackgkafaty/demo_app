import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const analyticsData = {
    totalSpent: 3247.86,
    totalIncome: 5200.00,
    savingsRate: 37.6,
    categories: [
      { name: 'Food & Dining', amount: 847.23, percentage: 26.1, color: '#EF4444' },
      { name: 'Transportation', amount: 524.50, percentage: 16.1, color: '#F59E0B' },
      { name: 'Shopping', amount: 392.15, percentage: 12.1, color: '#8B5CF6' },
      { name: 'Entertainment', amount: 285.90, percentage: 8.8, color: '#10B981' },
      { name: 'Utilities', amount: 456.30, percentage: 14.0, color: '#3B82F6' },
      { name: 'Healthcare', amount: 189.45, percentage: 5.8, color: '#F97316' },
    ],
    goals: [
      { name: 'Emergency Fund', current: 15000, target: 20000, percentage: 75 },
      { name: 'Vacation', current: 2800, target: 5000, percentage: 56 },
      { name: 'New Car', current: 8500, target: 25000, percentage: 34 },
    ]
  };

  const periods = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    Alert.alert('AI Response', `This is a demo response to: "${aiQuery}"\n\nIn the full app, this would analyze your spending patterns and provide personalized insights.`);
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
            <Text style={styles.titleText}>Analytics</Text>
            <Text style={styles.subtitleText}>Financial insights & trends</Text>
          </View>
        </View>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.selectedPeriodButton
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.selectedPeriodButtonText
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <IconSymbol name="arrow.down.circle" size={24} color="#EF4444" />
            <Text style={styles.overviewLabel}>Total Spent</Text>
            <Text style={styles.overviewValue}>${analyticsData.totalSpent.toFixed(2)}</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <IconSymbol name="arrow.up.circle" size={24} color="#10B981" />
            <Text style={styles.overviewLabel}>Total Income</Text>
            <Text style={styles.overviewValue}>${analyticsData.totalIncome.toFixed(2)}</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <IconSymbol name="chart.pie" size={24} color="#3B82F6" />
            <Text style={styles.overviewLabel}>Savings Rate</Text>
            <Text style={styles.overviewValue}>{analyticsData.savingsRate}%</Text>
          </View>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          {analyticsData.categories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${category.percentage}%`, backgroundColor: category.color }]} />
              </View>
              <Text style={styles.categoryPercentage}>{category.percentage}% of total spending</Text>
            </View>
          ))}
        </View>

        {/* Financial Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Goals</Text>
          {analyticsData.goals.map((goal, index) => (
            <View key={index} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalProgress}>
                  ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                </Text>
              </View>
              <View style={styles.goalProgressContainer}>
                <View style={[styles.goalProgressBar, { width: `${goal.percentage}%` }]} />
              </View>
              <Text style={styles.goalPercentage}>{goal.percentage}% complete</Text>
            </View>
          ))}
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
              <Text style={styles.modalTitle}>Analytics AI Assistant</Text>
              <TouchableOpacity 
                onPress={() => setAiModalVisible(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.aiPrompt}>
                Ask me to analyze your spending patterns and financial trends!
              </Text>
              <TextInput
                style={styles.aiInput}
                placeholder="e.g., Why did I spend more on food this month?"
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
                  <Text style={styles.askButtonText}>Analyze</Text>
                  <IconSymbol name="chart.bar" size={20} color="#FFFFFF" />
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
    paddingBottom: 12,
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
  periodSelector: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  selectedPeriodButton: {
    backgroundColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedPeriodButtonText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  goalProgress: {
    fontSize: 14,
    color: '#6B7280',
  },
  goalProgressContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 12,
    color: '#6B7280',
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
