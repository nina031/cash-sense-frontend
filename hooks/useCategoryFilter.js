// hooks/useCategoryFilter.js
import { useState } from "react";

/**
 * Hook to manage category and subcategory filtering
 *
 * @returns {Object} Filter state and methods
 */
export function useCategoryFilter() {
  // Store the active filter state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Functions to set filters
  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when changing category
  };

  const selectSubcategory = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Function to clear filters
  const clearCategoryFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  // Function to filter transactions by selected category/subcategory
  const filterTransactionsByCategory = (transactions) => {
    if (!selectedCategory) return transactions;

    return transactions.filter((transaction) => {
      // Check main category
      if (transaction.category?.id !== selectedCategory) return false;

      // If a subcategory is selected, also filter by subcategory
      if (selectedSubcategory) {
        return transaction.category?.subcategory?.id === selectedSubcategory;
      }

      // If only category is selected, return all transactions from this category
      return true;
    });
  };

  return {
    selectedCategory,
    selectedSubcategory,
    selectCategory,
    selectSubcategory,
    clearCategoryFilters,
    filterTransactionsByCategory,
  };
}
