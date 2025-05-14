// app/(app)/dashboard/analyse/page.js
"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";
import DateFilter from "@/components/DateFilter";
import CategoryPieChart from "@/components/CategoryPieChart";
import { filterTransactionsByDate } from "@/utils/dateUtils";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { filterTransactionsByType } from "@/utils/transactionUtils";
import { useFiltersStore } from "@/stores/useFiltersStore";

export default function TransactionsPage() {
  const { session } = useAuth();
  const { isDemoMode } = useDemoMode();
  const userId = session?.user?.id;

  // Récupérer l'état et les actions depuis le store Zustand
  const {
    transactionType,
    selectedCategory,
    selectedSubcategory,
    selectedMonth,
    selectedYear,
    clearCategoryFilters,
  } = useFiltersStore();

  // Charger toutes les transactions
  const { transactions, loading, error } = useTransactions(userId);

  // Filtrer les transactions par type (Dépenses/Revenus)
  const filteredByTypeTransactions = useMemo(() => {
    return filterTransactionsByType(transactions, transactionType);
  }, [transactions, transactionType]);

  // Filtrer les transactions par date
  const dateFilteredTransactions = useMemo(() => {
    return filterTransactionsByDate(
      filteredByTypeTransactions,
      selectedMonth,
      selectedYear
    );
  }, [filteredByTypeTransactions, selectedMonth, selectedYear]);

  // Filtrer les transactions par catégorie
  const categoryFilteredTransactions = useMemo(() => {
    if (!selectedCategory) return dateFilteredTransactions;

    return dateFilteredTransactions.filter((transaction) => {
      // Vérifier la catégorie principale
      if (transaction.category?.id !== selectedCategory) return false;

      // Si une sous-catégorie est sélectionnée, filtrer aussi par sous-catégorie
      if (selectedSubcategory) {
        return transaction.category?.subcategory?.id === selectedSubcategory;
      }

      // Si seulement la catégorie principale est sélectionnée
      return true;
    });
  }, [dateFilteredTransactions, selectedCategory, selectedSubcategory]);

  // Obtenir le nombre de transactions après tous les filtres
  const transactionCount = categoryFilteredTransactions.length;

  // Obtenir les informations de la catégorie active (pour l'affichage)
  const activeCategoryInfo = useMemo(() => {
    if (!selectedCategory) return null;

    if (selectedSubcategory) {
      return getCategoryInfo(selectedCategory, selectedSubcategory);
    }

    return getCategoryInfo(selectedCategory);
  }, [selectedCategory, selectedSubcategory]);

  return (
    <div className="flex flex-col h-full">
      {/* Filtres en haut de la page avec taille fixe */}
      <div className="flex-none">
        {/* Filtre par type de transaction */}
        <TransactionTypeFilter />
      </div>
      <div className="mr-auto">
        {/* Filtres de date */}
        <DateFilter />
      </div>

      {/* Conteneur principal qui prend tout l'espace disponible */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(90vh-270px)]">
        {/* Graphique circulaire des catégories */}
        <div className="bg-white rounded-lg p-15 shadow-lg border border-gray-100 overflow-auto">
          <CategoryPieChart transactions={dateFilteredTransactions} />
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

          <div className="text-sm text-gray-500 mb-3">
            Nombre de transactions: {transactionCount}
          </div>

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
