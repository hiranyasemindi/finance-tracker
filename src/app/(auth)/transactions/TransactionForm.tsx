"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { Input, Select, TextArea, FormGroup } from '@/components/form';
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

  const handleChange = (name: string, value: any) => {
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

  // Prepare options for select components
  const typeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...availableCategories.map(category => ({
      value: category.id,
      label: category.name
    }))
  ];

  const accountOptions = [
    { value: '', label: 'Select an account' },
    ...mockAccounts.map(account => ({
      value: account.id,
      label: account.name
    }))
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <FormGroup grid cols={2} gap={4}>
        {/* Transaction Type */}
        <Select
          id="type"
          name="type"
          label="Type"
          value={formData.type}
          options={typeOptions}
          onChange={(value) => handleChange('type', value)}
        />

        {/* Amount */}
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          label="Amount"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
          icon={<span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>}
          placeholder="0.00"
        />

        {/* Date */}
        <Input
          id="date"
          name="date"
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
        />

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

        {/* Account */}
        <Select
          id="accountId"
          name="accountId"
          label="Account"
          value={formData.accountId}
          options={accountOptions}
          onChange={(value) => handleChange('accountId', value)}
          error={errors.accountId}
        />
      </FormGroup>

      {/* Notes */}
      <TextArea
        id="notes"
        name="notes"
        label="Notes"
        rows={3}
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        placeholder="Add any additional details..."
      />

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