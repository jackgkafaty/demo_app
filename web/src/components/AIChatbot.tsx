'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIChatbotProps {
  currentPage?: string;
  pageData?: any;
  accounts?: any[];
}

export default function AIChatbot({ currentPage = 'Dashboard', pageData = null, accounts = [] }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `✨ Hi! I'm your AI assistant for the ${currentPage} section. Ask me about your specific data, and I'll help analyze what you see on this page!`, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom message renderer component
  const MessageRenderer = ({ content, isDark }: { content: string, isDark: boolean }) => {
    // Check if content contains chart data patterns
    const containsChartData = content.includes('gains and losses') || content.includes('portfolio') || content.includes('AAPL') || content.includes('Total Gains');
    
    // Extract chart data if present
    let chartData = null;
    if (containsChartData) {
      // Create sample chart data for gains/losses
      chartData = {
        gainsLosses: [
          { name: 'AAPL', value: 392.30, type: 'gain' },
          { name: 'MSFT', value: -173.50, type: 'loss' },
          { name: 'GOOGL', value: 239.50, type: 'gain' },
          { name: 'RBC Chequing', value: 27.10, type: 'gain' },
          { name: 'Tangerine Savings', value: 300.00, type: 'gain' },
          { name: 'Questrade Investment', value: 1234.80, type: 'gain' },
        ],
        summary: [
          { name: 'Total Gains', value: 2193.70, color: '#10b981' },
          { name: 'Total Losses', value: 173.50, color: '#ef4444' },
        ]
      };
    }

    const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

    return (
      <div className="space-y-4">
        {/* Render enhanced text content */}
        <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          {content.split('\n').map((line, i) => {
            // Enhanced formatting for different line types
            if (line.startsWith('###')) {
              return <h3 key={i} className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{line.replace('###', '').trim()}</h3>;
            } else if (line.startsWith('##')) {
              return <h2 key={i} className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{line.replace('##', '').trim()}</h2>;
            } else if (line.startsWith('- ')) {
              return <div key={i} className="flex items-start space-x-2 mb-1">
                <span className="text-blue-500 mt-1">•</span>
                <span>{line.replace('- ', '')}</span>
              </div>;
            } else if (line.includes('$') && (line.includes('Gain:') || line.includes('Loss:') || line.includes('Total'))) {
              // Highlight financial data
              const parts = line.split('$');
              return <p key={i} className="mb-2 font-medium">
                {parts[0]}
                {parts.length > 1 && <span className="text-green-500 font-bold">${parts[1]}</span>}
              </p>;
            } else if (line.includes('\\(') && line.includes('\\)')) {
              // Render math expressions with better formatting
              const mathContent = line.replace(/\\?\(/g, '').replace(/\\?\)/g, '');
              return <div key={i} className={`bg-blue-50 dark:bg-blue-900/20 p-2 rounded font-mono text-sm mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {mathContent}
              </div>;
            } else if (line.trim()) {
              return <p key={i} className="mb-2 leading-relaxed">{line}</p>;
            }
            return null;
          })}
        </div>
        
        {/* Render charts if data is available */}
        {chartData && (
          <div className="space-y-6 mt-6">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 Gains & Losses Breakdown
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.gainsLosses}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#9ca3af' : '#6b7280'}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.gainsLosses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'gain' ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50/50'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🥧 Overall Summary
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.summary}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${Number(value).toFixed(2)}`}
                  >
                    {chartData.summary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#ffffff' : '#000000'
                    }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  };

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

  // Get current USD/CAD exchange rate (mock for now, in production you'd use a real API)
  const getExchangeRateContext = () => {
    return {
      usdToCad: 1.37, // Current approximate rate
      cadToUsd: 0.73,
      lastUpdated: new Date().toISOString(),
      marketTrend: "CAD strengthening slightly against USD"
    };
  };

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
      // Create context-aware messages with page data
      const exchangeRates = getExchangeRateContext();
      const contextMessage = {
        role: 'system' as const,
        content: `You are an advanced AI financial advisor analyzing the ${currentPage} page. Here's the user's actual financial data:
        
Page: ${currentPage}
${pageData ? `Current Page Data: ${JSON.stringify(pageData, null, 2)}` : ''}
${accounts && accounts.length > 0 ? `User's Financial Accounts: ${JSON.stringify(accounts, null, 2)}` : ''}

Current Exchange Rates: ${JSON.stringify(exchangeRates, null, 2)}

Instructions:
1. Analyze the ACTUAL data provided above - use specific numbers and account balances
2. For currency questions (USD vs CAD), use the current exchange rates and provide strategic insights
3. For asset allocation questions, analyze their current distribution and suggest optimizations
4. For "smart moves" questions, provide actionable analysis based on their real numbers
5. Always reference their specific balances, amounts, and allocations in your responses
6. Be analytical and strategic while being responsible about risk disclaimers
7. If they ask theoretical scenarios, use their actual data as the baseline for projections
8. For currency analysis, convert amounts and show potential gains/losses from currency movements
9. Keep responses focused, analytical, and data-driven using their real financial information

Remember: The user wants intelligent analysis of their specific financial situation, not generic advice.`
      };

      console.log('Sending request to AI with context:', { currentPage, pageData, accounts });

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [contextMessage, ...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      console.log('AI API Response status:', response.status);
      const data = await response.json();
      console.log('AI API Response data:', data);
      
      if (response.ok) {
        // Simulate typing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message.content,
          timestamp: Date.now()
        }]);
      } else {
        let errorMessage = '🤖 I encountered an issue. Let me try a different approach.';
        
        if (data.error?.includes('PII detected')) {
          errorMessage = '🛡️ **Privacy Protected**: I noticed your message contains sensitive information (like account numbers, emails, or card numbers). Please rephrase without personal details for your security!';
        } else if (data.error?.includes('AI service not configured') || data.details?.includes('OpenAI API key')) {
          errorMessage = '⚡ **AI Service Configuration**: There might be an issue with the AI service setup. The API key should be configured now, but there may be a connection issue.';
        } else if (data.details) {
          errorMessage = `💭 ${data.details}`;
        } else if (data.error) {
          errorMessage = `🔧 Technical Issue: ${data.error}`;
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
    <div className="fixed bottom-6 right-6 z-[100]">
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
      {isExpanded && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-4 pb-4 px-[5%] bg-black/60 backdrop-blur-sm overflow-hidden">
          <div className={`
            w-full h-full min-w-[900px] min-h-[700px] max-w-[1400px] max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden
            ${isDarkMode 
              ? 'bg-gray-900/98 border border-gray-700/50' 
              : 'bg-white/98 border border-gray-200/50'
            }
            backdrop-blur-xl animate-in zoom-in-95 duration-300 flex flex-col
          `}>
            {/* Expanded Header */}
            <div className={`
              flex-shrink-0 p-6 border-b flex items-center justify-between min-h-[80px]
              ${isDarkMode ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/50 bg-gray-50/50'}
            `}>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }
                  `}>
                    <span className="text-white font-bold text-xl">AI</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Financial Assistant
                  </h3>
                  <p className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                    {currentPage} Analysis
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isTyping ? '🤖 Analyzing your data...' : '✅ Online • GPT-4o-mini • Full Screen Mode'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`
                    p-3 rounded-xl transition-all duration-200 text-lg
                    ${isDarkMode ? 'hover:bg-gray-700 bg-gray-800' : 'hover:bg-gray-100 bg-gray-100'}
                    shadow-md hover:shadow-lg transform hover:scale-105
                  `}
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`
                    p-3 rounded-xl transition-all duration-200
                    ${isDarkMode ? 'hover:bg-gray-700 bg-gray-800' : 'hover:bg-gray-100 bg-gray-100'}
                    shadow-md hover:shadow-lg transform hover:scale-105
                  `}
                  title="Minimize Chat"
                >
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {setIsExpanded(false); setIsOpen(false);}}
                  className={`
                    p-3 rounded-xl transition-all duration-200 text-red-400 
                    ${isDarkMode ? 'hover:bg-red-900/20 bg-red-900/10' : 'hover:bg-red-50 bg-red-50'}
                    shadow-md hover:shadow-lg transform hover:scale-105
                  `}
                  title="Close Chat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0" style={{ height: 'calc(100vh - 280px)' }}>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[70%] rounded-2xl px-6 py-4 relative
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
                    {message.role === 'user' ? (
                      <div className="text-white">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                            {line.includes('**') ? (
                              line.split('**').map((part, j) => 
                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                              )
                            ) : line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <MessageRenderer content={message.content} isDark={isDarkMode} />
                    )}
                    <div className={`
                      text-sm mt-3 opacity-70
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
                    rounded-2xl px-6 py-4
                    ${isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-gray-100/80 border border-gray-200/50'}
                    backdrop-blur-sm shadow-lg
                  `}>
                    <div className="flex items-center space-x-3">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Expanded Input */}
            <div className={`
              flex-shrink-0 p-6 border-t min-h-[120px]
              ${isDarkMode ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/30'}
              backdrop-blur-sm
            `}>
              <div className="flex space-x-4 h-full items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask me about your ${currentPage.toLowerCase()} data...`}
                    className={`
                      w-full px-6 py-4 rounded-2xl border-2 resize-none min-h-[70px] max-h-32 text-lg
                      ${isDarkMode 
                        ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500' 
                        : 'bg-white/70 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      }
                      backdrop-blur-sm focus:outline-none transition-all duration-200
                      focus:ring-4 focus:ring-opacity-20 focus:shadow-lg
                      ${isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}
                    `}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`
                    px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-3 min-h-[70px] text-lg
                    ${!input.trim() || isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl'
                    }
                    transform hover:scale-105 active:scale-95
                  `}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Chat Window */}
      <div className={`
        absolute bottom-20 right-0 w-96 h-[500px] 
        transition-all duration-300 transform origin-bottom-right
        ${isOpen && !isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        <div className={`
          h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col
          ${isDarkMode 
            ? 'bg-gray-900/95 border border-gray-700/50' 
            : 'bg-white/95 border border-gray-200/50'
          }
          backdrop-blur-xl
        `}>
          {/* Compact Header */}
          <div className={`
            flex-shrink-0 p-4 border-b
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
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsExpanded(true)}
                  className={`
                    p-2.5 rounded-lg transition-all duration-200 
                    ${isDarkMode ? 'hover:bg-gray-700 bg-gray-800/50' : 'hover:bg-gray-100 bg-gray-100/50'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    shadow-sm hover:shadow-md transform hover:scale-105
                  `}
                  title="Expand to Full Screen"
                >
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
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
          </div>

          {/* Compact Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
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
                  {message.role === 'user' ? (
                    <div className="text-white">
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
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <MessageRenderer content={message.content} isDark={isDarkMode} />
                    </div>
                  )}
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
            <div className="flex-shrink-0 px-4 py-2">
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
            flex-shrink-0 p-4 border-t
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

      {/* Add this global CSS for animations */}
      <style jsx global>{`
        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.4;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.4; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        
        .animate-in {
          animation: slide-in-up 0.3s ease-out;
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .slide-in-from-bottom-4 {
          animation: slide-in-from-bottom-4 0.3s ease-out;
        }
        
        @keyframes slide-in-from-bottom-4 {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .zoom-in-95 {
          animation: zoom-in 0.3s ease-out;
        }
        
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
