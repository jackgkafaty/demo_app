import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RetirementSavingsProps {}

export default function RetirementSavings({}: RetirementSavingsProps) {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);

  const calculateCompoundGrowth = () => {
    const years = retirementAge - currentAge;
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    
    // Future value of current savings
    const currentValue = currentSavings * Math.pow(1 + annualReturn / 100, years);
    
    // Future value of monthly contributions
    const contributionValue = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return currentValue + contributionValue;
  };

  const generateProjectionData = () => {
    const data = [];
    const years = retirementAge - currentAge;
    const monthlyRate = annualReturn / 100 / 12;
    
    for (let year = 0; year <= years; year += 2) {
      const months = year * 12;
      const currentValue = currentSavings * Math.pow(1 + annualReturn / 100, year);
      const contributionValue = months > 0 
        ? monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : 0;
      
      const totalContributions = currentSavings + (monthlyContribution * months);
      const totalValue = currentValue + contributionValue;
      const growth = totalValue - totalContributions;
      
      data.push({
        age: currentAge + year,
        value: Math.round(totalValue),
        contributions: Math.round(totalContributions),
        growth: Math.round(growth)
      });
    }
    return data;
  };

  const projectedValue = calculateCompoundGrowth();
  const projectionData = generateProjectionData();
  const totalContributions = currentSavings + (monthlyContribution * 12 * (retirementAge - currentAge));
  const totalGrowth = projectedValue - totalContributions;

  const goals = [
    { name: 'Emergency Fund', target: 50000, current: 35000, icon: '🚨', color: '#ef4444' },
    { name: 'House Down Payment', target: 100000, current: 45000, icon: '🏠', color: '#3b82f6' },
    { name: 'Retirement Nest Egg', target: 1000000, current: currentSavings, icon: '🥚', color: '#10b981' },
    { name: 'Vacation Fund', target: 15000, current: 8500, icon: '✈️', color: '#f59e0b' },
  ];

  const wealthBreakdown = [
    { name: 'Current Savings', value: currentSavings, color: '#3b82f6' },
    { name: 'Future Contributions', value: totalContributions - currentSavings, color: '#10b981' },
    { name: 'Compound Growth', value: totalGrowth, color: '#f59e0b' }
  ];

  const monthlyIncomeNeed = Math.round(projectedValue * 0.04 / 12); // 4% rule
  const yearlyIncomeNeed = monthlyIncomeNeed * 12;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projected Retirement Value */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold opacity-90">Retirement Projection</h3>
                <p className="text-sm opacity-75">At age {retirementAge} ({retirementAge - currentAge} years)</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">${projectedValue.toLocaleString()}</div>
              <div className="text-lg opacity-90">Monthly income: ${monthlyIncomeNeed.toLocaleString()} (4% rule)</div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="h-2 bg-white/20 rounded-full flex-1">
                <div className="h-2 bg-white/80 rounded-full" style={{width: `${Math.min((currentSavings / 1000000) * 100, 100)}%`}}></div>
              </div>
              <span className="text-sm font-medium">{((currentSavings / 1000000) * 100).toFixed(1)}% to $1M goal</span>
            </div>
          </div>
        </div>

        {/* Compound Growth Power */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Power</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compound interest</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">${totalGrowth.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{((totalGrowth/totalContributions)*100).toFixed(0)}% growth on contributions</div>
          </div>
        </div>
      </div>

      {/* Wealth Projection Chart */}
      <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Wealth Accumulation Projection</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="age" 
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
              formatter={(value: any, name: string) => [
                `$${Number(value).toLocaleString()}`, 
                name === 'value' ? 'Total Value' : name === 'contributions' ? 'Contributions' : 'Growth'
              ]}
              labelFormatter={(age) => `Age: ${age}`}
            />
            <Area 
              type="monotone" 
              dataKey="contributions" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="growth" 
              stackId="1"
              stroke="#10b981" 
              fill="url(#wealthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Calculator and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retirement Calculator */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Retirement Calculator</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Savings</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Contribution</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Annual Return (%)</label>
            <input
              type="number"
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-32 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Wealth Breakdown Pie Chart */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Wealth Composition at Retirement</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={wealthBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${((value/projectedValue)*100).toFixed(0)}%`}
                >
                  {wealthBreakdown.map((entry, index) => (
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
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Goals</h3>
          
          <div className="space-y-6">
            {goals.map((goal, index) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div key={index} className="group">
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{backgroundColor: `${goal.color}20`}}>
                          {goal.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{progress.toFixed(1)}% complete</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">${goal.current.toLocaleString()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">of ${goal.target.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: goal.color
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        ${(goal.target - goal.current).toLocaleString()} remaining
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {progress >= 100 ? '✅ Goal achieved!' : `${Math.ceil((goal.target - goal.current) / monthlyContribution)} months at current rate`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Monthly Contribution:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${monthlyContribution.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Annual Total:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${(monthlyContribution * 12).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Time to $1M:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {Math.ceil((1000000 - currentSavings) / (monthlyContribution * 12))} years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retirement Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-800/50">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Retirement Planning Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Safe Withdrawal Rate</div>
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">4% Rule</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">${yearlyIncomeNeed.toLocaleString()}/year sustainable</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Time Advantage</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{retirementAge - currentAge} Years</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compound growth period</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-sm text-gray-600 dark:text-gray-300">Growth Multiple</div>
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{(projectedValue/totalContributions).toFixed(1)}x</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Value vs contributions</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">📈 Optimization Tips</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Start early to maximize compound growth</li>
              <li>• Increase contributions with salary raises</li>
              <li>• Consider tax-advantaged accounts (RRSP, TFSA)</li>
              <li>• Diversify investments to manage risk</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">🎯 Milestones</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Age 35: 2x annual salary saved</li>
              <li>• Age 45: 5x annual salary saved</li>
              <li>• Age 55: 8x annual salary saved</li>
              <li>• Age 65: 10x annual salary saved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
