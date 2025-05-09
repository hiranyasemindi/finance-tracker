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
          <ChartComponent 
            type="bar" 
            data={barChartData} 
            height={300} 
          />
        </Card>
        
        {/* Expense Breakdown Chart */}
        <Card title="Expense Breakdown">
          <ChartComponent 
            type="pie" 
            data={pieChartData} 
            height={300}
          />
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card title="Recent Transactions">
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {getCategoryName(transaction.categoryId)}
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
    </div>
  );
} 