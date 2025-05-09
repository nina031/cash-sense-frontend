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
 * @returns {React.Component}
 */
export default function CategoryPieChart({
  transactions = [],
  transactionType,
}) {
  // Get data and methods from custom hooks
  const {
    chartData,
    totalAmount,
    titleText,
    currentLevel,
    currentCategory,
    handleDrillDown,
    handleBackClick,
    hasData,
  } = useCategoryData(transactions, transactionType);

  // Handle click on chart slices
  const handleChartClick = useCallback(
    (data) => {
      if (currentLevel === "main" && data.categoryId) {
        handleDrillDown(data.categoryId);
      }
    },
    [currentLevel, handleDrillDown]
  );

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
        onClick={handleBackClick}
        className="flex items-center mb-2 bg-gray-100 hover:bg-gray-200"
      >
        <ChevronLeft className="mr-1" size={16} />
        Retour
      </Button>
    );
  }, [currentLevel, handleBackClick]);

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
            onItemClick={handleDrillDown}
            currentLevel={currentLevel}
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
