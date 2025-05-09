"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { Input, Select, FormGroup } from '@/components/form';
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

  const handleChange = (name: string, value: any) => {
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

  // Prepare options for select component
  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
      <FormGroup>
        {/* Name */}
        <Input
          id="name"
          name="name"
          label="Category Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="e.g., Groceries, Rent, Salary"
        />

        {/* Type */}
        <Select
          id="type"
          name="type"
          label="Category Type"
          value={formData.type}
          options={typeOptions}
          onChange={(value) => handleChange('type', value)}
        />

        {/* Color */}
        <div className="mb-4">
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
          {errors.color && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.color}</p>}
        </div>

        {/* Preview */}
        <div className="mb-4">
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
      </FormGroup>

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