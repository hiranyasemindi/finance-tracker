"use client";

import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import ChartComponent from '@/components/ChartComponent';
import { formatCurrency } from '@/types';
import { 
  mockTransactions, 
  mockAccounts, 
  mockCategories, 
  generateMonthlyData, 
  generateCategoryBreakdown 
} from '@/data/mockData';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState(mockTransactions.slice(0, 5));
  
  useEffect(() => {
    // Calculate total balance
    const balance = mockAccounts.reduce((total, account) => total + account.balance, 0);
    setTotalBalance(balance);
    
    // Calculate monthly income and expense
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for current month
    const thisMonthTransactions = mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate income and expense totals
    const income = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setMonthlyIncome(income);
    setMonthlyExpense(expense);
  }, []);
  
  // Generate chart data
  const monthlyData = generateMonthlyData();
  const expenseBreakdown = generateCategoryBreakdown('expense');
  
  // Monthly chart data
  const barChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.incomeData,
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
      },
      {
        label: 'Expenses',
        data: monthlyData.expenseData,
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
      },
    ],
  };
  
  // Expense breakdown pie chart
  const pieChartData = {
    labels: expenseBreakdown.labels,
    datasets: [
      {
        data: expenseBreakdown.data,
        backgroundColor: expenseBreakdown.backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Last 30 Days
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center">
            <BanknotesIcon className="h-10 w-10 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Total Balance</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </Card>
        
        {/* Monthly Income Card */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center">
            <div className="mr-3 rounded-full p-2 bg-white bg-opacity-20">
              <ArrowUpIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Monthly Income</h3>
              <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
        </Card>
        
        {/* Monthly Expense Card */}
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex items-center">
            <div className="mr-3 rounded-full p-2 bg-white bg-opacity-20">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Monthly Expense</h3>
              <p className="text-2xl font-bold">{formatCurrency(monthlyExpense)}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview Chart */}
        <Card title="Monthly Overview">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Overview</h3>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              View Details
            </button>
          </div>
          <ChartComponent 
            type="bar" 
            data={barChartData} 
            height={300} 
          />
        </Card>
        
        {/* Expense Breakdown Chart */}
        <Card title="Expense Breakdown">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Breakdown</h3>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
              <WalletIcon className="h-4 w-4 mr-1" />
              View Categories
            </button>
          </div>
          <ChartComponent 
            type="pie" 
            data={pieChartData} 
            height={300}
          />
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
            <CreditCardIcon className="h-4 w-4 mr-1" />
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {getCategoryName(transaction.categoryId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <ArrowUpIcon className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Add Income</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <ArrowDownIcon className="h-6 w-6 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Add Expense</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Add Account</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <WalletIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Add Budget</span>
            </button>
          </div>
        </Card>
        
        {/* Savings Goals */}
        <Card className="bg-white dark:bg-gray-800 md:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Savings Goals</h3>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Add Goal
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vacation</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">$2,500 / $5,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Car</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">$15,000 / $30,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Fund</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">$8,000 / $10,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 