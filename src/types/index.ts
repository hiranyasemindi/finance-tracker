export type TransactionType = 'income' | 'expense';
export type AccountType = 'bank' | 'cash' | 'credit' | 'investment' | 'other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  accountId?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM format
  spent: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  preferredCurrency: string;
  isDarkMode: boolean;
  createdAt: string; // ISO date string
}

export interface MonthlyReport {
  month: string; // YYYY-MM format
  totalIncome: number;
  totalExpense: number;
  categories: {
    id: string;
    name: string;
    amount: number;
    type: TransactionType;
  }[];
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Mock data for initial development
export const mockCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#34D399' },
  { id: '2', name: 'Food', type: 'expense', color: '#F87171' },
  { id: '3', name: 'Transport', type: 'expense', color: '#60A5FA' },
  { id: '4', name: 'Rent', type: 'expense', color: '#A78BFA' },
  { id: '5', name: 'Entertainment', type: 'expense', color: '#FBBF24' },
  { id: '6', name: 'Freelance', type: 'income', color: '#34D399' },
]; 