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
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  userId: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
  userId: string;
}

export interface Budget {
  id: string;
  userId: string;
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
export const formatCurrency = (amount: number, currency: string = 'LKR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

