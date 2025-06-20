"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Select } from '@/components/form';
import ChartComponent from '@/components/ChartComponent';
import { Category, formatCurrency } from '@/types';
import { DocumentChartBarIcon } from '@heroicons/react/24/outline';
import { showToast } from 'nextjs-toast-notify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

export default function ReportsPage() {
  const [monthlyReports, setMonthlyReports] = useState<any>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const reportsResponse = await fetch("/api/reports/monthly-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const reportsData = await reportsResponse.json();
        setMonthlyReports(reportsData);
        if (reportsData.length > 0) {
          setSelectedMonth(reportsData[0].month);
        }

        const categoriesResponse = await fetch('/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.error) {
          showToast.error(`Error fetching categories`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          console.error('Error fetching categories:', categoriesData.error);
        } else {
          setCategories(categoriesData);
        }
      } catch (error) {
        showToast.error(`Error fetching data`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the selected month's report
  const selectedReport = monthlyReports?.find((report: any) => report.month === selectedMonth) || monthlyReports[0];

  // Format the month for display (YYYY-MM to Month YYYY)
  const formatMonthDisplay = (monthStr: string) => {
    if (!monthStr) return '';
    return monthStr;
  };

  // Prepare month options for select
  const monthOptions = monthlyReports.map((report: any) => ({
    value: report.month,
    label: report.month
  }));

  const generateMonthlyData = () => {
    const sorted = [...monthlyReports].sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

    const labels = sorted.map(report => {
      const [month, year] = report.month.split(' ');
      return `${month.substring(0, 3)} ${year}`;
    });

    const incomeData = sorted.map(report => report.totalIncome || 0);
    const expenseData = sorted.map(report => report.totalExpense || 0);
    const balanceData = sorted.map(report => (report.totalIncome || 0) - (report.totalExpense || 0));

    return {
      labels,
      incomeData,
      expenseData,
      balanceData,
    };
  };

  // Monthly data for charts
  const monthlyData = generateMonthlyData();

  // Expense breakdown for the selected month
  const expenseCategories = selectedReport?.categories.filter((c: any) => c.type === 'expense');
  const incomeCategories = selectedReport?.categories.filter((c: any) => c.type === 'income');

  // Pie chart data for expense breakdown
  const expensePieData = {
    labels: expenseCategories?.map((c: any) => c.name),
    datasets: [
      {
        data: expenseCategories?.map((c: any) => c.amount),
        backgroundColor: expenseCategories?.map((c: any) => {
          const category = categories?.find(cat => cat.id === c.id);
          return category ? category.color : '#gray';
        }),
        borderWidth: 1,
      },
    ],
  };

  // Income pie chart data
  const incomePieData = {
    labels: incomeCategories?.map((c: any) => c.name),
    datasets: [
      {
        data: incomeCategories?.map((c: any) => c.amount),
        backgroundColor: incomeCategories?.map((c: any) => {
          const category = categories?.find(cat => cat.id === c.id);
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

  const downloadPDFReport = async () => {
    try {
      showToast.info('Generating PDF report...', {
        duration: 2000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      pdf.setFontSize(20);
      pdf.setTextColor(40);
      pdf.text(`Financial Report - ${selectedMonth}`, pageWidth / 2, 40, { align: 'center' });

      const addSection = async (selector: string, yPosition: number) => {
        const element = document.querySelector(selector) as HTMLElement;
        if (!element) return yPosition;

        const dataUrl = await htmlToImage.toPng(element, {
          backgroundColor: '#ffffff',
          quality: 1,
          pixelRatio: 2,
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = contentWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (yPosition + pdfHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(dataUrl, 'PNG', margin, yPosition, pdfWidth, pdfHeight, undefined, 'FAST');
        return yPosition + pdfHeight + margin;
      };

      let currentY = 60;

      currentY = await addSection('.grid.grid-cols-1.md\\:grid-cols-3', currentY);

      currentY = await addSection('div.space-y-6 > div:nth-child(3)', currentY);

      currentY = await addSection('.grid.grid-cols-1.lg\\:grid-cols-2', currentY);

      currentY = await addSection('div.space-y-6 > div:last-child', currentY);

      pdf.save(`Financial_Report_${selectedMonth.replace(' ', '_')}.pdf`);

      showToast.success('PDF report generated successfully!', {
        duration: 3000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast.error('Failed to generate PDF report', {
        duration: 3000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton width={200} height={32} />
          <div className="flex items-center space-x-4">
            <Skeleton width={208} height={36} />
            <Skeleton width={100} height={36} />
          </div>
        </div>

        {/* Monthly Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="flex flex-col items-center">
                <Skeleton width={120} height={24} className="mb-2" />
                <Skeleton width={150} height={32} />
              </div>
            </Card>
          ))}
        </div>

        {/* Monthly Comparison Chart Skeleton */}
        <Card title={<Skeleton width={180} height={24} />}>
          <div className="mb-4 flex justify-end">
            <Skeleton width={120} height={32} />
          </div>
          <Skeleton height={300} />
        </Card>

        {/* Expense & Income Breakdown Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} title={<Skeleton width={160} height={24} />}>
              <Skeleton height={256} />
            </Card>
          ))}
        </div>

        {/* Detailed Breakdown Table Skeleton */}
        <Card title={<Skeleton width={180} height={24} />}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Category', 'Type', 'Amount', '% of Total'].map((header) => (
                    <th key={header} scope="col" className="px-6 py-3 text-left">
                      <Skeleton width={80} height={20} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4].map((cell) => (
                      <td key={cell} className="px-6 py-4 whitespace-nowrap">
                        <Skeleton width={cell === 1 ? 120 : 60} height={20} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h1>

        <div className="flex items-center space-x-4">
          {/* Month selector */}
          <div className="flex items-center">
            <Select
              id="month-selector"
              name="month"
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              options={monthOptions}
              className="mb-0 w-52"
              fullWidth={false}
            />
          </div>

          {/* Download buttons */}
          <div className="flex items-center space-x-2">
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
            <p className="text-2xl font-bold">{formatCurrency(selectedReport?.totalIncome)}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <p className="text-2xl font-bold">{formatCurrency(selectedReport?.totalExpense)}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Net Savings</h3>
            <p className="text-2xl font-bold">
              {formatCurrency(selectedReport?.totalIncome - selectedReport?.totalExpense)}
            </p>
          </div>
        </Card>
      </div>

      {/* Monthly Comparison Chart */}
      <Card title="Monthly Comparison">
        <div className="mb-4 flex justify-end">
          <div className="flex space-x-2 border border-gray-200 dark:border-gray-700 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm ${chartType === 'bar'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-300'
                }`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${chartType === 'line'
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
          {expenseCategories?.length > 0 ? (
            <div className="h-84">
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
          {incomeCategories?.length > 0 ? (
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
              {selectedReport?.categories.map((category: any) => {
                const categoryInfo = categories?.find(c => c.id === category.id);
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.type === 'income'
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
                  {formatCurrency(selectedReport?.totalIncome - selectedReport?.totalExpense)}
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