'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { showToast } from 'nextjs-toast-notify';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            showToast.error('Invalid reset link', {
                duration: 3000,
                progress: true,
                position: "top-right",
                transition: "bounceIn",
                sound: true,
            });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            showToast.error('Password must be at least 8 characters', {
                duration: 3000,
                progress: true,
                position: "top-right",
                transition: "bounceIn",
                sound: true,
            });
            return;
        }

        if (password !== confirmPassword) {
            showToast.error('Passwords do not match', {
                duration: 3000,
                progress: true,
                position: "top-right",
                transition: "bounceIn",
                sound: true,
            });
            return;
        }

        setIsLoading(true);
        fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    showToast.error(data.error, {
                        duration: 3000,
                        progress: true,
                        position: "top-right",
                        transition: "bounceIn",
                        sound: true,
                    });
                    return;
                }
                if (data.message) {
                    showToast.success('Password reset successfully! You can now sign in with your new password.', {
                        duration: 3000,
                        progress: true,
                        position: "top-right",
                        transition: "bounceIn",
                        sound: true,
                    });
                    router.push('/auth/signin')
                }
            })
            .catch(err => {
                showToast.error(err.message, {
                    duration: 3000,
                    progress: true,
                    position: "top-right",
                    transition: "bounceIn",
                    sound: true,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });

    };

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                            <CurrencyDollarIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Password Reset
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Invalid reset link. Please request a new password reset email.
                        </p>
                        <Link href="/auth/forgot-password">
                            <Button className="w-full">
                                Request New Reset Link
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                        <CurrencyDollarIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Reset Your Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your new password below
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </div>

                        <div className="text-sm text-center">
                            <Link
                                href="/auth/signin"
                                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                            >
                                Back to sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}