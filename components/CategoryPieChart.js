// components/CategoryPieChart.js
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CategoryLegend from "@/components/CategoryLegend";
import ChartTitle from "@/components/ChartTitle";
import { useCategoryChartData } from "@/hooks/useCategoryChartData";
import { useECharts } from "@/hooks/useECharts";
import { useFiltersStore } from "@/stores/useFiltersStore";

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
    selectedSubcategory,
    chartLevel,
    handleChartClick,
    handleLegendClick,
    handleBackClick,
  } = useFiltersStore();

  // Get chart data from custom hook
  const { chartData, titleText, totalAmount } =
    useCategoryChartData(transactions);

  // Initialize ECharts
  const { chartRef, chartContainerRef } = useECharts(
    chartData,
    handleChartClick,
    transactions.length > 0
  );

  return (
    <div ref={chartContainerRef} className="w-full">
      {/* Back button (only visible in subcategory mode) */}
      {chartLevel === "subcategory" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="flex items-center mb-2 bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft className="mr-1" size={16} />
          Retour
        </Button>
      )}

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
