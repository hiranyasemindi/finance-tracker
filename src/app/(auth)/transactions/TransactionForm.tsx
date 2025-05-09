"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { mockCategories, mockAccounts } from '@/data/mockData';
import { Transaction } from '@/types';

interface TransactionFormProps {
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
  initialData?: Partial<Transaction> | null;
}

export default function TransactionForm({
  onSubmit,
  onCancel,
  initialData
}: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'expense',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    accountId: '',
    notes: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableCategories, setAvailableCategories] = useState(mockCategories);

  // Filter categories based on transaction type
  useEffect(() => {
    setAvailableCategories(mockCategories.filter(c => c.type === formData.type));
    // Reset category if it doesn't match the current type
    if (formData.categoryId) {
      const category = mockCategories.find(c => c.id === formData.categoryId);
      if (category && category.type !== formData.type) {
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
    }
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Transaction Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              name="amount"
              id="amount"
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

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>

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
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
          )}
        </div>

        {/* Account */}
        <div>
          <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Account
          </label>
          <select
            id="accountId"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.accountId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          >
            <option value="">Select an account</option>
            {mockAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          {errors.accountId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accountId}</p>
          )}
        </div>

        {/* Notes (spans 2 columns) */}
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any additional details..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
} 