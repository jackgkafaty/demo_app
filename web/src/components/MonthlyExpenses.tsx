import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

interface MonthlyExpensesProps {}

export default function MonthlyExpenses({}: MonthlyExpensesProps) {
  const [expenses, setExpenses] = useState([
    { category: 'Food & Dining', amount: 850, date: '2025-06-15', icon: '🍽️' },
    { category: 'Transportation', amount: 320, date: '2025-06-10', icon: '🚗' },
    { category: 'Entertainment', amount: 180, date: '2025-06-05', icon: '🎬' },
    { category: 'Shopping', amount: 420, date: '2025-06-12', icon: '🛍️' },
    { category: 'Bills & Utilities', amount: 650, date: '2025-06-01', icon: '⚡' },
    { category: 'Healthcare', amount: 125, date: '2025-06-08', icon: '🏥' },
  ]);
  
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [showUndo, setShowUndo] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const newExpense = {
          category: 'Auto-detected',
          amount: Math.floor(Math.random() * 200) + 50,
          date: new Date().toISOString().split('T')[0],
          icon: '🤖'
        };
        setExpenses(prev => [...prev, newExpense]);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5000);
      }
    });
  };

  const undoLastExpense = () => {
    setExpenses(prev => prev.slice(0, -1));
    setShowUndo(false);
  };

  const categoryData = expenses.reduce((acc: any, expense) => {
    const existing = acc.find((item: any) => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount, icon: expense.icon });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgExpense = totalExpenses / expenses.length;

  const monthlyTrend = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 2100 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 2300 },
    { month: 'May', amount: 2600 },
    { month: 'Jun', amount: totalExpenses },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Monthly Expenses */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">Monthly Expenses</h3>
                <p className="text-sm opacity-75">June 2025 spending</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${totalExpenses.toLocaleString()}</div>
              <div className="text-lg opacity-90">Average: ${avgExpense.toFixed(0)} per transaction</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-2 bg-white/20 rounded-full flex-1">
                <div className="h-2 bg-white/80 rounded-full" style={{width: '65%'}}></div>
              </div>
              <span className="text-sm font-medium">65% of budget used</span>
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Status</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
            </div>
            <div className="text-3xl">�</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">$1,455</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">35% budget left</div>
          </div>
        </div>
      </div>

      {showUndo && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-6 py-4 rounded-2xl flex justify-between items-center shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl">✨</span>
            <span className="font-medium">New expense added automatically from receipt</span>
          </div>
          <button 
            onClick={undoLastExpense}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md"
          >
            Undo
          </button>
        </div>
      )}

      {/* Receipt Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Receipt Processing</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-1">Drag & drop receipts here for automatic analysis</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered category detection and amount extraction</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, value, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">6-Month Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
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
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Expenses']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Transactions</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {expenses.map((expense, index) => (
            <div key={index} className="group">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-all duration-200 border border-gray-200 dark:border-gray-600/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {expense.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{expense.category}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">${expense.amount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{((expense.amount / totalExpenses) * 100).toFixed(1)}% of total</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-800/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Spending Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Highest Category</div>
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">🍽️ Food & Dining ($850)</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">vs. Last Month</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">📉 -12% decrease</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Daily Spend</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">💰 $86.83</div>
          </div>
        </div>
      </div>
    </div>
  );
}
