// hooks/useCategoryChartData.js
import { useMemo } from "react";
import { useFiltersStore } from "@/stores/useFiltersStore";
import {
  groupTransactionsByCategory,
  groupTransactionsBySubcategory,
} from "@/utils/transactionUtils";
import { getCategoryInfo } from "@/utils/categoryUtils";

/**
 * Hook that prepares and formats chart data for the CategoryPieChart component
 *
 * @param {Array} transactions - List of transactions to analyze
 * @returns {Object} - Formatted chart data, title text, and total amount
 */
export function useCategoryChartData(transactions = []) {
  // Get state and functions from the store
  const {
    chartLevel,
    selectedCategory,
    selectedSubcategory,
    getChartTitle,
    calculateTotalAmount,
  } = useFiltersStore();

  // Calculate total amount based on current selection level
  const totalAmount = useMemo(() => {
    return calculateTotalAmount(transactions);
  }, [transactions, calculateTotalAmount]);

  // Generate chart data based on current level and filters
  const chartData = useMemo(() => {
    if (chartLevel === "main") {
      // First level: main categories
      return generateMainCategoryData(transactions);
    } else {
      // Second level: subcategories
      return generateSubcategoryData(
        transactions,
        selectedCategory,
        selectedSubcategory
      );
    }
  }, [transactions, chartLevel, selectedCategory, selectedSubcategory]);

  // Title text based on current level and selections
  const titleText = useMemo(() => {
    return getChartTitle();
  }, [getChartTitle]);

  return {
    chartData,
    titleText,
    totalAmount,
  };
}

/**
 * Generates chart data for main categories
 *
 * @param {Array} transactions - List of transactions
 * @returns {Array} - Formatted chart data
 */
function generateMainCategoryData(transactions) {
  const categoriesMap = groupTransactionsByCategory(transactions);

  // Convert to format for ECharts and our custom legend
  return Object.keys(categoriesMap)
    .filter((categoryId) => categoriesMap[categoryId] > 0)
    .map((categoryId) => {
      const { name, color, IconComponent } = getCategoryInfo(categoryId);
      return {
        value: categoriesMap[categoryId],
        name: name,
        itemStyle: { color },
        categoryId,
        IconComponent, // For our custom legend
      };
    });
}

/**
 * Generates chart data for subcategories
 *
 * @param {Array} transactions - List of transactions
 * @param {string} categoryId - Selected category ID
 * @param {string} selectedSubcategoryId - Selected subcategory ID
 * @returns {Array} - Formatted chart data
 */
function generateSubcategoryData(
  transactions,
  categoryId,
  selectedSubcategoryId
) {
  const subcategoriesMap = groupTransactionsBySubcategory(
    transactions,
    categoryId
  );

  return Object.keys(subcategoriesMap)
    .filter((subcategoryId) => subcategoriesMap[subcategoryId] > 0)
    .map((subcategoryId) => {
      const { name, color, IconComponent } = getCategoryInfo(
        categoryId,
        subcategoryId
      );

      // Highlight the selected subcategory if any
      const isSelected = subcategoryId === selectedSubcategoryId;
      const adjustedColor =
        selectedSubcategoryId && !isSelected ? `${color}80` : color;

      return {
        value: subcategoriesMap[subcategoryId],
        name: name,
        itemStyle: {
          color: adjustedColor,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? "#fff" : "transparent",
          shadowBlur: isSelected ? 10 : 0,
          shadowColor: isSelected ? "rgba(0, 0, 0, 0.3)" : "transparent",
        },
        subcategoryId,
        IconComponent,
      };
    });
}
