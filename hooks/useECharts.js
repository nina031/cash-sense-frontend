// hooks/useECharts.js
import { useRef, useEffect } from "react";
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
 * Hook for managing an ECharts instance
 *
 * @param {Array} data - Chart data
 * @param {Function} onChartClick - Click handler for chart elements
 * @param {boolean} hasData - Whether there is data to display
 * @param {Object} animationOptions - Custom animation options
 * @returns {Object} - Chart references and methods
 */
export function useECharts(
  data,
  onChartClick,
  hasData = true,
  animationOptions = {}
) {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const resizeObserver = useRef(null);

  // Initialize chart when component mounts
  useEffect(() => {
    if (!chartRef.current) return;

    // Create chart instance if it doesn't exist
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Set up resize observer for the chart container
    resizeObserver.current = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });

    if (chartContainerRef.current) {
      resizeObserver.current.observe(chartContainerRef.current);
    }

    // Clean up when component unmounts
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (!chartInstance.current) return;

    // If no data available
    if (!hasData || !data || data.length === 0) {
      chartInstance.current.setOption({
        title: { show: false },
        tooltip: { show: false },
        legend: { show: false },
        series: [{ type: "pie", data: [], radius: ["40%", "70%"] }],
      });
      return;
    }

    // Default animation options
    const defaultAnimationOptions = {
      animationDuration: 800,
      animationEasing: "cubicOut",
      animationThreshold: 8000,
      animationDelay: 0,
    };

    // Merge default options with user options
    const finalAnimationOptions = {
      ...defaultAnimationOptions,
      ...animationOptions,
    };

    // Chart configuration
    const option = {
      title: { show: false },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} € ({d}%)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#333",
        },
        extraCssText: "box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);",
      },
      legend: {
        show: false, // Hide ECharts native legend
      },
      // Apply animation options
      animation: true,
      animationThreshold: finalAnimationOptions.animationThreshold,
      animationDuration: finalAnimationOptions.animationDuration,
      animationEasing: finalAnimationOptions.animationEasing,
      animationDelay: finalAnimationOptions.animationDelay,
      series: [
        {
          type: "pie",
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
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
            scale: true,
            scaleSize: 10,
          },
          labelLine: { show: false },
          // Add animation options specific to the pie chart
          animationType: "scale",
          animationEasing: finalAnimationOptions.animationEasing,
          animationDuration: finalAnimationOptions.animationDuration,
          data,
        },
      ],
    };

    // Update chart with new options
    chartInstance.current.setOption(option, true);
  }, [data, hasData, animationOptions]);

  // Set up click handler for the chart
  useEffect(() => {
    if (!chartInstance.current) return;

    // Remove old event handlers
    chartInstance.current.off("click");

    // Add click handler if provided
    if (onChartClick) {
      chartInstance.current.on("click", (params) => {
        if (params.data) {
          onChartClick(params.data);
        }
      });
    }

    // Clean up when component unmounts or dependencies change
    return () => {
      if (chartInstance.current) {
        chartInstance.current.off("click");
      }
    };
  }, [onChartClick]);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { chartRef, chartContainerRef, chartInstance };
}
