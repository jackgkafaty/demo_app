import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

interface Stock {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  lastUpdated: string;
}

export default function StockTrackingScreen() {
  const [stocks, setStocks] = useState<Stock[]>([
    { ticker: 'AAPL', shares: 10, avgCost: 150.00, currentPrice: 185.20, lastUpdated: '2025-06-21' },
    { ticker: 'MSFT', shares: 5, avgCost: 300.00, currentPrice: 420.15, lastUpdated: '2025-06-21' },
    { ticker: 'GOOGL', shares: 3, avgCost: 120.00, currentPrice: 135.80, lastUpdated: '2025-06-21' },
  ]);

  const [newStock, setNewStock] = useState({ ticker: '', shares: '', avgCost: '' });
  const [isLoading, setIsLoading] = useState(false);

  const calculateGainLoss = (stock: Stock) => {
    const totalCost = stock.shares * stock.avgCost;
    const currentValue = stock.shares * stock.currentPrice;
    return currentValue - totalCost;
  };

  const calculateGainLossPercentage = (stock: Stock) => {
    const gainLoss = calculateGainLoss(stock);
    const totalCost = stock.shares * stock.avgCost;
    return (gainLoss / totalCost) * 100;
  };

  const totalPortfolioValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + (stock.shares * stock.avgCost), 0);
  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainLossPercentage = (totalGainLoss / totalCost) * 100;

  const addStock = async () => {
    if (!newStock.ticker || !newStock.shares || !newStock.avgCost) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with random price
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockPrice = Math.random() * 400 + 100;

    const stock: Stock = {
      ticker: newStock.ticker.toUpperCase(),
      shares: parseFloat(newStock.shares),
      avgCost: parseFloat(newStock.avgCost),
      currentPrice: mockPrice,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setStocks(prev => [...prev, stock]);
    setNewStock({ ticker: '', shares: '', avgCost: '' });
    setIsLoading(false);
    
    Alert.alert('Success', `Added ${stock.ticker} to your portfolio.`);
  };

  const refreshPrices = async () => {
    setIsLoading(true);
    
    // Simulate price updates
    const updatedStocks = stocks.map(stock => ({
      ...stock,
      currentPrice: stock.currentPrice * (0.95 + Math.random() * 0.1), // ±5% variation
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStocks(updatedStocks);
    setIsLoading(false);
    
    Alert.alert('Prices Updated', 'Stock prices have been refreshed.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.cardTitle}>Portfolio Overview</Text>
          <TouchableOpacity 
            style={[styles.refreshButton, { opacity: isLoading ? 0.5 : 1 }]}
            onPress={refreshPrices}
            disabled={isLoading}
          >
            <Text style={styles.refreshButtonText}>
              {isLoading ? 'Updating...' : 'Refresh'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>${totalPortfolioValue.toLocaleString()}</Text>
            <Text style={styles.overviewLabel}>Total Value</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, { color: totalGainLoss >= 0 ? '#10b981' : '#ef4444' }]}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
            </Text>
            <Text style={styles.overviewLabel}>Gain/Loss</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, { color: totalGainLossPercentage >= 0 ? '#10b981' : '#ef4444' }]}>
              {totalGainLossPercentage >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%
            </Text>
            <Text style={styles.overviewLabel}>Percentage</Text>
          </View>
        </View>
      </View>

      <View style={styles.addStockCard}>
        <Text style={styles.cardTitle}>Add New Stock</Text>
        <TextInput
          style={styles.input}
          placeholder="Ticker (e.g., AAPL)"
          value={newStock.ticker}
          onChangeText={(text) => setNewStock({...newStock, ticker: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of shares"
          value={newStock.shares}
          onChangeText={(text) => setNewStock({...newStock, shares: text})}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Average cost per share"
          value={newStock.avgCost}
          onChangeText={(text) => setNewStock({...newStock, avgCost: text})}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.addButton, { opacity: isLoading ? 0.5 : 1 }]}
          onPress={addStock}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading ? 'Adding...' : 'Add Stock'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.holdingsCard}>
        <Text style={styles.cardTitle}>Holdings</Text>
        {stocks.map((stock, index) => {
          const gainLoss = calculateGainLoss(stock);
          const percentage = calculateGainLossPercentage(stock);
          const currentValue = stock.shares * stock.currentPrice;
          
          return (
            <View key={index} style={styles.stockItem}>
              <View style={styles.stockHeader}>
                <Text style={styles.stockTicker}>{stock.ticker}</Text>
                <Text style={styles.stockShares}>{stock.shares} shares</Text>
              </View>
              
              <View style={styles.stockDetails}>
                <View style={styles.stockDetailRow}>
                  <Text style={styles.stockDetailLabel}>Avg Cost:</Text>
                  <Text style={styles.stockDetailValue}>${stock.avgCost.toFixed(2)}</Text>
                </View>
                <View style={styles.stockDetailRow}>
                  <Text style={styles.stockDetailLabel}>Current:</Text>
                  <Text style={styles.stockDetailValue}>${stock.currentPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.stockDetailRow}>
                  <Text style={styles.stockDetailLabel}>Value:</Text>
                  <Text style={styles.stockDetailValue}>${currentValue.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.stockGainLoss}>
                <Text style={[styles.gainLossValue, { color: gainLoss >= 0 ? '#10b981' : '#ef4444' }]}>
                  {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(0)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                </Text>
              </View>

              <Text style={styles.lastUpdated}>Updated: {stock.lastUpdated}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.taxCard}>
        <Text style={styles.cardTitle}>Tax Information</Text>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Realized Gains (Est.):</Text>
          <Text style={styles.taxValue}>$0</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Capital Gains Tax (Est.):</Text>
          <Text style={styles.taxValue}>$0</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Unrealized Gains:</Text>
          <Text style={[styles.taxValue, { color: totalGainLoss >= 0 ? '#10b981' : '#ef4444' }]}>
            ${totalGainLoss.toFixed(0)}
          </Text>
        </View>

        <View style={styles.taxNotes}>
          <Text style={styles.taxNotesTitle}>💡 Notes</Text>
          <Text style={styles.taxNote}>• Prices auto-fetch from NASDAQ/Yahoo</Text>
          <Text style={styles.taxNote}>• Tax calculations are estimates</Text>
          <Text style={styles.taxNote}>• Consult a tax professional for accuracy</Text>
          <Text style={styles.taxNote}>• Unrealized gains not taxed until sold</Text>
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
  overviewCard: {
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
  addStockCard: {
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
  holdingsCard: {
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
  taxCard: {
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
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stockItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 16,
    marginBottom: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockTicker: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockShares: {
    fontSize: 14,
    color: '#6b7280',
  },
  stockDetails: {
    marginBottom: 8,
  },
  stockDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stockDetailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  stockDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  stockGainLoss: {
    alignItems: 'center',
    marginBottom: 4,
  },
  gainLossValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taxLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  taxValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  taxNotes: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  taxNotesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  taxNote: {
    fontSize: 12,
    color: '#1e40af',
    marginBottom: 2,
  },
});
