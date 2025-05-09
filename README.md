# Finance Tracker

A personal finance manager built with Next.js that helps you track your income, expenses, and financial goals.

## Features

- **Dashboard**: Overview of income, expenses, savings with charts and recent transactions
- **Transactions**: Manage and filter transactions by date, category, and type
- **Categories**: Create and manage custom expense and income categories
- **Reports & Analytics**: View financial reports with charts and download options
- **Budget Planning**: Set monthly budgets per category and track spending
- **Accounts**: Manage bank accounts, cash, and credit cards
- **Profile & Settings**: Customize app settings and manage user information
- **Authentication**: Sign up, sign in, and password reset functionality

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: react-chartjs-2 + chart.js
- **Icons**: Heroicons
- **Forms**: react-hook-form
- **Authentication**: NextAuth.js (setup ready, backend implementation required)
- **State Management**: React Hooks, Context API
- **Dark Mode**: Fully supported with toggle functionality

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authenticated routes
│   │   ├── accounts/       # Accounts pages
│   │   ├── budget/         # Budget planning pages
│   │   ├── categories/     # Categories pages
│   │   ├── reports/        # Reports and analytics pages
│   │   ├── transactions/   # Transactions pages
│   │   ├── profile/        # User profile and settings
│   │   └── auth/           # Authentication pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard/Home page
├── components/             # Reusable UI components
├── data/                   # Mock data for development
└── types/                  # TypeScript interfaces and types
```

## Backend Integration

The frontend is ready to be connected to a backend API. The following endpoints will be needed:

- Authentication (signup, signin, password reset)
- CRUD operations for transactions, categories, budgets, and accounts
- Reports generation and analytics

## Customization

- **Theme**: You can customize the primary colors in the Tailwind configuration
- **Currency**: Currency preferences can be changed in the user profile settings

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Deploy

## License

[MIT](LICENSE)
