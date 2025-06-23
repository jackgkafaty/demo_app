import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function MonthlyExpensesScreen() {
  const [expenses, setExpenses] = useState([
    { category: 'Food', amount: 850, date: '2025-06-15' },
    { category: 'Transport', amount: 320, date: '2025-06-10' },
    { category: 'Entertainment', amount: 180, date: '2025-06-05' },
  ]);

  const categoryTotals = expenses.reduce((acc: any, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const addRandomExpense = () => {
    const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomAmount = Math.floor(Math.random() * 200) + 50;
    
    const newExpense = {
      category: randomCategory,
      amount: randomAmount,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [...prev, newExpense]);
    
    Alert.alert(
      'Expense Added',
      `Added $${randomAmount} for ${randomCategory}`,
      [
        { text: 'Undo', onPress: () => setExpenses(prev => prev.slice(0, -1)) },
        { text: 'OK' }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={addRandomExpense}>
        <Text style={styles.addButtonText}>📄 Add Receipt (Demo)</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryAmount}>${amount as number}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.map((expense, index) => (
          <View key={index} style={styles.expenseRow}>
            <View>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
              <Text style={styles.expenseDate}>{expense.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>${expense.amount}</Text>
          </View>
        ))}
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
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
