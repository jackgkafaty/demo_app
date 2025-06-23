import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';

export default function AskAIScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m your AI financial assistant. Ask me about budgets, spending patterns, investment advice, or any finance questions!', timestamp: Date.now() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // PII detection patterns
  const PII_PATTERNS = [
    /(\d{4}[-\s]?){3,4}/g,           // credit cards
    /\d{9,12}/g,                     // bank accounts
    /(?:[A-Z]{2,3}\d{6,10})/g,       // tax IDs
    /[A-Za-z0-9._%+-]+@/g,           // email addresses
  ];

  const containsPII = (text: string) => {
    return PII_PATTERNS.some(pattern => pattern.test(text));
  };

  useEffect(() => {
    // Animate entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for AI indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check for PII before sending
    if (containsPII(inputMessage)) {
      Alert.alert(
        '🛡️ Privacy Protection',
        'Your message contains sensitive information (like account numbers, emails, or card numbers). Please rephrase without personal details for your security!',
        [{ text: 'Got it!', style: 'default' }]
      );
      return;
    }

    if (!isOnline) {
      Alert.alert(
        '📱 Offline Mode',
        'You\'re currently offline. AI features require an internet connection. You can still view your financial data!',
        [{ text: 'OK' }]
      );
      return;
    }

    const userMessage = { role: 'user', content: inputMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call with proper error handling
      const response = await fetch('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          timestamp: Date.now()
        }]);
      } else {
        let errorMessage = '🤖 I encountered an issue.';
        
        if (data.details?.includes('OpenAI API key not set')) {
          errorMessage = '🔧 **AI Setup Required**: The AI features need to be configured by the administrator. All other finance features work perfectly!';
        } else if (data.details) {
          errorMessage = `💭 ${data.details}`;
        }

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: errorMessage,
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '🌐 **Connection Issue**: Can\'t reach the AI service right now. Please check your connection and try again!',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return (
          <Text key={index} style={styles.boldText}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Animated.View style={[styles.aiAvatar, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.aiAvatarText}>AI</Text>
          </Animated.View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Financial Assistant</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
              <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              }
            ]}
          >
            {message.role === 'assistant' && (
              <View style={styles.messageHeader}>
                <View style={styles.aiIndicator} />
                <Text style={styles.messageTime}>AI • {formatTime(message.timestamp)}</Text>
              </View>
            )}
            
            <View style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.assistantText
              ]}>
                {formatMessage(message.content)}
              </Text>
              
              {message.role === 'user' && (
                <Text style={styles.userMessageTime}>{formatTime(message.timestamp)}</Text>
              )}
            </View>
          </Animated.View>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <Animated.View style={[styles.messageWrapper, styles.assistantMessageWrapper]}>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <Animated.View style={[styles.typingDot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: pulseAnim }]} />
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask about your finances..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>🔒 Your privacy is protected - no personal info shared</Text>
        </View>
      </View>
    </Animated.View>
  );
}

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI responses
      const responses = [
        "Based on your recent expenses, you might want to consider reducing spending in the shopping category.",
        "Your TFSA contributions are on track. You have good room remaining for this year.",
        "Consider diversifying your stock portfolio with some index funds for better risk management.",
        "Your retirement savings compound growth looks healthy with current contributions.",
        "Budget tracking shows you're doing well in most categories. Keep it up!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    } catch (error) {
      // Fallback behavior as per instructions
      setMessages(prev => [...prev, {
        role: 'assistant', 
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or check cached summaries in your dashboard.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What category did I spend the most on this month?",
    "How is my budget tracking this month?",
    "Should I contribute more to my TFSA?",
    "How are my stocks performing?",
  ];

  const askQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
            ]}>
              {message.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickQuestionsContainer}>
        <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => askQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about your finances..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            numberOfLines={2}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, { opacity: isLoading || !inputMessage.trim() ? 0.5 : 1 }]}
            onPress={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          🔒 Your data is protected. No sensitive information is sent to AI.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderRadius: 18,
    padding: 12,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#374151',
  },
  loadingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    padding: 12,
    marginVertical: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  privacyText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
