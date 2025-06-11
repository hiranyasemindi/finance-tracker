"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { showToast } from 'nextjs-toast-notify';
import { useSession } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status } = useSession()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/')
    }
  }, [status, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrors({ form: data.error });
          showToast.error(data.error, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success('Account created successfully!', {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          router.push('/auth/signin');
        }
      })
      .catch(err => {
        console.error(err); setErrors({ form: 'Error signing up' });
        showToast.error('Error signing up', {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
            <CurrencyDollarIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.form && (
            <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errors.form}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-700'
                    } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-700'
                    } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-700'
                    } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-700'
                    } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className={`h-4 w-4 ${errors.agreeToTerms ? 'border-red-300 text-red-600' : 'border-gray-300 text-green-600'
                  } focus:ring-green-500 rounded dark:border-gray-700 dark:bg-gray-700`}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I agree to the{' '}
                <Link
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agreeToTerms}</p>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 