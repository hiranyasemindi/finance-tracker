"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DataTable from "@/components/DataTable";
import { formatCurrency, Transaction } from "@/types";
import { mockTransactions } from "@/data/mockData";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import TransactionForm from "./TransactionForm";
import { Input, Select, FormGroup } from "@/components/form";
import { showToast } from "nextjs-toast-notify";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialTransactions, setInitialTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  type Category = { id: string; name: string };
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterAmount, setFilterAmount] = useState<{
    min: string;
    max: string;
  }>({ min: "", max: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategoriesLoading(false);
        console.log("Categories:", data);
        if (data.error) {
          console.error(data.error);
          showToast.error(`Error fetching categories`, {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: "",
            sound: true,
          });
          return;
        }
        setCategories(data);
      })
      .catch((error) => {
        setCategoriesLoading(false);
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        console.log("Transactions:", data);
        setTransactions(data);
        setInitialTransactions(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching transactions:", error);
        showToast.error(`Error fetching transactions`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: "",
          sound: true,
        });
      });
  }, [])

  // Apply filters
  useEffect(() => {
    let filteredData = [...initialTransactions];

    // Filter by transaction type
    if (filterType !== "all") {
      filteredData = filteredData.filter((t) => t.type === filterType);
    }

    // Filter by category
    if (filterCategory !== "all") {
      filteredData = filteredData.filter(
        (t) => t.categoryId === filterCategory
      );
    }

    // Filter by date range
    if (filterDateFrom) {
      filteredData = filteredData.filter(
        (t) => new Date(t.date) >= new Date(filterDateFrom)
      );
    }

    if (filterDateTo) {
      filteredData = filteredData.filter(
        (t) => new Date(t.date) <= new Date(filterDateTo)
      );
    }

    // Filter by amount range
    if (filterAmount.min) {
      filteredData = filteredData.filter(
        (t) => t.amount >= Number(filterAmount.min)
      );
    }

    if (filterAmount.max) {
      filteredData = filteredData.filter(
        (t) => t.amount <= Number(filterAmount.max)
      );
    }

    setTransactions(filteredData);
  }, [filterType, filterCategory, filterDateFrom, filterDateTo, filterAmount]);

  // Handle new transaction
  const handleAddTransaction = (transaction: any) => {
    if (editingTransaction) {
      fetch("/api/transactions/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            showToast.error(data.error, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: "",
              sound: true,
            })
            return
          }
          setTransactions((prevTransactions) =>
            prevTransactions.map((t) =>
              t.id === editingTransaction.id ? transaction : t
            )
          );
          showToast.success("Transaction updated successfully", {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: "",
            sound: true,
          })
          setEditingTransaction(null);
          setIsFormOpen(false);
        })
        .catch((error) => {
          console.error("Error updating transaction:", error);
          showToast.error("Error updating transaction", {
            duration: 3000,
            progress: true,
            position: "top-right",
            transition: "bounceIn",
            icon: "",
            sound: true,
          })
        });
      // Update existing transaction
      // const updatedTransactions = transactions.map((t) =>
      //   t.id === editingTransaction.id
      //     ? { ...transaction, id: editingTransaction.id }
      //     : t
      // );
      // setTransactions(updatedTransactions);
      // setEditingTransaction(null);
    } else {
      // Add new transaction with generated ID
      fetch("/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            showToast.error(data.error, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            })
            return
          }

          if (data.message) {
            setTransactions([...transactions, data.transaction]);
            showToast.success(data.message, {
              duration: 3000,
              progress: true,
              position: "top-right",
              transition: "bounceIn",
              icon: '',
              sound: true,
            })
          }
        })
        .catch((error) => {
          console.error("Error adding transaction:", error);
          showToast.error(`Error adding transaction`, {
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
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    fetch("/api/transactions/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
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
        setTransactions(transactions.filter((t) => t.id !== id));
        showToast.success("Transaction deleted successfully", {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      })
      .catch((error) => {
        console.error("Error deleting transaction:", error);
        showToast.error(`Error deleting transaction`, {
          duration: 3000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      });

  };

  // Reset filters
  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterAmount({ min: "", max: "" });
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // DataTable columns
  const columns = [
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (transaction: any) => loading ? (
        <Skeleton width={80} />
      ) : (
        new Date(transaction.date).toLocaleDateString()
      ),
    },
    {
      key: "categoryId",
      header: "Category",
      sortable: true,
      render: (transaction: any) => loading || categoriesLoading ? (
        <Skeleton width={100} />
      ) : (
        getCategoryName(transaction.categoryId)
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (transaction: any) => loading ? (
        <Skeleton width={60} />
      ) : (
        <span
          className={
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }
        >
          {formatCurrency(transaction.amount)}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (transaction: any) => loading ? (
        <Skeleton width={70} />
      ) : (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === "income"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {transaction.type === "income" ? "Income" : "Expense"}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      sortable: false,
      render: (transaction: any) => loading ? (
        <Skeleton width={120} />
      ) : (
        transaction.notes
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (transaction: any) => loading ? (
        <div className="flex space-x-2">
          <Skeleton width={60} height={32} />
          <Skeleton width={70} height={32} />
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditTransaction(transaction)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteTransaction(transaction.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {loading ? <Skeleton width={150} /> : "Transactions"}
        </h1>
        <div className="flex space-x-3">
          {loading ? (
            <>
              <Skeleton width={100} height={36} />
              <Skeleton width={150} height={36} />
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="secondary"
                className="flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </Button>
              <Button
                onClick={() => {
                  setEditingTransaction(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Transaction
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <Card>
          {categoriesLoading ? (
            <div className="space-y-4">
              <Skeleton height={40} count={6} />
            </div>
          ) : (
            <FormGroup grid cols={2} gap={4}>
              {/* Type Filter */}
              <Select
                id="type-filter"
                label="Transaction Type"
                value={filterType}
                onChange={(value) => setFilterType(value)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
              />

              {/* Category Filter */}
              <Select
                id="category-filter"
                label="Category"
                value={filterCategory}
                onChange={(value) => setFilterCategory(value)}
                options={[
                  { value: "all", label: "All Categories" },
                  ...categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  })),
                ]}
              />

              {/* Date Range Filter */}
              <Input
                type="date"
                id="date-from"
                label="Date From"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />

              <Input
                type="date"
                id="date-to"
                label="Date To"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />

              {/* Amount Range Filter */}
              <Input
                type="number"
                id="amount-min"
                label="Min Amount"
                value={filterAmount.min}
                onChange={(e) =>
                  setFilterAmount({ ...filterAmount, min: e.target.value })
                }
                placeholder="0"
              />

              <Input
                type="number"
                id="amount-max"
                label="Max Amount"
                value={filterAmount.max}
                onChange={(e) =>
                  setFilterAmount({ ...filterAmount, max: e.target.value })
                }
                placeholder="9999"
              />

              {/* Reset button spans 2 columns */}
              <div className="md:col-span-2 flex justify-end">
                <Button variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </FormGroup>
          )}
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        {loading ? (
          <div className="space-y-4">
            {/* Table header skeleton */}
            <div className="flex justify-between items-center pb-4">
              <Skeleton width={120} height={20} />
              <Skeleton width={80} height={20} />
            </div>
            {/* Table rows skeleton */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex justify-between py-3 border-b border-gray-200">
                <Skeleton width={80} />
                <Skeleton width={100} />
                <Skeleton width={60} />
                <Skeleton width={70} />
                <Skeleton width={120} />
                <div className="flex space-x-2">
                  <Skeleton width={60} height={32} />
                  <Skeleton width={70} height={32} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            data={transactions}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No transactions found with the current filters."
          />
        )}
      </Card>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingTransaction
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </h2>
              <TransactionForm
                onSubmit={handleAddTransaction}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingTransaction(null);
                }}
                initialData={editingTransaction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
