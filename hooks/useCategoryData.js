// hooks/useCategoryData.js
import { useMemo, useState } from "react";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { TRANSACTION_TYPES } from "@/hooks/useTransactionTypeFilter";
import {
  groupTransactionsByCategory,
  groupTransactionsBySubcategory,
  calculateTotalAmount,
} from "@/utils/transactionUtils";

/**
 * Hook for processing transaction data for category charts
 *
 * @param {Array} transactions - List of filtered transactions (already filtered by date and type)
 * @param {string} transactionType - Type of transactions (expenses or income) - used for UI display
 * @returns {Object} - Data and methods for the category chart
 */
export function useCategoryData(
  transactions = [],
  transactionType = TRANSACTION_TYPES.EXPENSES
) {
  // State for drill-down functionality
  const [currentLevel, setCurrentLevel] = useState("main");
  const [currentCategory, setCurrentCategory] = useState(null);

  // Calculate total amount based on current level and category
  const totalAmount = useMemo(() => {
    if (currentLevel === "main") {
      // Show total of all transactions
      return calculateTotalAmount(transactions);
    } else {
      // Show only total of selected category
      const categoryTransactions = transactions.filter(
        (tx) => tx.category?.id === currentCategory
      );
      return calculateTotalAmount(categoryTransactions);
    }
  }, [transactions, currentLevel, currentCategory]);

  // Calculate chart data based on current level
  const chartData = useMemo(() => {
    if (currentLevel === "main") {
      // First level: main categories
      const categoriesMap = groupTransactionsByCategory(transactions);

      // Convert to format for ECharts and our custom legend
      return Object.keys(categoriesMap).map((categoryId) => {
        const { name, color, IconComponent } = getCategoryInfo(categoryId);
        return {
          value: categoriesMap[categoryId],
          name: name,
          itemStyle: { color },
          categoryId,
          IconComponent, // For our custom legend
        };
      });
    } else {
      // Second level: subcategories
      const subcategoriesMap = groupTransactionsBySubcategory(
        transactions,
        currentCategory
      );

      // Convert to format for ECharts and our custom legend
      return Object.keys(subcategoriesMap).map((subcategoryId) => {
        const { name, color, IconComponent } = getCategoryInfo(
          currentCategory,
          subcategoryId
        );
        return {
          value: subcategoriesMap[subcategoryId],
          name: name,
          itemStyle: { color },
          subcategoryId,
          IconComponent, // For our custom legend
        };
      });
    }
  }, [transactions, currentLevel, currentCategory]);

  // Drill down to subcategory level
  const handleDrillDown = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentLevel("subcategory");
  };

  // Go back to main categories
  const handleBackClick = () => {
    setCurrentLevel("main");
    setCurrentCategory(null);
  };

  // Title text based on current level
  const titleText = useMemo(() => {
    if (currentLevel === "main") {
      return `Total des ${
        transactionType === TRANSACTION_TYPES.EXPENSES ? "dépenses" : "revenus"
      }`;
    } else {
      return getCategoryInfo(currentCategory).name;
    }
  }, [currentLevel, currentCategory, transactionType]);

  return {
    chartData,
    totalAmount,
    titleText,
    currentLevel,
    currentCategory,
    handleDrillDown,
    handleBackClick,
    hasData: transactions.length > 0,
  };
}
