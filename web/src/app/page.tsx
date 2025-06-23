'use client';

import React, { useState, useEffect } from 'react';
import LiquidAssets from '@/components/LiquidAssets';
import MonthlyExpenses from '@/components/MonthlyExpenses';
import BudgetTracking from '@/components/BudgetTracking';
import RetirementSavings from '@/components/RetirementSavings';
import TFSATracker from '@/components/TFSATracker';
import StockTracking from '@/components/StockTracking';
import AIChatbot from '@/components/AIChatbot';

export default function Home() {
  const [activeTab, setActiveTab] = useState('liquid-assets');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const tabs = [
    { 
      id: 'liquid-assets', 
      name: 'Liquid Assets', 
      icon: '💎',
      color: 'from-emerald-500 to-teal-600',
      component: LiquidAssets 
    },
    { 
      id: 'monthly-expenses', 
      name: 'Monthly Expenses', 
      icon: '💳',
      color: 'from-red-500 to-pink-600',
      component: MonthlyExpenses 
    },
    { 
      id: 'budget-tracking', 
      name: 'Budget Tracking', 
      icon: '📊',
      color: 'from-blue-500 to-indigo-600',
      component: BudgetTracking 
    },
    { 
      id: 'retirement-savings', 
      name: 'Retirement & Savings', 
      icon: '🏦',
      color: 'from-purple-500 to-violet-600',
      component: RetirementSavings 
    },
    { 
      id: 'tfsa-tracker', 
      name: 'TFSA Tracker', 
      icon: '🇨🇦',
      color: 'from-amber-500 to-orange-600',
      component: TFSATracker 
    },
    { 
      id: 'stock-tracking', 
      name: 'Stock Tracking', 
      icon: '📈',
      color: 'from-green-500 to-emerald-600',
      component: StockTracking 
    },
  ];

  const mockAccounts = [
    { 
      name: 'RBC Chequing Account', 
      balance: 5420.50, 
      currency: 'CAD', 
      gainLoss: 0.5,
      institution: 'RBC',
      accountType: 'Chequing',
      interestRate: 0.05
    },
    { 
      name: 'Tangerine High Interest Savings', 
      balance: 25000.00, 
      currency: 'CAD', 
      gainLoss: 1.2,
      institution: 'Tangerine',
      accountType: 'Savings',
      interestRate: 2.75
    },
    { 
      name: 'Questrade Investment Account', 
      balance: 15750.25, 
      currency: 'USD', 
      gainLoss: 7.8,
      institution: 'Questrade',
      accountType: 'Investment',
      interestRate: 0,
      holdings: [
        { symbol: 'VTI', shares: 25, value: 6500 },
        { symbol: 'VXUS', shares: 15, value: 4250 },
        { symbol: 'AAPL', shares: 10, value: 3000 },
        { symbol: 'Cash', shares: 1, value: 2000.25 }
      ]
    },
  ];

  // Mock data for different pages
  const mockPageData = {
    'liquid-assets': {
      accounts: mockAccounts,
      totalLiquidAssets: 46170.75,
      totalCAD: 30420.50,
      totalUSD: 15750.25,
      usdInCAD: 21577.84, // 15750.25 * 1.37
      breakdown: {
        cashCAD: 30420.50,
        investmentsUSD: 15750.25,
        percentageCash: 65.9,
        percentageInvestments: 34.1
      },
      currencyExposure: {
        CAD: 65.9,
        USD: 34.1
      },
      recommendations: [
        'Consider currency hedging if planning major CAD expenses',
        'USD investments provide good diversification',
        'High liquidity ratio - good for emergency fund'
      ]
    },
    'monthly-expenses': {
      totalExpenses: 3250.00,
      categories: [
        { name: 'Housing', amount: 1500, percentage: 46 },
        { name: 'Food', amount: 600, percentage: 18 },
        { name: 'Transportation', amount: 400, percentage: 12 },
        { name: 'Entertainment', amount: 300, percentage: 9 },
        { name: 'Utilities', amount: 250, percentage: 8 },
        { name: 'Other', amount: 200, percentage: 6 }
      ]
    },
    'budget-tracking': {
      totalBudget: 3500,
      totalSpent: 3250,
      categories: [
        { category: 'Housing', budget: 1500, actual: 1500, percentage: 100 },
        { category: 'Food', budget: 700, actual: 600, percentage: 86 },
        { category: 'Transportation', budget: 500, actual: 400, percentage: 80 },
        { category: 'Entertainment', budget: 300, actual: 300, percentage: 100 },
        { category: 'Utilities', budget: 300, actual: 250, percentage: 83 },
        { category: 'Other', budget: 200, actual: 200, percentage: 100 }
      ]
    },
    'retirement-savings': {
      rrspBalance: 85000,
      rrspContributions: 12000,
      pensionPlan: 45000,
      totalRetirement: 130000,
      targetRetirement: 1000000
    },
    'tfsa-tracker': {
      currentBalance: 42500,
      contributionRoom: 23500,
      totalContributed: 42500,
      growthThisYear: 3200
    },
    'stock-tracking': {
      totalPortfolioValue: 15750.25,
      positions: [
        { symbol: 'AAPL', shares: 50, currentPrice: 150.25, totalValue: 7512.50, gainLoss: 5.2 },
        { symbol: 'MSFT', shares: 25, currentPrice: 330.45, totalValue: 8261.25, gainLoss: -2.1 },
        { symbol: 'GOOGL', shares: 10, currentPrice: 275.30, totalValue: 2753.00, gainLoss: 8.7 }
      ]
    }
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LiquidAssets;
  const currentTabName = tabs.find(tab => tab.id === activeTab)?.name || 'Dashboard';
  const currentPageData = mockPageData[activeTab as keyof typeof mockPageData];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${isDarkMode ? 'bg-purple-500' : 'bg-blue-300'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${isDarkMode ? 'bg-blue-500' : 'bg-purple-300'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl ${isDarkMode ? 'bg-emerald-500' : 'bg-pink-300'}`}></div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-xl transition-all duration-200 lg:hidden ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">💎</span>
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Finance Dashboard
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Personal Wealth Management
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                } shadow-sm hover:shadow-md transform hover:scale-105`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* User Avatar */}
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform`}>
                <span className="text-white font-semibold text-sm">JK</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Modern Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:sticky top-16 left-0 z-30 w-80 h-[calc(100vh-4rem)] 
          ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl
          border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          transition-transform duration-300 ease-in-out overflow-y-auto
        `}>
          <div className="p-6">
            {/* Quick Stats */}
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Portfolio Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Assets</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>$67,998</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Growth</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+$2,194</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
                    }
                    group
                  `}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${activeTab === tab.id ? 'text-white' : ''}`}>
                      {tab.name}
                    </div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Content Header */}
          <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {tabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
                  </h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage and analyze your financial data
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} backdrop-blur-sm`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-in slide-in-from-right-4 duration-500">
              <ActiveComponent accounts={mockAccounts} />
            </div>
          </div>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        currentPage={currentTabName}
        pageData={currentPageData}
        accounts={mockAccounts}
      />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
