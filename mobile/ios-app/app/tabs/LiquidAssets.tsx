import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function LiquidAssetsScreen() {
  const accounts = [
    { name: 'Chequing Account', balance: 5420.50, currency: 'CAD', gainLoss: 0.5 },
    { name: 'Savings Account', balance: 25000.00, currency: 'CAD', gainLoss: 1.2 },
    { name: 'Investment Account', balance: 15750.25, currency: 'USD', gainLoss: 7.8 },
  ];

  const totalUSD = accounts.reduce((sum, account) => {
    const rate = account.currency === 'CAD' ? 0.75 : 1;
    return sum + (account.balance * rate);
  }, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.totalSection}>
        <Text style={styles.totalAmount}>${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</Text>
        <Text style={styles.totalLabel}>Total (auto-converted)</Text>
      </View>

      {accounts.map((account, index) => (
        <View key={index} style={styles.accountCard}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountBalance}>
            {account.balance.toLocaleString()} {account.currency}
          </Text>
          <Text style={[styles.gainLoss, { color: account.gainLoss >= 0 ? '#10b981' : '#ef4444' }]}>
            {account.gainLoss >= 0 ? '+' : ''}{account.gainLoss.toFixed(2)}%
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  totalSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  accountCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gainLoss: {
    fontSize: 14,
    fontWeight: '500',
  },
});
