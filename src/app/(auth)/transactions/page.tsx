"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DataTable from "@/components/DataTable";
import { formatCurrency } from "@/types";
import { mockTransactions } from "@/data/mockData";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import TransactionForm from "./TransactionForm";
import { Input, Select, FormGroup } from "@/components/form";
import { showToast } from "nextjs-toast-notify";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
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

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
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
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filteredData = [...mockTransactions];

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
      // Update existing transaction
      const updatedTransactions = transactions.map((t) =>
        t.id === editingTransaction.id
          ? { ...transaction, id: editingTransaction.id }
          : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
    } else {
      // Add new transaction with generated ID
      const newTransaction = {
        ...transaction,
        id: `trans-${Date.now()}`,
      };
      setTransactions([newTransaction, ...transactions]);
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
    setTransactions(transactions.filter((t) => t.id !== id));
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
      render: (transaction: any) =>
        new Date(transaction.date).toLocaleDateString(),
    },
    {
      key: "categoryId",
      header: "Category",
      sortable: true,
      render: (transaction: any) => getCategoryName(transaction.categoryId),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (transaction: any) => (
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
      render: (transaction: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transaction.type === "income"
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
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (transaction: any) => (
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
          Transactions
        </h1>
        <div className="flex space-x-3">
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
        </div>
      </div>

      {/* Filters */}
      {isFilterOpen && (
        <Card>
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
        </Card>
      )}

      {/* Transactions Table */}
      <Card>
        <DataTable
          data={transactions}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No transactions found with the current filters."
        />
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
