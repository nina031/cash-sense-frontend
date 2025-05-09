// components/CategoryLegend.js
import React from "react";
import { formatAmount } from "@/utils/categoryUtils";

/**
 * Custom legend component for category charts
 *
 * @param {Array} data - Data for the legend
 * @param {Function} onItemClick - Click handler for legend items
 * @param {string} currentLevel - Current drill-down level
 * @returns {React.Component}
 */
export default function CategoryLegend({ data, onItemClick, currentLevel }) {
  if (!data || data.length === 0) return null;

  // Sort data by value (amount) in descending order and limit to 7 items
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 7);

  return (
    <div className="flex flex-col space-y-2 pr-2">
      {sortedData.map((item, index) => {
        // Get category information
        const IconComponent = item.IconComponent;
        const isClickable = currentLevel === "main" && item.categoryId;

        return (
          <div
            key={index}
            className={`flex items-center ${
              isClickable ? "cursor-pointer hover:bg-gray-50 rounded-md" : ""
            }`}
            onClick={() => isClickable && onItemClick(item.categoryId)}
            title={isClickable ? `Voir le détail de ${item.name}` : ""}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
              style={{ backgroundColor: item.itemStyle.color }}
            >
              <IconComponent size={14} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{item.name}</span>
              <span className="text-gray-600 text-xs">
                {formatAmount(item.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
