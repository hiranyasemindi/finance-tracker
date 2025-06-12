"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Input, Select, FormGroup } from '@/components/form';
import { mockUser } from '@/data/mockData';
import { UserIcon, MoonIcon, SunIcon, CogIcon } from '@heroicons/react/24/outline';
import { showToast } from 'nextjs-toast-notify';
import { User } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name,
    email: user?.email,
  });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        if (data.error) {
          console.error(data.error);
          showToast.error(data.error, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          return
        }
        setUser(data);
        setProfileForm({
          name: data.name,
          email: data.email,
        });
        setIsDarkMode(data.isDarkMode)
        if (data.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      })
      .catch(error => {
        setLoading(false)
        console.error('Error fetching profile:', error);
        showToast.error(`Error fetching profile`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      });
  }, []);

  // Available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen (¥)', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar (C$)', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar (A$)', symbol: 'A$' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'CNY', name: 'Chinese Yuan (¥)', symbol: '¥' },
    { code: 'LKR', name: 'Sri Lankan Rupee (Rs)', symbol: 'Rs' },
  ];

  // Currency options for select
  const currencyOptions = currencies.map(currency => ({
    value: currency.code,
    label: currency.name
  }));

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    setUser(prev => ({
      ...prev,
      preferredCurrency: value
    }));
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Also toggle dark mode class on document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setUser(prev => ({
      ...prev,
      isDarkMode: newDarkMode
    }));
  };

  // Handle profile form change
  const handleProfileFormChange = (name: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile form submit
  const handleProfileFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: profileForm.name,
      email: profileForm.email
    }));
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile & Settings</h1>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Personal Information</h2>
          {!isEditingProfile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center"
            >
              <CogIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileFormSubmit} className="space-y-4">
            <FormGroup>
              <Input
                type="text"
                id="name"
                name="name"
                label="Name"
                value={profileForm.name}
                onChange={(e) => handleProfileFormChange('name', e.target.value)}
                required
              />

              <Input
                type="email"
                id="email"
                name="email"
                label="Email"
                disabled={true}
                value={profileForm.email}
                onChange={(e) => handleProfileFormChange('email', e.target.value)}
                required
              />
            </FormGroup>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setProfileForm({
                    name: user?.name,
                    email: user?.email
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 mr-4">
                <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(user?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* App Settings */}
      <Card>
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">App Settings</h2>

        <div className="space-y-6">
          {/* Currency Preference */}
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-4">
            <div className="flex-grow">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Preferred Currency</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose the currency for displaying amounts
              </p>
            </div>
            <div className="w-full sm:w-52">
              <Select
                id="currency"
                name="currency"
                value={user?.preferredCurrency}
                onChange={handleCurrencyChange}
                options={currencyOptions}
                fullWidth={true}
                className="mb-0"
              />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleDarkModeToggle}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isDarkMode ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                aria-pressed={isDarkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                  <span
                    className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${isDarkMode ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                      }`}
                  >
                    <SunIcon className="h-3 w-3 text-gray-400" />
                  </span>
                  <span
                    className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${isDarkMode ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                      }`}
                  >
                    <MoonIcon className="h-3 w-3 text-green-600" />
                  </span>
                </span>
              </button>
            </div>
          </div>

        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="text-xl font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          These actions are irreversible. Please be certain before proceeding.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Reset All Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Clear all your financial data and start fresh
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
                  alert('Data reset functionality would be implemented here');
                }
              }}
            >
              Reset Data
            </Button>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion functionality would be implemented here');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 