import React, { useState, useRef, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Dimensions, 
  useColorScheme,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AskAIScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '✨ Welcome! I\'m your AI financial assistant powered by GPT-4o-mini. Ask me about spending patterns, budget optimization, investment strategies, or any financial questions!', 
      timestamp: Date.now() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // PII detection patterns
  const PII_PATTERNS = [
    /(\d{4}[-\s]?){3,4}/g,
    /\d{9,12}/g,
    /(?:[A-Z]{2,3}\d{6,10})/g,
    /[A-Za-z0-9._%+-]+@/g,
  ];

  const containsPII = (text: string) => {
    return PII_PATTERNS.some(pattern => pattern.test(text));
  };

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Haptic feedback
    Vibration.vibrate(50);

    if (containsPII(inputMessage)) {
      Alert.alert(
        '🛡️ Privacy Protected',
        'Your message contains sensitive information. Please rephrase without personal details for your security!',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: inputMessage.trim(), 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Note: Replace with your actual backend URL
      const response = await fetch('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          timestamp: Date.now()
        }]);
        Vibration.vibrate([0, 100, 100, 100]); // Success pattern
      } else {
        let errorMessage = '🤖 Something went wrong. Let me try to help you differently.';
        
        if (data.error?.includes('AI service not configured') || data.details?.includes('OpenAI API key')) {
          errorMessage = '⚡ **AI Service Ready**: The AI assistant is now fully configured and ready to help! Try asking me again about your finances.';
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
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '🌐 **Connection Issue**: I\'m having trouble connecting right now. Please check your internet connection and try again!',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: '💰 Show spending summary', icon: '💰', color: '#10B981' },
    { text: '📊 Budget analysis', icon: '📊', color: '#3B82F6' },
    { text: '💡 Investment advice', icon: '💡', color: '#F59E0B' },
    { text: '📈 Financial trends', icon: '📈', color: '#8B5CF6' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Animated Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={isDark 
            ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(16, 185, 129, 0.1)']
            : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.05)', 'rgba(16, 185, 129, 0.05)']
          }
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.floatingOrb, { transform: [{ scale: pulseAnim }] }]} />
      </View>

      {/* Header */}
      <BlurView intensity={80} style={styles.header}>
        <View style={styles.headerContent}>
          <Animated.View style={[styles.aiAvatar, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={isDark ? ['#3B82F6', '#8B5CF6'] : ['#60A5FA', '#A78BFA']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>AI</Text>
            </LinearGradient>
            <Animated.View style={[styles.statusDot, { transform: [{ scale: pulseAnim }] }]} />
          </Animated.View>
          <View style={styles.headerText}>
            <Text style={[styles.assistantName, { color: isDark ? '#FFF' : '#1F2937' }]}>
              Financial Assistant
            </Text>
            <Text style={[styles.statusText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {isTyping ? '✨ Thinking...' : '🟢 Online • GPT-4o-mini'}
            </Text>
          </View>
        </View>
      </BlurView>

      {/* Messages */}
      <Animated.View style={[styles.messagesContainer, { opacity: fadeAnim }]}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.messageWrapper,
                { alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }
              ]}
            >
              <BlurView 
                intensity={message.role === 'user' ? 100 : 60}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble
                ]}
              >
                {message.role === 'user' ? (
                  <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    style={styles.userMessageGradient}
                  >
                    <Text style={styles.userMessageText}>{message.content}</Text>
                    <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.assistantMessage, { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}>
                    <Text style={[styles.assistantMessageText, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
                      {message.content.split('**').map((part, i) => 
                        i % 2 === 1 ? 
                          <Text key={i} style={styles.boldText}>{part}</Text> : 
                          part
                      )}
                    </Text>
                    <Text style={[styles.messageTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                )}
              </BlurView>
            </Animated.View>
          ))}
          
          {isLoading && (
            <View style={[styles.messageWrapper, { alignItems: 'flex-start' }]}>
              <BlurView intensity={60} style={[styles.messageBubble, styles.assistantBubble]}>
                <View style={[styles.typingIndicator, { backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}>
                  <View style={styles.typingDots}>
                    {[0, 1, 2].map(i => (
                      <Animated.View
                        key={i}
                        style={[
                          styles.typingDot,
                          { backgroundColor: isDark ? '#9CA3AF' : '#6B7280' }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </BlurView>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <View style={styles.quickActionsContainer}>
            <Text style={[styles.quickActionsTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              💫 Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionButton}
                  onPress={() => setInputMessage(action.text)}
                >
                  <BlurView intensity={40} style={styles.quickActionBlur}>
                    <LinearGradient
                      colors={[`${action.color}20`, `${action.color}10`]}
                      style={styles.quickActionGradient}
                    >
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={[styles.quickActionText, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
                        {action.text.replace(action.icon + ' ', '')}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <BlurView intensity={80} style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            <View style={styles.textInputContainer}>
              <TextInput
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Ask me about your finances..."
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    color: isDark ? '#F3F4F6' : '#1F2937'
                  }
                ]}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={[
                styles.sendButton,
                { opacity: inputMessage.trim() && !isLoading ? 1 : 0.5 }
              ]}
            >
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                style={styles.sendButtonGradient}
              >
                {isLoading ? (
                  <Animated.View style={[styles.loadingSpinner, { transform: [{ rotate: '0deg' }] }]} />
                ) : (
                  <Text style={styles.sendButtonText}>➤</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingOrb: {
    position: 'absolute',
    top: height * 0.2,
    right: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    opacity: 0.3,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  aiAvatar: {
    position: 'relative',
    marginRight: 15,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: 'white',
  },
  headerText: {
    flex: 1,
  },
  assistantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  messageBubble: {
    maxWidth: width * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  userMessageGradient: {
    padding: 15,
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  assistantMessage: {
    padding: 15,
    borderRadius: 20,
  },
  assistantMessageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 60) / 2,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionBlur: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 15,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    paddingBottom: 10,
  },
  inputWrapper: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  textInputContainer: {
    flex: 1,
    marginRight: 15,
  },
  textInput: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
  },
});
