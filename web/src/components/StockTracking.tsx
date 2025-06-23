import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface StockTrackingProps {}

interface Stock {
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  lastUpdated: string;
  logo?: string;
  companyName?: string;
  marketCap?: string;
  sector?: string;
}

export default function StockTracking({}: StockTrackingProps) {
  const [stocks, setStocks] = useState<Stock[]>([
    { 
      ticker: 'AAPL', 
      shares: 10, 
      avgCost: 150.00, 
      currentPrice: 185.20, 
      lastUpdated: '2025-06-21',
      companyName: 'Apple Inc.',
      marketCap: '$2.8T',
      sector: 'Technology',
      logo: '🍎'
    },
    { 
      ticker: 'MSFT', 
      shares: 5, 
      avgCost: 300.00, 
      currentPrice: 420.15, 
      lastUpdated: '2025-06-21',
      companyName: 'Microsoft Corp.',
      marketCap: '$3.1T',
      sector: 'Technology',
      logo: '🖥️'
    },
    { 
      ticker: 'GOOGL', 
      shares: 3, 
      avgCost: 120.00, 
      currentPrice: 135.80, 
      lastUpdated: '2025-06-21',
      companyName: 'Alphabet Inc.',
      marketCap: '$1.7T',
      sector: 'Technology',
      logo: '🔍'
    },
    { 
      ticker: 'TSLA', 
      shares: 8, 
      avgCost: 200.00, 
      currentPrice: 248.50, 
      lastUpdated: '2025-06-21',
      companyName: 'Tesla Inc.',
      marketCap: '$790B',
      sector: 'Automotive',
      logo: '⚡'
    },
  ]);

  const [newStock, setNewStock] = useState({ ticker: '', shares: '', avgCost: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  // Mock API call - in real app would use NASDAQ/Yahoo Finance API
  const fetchStockPrice = async (ticker: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockPrice = Math.random() * 400 + 100;
    setIsLoading(false);
    return mockPrice;
  };

  const addStock = async () => {
    if (!newStock.ticker || !newStock.shares || !newStock.avgCost) return;

    try {
      const currentPrice = await fetchStockPrice(newStock.ticker);
      const stock: Stock = {
        ticker: newStock.ticker.toUpperCase(),
        shares: parseFloat(newStock.shares),
        avgCost: parseFloat(newStock.avgCost),
        currentPrice: currentPrice,
        lastUpdated: new Date().toISOString().split('T')[0],
        companyName: `${newStock.ticker.toUpperCase()} Company`,
        marketCap: 'N/A',
        sector: 'Unknown',
        logo: '📊'
      };

      setStocks(prev => [...prev, stock]);
      setNewStock({ ticker: '', shares: '', avgCost: '' });
    } catch (error) {
      const stock: Stock = {
        ticker: newStock.ticker.toUpperCase(),
        shares: parseFloat(newStock.shares),
        avgCost: parseFloat(newStock.avgCost),
        currentPrice: parseFloat(newStock.avgCost),
        lastUpdated: new Date().toISOString().split('T')[0],
        companyName: `${newStock.ticker.toUpperCase()} Company`,
        marketCap: 'N/A',
        sector: 'Unknown',
        logo: '📊'
      };
      setStocks(prev => [...prev, stock]);
      setNewStock({ ticker: '', shares: '', avgCost: '' });
    }
  };

  const refreshPrices = async () => {
    setIsLoading(true);
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const currentPrice = await fetchStockPrice(stock.ticker);
          return { ...stock, currentPrice, lastUpdated: new Date().toISOString().split('T')[0] };
        } catch {
          return { ...stock, lastUpdated: new Date().toISOString().split('T')[0] };
        }
      })
    );
    setStocks(updatedStocks);
    setIsLoading(false);
  };

  const calculateGainLoss = (stock: Stock) => {
    const totalCost = stock.shares * stock.avgCost;
    const currentValue = stock.shares * stock.currentPrice;
    return currentValue - totalCost;
  };

  const calculateGainLossPercentage = (stock: Stock) => {
    const gainLoss = calculateGainLoss(stock);
    const totalCost = stock.shares * stock.avgCost;
    return (gainLoss / totalCost) * 100;
  };

  const totalPortfolioValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.currentPrice), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + (stock.shares * stock.avgCost), 0);
  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainLossPercentage = (totalGainLoss / totalCost) * 100;

  // Generate chart data for portfolio performance
  const generateChartData = () => {
    const data = [];
    const days = selectedTimeframe === '1D' ? 1 : selectedTimeframe === '1W' ? 7 : selectedTimeframe === '1M' ? 30 : 365;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% daily variation
      const value = totalPortfolioValue * (1 + variation * (i / days));
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Portfolio allocation data
  const allocationData = stocks.map(stock => ({
    name: stock.ticker,
    value: stock.shares * stock.currentPrice,
    percentage: ((stock.shares * stock.currentPrice) / totalPortfolioValue * 100).toFixed(1),
    color: stock.ticker === 'AAPL' ? '#3b82f6' : stock.ticker === 'MSFT' ? '#10b981' : stock.ticker === 'GOOGL' ? '#f59e0b' : '#ef4444'
  }));

  const bestPerformer = stocks.reduce((best, stock) => 
    calculateGainLossPercentage(stock) > calculateGainLossPercentage(best) ? stock : best
  );

  const worstPerformer = stocks.reduce((worst, stock) => 
    calculateGainLossPercentage(stock) < calculateGainLossPercentage(worst) ? stock : worst
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className="col-span-1 md:col-span-2">
          <div className={`bg-gradient-to-br ${totalGainLoss >= 0 ? 'from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700' : 'from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700'} rounded-3xl p-8 text-white shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">Portfolio Value</h3>
                <p className="text-sm opacity-75">Total investment worth</p>
              </div>
              <div className="text-4xl">{totalGainLoss >= 0 ? '📈' : '📉'}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
              <div className="text-lg opacity-90">
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()} ({totalGainLossPercentage >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%)
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm opacity-75">Initial Investment: ${totalCost.toLocaleString()}</span>
              <button
                onClick={refreshPrices}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? '⟳ Updating...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Day's Change */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Change</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market session</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">+$1,247</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">+2.31% today</div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio Performance</h3>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '1Y'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
              labelFormatter={(value) => `Date: ${value}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings and Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Holdings</h3>
          <div className="space-y-4">
            {stocks.map((stock, index) => {
              const gainLoss = calculateGainLoss(stock);
              const percentage = calculateGainLossPercentage(stock);
              const currentValue = stock.shares * stock.currentPrice;
              
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-all duration-200 border border-gray-200 dark:border-gray-600/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                        {stock.logo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900 dark:text-white">{stock.ticker}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{stock.shares} shares</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{stock.companyName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Avg: ${stock.avgCost.toFixed(2)} • Current: ${stock.currentPrice.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900 dark:text-white">${currentValue.toLocaleString()}</div>
                      <div className={`text-sm font-medium ${percentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {percentage >= 0 ? '+' : ''}${gainLoss.toFixed(0)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Allocation</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Stock */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Stock</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ticker (e.g., AAPL)"
              value={newStock.ticker}
              onChange={(e) => setNewStock({...newStock, ticker: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Number of shares"
              value={newStock.shares}
              onChange={(e) => setNewStock({...newStock, shares: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Average cost per share"
              value={newStock.avgCost}
              onChange={(e) => setNewStock({...newStock, avgCost: e.target.value})}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addStock}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg"
            >
              {isLoading ? '⟳ Adding...' : '+ Add Stock'}
            </button>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">💡 Performance Insights</h3>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border-l-4 border-green-400">
              <div className="flex items-start space-x-3">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Best Performer</div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {bestPerformer.ticker} (+{calculateGainLossPercentage(bestPerformer).toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border-l-4 border-red-400">
              <div className="flex items-start space-x-3">
                <span className="text-xl">📉</span>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Needs Attention</div>
                  <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {worstPerformer.ticker} ({calculateGainLossPercentage(worstPerformer).toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border-l-4 border-blue-400">
              <div className="flex items-start space-x-3">
                <span className="text-xl">💰</span>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Unrealized Gains</div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    ${totalGainLoss.toFixed(0)} (Tax-free until sold)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">� Quick Stats</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2">
                <div className="text-gray-600 dark:text-gray-300">Diversity Score</div>
                <div className="font-bold text-gray-900 dark:text-white">85/100</div>
              </div>
              <div className="text-center bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2">
                <div className="text-gray-600 dark:text-gray-300">Risk Level</div>
                <div className="font-bold text-yellow-600 dark:text-yellow-400">Moderate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
