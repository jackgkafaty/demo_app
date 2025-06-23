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
        
        if (data.error === 'AI service not configured' || data.details?.includes('OpenAI API key')) {
          errorMessage = `🔧 **AI Setup Required**

To enable AI features, an OpenAI API key is needed:

1. Get a key from: platform.openai.com/api-keys
2. Add it to backend/.env file
3. Restart the backend server

**Good news!** All other finance features work perfectly without AI:
• Track expenses & budgets
• Monitor stocks & investments  
• Manage TFSA contributions
• View financial summaries

The AI is just an extra helper for insights!`;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aiAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageWrapper: {
    marginVertical: 8,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 4,
  },
  aiIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8b5cf6',
    marginRight: 6,
  },
  messageTime: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 6,
    marginLeft: 40,
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 6,
    marginRight: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: '#374151',
  },
  boldText: {
    fontWeight: '600',
  },
  userMessageTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    textAlign: 'right',
  },
  typingBubble: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    marginRight: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 2,
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  privacyNotice: {
    marginTop: 12,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
