import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LiquidAssetsProps {
  accounts?: Array<{
    name: string;
    balance: number;
    currency: string;
    gainLoss: number;
    institution?: string;
    accountType?: string;
    interestRate?: number;
  }>;
}

export default function LiquidAssets({ accounts = [] }: LiquidAssetsProps) {
  // Use provided accounts or default data
  const defaultAccounts = [
    { name: 'RBC Chequing Account', balance: 5420.50, currency: 'CAD', gainLoss: 0.5, institution: 'RBC', accountType: 'Chequing', interestRate: 0.05 },
    { name: 'Tangerine High Interest Savings', balance: 25000.00, currency: 'CAD', gainLoss: 1.2, institution: 'Tangerine', accountType: 'Savings', interestRate: 2.75 },
    { name: 'Questrade Investment Account', balance: 15750.25, currency: 'USD', gainLoss: 7.8, institution: 'Questrade', accountType: 'Investment', interestRate: 0 },
  ];
  
  const accountData = accounts.length > 0 ? accounts : defaultAccounts;

  const totalUSD = accountData.reduce((sum, account) => {
    const rate = account.currency === 'CAD' ? 0.73 : 1; // Updated conversion rate
    return sum + (account.balance * rate);
  }, 0);

  const totalCAD = accountData.reduce((sum, account) => {
    const rate = account.currency === 'USD' ? 1.37 : 1;
    return sum + (account.balance * rate);
  }, 0);

  const chartData = accountData.map(account => ({
    name: account.name.split(' ').slice(0, 2).join(' '),
    balance: account.balance,
    gainLoss: account.gainLoss,
    currency: account.currency
  }));

  const currencyData = [
    { name: 'CAD', value: accountData.filter(a => a.currency === 'CAD').reduce((sum, a) => sum + a.balance, 0), color: '#3b82f6' },
    { name: 'USD', value: accountData.filter(a => a.currency === 'USD').reduce((sum, a) => sum + a.balance, 0), color: '#10b981' },
  ];

  const getAccountIcon = (type: string) => {
    switch(type) {
      case 'Chequing': return '💳';
      case 'Savings': return '🏦';
      case 'Investment': return '📈';
      default: return '💰';
    }
  };

  const getBankColor = (institution: string) => {
    switch(institution) {
      case 'RBC': return 'from-blue-500 to-blue-700';
      case 'Tangerine': return 'from-orange-500 to-red-600';
      case 'Questrade': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">Total Portfolio Value</h3>
                <p className="text-sm opacity-75">Combined liquid assets</p>
              </div>
              <div className="text-4xl">💎</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-lg opacity-90">≈ ${totalCAD.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-2 bg-white/20 rounded-full flex-1">
                <div className="h-2 bg-white/80 rounded-full" style={{width: '78%'}}></div>
              </div>
              <span className="text-sm font-medium">78% Growth Target</span>
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Growth</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">This month</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">+$2,194</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">+3.24% increase</div>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountData.map((account, index) => (
          <div key={index} className="group">
            <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Account Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getBankColor(account.institution || '')} flex items-center justify-center text-2xl shadow-lg`}>
                  {getAccountIcon(account.accountType || '')}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  account.gainLoss >= 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {account.gainLoss >= 0 ? '+' : ''}{account.gainLoss.toFixed(2)}%
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                    {account.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{account.institution}</p>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${account.balance.toLocaleString()} {account.currency}
                  </div>
                  {account.interestRate && account.interestRate > 0 && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {account.interestRate}% APY
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    Transfer
                  </button>
                  <button className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm font-medium text-white transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Balances</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Bar 
                dataKey="balance" 
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Currency Distribution */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Currency Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={currencyData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {currencyData.map((entry, index) => (
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
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Balance']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-800/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Financial Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Emergency Fund Status</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">✅ 6.2 months covered</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Best Performing Account</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">📈 Questrade (+7.8%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
