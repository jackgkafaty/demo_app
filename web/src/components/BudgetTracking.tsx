import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BudgetTrackingProps {}

export default function BudgetTracking({}: BudgetTrackingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const budgetData = [
    { category: 'Food & Dining', budget: 1000, actual: 850, percentage: 85, icon: '🍽️', color: '#3b82f6' },
    { category: 'Transportation', budget: 400, actual: 320, percentage: 80, icon: '🚗', color: '#10b981' },
    { category: 'Entertainment', budget: 300, actual: 280, percentage: 93, icon: '🎬', color: '#f59e0b' },
    { category: 'Shopping', budget: 500, actual: 620, percentage: 124, icon: '🛍️', color: '#ef4444' },
    { category: 'Bills & Utilities', budget: 800, actual: 750, percentage: 94, icon: '⚡', color: '#8b5cf6' },
    { category: 'Healthcare', budget: 200, actual: 125, percentage: 63, icon: '🏥', color: '#06b6d4' },
  ];

  const monthlyComparison = [
    { month: 'Apr', budget: 3200, actual: 2890 },
    { month: 'May', budget: 3200, actual: 3150 },
    { month: 'Jun', budget: 3200, actual: 2945 },
  ];

  const suggestions = [
    { text: "Great job staying under budget on food!", type: 'success', icon: '✅' },
    { text: "Consider reducing shopping expenses by $120", type: 'warning', icon: '⚠️' },
    { text: "Transportation costs are well managed", type: 'success', icon: '✅' },
    { text: "Set up auto-save for unused budget amounts", type: 'info', icon: '💡' }
  ];

  const getColor = (percentage: number) => {
    if (percentage <= 80) return '#10b981'; // green
    if (percentage <= 100) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getStatusColor = (percentage: number) => {
    if (percentage <= 80) return 'text-green-600 dark:text-green-400';
    if (percentage <= 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Budget Status */}
        <div className="col-span-1 md:col-span-2">
          <div className={`bg-gradient-to-br ${overallPercentage > 100 ? 'from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700' : 'from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700'} rounded-3xl p-8 text-white shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">Budget Overview</h3>
                <p className="text-sm opacity-75">June 2025 tracking</p>
              </div>
              <div className="text-4xl">{overallPercentage > 100 ? '🚨' : '💚'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</div>
              <div className="text-lg opacity-90">{overallPercentage.toFixed(1)}% of total budget used</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-2 bg-white/20 rounded-full flex-1">
                <div className="h-2 bg-white/80 rounded-full" style={{width: `${Math.min(overallPercentage, 100)}%`}}></div>
              </div>
              <span className="text-sm font-medium">{overallPercentage > 100 ? 'Over Budget' : 'On Track'}</span>
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remaining</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${Math.abs(totalBudget - totalSpent).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {totalBudget - totalSpent >= 0 ? 'Available to spend' : 'Over budget'}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetData.map((item, index) => (
            <div key={index} className="group">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600/50">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.percentage <= 80 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : item.percentage <= 100
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {item.percentage}%
                  </div>
                </div>

                {/* Progress Circle */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={[item]}>
                      <RadialBar 
                        dataKey="percentage" 
                        cornerRadius={10} 
                        fill={getColor(item.percentage)}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                </div>

                {/* Category Details */}
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.category}</h4>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ${item.actual} / ${item.budget}
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(item.percentage)}`}>
                    {item.percentage > 100 ? '+' : '-'}${Math.abs(item.actual - item.budget)} 
                    {item.percentage > 100 ? ' over budget' : ' remaining'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">3-Month Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any, name: string) => [`$${Number(value).toLocaleString()}`, name === 'budget' ? 'Budget' : 'Actual']}
              />
              <Bar 
                dataKey="budget" 
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                name="budget"
              />
              <Bar 
                dataKey="actual" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="actual"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">💡 Smart Insights</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 rounded-2xl border-l-4 ${
                suggestion.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-400'
                  : suggestion.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
              }`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{suggestion.icon}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{suggestion.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Budget:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Total Spent:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Difference:</span>
                <span className={`font-semibold ${
                  totalSpent > totalBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {totalSpent > totalBudget ? '+' : '-'}${Math.abs(totalBudget - totalSpent).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-indigo-200 dark:border-indigo-800/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Budget Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Categories On Track</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {budgetData.filter(item => item.percentage <= 100).length}/{budgetData.length}
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Best Category</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">Healthcare (63%)</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Needs Attention</div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">Shopping (124%)</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Efficiency</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">89%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
