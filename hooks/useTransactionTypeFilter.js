// hooks/useTransactionTypeFilter.js
import { useState, useMemo } from "react";
import { filterTransactionsByType } from "@/utils/transactionUtils";

export const TRANSACTION_TYPES = {
  EXPENSES: "Dépenses",
  INCOME: "Revenus",
};

/**
 * Hook to filter transactions by type (expenses or income)
 *
 * @param {Array} transactions - List of transactions to filter
 * @returns {Object} - Transaction type state and filtered transactions
 */
export function useTransactionTypeFilter(transactions = []) {
  const [transactionType, setTransactionType] = useState(
    TRANSACTION_TYPES.EXPENSES
  );

  // Memoize the filtered transactions to avoid unnecessary re-renders
  const filteredTransactions = useMemo(
    () => filterTransactionsByType(transactions, transactionType),
    [transactions, transactionType]
  );

  return {
    transactionType,
    setTransactionType,
    filteredTransactions,
    TRANSACTION_TYPES,
  };
}
