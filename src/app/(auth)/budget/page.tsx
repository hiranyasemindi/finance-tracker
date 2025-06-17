"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Budget, Category, formatCurrency } from '@/types';
import { PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import BudgetForm from './BudgetForm';
import { Select } from '@/components/form';
import { showToast } from 'nextjs-toast-notify';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [activeMonth, setActiveMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // This gives 'YYYY-MM' format
  );// Default to November 2023

  useEffect(() => {
    fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          showToast.error(`Error fetching categories`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          console.error('Error fetching categories:', data.error);
          return;
        }
        setCategories(data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [])

  // Filter budgets by active month
  const filteredBudgets = budgets.filter(budget => budget.month === activeMonth);

  // Calculate total budget and spent amount
  const totalBudget = filteredBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0);

  // Get all months from the budgets data
  const getUniqueMonths = () => {
    const months = budgets.map(budget => budget.month);
    return [...new Set(months)];
  };

  // Format month for display (YYYY-MM to Month YYYY)
  const formatMonth = (monthStr: string, func: string) => {
    console.log(monthStr, func);
    const [year, month] = monthStr?.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Handle new budget
  const handleAddBudget = (budget: any) => {
    if (editingBudget) {
      // Update existing budget
      const updatedBudgets = budgets.map(b =>
        b.id === editingBudget.id ? { ...budget, id: editingBudget.id } : b
      );
      setBudgets(updatedBudgets);
    } else {
      fetch('/api/budget/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(budget)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error adding budget:', data.error);
          } else {
            setBudgets([...budgets, data.budget]);
          }
        })
        .catch(error => {
          console.error('Error adding budget:', error);
        });

    }
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  // Handle delete budget
  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get category color by ID
  const getCategoryColor = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.color : '#gray';
  };

  // Calculate budget status as percentage
  const getBudgetPercentage = (amount: number, spent: number) => {
    return amount > 0 ? Math.min(Math.round((spent / amount) * 100), 100) : 0;
  };

  // Check if a budget is over the limit
  const isOverBudget = (amount: number, spent: number) => {
    return spent > amount;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Budget Planning</h1>

        <div className="flex items-center gap-4">
          {/* Month selector */}
          <div className="flex items-center h-10">
            <Select
              id="month-selector"
              name="month"
              value={activeMonth}
              onChange={(value) => setActiveMonth(value)}
              options={getUniqueMonths().map((month) => ({
                value: month,
                label: formatMonth(month, "getUniqueMonths")
              }))}
              className="mb-0 w-52"
              fullWidth={false}
            />
          </div>

          <Button
            onClick={() => {
              setEditingBudget(null);
              setIsFormOpen(true);
            }}
            className="flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Budget</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(totalBudget)}
            </p>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>Spent: {formatCurrency(totalSpent)}</span>
                <span>
                  {getBudgetPercentage(totalBudget, totalSpent)}% of budget
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${isOverBudget(totalBudget, totalSpent)
                    ? 'bg-red-600 dark:bg-red-500'
                    : getBudgetPercentage(totalBudget, totalSpent) > 80
                      ? 'bg-yellow-400 dark:bg-yellow-500'
                      : 'bg-green-600 dark:bg-green-500'
                    }`}
                  style={{ width: `${getBudgetPercentage(totalBudget, totalSpent)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Remaining Budget</h3>
            <p className={`text-3xl font-bold mt-2 ${totalBudget - totalSpent > 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
              }`}>
              {formatCurrency(totalBudget - totalSpent)}
            </p>

            <div className="mt-4 flex items-center">
              {isOverBudget(totalBudget, totalSpent) ? (
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-md flex items-center text-red-800 dark:text-red-300 w-full">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  <span>You've exceeded your total budget for {formatMonth(activeMonth, "activeMonth")}</span>
                </div>
              ) : (
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-md flex items-center text-green-800 dark:text-green-300 w-full">
                  <span>You're on track with your budget for {formatMonth(activeMonth, "activeMonthh")}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Category Budgets */}
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mt-8">Category Budgets</h2>

      {filteredBudgets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBudgets.map((budget) => (
            <Card key={budget.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: getCategoryColor(budget.categoryId) }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getCategoryName(budget.categoryId)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatMonth(budget.month, "formatMonth")}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingBudget(budget);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Spent: {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    Budget: {formatCurrency(budget.amount)}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full ${isOverBudget(budget.amount, budget.spent)
                      ? 'bg-red-600 dark:bg-red-500'
                      : getBudgetPercentage(budget.amount, budget.spent) > 80
                        ? 'bg-yellow-400 dark:bg-yellow-500'
                        : 'bg-green-600 dark:bg-green-500'
                      }`}
                    style={{ width: `${getBudgetPercentage(budget.amount, budget.spent)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${isOverBudget(budget.amount, budget.spent)
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                    }`}>
                    {isOverBudget(budget.amount, budget.spent)
                      ? `${formatCurrency(budget.spent - budget.amount)} over budget`
                      : `${formatCurrency(budget.amount - budget.spent)} remaining`}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {getBudgetPercentage(budget.amount, budget.spent)}% used
                  </span>
                </div>

                {isOverBudget(budget.amount, budget.spent) && (
                  <div className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    You've exceeded this budget
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No budgets set for {formatMonth(activeMonth, "no budgets")}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start planning your finances by setting up category budgets.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  setEditingBudget(null);
                  setIsFormOpen(true);
                }}
              >
                <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
                Add Budget
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Budget Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </h2>
              <BudgetForm
                onSubmit={handleAddBudget}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingBudget(null);
                }}
                categories={categories}
                initialData={editingBudget}
                defaultMonth={activeMonth}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 