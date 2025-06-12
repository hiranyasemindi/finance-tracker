import { Transaction, Category, Account, Budget, User, MonthlyReport } from '@/types';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#34D399' , userId: '1'},
];

// Mock Accounts
export const mockAccounts: Account[] = [
  { id: '1', name: 'Main Bank Account', balance: 5280.42, type: 'bank' },
  { id: '2', name: 'Savings Account', balance: 12750.00, type: 'bank' },
  { id: '3', name: 'Cash', balance: 350.00, type: 'cash' },
  { id: '4', name: 'Credit Card', balance: -420.50, type: 'credit' },
];

// Mock User
export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  preferredCurrency: 'USD',
  isDarkMode: false,
  password: 'mockPassword123',
  createdAt: new Date().toISOString(),
};

// Mock Transactions (last 3 months)
const currentDate = new Date();
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

const generateRandomTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random date within last 3 months
    const date = new Date(
      threeMonthsAgo.getTime() + Math.random() * (currentDate.getTime() - threeMonthsAgo.getTime())
    );
    
    // 20% chance of being income
    const type = Math.random() < 0.2 ? 'income' : 'expense';
    
    // Select random category based on type
    const possibleCategories = mockCategories.filter(c => c.type === type);
    const category = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
    
    // Random amount
    const amount = type === 'income' 
      ? Math.floor(Math.random() * 2000) + 1000 // Income: 1000-3000
      : Math.floor(Math.random() * 200) + 10;  // Expense: 10-210
    
    // Random account
    const accountId = mockAccounts[Math.floor(Math.random() * mockAccounts.length)].id;
    
    transactions.push({
      id: `trans-${i}`,
      amount,
      type,
      date: date.toISOString().split('T')[0],
      categoryId: category?.id,
      accountId,
      notes: type === 'income' ? 'Monthly income' : `Payment for ${category?.name.toLowerCase()}`,
    });
  }
  
  // Sort by date (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockTransactions = generateRandomTransactions(100);

// Mock Budgets
export const mockBudgets: Budget[] = [
  { id: '1', categoryId: '3', amount: 500, month: '2023-11', spent: 420 },
  { id: '2', categoryId: '4', amount: 200, month: '2023-11', spent: 180 },
  { id: '3', categoryId: '5', amount: 1200, month: '2023-11', spent: 1200 },
  { id: '4', categoryId: '6', amount: 300, month: '2023-11', spent: 350 },
  { id: '5', categoryId: '7', amount: 400, month: '2023-11', spent: 225 },
  { id: '6', categoryId: '8', amount: 250, month: '2023-11', spent: 240 },
];

// Helper functions to generate summary data
export const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = months.map(() => Math.floor(Math.random() * 3000) + 2000);
  const expenseData = months.map(() => Math.floor(Math.random() * 2000) + 1000);
  
  return {
    labels: months,
    incomeData,
    expenseData,
    balanceData: incomeData.map((income, i) => income - expenseData[i]),
  };
};

export const generateCategoryBreakdown = (type: 'income' | 'expense') => {
  const categories = mockCategories.filter(c => c.type === type);
  const data = categories.map(() => Math.floor(Math.random() * 1000) + 100);
  
  return {
    labels: categories.map(c => c.name),
    data,
    backgroundColor: categories.map(c => c.color),
  };
};

// Generate monthly reports
export const mockMonthlyReports: MonthlyReport[] = (() => {
  const reports: MonthlyReport[] = [];
  const today = new Date();
  
  // Generate reports for the last 12 months
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(today);
    monthDate.setMonth(today.getMonth() - i);
    const month = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Generate random category amounts
    const categoriesData = mockCategories.map(category => {
      return {
        id: category.id,
        name: category.name,
        type: category.type,
        amount: category.type === 'income' 
          ? Math.floor(Math.random() * 2000) + 1000 
          : Math.floor(Math.random() * 500) + 100
      };
    });
    
    const totalIncome = categoriesData
      .filter(c => c.type === 'income')
      .reduce((sum, c) => sum + c.amount, 0);
      
    const totalExpense = categoriesData
      .filter(c => c.type === 'expense')
      .reduce((sum, c) => sum + c.amount, 0);
    
    reports.push({
      month,
      totalIncome,
      totalExpense,
      categories: categoriesData,
    });
  }
  
  return reports;
})(); 