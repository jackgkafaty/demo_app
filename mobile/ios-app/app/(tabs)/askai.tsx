import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AskAIScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your personal finance AI assistant. I can help you analyze your spending, track budgets, and provide financial insights. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "What did I spend the most on this month?",
    "How can I improve my budget?",
    "What's my savings rate?",
    "Should I invest more in retirement?",
  ];

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // For now, simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: `I understand you're asking about "${userMessage.content}". This is a demo response. In the full app, I would analyze your financial data and provide personalized insights based on your spending patterns, budget, and financial goals.`,
          timestamp: new Date(),
        };
        
        setChatHistory(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    }
  };

  const sendQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <Text style={styles.headerTitle}>🤖 Ask AI</Text>
        <Text style={styles.headerSubtitle}>Your Personal Finance Assistant</Text>
      </ThemedView>

      {/* Chat History */}
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {chatHistory.map((item) => (
          <View
            key={item.id}
            style={[
              styles.messageContainer,
              item.type === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              item.type === 'user' ? styles.userMessageText : styles.aiMessageText,
            ]}>
              {item.content}
            </Text>
            <Text style={[
              styles.timestamp,
              item.type === 'user' ? styles.userTimestamp : styles.aiTimestamp,
            ]}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Questions */}
      <ThemedView style={styles.quickQuestionsContainer}>
        <ThemedText style={styles.quickQuestionsTitle}>Quick Questions</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => sendQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Input Area */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me about your finances..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </ThemedView>
    </View>
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
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9ca3af',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  quickQuestionsScroll: {
    paddingHorizontal: 16,
  },
  quickQuestionButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    maxHeight: 120,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
