// components/chart/ChartTitle.js
import React from "react";
import { formatAmount } from "@/utils/categoryUtils";

/**
 * Chart title and total amount component
 *
 * @param {string} title - Chart title
 * @param {number} amount - Total amount to display
 * @returns {React.Component}
 */
function ChartTitle({ title, amount }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        {title}
      </h2>
      <p className="text-2xl font-bold text-center">{formatAmount(amount)}</p>
    </>
  );
}

export default React.memo(ChartTitle);
