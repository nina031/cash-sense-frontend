// hooks/useTransactionTypeFilter.js
import { useState } from "react";

export const TRANSACTION_TYPES = {
  EXPENSES: "Dépenses",
  INCOME: "Revenus",
};

export function useTransactionTypeFilter(transactions = []) {
  const [transactionType, setTransactionType] = useState(
    TRANSACTION_TYPES.EXPENSES
  );

  // Filtrer les transactions selon le type sélectionné
  const filteredTransactions = transactions.filter((transaction) => {
    if (transactionType === TRANSACTION_TYPES.EXPENSES) {
      return transaction.amount > 0; // Dépenses: montant positif
    } else if (transactionType === TRANSACTION_TYPES.INCOME) {
      return transaction.amount < 0; // Revenus: montant négatif
    }
    return true;
  });

  return {
    transactionType,
    setTransactionType,
    filteredTransactions,
    TRANSACTION_TYPES,
  };
}
