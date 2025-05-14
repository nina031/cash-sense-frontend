// stores/useFiltersStore.js
import { create } from "zustand";
import { TRANSACTION_TYPES } from "@/utils/constants";
import { getCurrentMonthAndYear } from "@/utils/dateUtils";
import {
  groupTransactionsByCategory,
  groupTransactionsBySubcategory,
  calculateTotalAmount,
} from "@/utils/transactionUtils";
import { getCategoryInfo } from "@/utils/categoryUtils";

// Récupérer les valeurs par défaut pour le mois et l'année
const { month: defaultMonth, year: defaultYear } = getCurrentMonthAndYear();

// Création du store pour les filtres d'analyse
export const useFiltersStore = create((set, get) => ({
  // État initial
  transactionType: TRANSACTION_TYPES.EXPENSES, // Par défaut sur "Dépenses"
  selectedCategory: null,
  selectedSubcategory: null,
  selectedMonth: defaultMonth,
  selectedYear: defaultYear,

  // État spécifique au graphique
  chartLevel: "main", // "main" ou "subcategory"

  // Actions qui modifient l'état
  setTransactionType: (type) =>
    set({
      transactionType: type,
      // Réinitialiser les filtres de catégorie lorsqu'on change le type de transaction
      selectedCategory: null,
      selectedSubcategory: null,
      chartLevel: "main",
    }),

  // Définir une catégorie (réinitialise la sous-catégorie et change le niveau du graphique)
  selectCategory: (categoryId) =>
    set({
      selectedCategory: categoryId,
      selectedSubcategory: null,
      // Si une catégorie est sélectionnée, on passe en niveau sous-catégorie
      chartLevel: categoryId ? "subcategory" : "main",
    }),

  // Définir une sous-catégorie
  selectSubcategory: (subcategoryId) =>
    set({
      selectedSubcategory: subcategoryId,
      // On reste au niveau sous-catégorie
      chartLevel: "subcategory",
    }),

  // Définir le mois
  setSelectedMonth: (month) =>
    set({
      selectedMonth: month,
    }),

  // Définir l'année
  setSelectedYear: (year) =>
    set({
      selectedYear: year,
    }),

  // Effacer les filtres de catégorie et revenir au niveau principal
  clearCategoryFilters: () =>
    set({
      selectedCategory: null,
      selectedSubcategory: null,
      chartLevel: "main",
    }),

  // Effacer tous les filtres (conserve le type de transaction)
  clearAllFilters: () => {
    const { month, year } = getCurrentMonthAndYear();
    set({
      selectedCategory: null,
      selectedSubcategory: null,
      selectedMonth: month,
      selectedYear: year,
      chartLevel: "main",
    });
  },

  // Sélectionner une catégorie depuis le graphique (peut inclure une sous-catégorie)
  handleChartSelection: (categoryId, subcategoryId = null) => {
    if (categoryId === null) {
      // Si categoryId est null, on supprime tous les filtres
      set({
        selectedCategory: null,
        selectedSubcategory: null,
        chartLevel: "main",
      });
    } else if (subcategoryId) {
      // Si on a une sous-catégorie, on filtre par catégorie et sous-catégorie
      set({
        selectedCategory: categoryId,
        selectedSubcategory: subcategoryId,
        chartLevel: "subcategory",
      });
    } else {
      // Sinon, on filtre uniquement par catégorie
      set({
        selectedCategory: categoryId,
        selectedSubcategory: null,
        chartLevel: "subcategory",
      });
    }
  },

  // Gérer le clic sur le bouton Retour
  handleBackClick: () => {
    const state = get();
    if (state.selectedSubcategory) {
      // Si une sous-catégorie est sélectionnée, on enlève juste la sous-catégorie
      set({
        selectedSubcategory: null,
      });
    } else if (state.selectedCategory) {
      // Si seulement une catégorie est sélectionnée, on revient au niveau principal
      set({
        selectedCategory: null,
        chartLevel: "main",
      });
    }
  },

  // NOUVELLES FONCTIONS AJOUTÉES

  // Gérer le clic sur une section du graphique
  handleChartClick: (data) => {
    const state = get();
    if (state.chartLevel === "main" && data.categoryId) {
      // Sélectionner la catégorie
      get().handleChartSelection(data.categoryId);
    } else if (state.chartLevel === "subcategory" && data.subcategoryId) {
      // Sélectionner la sous-catégorie
      get().handleChartSelection(state.selectedCategory, data.subcategoryId);
    }
  },

  // Gérer le clic sur un élément de la légende
  handleLegendClick: (categoryId, subcategoryId = null) => {
    const state = get();
    if (state.chartLevel === "main" && categoryId) {
      get().handleChartSelection(categoryId);
    } else if (subcategoryId) {
      get().handleChartSelection(state.selectedCategory, subcategoryId);
    }
  },

  // Calculer le titre du graphique en fonction des sélections actuelles
  getChartTitle: () => {
    const state = get();
    if (state.chartLevel === "main") {
      return `Total des ${
        state.transactionType === TRANSACTION_TYPES.EXPENSES
          ? "dépenses"
          : "revenus"
      }`;
    } else if (state.selectedSubcategory) {
      return getCategoryInfo(state.selectedCategory, state.selectedSubcategory)
        .name;
    } else if (state.selectedCategory) {
      return getCategoryInfo(state.selectedCategory).name;
    } else {
      return "Toutes les transactions";
    }
  },

  // Calculer le montant total en fonction des sélections actuelles et des transactions
  calculateTotalAmount: (transactions) => {
    const state = get();

    // Si nous sommes au niveau principal, utiliser toutes les transactions
    if (state.chartLevel === "main") {
      return calculateTotalAmount(transactions);
    }

    // Si nous sommes au niveau sous-catégorie
    let categoryTransactions = transactions.filter(
      (tx) => tx.category?.id === state.selectedCategory
    );

    // Si une sous-catégorie est sélectionnée, filtrer davantage
    if (state.selectedSubcategory) {
      categoryTransactions = categoryTransactions.filter(
        (tx) => tx.category?.subcategory?.id === state.selectedSubcategory
      );
    }

    return calculateTotalAmount(categoryTransactions);
  },
}));
