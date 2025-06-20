# Finance Tracker

A personal finance manager built with Next.js that helps you track your income, expenses, and financial goals. This project was created for learning Next.js and is not intended for production use with real financial data.

> **Note:** Account balances and transaction data are not encrypted as this is a learning project. While you can use this application with Neon DB for personal usage, please be aware of the security limitations. If you choose to use it with real financial information, do so at your own risk and consider implementing additional security measures.

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
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (via Neon DB)
- **Email Service**: RESEND
- **State Management**: React Hooks, Context API
- **Dark Mode**: Fully supported with toggle functionality

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database (Neon DB recommended)
- RESEND account for email functionality

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

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your_neon_db_connection_string"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   RESEND_API_KEY="your_resend_api_key"
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Setting up Neon DB

1. Create an account at [Neon](https://neon.tech/)
2. Create a new project
3. Create a new database
4. Get your connection string from the dashboard
5. Replace the `DATABASE_URL` in your `.env` file with your Neon DB connection string

### Setting up RESEND for Email Functionality

1. Create an account at [RESEND](https://resend.com/)
2. Create an API key
3. Add the API key to your `.env` file as `RESEND_API_KEY`

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

## Database Schema

The application uses Prisma ORM with a PostgreSQL database. The schema includes models for:

- Users
- Accounts
- Transactions
- Categories
- Budgets
- Password Reset Tokens

You can find the complete schema in the `prisma/schema.prisma` file.

## Customization

- **Theme**: You can customize the primary colors in the Tailwind configuration
- **Currency**: Currency preferences can be changed in the user profile settings

## Deployment

This application can be easily deployed to Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Deploy

## License

[Custom License](LICENSE) - Personal use only. Commercial use and distribution are not permitted.
