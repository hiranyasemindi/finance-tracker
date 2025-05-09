"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call an authentication API
      // For demo purposes, we'll just redirect to the dashboard
      // if the email and password are not empty
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }
      
      console.log('Signing in with:', formData.email);
      
      // Redirect to dashboard
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, we provide a simple sign-in flow
  // In a real app, this would integrate with NextAuth.js
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
            <CurrencyDollarIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link 
            href="/auth/signup" 
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/auth/forgot-password" 
                  className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => alert('Google sign-in would be implemented here')}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C8.303 2 4.755 4.432 2.964 8.062c-.865 1.775-1.35 3.782-1.35 5.9 0 2.119.485 4.126 1.35 5.9 1.791 3.631 5.339 6.063 9.581 6.063 5.339 0 9.97-3.547 9.97-8.435 0-.642-.084-1.276-.211-1.89H12.545z" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => alert('Apple sign-in would be implemented here')}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.561 8.45c-.251.227-.496.54-.496 1.09 0 .55.227.905.478 1.187.227.251.704.613.704 1.09 0 .432-.272.864-.816 1.295-.59.477-1.25.705-1.977.705-.297 0-.659-.046-1.023-.114a3.647 3.647 0 01-1.091.16c-.796 0-1.546-.273-2.082-.75-.216-.182-.42-.296-.704-.296-.318 0-.55.137-.796.41-.364.41-.819.66-1.386.66-.386 0-.75-.115-1.046-.297-.203-.114-.492-.318-.765-.318-.25 0-.454.114-.613.273A3.368 3.368 0 005 13.613c0 1.046.432 2.137 1.114 2.909.613.705 1.432 1.16 2.319 1.16.34 0 .682-.069 1-.182.317-.114.61-.296.886-.296.25 0 .5.16.818.273.296.115.613.16.91.16a3.471 3.471 0 002.335-1.137c.637-.682 1.16-1.727 1.16-2.75 0-.387-.087-.728-.23-1.023.909-.501 1.524-1.409 1.524-2.456-.023-.91-.456-1.682-1.275-2.182zM13.159 2c.046.363.073.75.073 1.114 0 .36-.073.75-.187 1.136-.182.364-.432.728-.773 1.023-.478.34-1 .567-1.636.567-.023-.364-.046-.728-.046-1.068 0-.364.023-.704.114-1.046.137-.34.364-.727.682-1.023a3.47 3.47 0 011.75-.704h.023z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 