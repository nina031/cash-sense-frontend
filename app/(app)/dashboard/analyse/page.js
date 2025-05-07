// app/(app)/dashboard/analyse/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionTypeFilter } from "@/hooks/useTransactionTypeFilter";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";

export default function TransactionsPage() {
  const { isDemoMode } = useDemoMode();
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Charger les transactions
  const { transactions, loading, error } = useTransactions(userId);

  // Utiliser notre hook de filtrage par type
  const { transactionType, setTransactionType, filteredTransactions } =
    useTransactionTypeFilter(transactions);

  return (
    <div>
      {/* Filtre par type de transaction (Dépenses/Revenus) */}
      <TransactionTypeFilter
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <TransactionList
          transactions={filteredTransactions}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
