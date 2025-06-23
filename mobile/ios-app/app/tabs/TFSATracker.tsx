import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function TFSATrackerScreen() {
  const [currentYear] = useState(2025);
  const [contributions, setContributions] = useState([
    { year: 2023, amount: 6500, limit: 6500 },
    { year: 2024, amount: 7000, limit: 7000 },
    { year: 2025, amount: 4500, limit: 7000 },
  ]);
  const [newContribution, setNewContribution] = useState('');

  const currentLimit = 7000;
  const currentContribution = contributions.find(c => c.year === currentYear)?.amount || 0;
  const remainingRoom = currentLimit - currentContribution;
  const isOverContributed = currentContribution > currentLimit;

  const addContribution = () => {
    const amount = parseFloat(newContribution);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid contribution amount.');
      return;
    }

    setContributions(prev => 
      prev.map(c => 
        c.year === currentYear 
          ? { ...c, amount: c.amount + amount }
          : c
      )
    );
    setNewContribution('');
    Alert.alert('Success', `Added $${amount} to your ${currentYear} TFSA contribution.`);
  };

  const lifetimeContributionRoom = () => {
    return contributions.reduce((sum, c) => sum + c.limit, 0);
  };

  const lifetimeContributions = () => {
    return contributions.reduce((sum, c) => sum + c.amount, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>{currentYear} TFSA Status</Text>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Annual Limit</Text>
          <Text style={styles.statusValue}>${currentLimit.toLocaleString()}</Text>
        </View>
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Contributed</Text>
          <Text style={styles.statusValue}>${currentContribution.toLocaleString()}</Text>
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min((currentContribution / currentLimit) * 100, 100)}%`,
                backgroundColor: isOverContributed ? '#ef4444' : '#10b981'
              }
            ]} 
          />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>
            {isOverContributed ? 'Over-contributed!' : 'Remaining Room'}
          </Text>
          <Text style={[styles.statusValue, { color: isOverContributed ? '#ef4444' : '#10b981' }]}>
            ${Math.abs(remainingRoom).toLocaleString()}
          </Text>
        </View>

        {isOverContributed && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Over-contribution Warning</Text>
              <Text style={styles.warningText}>
                You have exceeded your TFSA limit by ${Math.abs(remainingRoom).toLocaleString()}. 
                This may result in penalty taxes of 1% per month.
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.addCard}>
        <Text style={styles.cardTitle}>Add Contribution</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={newContribution}
            onChangeText={setNewContribution}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addContribution}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>Contribution History</Text>
        {contributions.map((contribution, index) => {
          const progress = (contribution.amount / contribution.limit) * 100;
          return (
            <View key={index} style={styles.yearItem}>
              <View style={styles.yearHeader}>
                <Text style={styles.yearText}>{contribution.year}</Text>
                <Text style={styles.yearAmount}>
                  ${contribution.amount.toLocaleString()} / ${contribution.limit.toLocaleString()}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: progress > 100 ? '#ef4444' : '#3b82f6'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(1)}% used</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Lifetime Summary</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Total Room Available</Text>
          <Text style={styles.statusValue}>${lifetimeContributionRoom().toLocaleString()}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Total Contributed</Text>
          <Text style={styles.statusValue}>${lifetimeContributions().toLocaleString()}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Unused Room</Text>
          <Text style={[styles.statusValue, { color: '#3b82f6' }]}>
            ${(lifetimeContributionRoom() - lifetimeContributions()).toLocaleString()}
          </Text>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 TFSA Tips</Text>
          <Text style={styles.tipText}>• TFSA room carries forward if unused</Text>
          <Text style={styles.tipText}>• Withdrawals restore room next year</Text>
          <Text style={styles.tipText}>• Investment gains don't count toward limit</Text>
          <Text style={styles.tipText}>• Over-contributions are penalized 1%/month</Text>
        </View>
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
  statusCard: {
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
  addCard: {
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
  historyCard: {
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#b91c1c',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  yearItem: {
    marginBottom: 16,
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  yearAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  tipsCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#1e40af',
    marginBottom: 2,
  },
});
