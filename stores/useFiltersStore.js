// stores/useFiltersStore.js
import { create } from "zustand";
import { TRANSACTION_TYPES } from "@/utils/constants";
import { getCurrentMonthAndYear } from "@/utils/dateUtils";

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
}));
