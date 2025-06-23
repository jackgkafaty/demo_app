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

export default function HomeScreen() {
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  const portfolioData = {
    totalAssets: 67998,
    monthlyGrowth: 2194,
    accounts: [
      { name: 'Savings Account', balance: 25000, change: 5.2 },
      { name: 'Investment Portfolio', balance: 42998, change: 8.7 },
    ],
    recentTransactions: [
      { id: 1, description: 'Grocery Store', amount: -127.45, date: '2 hours ago' },
      { id: 2, description: 'Salary Deposit', amount: 5200.00, date: '1 day ago' },
      { id: 3, description: 'Utility Bill', amount: -89.32, date: '2 days ago' },
    ]
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    Alert.alert('AI Response', `This is a demo response to: "${aiQuery}"\n\nIn the full app, this would connect to your finance data and provide personalized insights.`);
    setAiQuery('');
    setAiModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Enhanced Header with Finance Branding */}
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.nameText}>John Doe</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <IconSymbol name="bell" size={24} color="#6B7280" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Portfolio Overview Card */}
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.portfolioCard}
        >
          <Text style={styles.portfolioTitle}>Portfolio Overview</Text>
          <Text style={styles.totalAssets}>
            ${portfolioData.totalAssets.toLocaleString()}
          </Text>
          <View style={styles.growthContainer}>
            <IconSymbol name="arrow.up.right" size={16} color="#FFFFFF" />
            <Text style={styles.growthText}>
              +${portfolioData.monthlyGrowth.toLocaleString()} this month
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="plus.circle" size={32} color="#10B981" />
              <Text style={styles.actionText}>Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="chart.bar" size={32} color="#3B82F6" />
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="target" size={32} color="#F59E0B" />
              <Text style={styles.actionText}>Set Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol name="doc.text" size={32} color="#8B5CF6" />
              <Text style={styles.actionText}>Budgets</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Accounts */}
        <View style={styles.accountsSection}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          {portfolioData.accounts.map((account, index) => (
            <View key={index} style={styles.accountCard}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBalance}>
                  ${account.balance.toLocaleString()}
                </Text>
              </View>
              <View style={styles.accountChange}>
                <IconSymbol 
                  name={account.change > 0 ? "arrow.up" : "arrow.down"} 
                  size={16} 
                  color={account.change > 0 ? "#10B981" : "#EF4444"} 
                />
                <Text style={[
                  styles.changeText,
                  { color: account.change > 0 ? "#10B981" : "#EF4444" }
                ]}>
                  {account.change > 0 ? '+' : ''}{account.change}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {portfolioData.recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount > 0 ? "#10B981" : "#EF4444" }
              ]}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom padding for floating button */}
        <View style={{ height: 100 }} />
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
              <Text style={styles.modalTitle}>Ask AI Assistant</Text>
              <TouchableOpacity 
                onPress={() => setAiModalVisible(false)}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.aiPrompt}>
                Ask me anything about your finances!
              </Text>
              <TextInput
                style={styles.aiInput}
                placeholder="e.g., How much did I spend on groceries this month?"
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
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.askButtonGradient}
                >
                  <Text style={styles.askButtonText}>Ask AI</Text>
                  <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  portfolioCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  portfolioTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAssets: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    textAlign: 'center',
  },
  accountsSection: {
    marginBottom: 24,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  accountChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingAiButton: {
    position: 'absolute',
    bottom: 115, // Positioned above enhanced tab bar
    right: 20,
    width: 68,
    height: 68,
    borderRadius: 34,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
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
