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
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(), 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          timestamp: Date.now()
        }]);
      } else {
        let errorMessage = '🤖 Oops! Something went wrong.';
        
        if (data.error === 'PII detected in message. Submission blocked.') {
          errorMessage = '🛡️ **Security Alert**: Your message contains sensitive information (like account numbers, emails, or card numbers). Please rephrase without personal details for your privacy!';
        } else if (data.error === 'AI service not configured' || data.details?.includes('OpenAI API key not set')) {
          errorMessage = `🔧 **AI Setup Required**

To enable AI features, you need an OpenAI API key:

1. Get a key from: https://platform.openai.com/api-keys
2. Add it to your backend/.env file:
   \`OPENAI_KEY=sk-proj-your-key-here\`
3. Restart the backend server

**Don't worry!** All other finance tracking features work perfectly without AI. The AI is just an extra helper for insights and suggestions.

💡 You can still track expenses, budgets, stocks, and manage all your financial data!`;
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
        content: '🌐 **Connection Error**: Couldn\'t reach the AI service. Please check your connection and try again!',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
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

  // Floating Action Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative overflow-hidden rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-md' 
              : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-md'
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.3)'
          }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Icon with animation */}
          <div className="relative z-10 flex items-center justify-center">
            <svg 
              className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/30" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 rounded-full animate-ping bg-purple-400/20" style={{ animationDuration: '3s', animationDelay: '1s' }} />
        </button>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] transition-all duration-500 ease-out">
      <div 
        className={`relative h-full rounded-2xl shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border border-gray-700/50' 
            : 'bg-white/80 border border-white/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          boxShadow: isDarkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Header with glass effect */}
        <div 
          className={`relative overflow-hidden rounded-t-2xl p-4 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50' 
              : 'bg-gradient-to-r from-blue-500/80 to-purple-600/80'
          }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }} />
            <div className="absolute top-2 right-8 h-4 w-4 rounded-full bg-white/30 animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }} />
            <div className="absolute bottom-2 left-8 h-6 w-6 rounded-full bg-white/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }} />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Financial Assistant</h3>
                <p className="text-xs text-white/80">Powered by AI • Online</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white hover:rotate-90"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ 
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className={`max-w-[85%] group ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-500" />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      AI • {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div 
                  className={`relative rounded-2xl p-3 transition-all duration-200 group-hover:scale-[1.02] ${
                    message.role === 'user'
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white ml-4'
                        : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white ml-4'
                      : isDarkMode
                        ? 'bg-gray-800/60 text-gray-100 mr-4 border border-gray-700/50'
                        : 'bg-gray-50/80 text-gray-800 mr-4 border border-gray-200/50'
                  }`}
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  {/* Message content with markdown-like formatting */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-100'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  )}

                  {/* Message tail */}
                  <div 
                    className={`absolute top-3 w-3 h-3 transform rotate-45 ${
                      message.role === 'user'
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 -right-1'
                          : 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 -right-1'
                        : isDarkMode
                          ? 'bg-gray-800/60 -left-1 border-l border-b border-gray-700/50'
                          : 'bg-gray-50/80 -left-1 border-l border-b border-gray-200/50'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className={`rounded-2xl p-3 mr-4 ${
                isDarkMode ? 'bg-gray-800/60' : 'bg-gray-50/80'
              }`} style={{ backdropFilter: 'blur(8px)' }}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-gray-400' : 'bg-gray-600'}`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your finances..."
                rows={1}
                className={`w-full resize-none rounded-xl px-4 py-3 pr-12 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 focus:ring-purple-500/50' 
                    : 'bg-white/80 text-gray-900 placeholder-gray-500 border border-gray-300/50 focus:ring-blue-500/50'
                }`}
                style={{ backdropFilter: 'blur(8px)', maxHeight: '100px' }}
                disabled={isLoading}
              />
              
              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500'
                } hover:scale-105 active:scale-95`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Privacy notice */}
          <p className={`text-xs mt-2 flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your privacy is protected - no personal info shared
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
