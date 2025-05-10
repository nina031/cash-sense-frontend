// components/CategoryPieChart.js
"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CategoryLegend from "@/components/CategoryLegend";
import ChartTitle from "@/components/ChartTitle";
import { useFiltersStore } from "@/stores/useFiltersStore";
import {
  groupTransactionsByCategory,
  groupTransactionsBySubcategory,
  calculateTotalAmount,
} from "@/utils/transactionUtils";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { TRANSACTION_TYPES } from "@/hooks/useTransactionTypeFilter";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// Register necessary ECharts components
echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

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

  // Refs for chart
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const isAnimating = useRef(false);
  const prevLevelRef = useRef(chartLevel);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    // Si nous sommes au niveau principal, utiliser toutes les transactions
    if (chartLevel === "main") {
      return calculateTotalAmount(transactions);
    }

    // Si nous sommes au niveau sous-catégorie
    let categoryTransactions = transactions.filter(
      (tx) => tx.category?.id === selectedCategory
    );

    // Si une sous-catégorie est sélectionnée, filtrer davantage
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
      // Premier niveau: catégories principales
      const categoriesMap = groupTransactionsByCategory(transactions);

      // Convertir en format pour ECharts et notre légende personnalisée
      return Object.keys(categoriesMap).map((categoryId) => {
        const { name, color, IconComponent } = getCategoryInfo(categoryId);
        return {
          value: categoriesMap[categoryId],
          name: name,
          itemStyle: { color },
          categoryId,
          IconComponent, // Pour notre légende personnalisée
        };
      });
    } else {
      // Second niveau: sous-catégories
      // Si une sous-catégorie est sélectionnée, ne montrer que celle-ci en surbrillance
      if (selectedSubcategory) {
        const allSubcategoriesMap = groupTransactionsBySubcategory(
          transactions.filter((tx) => tx.category?.id === selectedCategory),
          selectedCategory
        );

        // Créer les données du graphique avec la sous-catégorie sélectionnée en surbrillance
        return Object.keys(allSubcategoriesMap).map((subcategoryId) => {
          const { name, color, IconComponent } = getCategoryInfo(
            selectedCategory,
            subcategoryId
          );

          // Mettre en surbrillance la sous-catégorie sélectionnée
          const isSelected = subcategoryId === selectedSubcategory;
          const adjustedColor = isSelected ? color : `${color}80`; // Ajouter de la transparence aux éléments non sélectionnés

          return {
            value: allSubcategoriesMap[subcategoryId],
            name: name,
            itemStyle: {
              color: adjustedColor,
              // Ajouter une bordure ou autre mise en valeur à l'élément sélectionné
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
        // Vue normale des sous-catégories (pas de sélection spécifique)
        const subcategoriesMap = groupTransactionsBySubcategory(
          transactions,
          selectedCategory
        );

        // Convertir en format pour ECharts et notre légende personnalisée
        return Object.keys(subcategoriesMap).map((subcategoryId) => {
          const { name, color, IconComponent } = getCategoryInfo(
            selectedCategory,
            subcategoryId
          );
          return {
            value: subcategoriesMap[subcategoryId],
            name: name,
            itemStyle: { color },
            subcategoryId,
            IconComponent, // Pour notre légende personnalisée
          };
        });
      }
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

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    // Create chart instance if it doesn't exist
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // Set up resize observer for the chart container
      const resizeObserver = new ResizeObserver(() => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      });

      if (chartContainerRef.current) {
        resizeObserver.observe(chartContainerRef.current);
      }

      // Clean up when component unmounts
      return () => {
        resizeObserver.disconnect();
        if (chartInstance.current) {
          chartInstance.current.dispose();
          chartInstance.current = null;
        }
      };
    }
  }, []);

  // Function to update chart with animation
  const updateChart = useCallback((data, animate = false) => {
    if (!chartInstance.current) return;

    if (!data || data.length === 0) {
      chartInstance.current.setOption({
        series: [{ type: "pie", data: [] }],
      });
      return;
    }

    // Base chart options - always using donut chart (anneau)
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} € ({d}%)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: { color: "#333" },
        extraCssText: "box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);",
      },
      series: [
        {
          type: "pie",
          // Always use the donut shape (anneau) with inner radius of 30%
          radius: ["30%", "75%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: "bold" },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          labelLine: { show: false },
          data: data,
          animationDuration: animate ? 800 : 0,
          animationEasing: "cubicInOut",
        },
      ],
    };

    // Update chart with new options
    chartInstance.current.setOption(option, true);
  }, []);

  // Handle animated transitions between levels
  useEffect(() => {
    if (!chartInstance.current || isAnimating.current) return;

    const hasLevelChanged = prevLevelRef.current !== chartLevel;
    if (hasLevelChanged) {
      isAnimating.current = true;

      // Display the chart with animation
      updateChart(chartData, true);

      // Add special highlight/zoom effect on the selected category during drill-down
      if (chartLevel === "subcategory" && prevLevelRef.current === "main") {
        // Find the index of the selected category in the data
        const selectedIndex = chartData.findIndex(
          (item) =>
            item.categoryId === selectedCategory ||
            item.subcategoryId === selectedSubcategory
        );

        if (selectedIndex >= 0) {
          // Apply highlight and expansion animation to the selected sector
          setTimeout(() => {
            chartInstance.current.dispatchAction({
              type: "pieSelect",
              seriesIndex: 0,
              dataIndex: selectedIndex,
            });

            // Add a delayed highlight/unhighlight for visual effect
            setTimeout(() => {
              chartInstance.current.dispatchAction({
                type: "pieUnSelect",
                seriesIndex: 0,
                dataIndex: selectedIndex,
              });
              isAnimating.current = false;
            }, 500);
          }, 300);
        } else {
          isAnimating.current = false;
        }
      } else {
        // For other transitions
        setTimeout(() => {
          isAnimating.current = false;
        }, 800);
      }

      // Update the previous level reference
      prevLevelRef.current = chartLevel;
    } else {
      // If just the data changed but not the level, update without special animation
      updateChart(chartData, true);
    }
  }, [
    chartLevel,
    chartData,
    updateChart,
    selectedCategory,
    selectedSubcategory,
  ]);

  // Set up click handler for the chart
  useEffect(() => {
    if (!chartInstance.current) return;

    // Remove old event handlers
    chartInstance.current.off("click");

    // Add click handler
    chartInstance.current.on("click", (params) => {
      if (params.data) {
        if (chartLevel === "main" && params.data.categoryId) {
          // Select category
          handleChartSelection(params.data.categoryId);
        } else if (chartLevel === "subcategory" && params.data.subcategoryId) {
          // Select subcategory
          handleChartSelection(selectedCategory, params.data.subcategoryId);
        }
      }
    });

    // Clean up when component unmounts or dependencies change
    return () => {
      if (chartInstance.current) {
        chartInstance.current.off("click");
      }
    };
  }, [chartLevel, selectedCategory, handleChartSelection]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial chart update when component mounts
  useEffect(() => {
    if (chartInstance.current && chartData.length > 0) {
      updateChart(chartData, false);
    }
  }, []);

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
    <div ref={chartContainerRef} className="w-full h-full">
      {/* Back button (only visible in subcategory mode) */}
      {renderBackButton()}

      {/* Chart and legend side by side */}
      <div className="flex flex-row h-full">
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
        <div className="w-2/3 h-full">
          {/* Title and amount aligned with the chart */}
          <div className="h-full flex flex-col">
            <div>
              <ChartTitle title={titleText} amount={totalAmount} />
            </div>

            {/* Chart */}
            <div
              ref={chartRef}
              className="flex-grow"
              style={{ minHeight: "300px", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
