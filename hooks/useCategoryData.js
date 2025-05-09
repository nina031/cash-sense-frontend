// hooks/useCategoryData.js
import { useMemo, useState, useEffect } from "react";
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
 * @param {string} externalSelectedCategory - Category selected from outside the component (optional)
 * @param {string} externalSelectedSubcategory - Subcategory selected from outside the component (optional)
 * @returns {Object} - Data and methods for the category chart
 */
export function useCategoryData(
  transactions = [],
  transactionType = TRANSACTION_TYPES.EXPENSES,
  externalSelectedCategory = null,
  externalSelectedSubcategory = null
) {
  // State for drill-down functionality
  const [currentLevel, setCurrentLevel] = useState("main");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  // Sync with external selected category/subcategory
  useEffect(() => {
    if (externalSelectedCategory) {
      setCurrentCategory(externalSelectedCategory);
      setCurrentLevel("subcategory");

      if (externalSelectedSubcategory) {
        setCurrentSubcategory(externalSelectedSubcategory);
      } else {
        setCurrentSubcategory(null);
      }
    }
  }, [externalSelectedCategory, externalSelectedSubcategory]);

  // Get transactions for current selection
  const filteredTransactions = useMemo(() => {
    if (!currentCategory) return transactions;

    // Filter by main category
    const categoryTransactions = transactions.filter(
      (tx) => tx.category?.id === currentCategory
    );

    // If subcategory is selected, filter further
    if (currentSubcategory) {
      return categoryTransactions.filter(
        (tx) => tx.category?.subcategory?.id === currentSubcategory
      );
    }

    return categoryTransactions;
  }, [transactions, currentCategory, currentSubcategory]);

  // Calculate total amount based on current level and filters
  const totalAmount = useMemo(() => {
    return calculateTotalAmount(filteredTransactions);
  }, [filteredTransactions]);

  // Calculate chart data based on current level and filters
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
      // If a subcategory is selected, only show that one highlighted
      if (currentSubcategory) {
        const allSubcategoriesMap = groupTransactionsBySubcategory(
          transactions.filter((tx) => tx.category?.id === currentCategory),
          currentCategory
        );

        // Create chart data with the selected subcategory highlighted
        return Object.keys(allSubcategoriesMap).map((subcategoryId) => {
          const { name, color, IconComponent } = getCategoryInfo(
            currentCategory,
            subcategoryId
          );

          // Highlight the selected subcategory
          const isSelected = subcategoryId === currentSubcategory;
          const adjustedColor = isSelected ? color : `${color}80`; // Add transparency to non-selected items

          return {
            value: allSubcategoriesMap[subcategoryId],
            name: name,
            itemStyle: {
              color: adjustedColor,
              // Add border or other emphasis to selected item
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? "#fff" : "transparent",
              shadowBlur: isSelected ? 10 : 0,
              shadowColor: isSelected ? "rgba(0, 0, 0, 0.3)" : "transparent",
            },
            subcategoryId,
            IconComponent,
          };
        });
      } else {
        // Normal subcategory view (no specific selection)
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
    }
  }, [transactions, currentLevel, currentCategory, currentSubcategory]);

  // Drill down to subcategory level
  const handleDrillDown = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentLevel("subcategory");
    setCurrentSubcategory(null); // Clear any subcategory selection
  };

  // Select a specific subcategory
  const handleSubcategorySelect = (subcategoryId) => {
    setCurrentSubcategory(subcategoryId);
  };

  // Go back to main categories
  const handleBackClick = () => {
    if (currentSubcategory) {
      // If a subcategory is selected, first clear that selection
      setCurrentSubcategory(null);
    } else {
      // If just at subcategory level, go back to main
      setCurrentLevel("main");
      setCurrentCategory(null);
    }
  };

  // Title text based on current level and selections
  const titleText = useMemo(() => {
    if (currentLevel === "main") {
      return `Total des ${
        transactionType === TRANSACTION_TYPES.EXPENSES ? "dépenses" : "revenus"
      }`;
    } else if (currentSubcategory) {
      return getCategoryInfo(currentCategory, currentSubcategory).name;
    } else {
      return getCategoryInfo(currentCategory).name;
    }
  }, [currentLevel, currentCategory, currentSubcategory, transactionType]);

  return {
    chartData,
    totalAmount,
    titleText,
    currentLevel,
    currentCategory,
    currentSubcategory,
    handleDrillDown,
    handleSubcategorySelect,
    handleBackClick,
    hasData: transactions.length > 0,
  };
}
