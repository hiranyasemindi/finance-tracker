"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Account, formatCurrency } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AccountForm from './AccountForm';
import { showToast } from 'nextjs-toast-notify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setAccounts(data);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error fetching accounts:', error);
        showToast.error(`Error fetching accounts`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Group accounts by type
  const accountsByType = accounts.reduce((acc: Record<string, any[]>, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {});

  // Handle add/edit account
  const handleAddAccount = (account: any) => {
    if (editingAccount) {
      // Update existing account
      fetch(`/api/accounts/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error updating account:', data.error);
          } else {
            // const updatedAccounts = accounts.map(a =>
            //   a.id === editingAccount.id ? { ...account, id: editingAccount.id } : a
            // );
            // setAccounts(updatedAccounts);
            setAccounts(accounts.map(a =>
              a.id === editingAccount.id ? data : a
            ));
            setEditingAccount(null);
            setIsFormOpen(false);
            showToast.success(`Account updated successfully`, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          }
        })
        .catch(error => {
          console.error('Error updating account:', error);
          showToast.error(`Error updating account`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        });
    } else {
      // Add new account with generated ID
      fetch('/api/accounts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error adding account:', data.error);
          } else {
            setAccounts([...accounts, data]);
            showToast.success(`Account added successfully`, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          }
        })
        .catch(error => {
          console.error('Error adding account:', error);
          showToast.error(`Error adding account`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        });
    }
    setIsFormOpen(false);
    setEditingAccount(null);
  };

  // Handle delete account
  const handleDeleteAccount = (id: string) => {
    fetch('/api/accounts/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error deleting account:', data.error);
          
          // Display a more user-friendly error message for foreign key constraints
          if (data.type === "FOREIGN_KEY_CONSTRAINT") {
            showToast.error(data.error, {
              duration: 5000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          } else {
            showToast.error(`Error deleting account`, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          }
        } else {
          setAccounts(accounts.filter(account => account.id !== id));
          showToast.success(`Account deleted successfully`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        }
      })
      .catch(error => {
        showToast.error(`Error deleting account`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      });
  };

  // Get account type display name
  const getAccountTypeDisplay = (type: string) => {
    const typeLabels: Record<string, string> = {
      'bank': 'Bank Accounts',
      'cash': 'Cash & Wallets',
      'credit': 'Credit Cards',
      'investment': 'Investment Accounts',
      'other': 'Other Accounts',
    };
    return typeLabels[type] || 'Accounts';
  };

  // Get account type icon color
  const getAccountTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'bank': 'bg-blue-500',
      'cash': 'bg-green-500',
      'credit': 'bg-red-500',
      'investment': 'bg-purple-500',
      'other': 'bg-gray-500',
    };
    return colorMap[type] || 'bg-gray-500';
  };

  // Get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'cash':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'credit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'investment':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Skeleton loading components
  const renderSkeletonCards = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <Card key={index}>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Skeleton circle width={40} height={40} className="mr-3" />
            <div>
              <Skeleton width={120} height={20} className="mb-2" />
              <Skeleton width={80} height={24} />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton circle width={20} height={20} />
            <Skeleton circle width={20} height={20} />
          </div>
        </div>
      </Card>
    ));
  };

  const renderSkeletonGroups = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="space-y-4">
        <Skeleton width={150} height={24} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSkeletonCards(2)}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accounts</h1>
        <Button
          onClick={() => {
            setEditingAccount(null);
            setIsFormOpen(true);
          }}
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Total Balance Summary */}
      {loading ? (
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="flex flex-col items-center">
            <Skeleton width={120} height={24} className="bg-blue-400" />
            <Skeleton width={150} height={36} className="mt-2 bg-blue-400" />
            <Skeleton width={180} height={16} className="mt-2 bg-blue-400" />
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium">Total Balance</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalBalance)}</p>
            <p className="text-sm mt-2 opacity-80">Across {accounts.length} accounts</p>
          </div>
        </Card>
      )}

      {/* Accounts by Type */}
      {loading ? (
        renderSkeletonGroups()
      ) : Object.keys(accountsByType).length > 0 ? (
        Object.keys(accountsByType).map(type => (
          <div key={type} className="space-y-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              {getAccountTypeDisplay(type)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountsByType[type].map(account => (
                <Card key={account.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`rounded-full p-2 ${getAccountTypeColor(account.type)} text-white mr-3`}>
                        {getAccountTypeIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{account.name}</h3>
                        <p className={`text-lg font-bold ${account.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                          }`}>
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingAccount(account);
                          setIsFormOpen(true);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Card className="py-12">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No accounts added yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start by adding your bank accounts, wallets, or credit cards.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => {
                  setEditingAccount(null);
                  setIsFormOpen(true);
                }}
              >
                <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
                Add Account
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Account Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <AccountForm
                onSubmit={handleAddAccount}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingAccount(null);
                }}
                initialData={editingAccount}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
