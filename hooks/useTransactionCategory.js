// hooks/useTransactionCategory.js
import { useMemo } from "react";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { useFiltersStore } from "@/stores/useFiltersStore";

/**
 * Hook to get category information for a transaction
 * Shows main category icon when no category filter is active
 * Shows subcategory icon when a category filter is active
 *
 * @param {Object} transaction - Transaction data
 * @returns {Object} Category information (color, icon, name)
 */
export function useTransactionCategory(transaction) {
  // Get current filter state from the store
  const { selectedCategory } = useFiltersStore();

  return useMemo(() => {
    const categoryId = transaction?.category?.id;
    const subcategoryId = transaction?.category?.subcategory?.id;

    // If a category filter is active, show subcategory icon
    if (selectedCategory) {
      return getCategoryInfo(categoryId, subcategoryId);
    }

    // Otherwise, only show main category icon
    return getCategoryInfo(categoryId);
  }, [transaction?.category, selectedCategory]);
}
