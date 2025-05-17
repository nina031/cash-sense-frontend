// stores/selectors.js
import { useTransactionsStore } from "./useTransactionsStore";
import { useFiltersStore } from "./useFiltersStore";
import { filterTransactionsByType } from "@/utils/transactionUtils";
import { filterTransactionsByDate } from "@/utils/dateUtils";
import { getCategoryInfo } from "@/utils/categoryUtils";

export const useFilteredTransactions = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const {
    transactionType,
    selectedMonth,
    selectedYear,
    selectedCategory,
    selectedSubcategory,
  } = useFiltersStore();

  // Utilisons les fonctions de filtrage existantes
  const filteredByType = filterTransactionsByType(
    transactions,
    transactionType
  );
  const filteredByDate = filterTransactionsByDate(
    filteredByType,
    selectedMonth,
    selectedYear
  );

  // Filtrer par catégorie si nécessaire
  if (!selectedCategory) return filteredByDate;

  return filteredByDate.filter((transaction) => {
    // Vérifier la catégorie principale
    if (transaction.category?.id !== selectedCategory) return false;

    // Si une sous-catégorie est sélectionnée, filtrer aussi par sous-catégorie
    if (selectedSubcategory) {
      return transaction.category?.subcategory?.id === selectedSubcategory;
    }

    // Si seulement la catégorie principale est sélectionnée
    return true;
  });
};

// Sélecteur pour obtenir le nombre de transactions filtrées
export const useFilteredTransactionsCount = () => {
  const filteredTransactions = useFilteredTransactions();
  return filteredTransactions.length;
};

// Sélecteur pour obtenir les informations de la catégorie active
export const useActiveCategoryInfo = () => {
  const { selectedCategory, selectedSubcategory } = useFiltersStore();

  if (!selectedCategory) return null;

  if (selectedSubcategory) {
    return getCategoryInfo(selectedCategory, selectedSubcategory);
  }

  return getCategoryInfo(selectedCategory);
};
