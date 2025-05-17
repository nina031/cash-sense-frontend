// app/(app)/dashboard/analyse/page.js
"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TransactionList from "@/components/TransactionList";
import TransactionTypeFilter from "@/components/TransactionTypeFilter";
import DateFilter from "@/components/DateFilter";
import CategoryPieChart from "@/components/CategoryPieChart";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTransactionButton from "@/components/AddTransactionButton";

// Nouveaux imports
import { useTransactionsStore } from "@/stores/useTransactionsStore";
import { useDemoModeStore } from "@/stores/useDemoModeStore";
import { useFiltersStore } from "@/stores/useFiltersStore";
import {
  useFilteredTransactions,
  useFilteredTransactionsCount,
  useActiveCategoryInfo,
} from "@/stores/selectors";

export default function TransactionsPage() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Utiliser les nouveaux stores avec sélecteurs individuels
  // C'est important de sélectionner chaque état séparément pour éviter les boucles infinies
  const fetchTransactions = useTransactionsStore(
    (state) => state.fetchTransactions
  );
  const loading = useTransactionsStore((state) => state.loading);
  const error = useTransactionsStore((state) => state.error);

  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);
  const selectedCategory = useFiltersStore((state) => state.selectedCategory);
  const clearCategoryFilters = useFiltersStore(
    (state) => state.clearCategoryFilters
  );

  // Utiliser les sélecteurs
  const filteredTransactions = useFilteredTransactions();
  const transactionCount = useFilteredTransactionsCount();
  const activeCategoryInfo = useActiveCategoryInfo();

  // Charger les transactions au montage
  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);

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
          <CategoryPieChart transactions={filteredTransactions} />
        </div>

        {/* Liste des transactions */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Transactions</h2>

            {/* Partie droite avec filtre actif et/ou bouton d'ajout */}
            <div className="flex items-center gap-2">
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

              {/* Bouton d'ajout de transaction - n'apparaît pas en mode démo */}
              {!isDemoMode && userId && <AddTransactionButton />}
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-3">
            Nombre de transactions: {transactionCount}
          </div>

          <TransactionList
            transactions={filteredTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
