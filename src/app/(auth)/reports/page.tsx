"use client";

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ChartComponent from '@/components/ChartComponent';
import { mockMonthlyReports, mockCategories, generateMonthlyData, generateCategoryBreakdown } from '@/data/mockData';
import { formatCurrency } from '@/types';
import { ArrowDownTrayIcon, DocumentTextIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(mockMonthlyReports[0].month);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  
  // Get the selected month's report
  const selectedReport = mockMonthlyReports.find(report => report.month === selectedMonth) || mockMonthlyReports[0];
  
  // Format the month for display (YYYY-MM to Month YYYY)
  const formatMonthDisplay = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Monthly data for charts
  const monthlyData = generateMonthlyData();
  
  // Expense breakdown for the selected month
  const expenseCategories = selectedReport.categories.filter(c => c.type === 'expense');
  const incomeCategories = selectedReport.categories.filter(c => c.type === 'income');
  
  // Pie chart data for expense breakdown
  const expensePieData = {
    labels: expenseCategories.map(c => c.name),
    datasets: [
      {
        data: expenseCategories.map(c => c.amount),
        backgroundColor: expenseCategories.map(c => {
          const category = mockCategories.find(cat => cat.id === c.id);
          return category ? category.color : '#gray';
        }),
        borderWidth: 1,
      },
    ],
  };
  
  // Income pie chart data
  const incomePieData = {
    labels: incomeCategories.map(c => c.name),
    datasets: [
      {
        data: incomeCategories.map(c => c.amount),
        backgroundColor: incomeCategories.map(c => {
          const category = mockCategories.find(cat => cat.id === c.id);
          return category ? category.color : '#gray';
        }),
        borderWidth: 1,
      },
    ],
  };

  // Monthly comparison bar/line chart data
  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.incomeData,
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: monthlyData.expenseData,
        backgroundColor: 'rgba(248, 113, 113, 0.5)',
        borderColor: 'rgb(248, 113, 113)',
        borderWidth: 2,
        tension: 0.1,
      },
      {
        label: 'Balance',
        data: monthlyData.balanceData,
        backgroundColor: 'rgba(96, 165, 250, 0.5)',
        borderColor: 'rgb(96, 165, 250)',
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  // Simulate downloading CSV report
  const downloadCSVReport = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Downloading CSV report for', selectedMonth);
    alert('CSV Report downloaded!');
  };

  // Simulate downloading PDF report
  const downloadPDFReport = () => {
    // In a real app, this would generate and download a PDF file
    console.log('Downloading PDF report for', selectedMonth);
    alert('PDF Report downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h1>
        
        <div className="flex items-center space-x-4">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {mockMonthlyReports.map((report) => (
              <option key={report.month} value={report.month}>
                {formatMonthDisplay(report.month)}
              </option>
            ))}
          </select>

          {/* Download buttons */}
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadCSVReport}
              className="flex items-center"
            >
              <DocumentTextIcon className="h-5 w-5 mr-1" />
              CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadPDFReport}
              className="flex items-center"
            >
              <DocumentChartBarIcon className="h-5 w-5 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Total Income</h3>
            <p className="text-2xl font-bold">{formatCurrency(selectedReport.totalIncome)}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <p className="text-2xl font-bold">{formatCurrency(selectedReport.totalExpense)}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Net Savings</h3>
            <p className="text-2xl font-bold">
              {formatCurrency(selectedReport.totalIncome - selectedReport.totalExpense)}
            </p>
          </div>
        </Card>
      </div>

      {/* Monthly Comparison Chart */}
      <Card title="Monthly Comparison">
        <div className="mb-4 flex justify-end">
          <div className="flex space-x-2 border border-gray-200 dark:border-gray-700 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'bar'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'line'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
          </div>
        </div>
        <ChartComponent 
          type={chartType} 
          data={monthlyChartData} 
          height={300}
        />
      </Card>

      {/* Expense & Income Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Expense Breakdown">
          {expenseCategories.length > 0 ? (
            <div className="h-64">
              <ChartComponent 
                type="pie" 
                data={expensePieData} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No expense data available for this month
            </div>
          )}
        </Card>
        
        <Card title="Income Breakdown">
          {incomeCategories.length > 0 ? (
            <div className="h-64">
              <ChartComponent 
                type="pie" 
                data={incomePieData} 
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No income data available for this month
            </div>
          )}
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card title="Detailed Breakdown">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {selectedReport.categories.map((category) => {
                const categoryInfo = mockCategories.find(c => c.id === category.id);
                const totalForType = category.type === 'income' ? 
                  selectedReport.totalIncome : selectedReport.totalExpense;
                const percentage = totalForType > 0 ? 
                  ((category.amount / totalForType) * 100).toFixed(1) : '0';
                
                return (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: categoryInfo?.color || '#gray' }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.type === 'income' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {category.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(category.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="row" colSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedReport.totalIncome - selectedReport.totalExpense)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
} 