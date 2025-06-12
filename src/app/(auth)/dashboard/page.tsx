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
  CalendarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Create fixed transactions for initial render to avoid hydration mismatch
const initialTransactions = [
  {
    id: 'trans-1',
    amount: 2500,
    type: 'income',
    date: '2023-05-15',
    categoryId: '1', // Salary
    accountId: '1',
    notes: 'Monthly salary'
  },
  {
    id: 'trans-2',
    amount: 1200,
    type: 'expense',
    date: '2023-05-16',
    categoryId: '5', // Rent
    accountId: '1',
    notes: 'Monthly rent'
  },
  {
    id: 'trans-3',
    amount: 85,
    type: 'expense',
    date: '2023-05-18',
    categoryId: '3', // Food
    accountId: '1',
    notes: 'Grocery shopping'
  },
  {
    id: 'trans-4',
    amount: 45,
    type: 'expense',
    date: '2023-05-20',
    categoryId: '4', // Transport
    accountId: '1',
    notes: 'Gas'
  },
  {
    id: 'trans-5',
    amount: 120,
    type: 'expense',
    date: '2023-05-22',
    categoryId: '6', // Entertainment
    accountId: '1',
    notes: 'Concert tickets'
  }
];

// Fixed financial data for initial render
const initialFinancialData = {
  totalBalance: 17959.92, // Sum of all account balances
  monthlyIncome: 2500.00,
  monthlyExpense: 1450.00
};

// Fixed chart data for initial render
const initialBarChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Income',
      data: [2200, 2400, 2300, 2500, 2600, 2400, 2500, 2700, 2800, 2600, 2500, 2700],
      backgroundColor: 'rgba(52, 211, 153, 0.8)',
    },
    {
      label: 'Expenses',
      data: [1400, 1300, 1500, 1450, 1600, 1400, 1550, 1500, 1600, 1450, 1400, 1650],
      backgroundColor: 'rgba(248, 113, 113, 0.8)',
    },
  ],
};

// Fixed pie chart data for initial render
const initialPieChartData = {
  labels: ['Food', 'Transport', 'Rent', 'Entertainment', 'Shopping', 'Utilities'],
  datasets: [
    {
      data: [300, 150, 1200, 200, 250, 180],
      backgroundColor: [
        '#F87171', // Food
        '#FBBF24', // Transport
        '#A78BFA', // Rent
        '#EC4899', // Entertainment
        '#F97316', // Shopping
        '#8B5CF6', // Utilities
      ],
      borderWidth: 1,
    },
  ],
};

export default function Dashboard() {
  const [totalBalance, setTotalBalance] = useState(initialFinancialData.totalBalance);
  const [monthlyIncome, setMonthlyIncome] = useState(initialFinancialData.monthlyIncome);
  const [monthlyExpense, setMonthlyExpense] = useState(initialFinancialData.monthlyExpense);
  const [recentTransactions, setRecentTransactions] = useState(initialTransactions);
  const [dateRange, setDateRange] = useState('last30');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [barChartData, setBarChartData] = useState(initialBarChartData);
  const [pieChartData, setPieChartData] = useState(initialPieChartData);
  
  useEffect(() => {
    // Mark that we're on the client side
    setIsClientSide(true);
    
    // Only update with dynamic data on the client side after hydration
    if (typeof window !== 'undefined') {
      // Calculate total balance
      const balance = mockAccounts.reduce((total, account) => total + account.balance, 0);
      setTotalBalance(balance);
      
      // Generate dynamic chart data
      const monthlyData = generateMonthlyData();
      const expenseBreakdown = generateCategoryBreakdown('expense');
      
      // Update chart data
      setBarChartData({
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
      });
      
      setPieChartData({
        labels: expenseBreakdown.labels,
        datasets: [
          {
            data: expenseBreakdown.data,
            backgroundColor: expenseBreakdown.backgroundColor,
            borderWidth: 1,
          },
        ],
      });
      
      // Update transactions data
      updateTransactionData(dateRange);
    }
  }, [dateRange]);
  
  const updateTransactionData = (range: string) => {
    // Only update with dynamic data on the client side
    if (!isClientSide) return;
    
    const currentDate = new Date();
    let startDate = new Date();
    let filterLabel = 'Last 30 Days';
    
    // Set the start date based on the selected range
    switch(range) {
      case 'last7':
        startDate.setDate(currentDate.getDate() - 7);
        filterLabel = 'Last 7 Days';
        break;
      case 'last30':
        startDate.setDate(currentDate.getDate() - 30);
        filterLabel = 'Last 30 Days';
        break;
      case 'last90':
        startDate.setDate(currentDate.getDate() - 90);
        filterLabel = 'Last 90 Days';
        break;
      case 'thisMonth':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        filterLabel = 'This Month';
        break;
      case 'lastMonth':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        filterLabel = 'Last Month';
        break;
      case 'thisYear':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        filterLabel = 'This Year';
        break;
      default:
        startDate.setDate(currentDate.getDate() - 30);
    }
    
    // Filter transactions for selected date range
    const filteredTransactions = mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= currentDate;
    });

    // Ensure accountId is always a string (filter out or provide a fallback)
    const sanitizedTransactions = filteredTransactions
      .filter(t => typeof t.accountId === 'string')
      .map(t => ({
        ...t,
        accountId: t.accountId as string,
        notes: t.notes ?? '', // fallback for notes if needed
      }));

    // Update recent transactions
    setRecentTransactions(sanitizedTransactions.slice(0, 5));
    
    // Calculate income and expense totals for the period
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setMonthlyIncome(income);
    setMonthlyExpense(expense);
  };
  
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setIsDateDropdownOpen(false);
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  // Get date range label
  const getDateRangeLabel = () => {
    switch(dateRange) {
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      case 'last90': return 'Last 90 Days';
      case 'thisMonth': return 'This Month';
      case 'lastMonth': return 'Last Month';
      case 'thisYear': return 'This Year';
      default: return 'Last 30 Days';
    }
  };
  
  // Format date consistently for both server and client
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-2 relative">
          <button 
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {getDateRangeLabel()}
            <ChevronDownIcon className="h-4 w-4 ml-2" />
          </button>
          
          {isDateDropdownOpen && (
            <div className="absolute right-0 mt-2 top-full z-10 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('last7')}
                >
                  Last 7 Days
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('last30')}
                >
                  Last 30 Days
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('last90')}
                >
                  Last 90 Days
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('thisMonth')}
                >
                  This Month
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('lastMonth')}
                >
                  Last Month
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDateRangeChange('thisYear')}
                >
                  This Year
                </button>
              </div>
            </div>
          )}
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
              <h3 className="text-lg font-medium">{dateRange === 'thisMonth' || dateRange === 'lastMonth' ? 'Monthly' : 'Period'} Income</h3>
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
              <h3 className="text-lg font-medium">{dateRange === 'thisMonth' || dateRange === 'lastMonth' ? 'Monthly' : 'Period'} Expense</h3>
              <p className="text-2xl font-bold">{formatCurrency(monthlyExpense)}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview Chart */}
        <Card>
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
        <Card>
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
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {getCategoryName(transaction.categoryId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.notes || 'No description'}
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
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No transactions found for this period
                  </td>
                </tr>
              )}
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