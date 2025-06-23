import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface TFSATrackerProps {}

export default function TFSATracker({}: TFSATrackerProps) {
  const [currentYear] = useState(2025);
  const [contributions, setContributions] = useState([
    { year: 2021, amount: 6000, limit: 6000 },
    { year: 2022, amount: 6000, limit: 6000 },
    { year: 2023, amount: 6500, limit: 6500 },
    { year: 2024, amount: 7000, limit: 7000 },
    { year: 2025, amount: 4500, limit: 7000 },
  ]);

  const [accountGrowth] = useState([
    { year: '2021', balance: 6000, growth: 0 },
    { year: '2022', balance: 12850, growth: 850 },
    { year: '2023', balance: 20580, growth: 1230 },
    { year: '2024', balance: 29450, growth: 1870 },
    { year: '2025', balance: 35280, growth: 1330 },
  ]);

  const [newContribution, setNewContribution] = useState('');
  
  const currentLimit = 7000; // 2025 TFSA limit
  const currentContribution = contributions.find(c => c.year === currentYear)?.amount || 0;
  const remainingRoom = currentLimit - currentContribution;
  const isOverContributed = currentContribution > currentLimit;
  const currentBalance = accountGrowth[accountGrowth.length - 1]?.balance || 0;
  const totalGrowth = accountGrowth.reduce((sum, item) => sum + item.growth, 0);

  const addContribution = () => {
    const amount = parseFloat(newContribution);
    if (!amount || amount <= 0) return;

    setContributions(prev => 
      prev.map(c => 
        c.year === currentYear 
          ? { ...c, amount: c.amount + amount }
          : c
      )
    );
    setNewContribution('');
  };

  const lifetimeContributionRoom = () => {
    return contributions.reduce((sum, c) => sum + c.limit, 0);
  };

  const lifetimeContributions = () => {
    return contributions.reduce((sum, c) => sum + c.amount, 0);
  };

  const chartData = contributions.map(c => ({
    year: c.year.toString(),
    contributed: c.amount,
    limit: c.limit,
    remaining: Math.max(0, c.limit - c.amount)
  }));

  const utilizationData = [
    { name: 'Used Room', value: lifetimeContributions(), color: '#3b82f6' },
    { name: 'Available Room', value: lifetimeContributionRoom() - lifetimeContributions(), color: '#e5e7eb' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TFSA Balance */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">TFSA Balance</h3>
                <p className="text-sm opacity-75">Tax-Free Savings Account</p>
              </div>
              <div className="text-4xl">🇨🇦</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${currentBalance.toLocaleString()}</div>
              <div className="text-lg opacity-90">Tax-free growth: +${totalGrowth.toLocaleString()}</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-2 bg-white/20 rounded-full flex-1">
                <div className="h-2 bg-white/80 rounded-full" style={{width: `${(lifetimeContributions() / lifetimeContributionRoom()) * 100}%`}}></div>
              </div>
              <span className="text-sm font-medium">{((lifetimeContributions() / lifetimeContributionRoom()) * 100).toFixed(0)}% room used</span>
            </div>
          </div>
        </div>

        {/* Remaining Room */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remaining Room</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentYear}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${isOverContributed ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              ${Math.abs(remainingRoom).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {isOverContributed ? 'Over-contributed!' : 'Available to contribute'}
            </div>
          </div>
        </div>
      </div>

      {/* Over-contribution Warning */}
      {isOverContributed && (
        <div className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border border-red-300 dark:border-red-700 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-semibold text-red-800 dark:text-red-200">Over-contribution Alert</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                You have exceeded your TFSA contribution limit by ${Math.abs(remainingRoom).toLocaleString()}. 
                This may result in penalty taxes of 1% per month on the excess amount.
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Consider withdrawing the excess amount to avoid penalties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Contributions */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Yearly Contributions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
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
                formatter={(value: any, name: string) => [`$${Number(value).toLocaleString()}`, name === 'contributed' ? 'Contributed' : 'Remaining Room']}
              />
              <Bar dataKey="contributed" stackId="a" fill="#3b82f6" name="contributed" radius={[0, 0, 4, 4]} />
              <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="remaining" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Account Growth */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accountGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
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
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actions and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Contribution */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add Contribution ({currentYear})</h3>
          
          {/* Current Year Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Current Year Progress</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ${currentContribution.toLocaleString()} / ${currentLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isOverContributed ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((currentContribution / currentLimit) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isOverContributed ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                {isOverContributed ? 'Over limit' : 'Available'}
              </span>
              <span className={`font-semibold ${isOverContributed ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                ${Math.abs(remainingRoom).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Add Contribution Form */}
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Contribution amount"
              value={newContribution}
              onChange={(e) => setNewContribution(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addContribution}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium transition-all duration-200 shadow-lg"
            >
              Add Contribution
            </button>
          </div>
        </div>

        {/* Room Utilization */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Room Utilization</h3>
          
          <div className="flex justify-center mb-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {utilizationData.map((entry, index) => (
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
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Room']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Used Room:</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">${lifetimeContributions().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-600 dark:text-gray-300">Available Room:</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${(lifetimeContributionRoom() - lifetimeContributions()).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300">Total Room:</span>
              <span className="font-semibold text-gray-900 dark:text-white">${lifetimeContributionRoom().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TFSA Tips and Information */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl p-6 border border-indigo-200 dark:border-indigo-800/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          TFSA Knowledge Hub
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Annual Limit (2025)</div>
            <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">$7,000</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Penalty Rate</div>
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">1% / month</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Tax on Growth</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">0% (Tax-free)</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Room Restoration</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">Next calendar year</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">✅ Key Benefits</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Tax-free investment growth and withdrawals</li>
              <li>• Unused contribution room carries forward</li>
              <li>• Withdrawals restore room in following year</li>
              <li>• No age limit for contributions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">⚠️ Important Rules</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Over-contributions penalized at 1% per month</li>
              <li>• Cannot re-contribute withdrawn amounts same year</li>
              <li>• Must be 18+ and Canadian resident</li>
              <li>• No tax deduction for contributions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
