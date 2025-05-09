// app/(app)/dashboard/analyse/page.js
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionTypeFilter } from "@/hooks/useTransactionTypeFilter";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";
import DateFilter from "@/components/DateFilter";
import CategoryPieChart from "@/components/CategoryPieChart";
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

  // Memoize date-filtered transactions to avoid unnecessary recalculations
  const dateFilteredTransactions = useMemo(() => {
    return filterTransactionsByDate(
      filteredTransactions,
      selectedMonth,
      selectedYear
    );
  }, [filteredTransactions, selectedMonth, selectedYear]);

  // Memoize formatted date for display
  const formattedDate = useMemo(() => {
    return formatDate(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Memoize transaction count for display
  const transactionCount = useMemo(() => {
    return dateFilteredTransactions.length;
  }, [dateFilteredTransactions]);

  return (
    <div className="flex flex-col h-full">
      {/* Filtres en haut de la page avec taille fixe */}
      <div className="flex-none">
        {/* Filtre par type de transaction */}
        <TransactionTypeFilter
          transactionType={transactionType}
          setTransactionType={setTransactionType}
        />
      </div>
      <div className="mr-auto">
        {/* Filtres de date */}
        <DateFilter
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Conteneur principal qui prend tout l'espace disponible */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(90vh-270px)]">
        {/* Graphique circulaire des catégories - avec les données déjà filtrées */}
        <div className="bg-white rounded-lg p-15 shadow-lg border border-gray-100 overflow-auto">
          <CategoryPieChart
            transactions={dateFilteredTransactions}
            transactionType={transactionType}
          />
        </div>

        {/* Liste des transactions - avec les mêmes données filtrées */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>
          {formattedDate && (
            <div className="text-sm text-gray-500 mb-3">
              Nombre de transactions: {transactionCount}
            </div>
          )}
          <TransactionList
            transactions={dateFilteredTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
