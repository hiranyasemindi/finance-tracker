"use client";

import { useState } from 'react';
import Button from '@/components/Button';
import { Account } from '@/types';

interface AccountFormProps {
  onSubmit: (data: Partial<Account>) => void;
  onCancel: () => void;
  initialData?: Partial<Account> | null;
}

export default function AccountForm({
  onSubmit,
  onCancel,
  initialData
}: AccountFormProps) {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    balance: 0,
    type: 'bank',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const accountTypes = [
    { value: 'bank', label: 'Bank Account' },
    { value: 'cash', label: 'Cash & Wallet' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'balance') {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Account name is required';
    }

    if (formData.balance === undefined) {
      newErrors.balance = 'Balance is required';
    }

    if (!formData.type) {
      newErrors.type = 'Account type is required';
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
      {/* Account Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="e.g., Checking Account, Cash Wallet"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Account Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Account Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.type ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
          }`}
        >
          {accountTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>
        )}
      </div>

      {/* Balance */}
      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Balance
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            id="balance"
            name="balance"
            value={formData.balance === undefined ? '' : formData.balance}
            onChange={handleChange}
            className={`mt-1 block w-full pl-7 pr-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.balance ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.balance && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.balance}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          For credit cards, enter a negative balance if you owe money.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Account
        </Button>
      </div>
    </form>
  );
} 