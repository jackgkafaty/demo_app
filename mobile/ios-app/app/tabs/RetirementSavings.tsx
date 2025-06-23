import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function RetirementSavingsScreen() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('25000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');

  const calculateCompoundGrowth = () => {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthly = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn) / 100;

    const years = retAge - age;
    const monthlyRate = returnRate / 12;
    const months = years * 12;
    
    const currentValue = savings * Math.pow(1 + returnRate, years);
    const contributionValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return currentValue + contributionValue;
  };

  const projectedValue = calculateCompoundGrowth();

  const goals = [
    { name: 'Emergency Fund', target: 50000, current: 25000 },
    { name: 'House Down Payment', target: 100000, current: 45000 },
    { name: 'Retirement', target: 1000000, current: parseFloat(currentSavings) },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calculatorCard}>
        <Text style={styles.cardTitle}>Retirement Calculator</Text>
        
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Age</Text>
            <TextInput
              style={styles.input}
              value={currentAge}
              onChangeText={setCurrentAge}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Retirement Age</Text>
            <TextInput
              style={styles.input}
              value={retirementAge}
              onChangeText={setRetirementAge}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Savings ($)</Text>
          <TextInput
            style={styles.input}
            value={currentSavings}
            onChangeText={setCurrentSavings}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Monthly Contribution ($)</Text>
          <TextInput
            style={styles.input}
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Expected Annual Return (%)</Text>
          <TextInput
            style={styles.input}
            value={annualReturn}
            onChangeText={setAnnualReturn}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Projected Value at Retirement</Text>
          <Text style={styles.resultValue}>
            ${projectedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </Text>
          <Text style={styles.resultSubtext}>
            In {parseInt(retirementAge) - parseInt(currentAge)} years
          </Text>
        </View>
      </View>

      <View style={styles.goalsCard}>
        <Text style={styles.cardTitle}>Goal Tracking</Text>
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalPercentage}>{progress.toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} 
                />
              </View>
              <View style={styles.goalDetails}>
                <Text style={styles.goalCurrent}>${goal.current.toLocaleString()}</Text>
                <Text style={styles.goalTarget}>${goal.target.toLocaleString()}</Text>
              </View>
              <Text style={styles.goalRemaining}>
                ${(goal.target - goal.current).toLocaleString()} remaining
              </Text>
            </View>
          );
        })}
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
  calculatorCard: {
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
  goalsCard: {
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#15803d',
  },
  resultSubtext: {
    fontSize: 12,
    color: '#166534',
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalPercentage: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalCurrent: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalTarget: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalRemaining: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
