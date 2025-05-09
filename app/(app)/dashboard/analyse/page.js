// app/(app)/dashboard/analyse/page.js
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionTypeFilter } from "@/hooks/useTransactionTypeFilter";
import { useCategoryFilter } from "@/hooks/useCategoryFilter";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";
import DateFilter from "@/components/DateFilter";
import CategoryPieChart from "@/components/CategoryPieChart";
import { formatDate, filterTransactionsByDate } from "@/utils/dateUtils";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryInfo } from "@/utils/categoryUtils";

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

  // Filtrer par catégorie (nouveau)
  const {
    selectedCategory,
    selectedSubcategory,
    selectCategory,
    selectSubcategory,
    clearCategoryFilters,
    filterTransactionsByCategory,
  } = useCategoryFilter();

  // Memoize date-filtered transactions
  const dateFilteredTransactions = useMemo(() => {
    return filterTransactionsByDate(
      filteredTransactions,
      selectedMonth,
      selectedYear
    );
  }, [filteredTransactions, selectedMonth, selectedYear]);

  // Apply category filter after date filter (new)
  const categoryFilteredTransactions = useMemo(() => {
    return filterTransactionsByCategory(dateFilteredTransactions);
  }, [dateFilteredTransactions, filterTransactionsByCategory]);

  // Memoize formatted date for display
  const formattedDate = useMemo(() => {
    return formatDate(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Memoize transaction count for display
  const transactionCount = useMemo(() => {
    return categoryFilteredTransactions.length;
  }, [categoryFilteredTransactions]);

  // Get category info for display (new)
  const activeCategoryInfo = useMemo(() => {
    if (!selectedCategory) return null;

    if (selectedSubcategory) {
      return getCategoryInfo(selectedCategory, selectedSubcategory);
    }

    return getCategoryInfo(selectedCategory);
  }, [selectedCategory, selectedSubcategory]);

  // Handle click on chart slices (new)
  const handleChartSelection = (categoryId, subcategoryId = null) => {
    if (categoryId === null) {
      // Si categoryId est null, on supprime tous les filtres
      clearCategoryFilters();
    } else if (subcategoryId) {
      // Si on a une sous-catégorie, on filtre par catégorie et sous-catégorie
      selectCategory(categoryId);
      selectSubcategory(subcategoryId);
    } else {
      // Sinon, on filtre uniquement par catégorie
      selectCategory(categoryId);
    }
  };

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
        {/* Graphique circulaire des catégories */}
        <div className="bg-white rounded-lg p-15 shadow-lg border border-gray-100 overflow-auto">
          <CategoryPieChart
            transactions={dateFilteredTransactions}
            transactionType={transactionType}
            onSelectCategory={handleChartSelection}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
          />
        </div>

        {/* Liste des transactions */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transactions</h2>

            {/* Afficher le filtre actif et bouton pour l'effacer */}
            {selectedCategory && (
              <div className="flex items-center">
                <div className="flex items-center bg-gray-100 rounded-md py-1 px-3 mr-2">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: activeCategoryInfo?.color }}
                  ></div>
                  <span className="text-sm font-medium">
                    {activeCategoryInfo?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCategoryFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={16} />
                </Button>
              </div>
            )}
          </div>

          {formattedDate && (
            <div className="text-sm text-gray-500 mb-3">
              Nombre de transactions: {transactionCount}
            </div>
          )}

          <TransactionList
            transactions={categoryFilteredTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
