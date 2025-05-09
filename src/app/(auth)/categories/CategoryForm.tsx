"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { Category, TransactionType } from '@/types';

interface CategoryFormProps {
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
  initialData?: Category | null;
  defaultType?: TransactionType;
}

// Color palette for category colors
const colorPalette = [
  '#34D399', // green
  '#F87171', // red
  '#60A5FA', // blue
  '#A78BFA', // purple
  '#FBBF24', // yellow
  '#EC4899', // pink
  '#F97316', // orange
  '#8B5CF6', // violet
  '#14B8A6', // teal
  '#F43F5E', // rose
];

export default function CategoryForm({
  onSubmit,
  onCancel,
  initialData,
  defaultType = 'expense'
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    type: defaultType,
    color: colorPalette[0],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Category name is required';
    }

    if (!formData.color) {
      newErrors.color = 'Please select a color';
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
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category Name
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
          placeholder="e.g., Groceries, Rent, Salary"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorPalette.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-green-500' : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {formData.color === color && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.color}</p>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preview
        </label>
        <div className="border dark:border-gray-700 p-3 rounded-md">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full mr-3"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.name || 'Category Name'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'} Category
        </Button>
      </div>
    </form>
  );
} 