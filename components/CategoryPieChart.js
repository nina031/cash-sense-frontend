// components/CategoryPieChart.js
"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CategoryLegend from "@/components/CategoryLegend";
import ChartTitle from "@/components/ChartTitle";
import { useECharts } from "@/hooks/useECharts";
import { useFiltersStore } from "@/stores/useFiltersStore";
import {
  groupTransactionsByCategory,
  groupTransactionsBySubcategory,
  calculateTotalAmount,
} from "@/utils/transactionUtils";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { TRANSACTION_TYPES } from "@/utils/constants";

/**
 * Component for displaying transaction categories in a pie chart
 * Uses Zustand store for state management
 *
 * @param {Array} transactions - List of transactions already filtered by date and type
 * @returns {React.Component}
 */
export default function CategoryPieChart({ transactions = [] }) {
  // Get state and actions from the store
  const {
    transactionType,
    selectedCategory,
    selectedSubcategory,
    chartLevel,
    handleChartSelection,
    handleBackClick,
  } = useFiltersStore();

  // Calculate total amount
  const totalAmount = useMemo(() => {
    // If we're at the main level, use all transactions
    if (chartLevel === "main") {
      return calculateTotalAmount(transactions);
    }

    // If we're at the subcategory level
    let categoryTransactions = transactions.filter(
      (tx) => tx.category?.id === selectedCategory
    );

    // If a subcategory is selected, filter further
    if (selectedSubcategory) {
      categoryTransactions = categoryTransactions.filter(
        (tx) => tx.category?.subcategory?.id === selectedSubcategory
      );
    }

    return calculateTotalAmount(categoryTransactions);
  }, [transactions, chartLevel, selectedCategory, selectedSubcategory]);

  // Generate chart data based on current level and filters
  const chartData = useMemo(() => {
    if (chartLevel === "main") {
      // First level: main categories
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
    } else {
      // Second level: subcategories
      // If a subcategory is selected, only show that one highlighted
      const subcategoriesMap = groupTransactionsBySubcategory(
        transactions,
        selectedCategory
      );

      return Object.keys(subcategoriesMap)
        .filter((subcategoryId) => subcategoriesMap[subcategoryId] > 0)
        .map((subcategoryId) => {
          const { name, color, IconComponent } = getCategoryInfo(
            selectedCategory,
            subcategoryId
          );

          // Highlight the selected subcategory if any
          const isSelected = subcategoryId === selectedSubcategory;
          const adjustedColor =
            selectedSubcategory && !isSelected ? `${color}80` : color;

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
  }, [transactions, chartLevel, selectedCategory, selectedSubcategory]);

  // Title text based on current level and selections
  const titleText = useMemo(() => {
    if (chartLevel === "main") {
      return `Total des ${
        transactionType === TRANSACTION_TYPES.EXPENSES ? "dépenses" : "revenus"
      }`;
    } else if (selectedSubcategory) {
      return getCategoryInfo(selectedCategory, selectedSubcategory).name;
    } else if (selectedCategory) {
      return getCategoryInfo(selectedCategory).name;
    } else {
      return "Toutes les transactions";
    }
  }, [chartLevel, selectedCategory, selectedSubcategory, transactionType]);

  // Handle click on chart slices
  const handleChartClick = useCallback(
    (data) => {
      if (chartLevel === "main" && data.categoryId) {
        // Select the category
        handleChartSelection(data.categoryId);
      } else if (chartLevel === "subcategory" && data.subcategoryId) {
        // Select the subcategory
        handleChartSelection(selectedCategory, data.subcategoryId);
      }
    },
    [chartLevel, selectedCategory, handleChartSelection]
  );

  // Handle click on legend items
  const handleLegendClick = useCallback(
    (categoryId, subcategoryId = null) => {
      if (chartLevel === "main" && categoryId) {
        handleChartSelection(categoryId);
      } else if (subcategoryId) {
        handleChartSelection(selectedCategory, subcategoryId);
      }
    },
    [chartLevel, selectedCategory, handleChartSelection]
  );

  // Initialize ECharts
  const { chartRef, chartContainerRef } = useECharts(
    chartData,
    handleChartClick,
    transactions.length > 0
  );

  // Render back button only in subcategory view
  const renderBackButton = useCallback(() => {
    if (chartLevel !== "subcategory") return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackClick}
        className="flex items-center mb-2 bg-gray-100 hover:bg-gray-200"
      >
        <ChevronLeft className="mr-1" size={16} />
        Retour
      </Button>
    );
  }, [chartLevel, handleBackClick]);

  return (
    <div ref={chartContainerRef} className="w-full">
      {/* Back button (only visible in subcategory mode) */}
      {renderBackButton()}

      {/* Chart and legend side by side */}
      <div className="flex flex-row">
        {/* Legend on the left */}
        <div className="flex items-center">
          <CategoryLegend
            data={chartData}
            onItemClick={handleLegendClick}
            currentLevel={chartLevel}
            selectedSubcategoryId={selectedSubcategory}
          />
        </div>

        {/* Pie chart on the right with aligned title */}
        <div className="w-2/3">
          {/* Title and amount aligned with the chart */}
          <div>
            <ChartTitle title={titleText} amount={totalAmount} />

            {/* Chart */}
            <div
              ref={chartRef}
              style={{ height: "300px", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
