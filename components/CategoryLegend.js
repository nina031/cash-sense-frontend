// components/CategoryLegend.js
import React from "react";
import { formatAmount } from "@/utils/categoryUtils";

/**
 * Custom legend component for category charts
 *
 * @param {Array} data - Data for the legend
 * @param {Function} onItemClick - Click handler for legend items
 * @param {string} currentLevel - Current drill-down level
 * @param {string} selectedSubcategoryId - Currently selected subcategory ID
 * @returns {React.Component}
 */
export default function CategoryLegend({
  data,
  onItemClick,
  currentLevel,
  selectedSubcategoryId = null,
}) {
  if (!data || data.length === 0) return null;

  // Sort data by value (amount) in descending order and limit to 7 items
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 7);

  // Check if we have a selected subcategory (for applying visual effects)
  const hasSelectedSubcategory =
    currentLevel === "subcategory" && selectedSubcategoryId;

  return (
    <div className="flex flex-col space-y-2 pr-2">
      {sortedData.map((item, index) => {
        // Get category information
        const IconComponent = item.IconComponent;
        const isClickable = true; // Allow clicking on both main and subcategories

        // Check if this item is selected
        const isSelected =
          currentLevel === "subcategory" &&
          item.subcategoryId &&
          item.subcategoryId === selectedSubcategoryId;

        // Check if item should be visually dimmed
        const shouldDim = hasSelectedSubcategory && !isSelected;

        // Determine what to pass to the click handler
        const handleClick = () => {
          if (currentLevel === "main" && item.categoryId) {
            onItemClick(item.categoryId);
          } else if (currentLevel === "subcategory" && item.subcategoryId) {
            onItemClick(null, item.subcategoryId); // Null will be replaced with currentCategory in parent
          }
        };

        return (
          <div
            key={index}
            className={`flex items-center ${
              isClickable
                ? "cursor-pointer hover:bg-gray-50 rounded-md p-1"
                : ""
            }`}
            onClick={handleClick}
            title={isClickable ? `Filtrer par ${item.name}` : ""}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
              style={{
                backgroundColor: shouldDim
                  ? `${item.itemStyle.color}80` // Add transparency to non-selected items
                  : item.itemStyle.color,
              }}
            >
              <IconComponent size={14} color="white" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-medium text-sm ${
                  shouldDim ? "text-gray-400" : ""
                }`}
              >
                {item.name}
              </span>
              <span
                className={`text-xs ${
                  shouldDim ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatAmount(item.value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
