"use client";

import { useState } from 'react';
import Button from '@/components/Button';
import { mockCategories } from '@/data/mockData';
import { Budget } from '@/types';

interface BudgetFormProps {
  onSubmit: (data: Partial<Budget>) => void;
  onCancel: () => void;
  initialData?: Budget | null;
  defaultMonth?: string;
}

export default function BudgetForm({
  onSubmit,
  onCancel,
  initialData,
  defaultMonth = new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
}: BudgetFormProps) {
  const [formData, setFormData] = useState<Partial<Budget>>({
    categoryId: '',
    amount: 0,
    month: defaultMonth,
    spent: initialData?.spent || 0,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get expense categories only (budgets are for expenses)
  const expenseCategories = mockCategories.filter(c => c.type === 'expense');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'amount' || name === 'spent') {
      const numValue = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Generate the last 12 months options for the month selector
  const getMonthOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthDisplay = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      options.push({ value: monthStr, label: monthDisplay });
    }
    
    return options;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Category */}
      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.categoryId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
        >
          <option value="">Select a category</option>
          {expenseCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
        )}
      </div>

      {/* Month */}
      <div>
        <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Month
        </label>
        <select
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.month ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
        >
          {getMonthOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.month && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.month}</p>
        )}
      </div>

      {/* Budget Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`mt-1 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.amount ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
        )}
      </div>

      {/* Spent Amount - Only show this for editing */}
      {initialData && (
        <div>
          <label htmlFor="spent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount Spent
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              id="spent"
              name="spent"
              value={formData.spent}
              onChange={handleChange}
              className="mt-1 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This will be automatically updated based on your transactions, but you can manually adjust it if needed.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Budget
        </Button>
      </div>
    </form>
  );
} 