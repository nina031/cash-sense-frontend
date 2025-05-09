// components/CategoryPieChart.js
"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CategoryLegend from "@/components/CategoryLegend";
import ChartTitle from "@/components/ChartTitle";
import { useCategoryData } from "@/hooks/useCategoryData";
import { useECharts } from "@/hooks/useECharts";

/**
 * Component for displaying transaction categories in a pie chart
 *
 * @param {Array} transactions - List of transactions already filtered by date and type
 * @param {string} transactionType - Type of transactions (expenses or income)
 * @param {Function} onSelectCategory - Callback for category selection
 * @param {string} selectedCategory - Currently selected category ID
 * @param {string} selectedSubcategory - Currently selected subcategory ID
 * @returns {React.Component}
 */
export default function CategoryPieChart({
  transactions = [],
  transactionType,
  onSelectCategory = () => {},
  selectedCategory = null,
  selectedSubcategory = null,
}) {
  // Get data and methods from custom hooks
  const {
    chartData,
    totalAmount,
    titleText,
    currentLevel,
    currentCategory,
    currentSubcategory,
    handleDrillDown,
    handleSubcategorySelect,
    handleBackClick,
    hasData,
  } = useCategoryData(
    transactions,
    transactionType,
    selectedCategory,
    selectedSubcategory
  );

  // Handle click on chart slices
  const handleChartClick = useCallback(
    (data) => {
      if (currentLevel === "main" && data.categoryId) {
        // Call the drill down internally for chart navigation
        handleDrillDown(data.categoryId);

        // Notify the parent component about the selection
        onSelectCategory(data.categoryId);
      } else if (currentLevel === "subcategory" && data.subcategoryId) {
        // Select the subcategory internally
        handleSubcategorySelect(data.subcategoryId);

        // Notify the parent component about subcategory selection
        onSelectCategory(currentCategory, data.subcategoryId);
      }
    },
    [
      currentLevel,
      currentCategory,
      handleDrillDown,
      handleSubcategorySelect,
      onSelectCategory,
    ]
  );

  // Handle click on legend items
  const handleLegendClick = useCallback(
    (categoryId, subcategoryId = null) => {
      if (currentLevel === "main" && categoryId) {
        handleDrillDown(categoryId);
        onSelectCategory(categoryId);
      } else if (subcategoryId) {
        handleSubcategorySelect(subcategoryId);
        onSelectCategory(currentCategory, subcategoryId);
      }
    },
    [
      currentLevel,
      currentCategory,
      handleDrillDown,
      handleSubcategorySelect,
      onSelectCategory,
    ]
  );

  // Handle back button click
  const handleBackButtonClick = useCallback(() => {
    // If we're at subcategory level with a specific subcategory selected
    if (currentSubcategory) {
      // Clear subcategory selection but stay at subcategory level
      handleBackClick();
      // Update parent's state to clear subcategory filter
      onSelectCategory(currentCategory);
    } else {
      // We're at subcategory level without specific selection
      // Go back to main and clear all filters
      handleBackClick();
      onSelectCategory(null);
    }
  }, [handleBackClick, onSelectCategory, currentCategory, currentSubcategory]);

  // Initialize ECharts
  const { chartRef, chartContainerRef } = useECharts(
    chartData,
    handleChartClick,
    hasData
  );

  // Render back button only in subcategory view
  const renderBackButton = useCallback(() => {
    if (currentLevel !== "subcategory") return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackButtonClick}
        className="flex items-center mb-2 bg-gray-100 hover:bg-gray-200"
      >
        <ChevronLeft className="mr-1" size={16} />
        Retour
      </Button>
    );
  }, [currentLevel, currentSubcategory, handleBackButtonClick]);

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
            currentLevel={currentLevel}
            selectedSubcategoryId={currentSubcategory}
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
