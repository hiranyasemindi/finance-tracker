"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Card from '@/components/Card';
import ChartComponent from '@/components/ChartComponent';
import { Account, Category, formatCurrency, Transaction } from '@/types';
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('last30');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);

  // Calculate derived values
  const totalBalance = useMemo(() => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  }, [accounts]);

  const { monthlyIncome, monthlyExpense, filteredTransactions } = useMemo(() => {
    const currentDate = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'last7': startDate.setDate(currentDate.getDate() - 7); break;
      case 'last30': startDate.setDate(currentDate.getDate() - 30); break;
      case 'last90': startDate.setDate(currentDate.getDate() - 90); break;
      case 'thisMonth': startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); break;
      case 'lastMonth': 
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        break;
      case 'thisYear': startDate = new Date(currentDate.getFullYear(), 0, 1); break;
      default: startDate.setDate(currentDate.getDate() - 30);
    }

    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= currentDate;
    });

    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      monthlyIncome: income,
      monthlyExpense: expense,
      filteredTransactions: filtered
    };
  }, [transactions, dateRange]);

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [filteredTransactions]);

  const barChartData = useMemo(() => {
    const sorted = [...monthlyReports].sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sorted.map(report => {
      const [month, year] = report.month.split(' ');
      return `${month.substring(0, 3)} ${year}`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: sorted.map(report => report.totalIncome || 0),
          backgroundColor: 'rgba(52, 211, 153, 0.8)',
        },
        {
          label: 'Expenses',
          data: sorted.map(report => report.totalExpense || 0),
          backgroundColor: 'rgba(248, 113, 113, 0.8)',
        },
      ],
    };
  }, [monthlyReports]);

  const pieChartData = useMemo(() => {
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const expenseData = monthlyReports.flatMap(report => 
      report.categories.filter((cat: any) => cat.type === 'expense')
    );

    const categoryMap = new Map<string, number>();
    expenseData.forEach((cat: any) => {
      categoryMap.set(cat.id, (categoryMap.get(cat.id) || 0) + cat.amount);
    });

    return {
      labels: expenseCategories.map(c => c.name),
      datasets: [
        {
          data: expenseCategories.map(c => categoryMap.get(c.id) || 0),
          backgroundColor: expenseCategories.map(c => c.color),
          borderWidth: 1,
        },
      ],
    };
  }, [categories, monthlyReports]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [dashboardRes, reportsRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/reports/monthly-reports')
        ]);

        if (!dashboardRes.ok || !reportsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [dashboardData, reportsData] = await Promise.all([
          dashboardRes.json(),
          reportsRes.json()
        ]);

        setTransactions(dashboardData.transactions);
        setAccounts(dashboardData.accounts);
        setCategories(dashboardData.categories);
        setMonthlyReports(reportsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setIsDateDropdownOpen(false);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      case 'last90': return 'Last 90 Days';
      case 'thisMonth': return 'This Month';
      case 'lastMonth': return 'Last Month';
      case 'thisYear': return 'This Year';
      default: return 'Last 30 Days';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Date Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {isLoading ? (
          <Skeleton width={150} height={36} />
        ) : (
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
                  {['last7', 'last30', 'last90', 'thisMonth', 'lastMonth', 'thisYear'].map((range) => (
                    <button
                      key={range}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleDateRangeChange(range)}
                    >
                      {(() => {
                        switch (range) {
                          case 'last7': return 'Last 7 Days';
                          case 'last30': return 'Last 30 Days';
                          case 'last90': return 'Last 90 Days';
                          case 'thisMonth': return 'This Month';
                          case 'lastMonth': return 'Last Month';
                          case 'thisYear': return 'This Year';
                          default: return range;
                        }
                      })()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
          </>
        ) : (
          <>
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center">
                <BanknotesIcon className="h-10 w-10 mr-3" />
                <div>
                  <h3 className="text-lg font-medium">Total Balance</h3>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <div className="flex items-center">
                <div className="mr-3 rounded-full p-2 bg-white bg-opacity-20">
                  <ArrowUpIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{['thisMonth', 'lastMonth'].includes(dateRange) ? 'Monthly' : 'Period'} Income</h3>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <div className="flex items-center">
                <div className="mr-3 rounded-full p-2 bg-white bg-opacity-20">
                  <ArrowDownIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{['thisMonth', 'lastMonth'].includes(dateRange) ? 'Monthly' : 'Period'} Expense</h3>
                  <p className="text-2xl font-bold">{formatCurrency(monthlyExpense)}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton height={350} />
            <Skeleton height={350} />
          </>
        ) : (
          <>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Overview</h3>
              </div>
              <ChartComponent
                type="bar"
                data={barChartData}
                height={300}
              />
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Breakdown</h3>
              </div>
              <ChartComponent
                type="pie"
                data={pieChartData}
                height={300}
              />
            </Card>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isLoading ? <Skeleton width={150} /> : 'Recent Transactions'}
          </h3>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton height={60} count={5} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
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
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}