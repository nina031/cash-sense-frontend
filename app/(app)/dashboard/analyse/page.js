// app/(app)/dashboard/analyse/page.js
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionTypeFilter } from "@/hooks/useTransactionTypeFilter";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";
import DateFilter from "@/components/DateFilter";
import { formatDate, filterTransactionsByDate } from "@/utils/dateUtils";

export default function TransactionsPage() {
  const { session } = useAuth();
  const { isDemoMode } = useDemoMode();
  const userId = session?.user?.id;

  // États pour les filtres de date
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Charger toutes les transactions
  const { transactions, loading, error } = useTransactions(userId);

  // Filtrer par type (Dépenses/Revenus)
  const { transactionType, setTransactionType, filteredTransactions } =
    useTransactionTypeFilter(transactions);

  // Filtrer par date (Mois/Année) en utilisant notre fonction utilitaire
  const dateFilteredTransactions = filterTransactionsByDate(
    filteredTransactions,
    selectedMonth,
    selectedYear
  );

  // Formater la date pour l'affichage
  const formattedDate = formatDate(selectedMonth, selectedYear);

  return (
    <div>
      {/* Filtre par type de transaction */}
      <TransactionTypeFilter
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />

      {/* Filtres de date */}
      <DateFilter
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        {formattedDate && (
          <div className="text-sm text-gray-500 mb-3">
            Nombre de transactions: {dateFilteredTransactions.length}
          </div>
        )}
        <TransactionList
          transactions={dateFilteredTransactions}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
