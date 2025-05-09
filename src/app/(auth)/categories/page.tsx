"use client";

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { mockCategories } from '@/data/mockData';
import { Category, TransactionType } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CategoryForm from './CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Filter categories by type
  const filteredCategories = categories.filter(category => category.type === activeTab);

  // Handle new category
  const handleAddCategory = (category: Partial<Category>) => {
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(c => 
        c.id === editingCategory.id ? { ...category, id: editingCategory.id } as Category : c
      );
      setCategories(updatedCategories);
    } else {
      // Add new category with generated ID
      const newCategory = {
        ...category,
        id: `cat-${Date.now()}`,
      } as Category;
      setCategories([...categories, newCategory]);
    }
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  // Handle delete category
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('expense')}
            className={`${
              activeTab === 'expense'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`${
              activeTab === 'income'
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Income
          </button>
        </nav>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <Card key={category.id} className="flex flex-col">
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full mr-3"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex-1">
                {category.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setIsFormOpen(true);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {category.type === 'income' ? 'Income' : 'Expense'} Category
            </div>
          </Card>
        ))}

        {/* Empty state */}
        {filteredCategories.length === 0 && (
          <Card className="col-span-full py-12">
            <div className="text-center">
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No {activeTab} categories
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new {activeTab} category.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setIsFormOpen(true);
                  }}
                >
                  <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
                  Add Category
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCategory(null);
                }}
                initialData={editingCategory}
                defaultType={activeTab}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 