"use client";

import { useState } from 'react';
import Button from '@/components/Button';
import { Input, Select, FormGroup } from '@/components/form';
import { Budget, Category } from '@/types';

interface BudgetFormProps {
  onSubmit: (data: Partial<Budget>) => void;
  onCancel: () => void;
  initialData?: Budget | null;
  defaultMonth?: string;
  categories?: Category[],

}

export default function BudgetForm({
  onSubmit,
  onCancel,
  initialData,
  categories,
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
  const expenseCategories = categories?.filter(c => c.type === 'expense');

  const handleChange = (name: string, value: any) => {
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

  // Prepare category options
  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...(expenseCategories ?? []).map(category => ({
      value: String(category.id),
      label: category.name
    }))
  ];

  // Prepare month options
  const monthOptions = getMonthOptions();

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <FormGroup>
        {/* Category */}
        <Select
          id="categoryId"
          name="categoryId"
          label="Category"
          value={formData.categoryId}
          options={categoryOptions}
          onChange={(value) => handleChange('categoryId', value)}
          error={errors.categoryId}
        />

        {/* Month */}
        <Select
          id="month"
          name="month"
          label="Month"
          value={formData.month}
          options={monthOptions}
          onChange={(value) => handleChange('month', value)}
          error={errors.month}
        />

        {/* Budget Amount */}
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          label="Budget Amount"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
          icon={<span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>}
          placeholder="0.00"
        />

        {/* Spent Amount - Only show this for editing */}
        {initialData && (
          <Input
            id="spent"
            name="spent"
            type="number"
            step="0.01"
            min="0"
            label="Amount Spent"
            value={formData.spent}
            onChange={(e) => handleChange('spent', e.target.value)}
            icon={<span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>}
            placeholder="0.00"
            className="mb-0"
          />
        )}

        {initialData && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This will be automatically updated based on your transactions, but you can manually adjust it if needed.
          </p>
        )}
      </FormGroup>

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