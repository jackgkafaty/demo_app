'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '✨ Welcome! I\'m your AI financial assistant powered by GPT-4o-mini. Ask me about your spending patterns, budget optimization, investment strategies, or any financial questions!', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Detect system dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(), 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai', {
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
      
      if (response.ok) {
        // Simulate typing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          timestamp: Date.now()
        }]);
      } else {
        let errorMessage = '🤖 Something went wrong. Let me try to help you differently.';
        
        if (data.error?.includes('PII detected')) {
          errorMessage = '🛡️ **Privacy Protected**: I noticed your message contains sensitive information (like account numbers, emails, or card numbers). Please rephrase without personal details for your security!';
        } else if (data.error?.includes('AI service not configured') || data.details?.includes('OpenAI API key')) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: "💰 Show my spending summary", icon: "💰" },
    { text: "📊 Budget analysis", icon: "📊" },
    { text: "💡 Investment advice", icon: "💡" },
    { text: "📈 Financial trends", icon: "📈" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform
          ${isDarkMode 
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'
          }
          ${isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'}
          backdrop-blur-xl bg-opacity-90 border border-white/20
          flex items-center justify-center group
        `}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {isLoading && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div className={`
        absolute bottom-20 right-0 w-96 h-[500px] 
        transition-all duration-300 transform origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        <div className={`
          h-full rounded-2xl shadow-2xl overflow-hidden
          ${isDarkMode 
            ? 'bg-gray-900/95 border border-gray-700/50' 
            : 'bg-white/95 border border-gray-200/50'
          }
          backdrop-blur-xl
        `}>
          {/* Header */}
          <div className={`
            p-4 border-b
            ${isDarkMode ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/50 bg-gray-50/50'}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }
                  `}>
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Financial Assistant
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isTyping ? 'Typing...' : 'Online • GPT-4o-mini'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] rounded-2xl px-4 py-3 relative
                  ${message.role === 'user'
                    ? isDarkMode
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                      : 'bg-gray-100/80 text-gray-800 border border-gray-200/50'
                  }
                  backdrop-blur-sm shadow-lg
                  animate-in slide-in-from-bottom-4 duration-300
                `}>
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0">
                        {line.includes('**') ? (
                          line.split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )
                        ) : line}
                      </p>
                    ))}
                  </div>
                  <div className={`
                    text-xs mt-2 opacity-70
                    ${message.role === 'user' ? 'text-white/80' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`
                  rounded-2xl px-4 py-3
                  ${isDarkMode 
                    ? 'bg-gray-800/80 border border-gray-700/50' 
                    : 'bg-gray-100/80 border border-gray-200/50'
                  }
                  backdrop-blur-sm
                `}>
                  <div className="flex space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{animationDelay: '0ms'}}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{animationDelay: '150ms'}}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(action.text)}
                    className={`
                      p-2 rounded-xl text-xs text-left transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50' 
                        : 'bg-gray-50/50 hover:bg-gray-100/50 text-gray-700 border border-gray-200/50'
                      }
                      backdrop-blur-sm hover:scale-105
                    `}
                  >
                    <span className="mr-1">{action.icon}</span>
                    {action.text.replace(action.icon + ' ', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`
            p-4 border-t
            ${isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/30'}
            backdrop-blur-sm
          `}>
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your finances..."
                  className={`
                    w-full max-h-20 min-h-[44px] px-4 py-3 rounded-xl resize-none
                    ${isDarkMode 
                      ? 'bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-400' 
                      : 'bg-white/50 border border-gray-300/50 text-gray-900 placeholder-gray-500'
                    }
                    backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    transition-all duration-200
                  `}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                  ${input.trim() && !isLoading
                    ? isDarkMode
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white'
                    : isDarkMode
                      ? 'bg-gray-700/50 text-gray-500'
                      : 'bg-gray-200/50 text-gray-400'
                  }
                  backdrop-blur-sm hover:scale-105 disabled:hover:scale-100
                `}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
