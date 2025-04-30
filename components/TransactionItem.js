/**
 * Displays a single transaction with icon, details and amount
 */
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  findCategoryByTransaction,
  getCategoryIcon,
  getCategoryBackgroundColor,
  getCategoryFromPath,
  normalizeCategory,
} from "@/utils/categoryUtils";

export default function TransactionItem({
  transaction,
  showCheckbox = false,
  categoryPath = [],
}) {
  // Format the amount (negative for expenses, positive for income)
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Get category information based on transaction data and current category path
  const getCategoryInfo = () => {
    const name = transaction.name || "";

    // If we have a categoryPath (user clicked on a specific category)
    if (categoryPath && categoryPath.length > 0) {
      // Normalize the transaction category to array format
      const transactionCategories = normalizeCategory(transaction.category);

      // Debugging - uncomment if needed
      // console.log("Transaction:", name, "Categories:", transactionCategories, "Path:", categoryPath);

      // Check if this transaction belongs to a specific sub-category
      if (transactionCategories.length > categoryPath.length) {
        // Get the sub-category name at the next level
        const subCategoryName = transactionCategories[categoryPath.length];

        if (subCategoryName) {
          // Use direct utility functions to get icon and background color
          const icon = getCategoryIcon(subCategoryName);
          const bgColor = getCategoryBackgroundColor(subCategoryName);

          return {
            category: { name: subCategoryName },
            IconComponent: icon,
            backgroundColor: bgColor,
          };
        }
      }

      // We're viewing items in a category, use the specific icon for this transaction
      // based on its actual category (not just the parent)
      if (transactionCategories.length > 0) {
        // Use the most specific category available for this transaction
        const mostSpecificCategory =
          transactionCategories[transactionCategories.length - 1];
        const icon = getCategoryIcon(mostSpecificCategory);
        const bgColor = getCategoryBackgroundColor(mostSpecificCategory);

        return {
          category: { name: mostSpecificCategory },
          IconComponent: icon,
          backgroundColor: bgColor,
        };
      }

      // Fallback to selected category
      const icon = getCategoryIcon(categoryPath[categoryPath.length - 1]);
      const bgColor = getCategoryBackgroundColor(
        categoryPath[categoryPath.length - 1]
      );

      return {
        category: { name: categoryPath[categoryPath.length - 1] },
        IconComponent: icon,
        backgroundColor: bgColor,
      };
    }

    // Default behavior (no specific category selected)
    // Find the appropriate category based on transaction data
    const category = findCategoryByTransaction(name, transaction.category);

    return {
      category,
      IconComponent: category.icon || HelpCircle,
      backgroundColor: category.backgroundColor || "bg-gray-500",
    };
  };

  // Get title and subtitles
  const formatTransactionTitle = () => {
    const name = transaction.name || "Transaction";

    // Special formatting for CARTE transactions
    if (name.toUpperCase().startsWith("CARTE")) {
      const parts = name.split(" ");
      // Format: "CARTE DD/MM/YY MERCHANT"
      if (parts.length >= 3) {
        const date = parts[1];
        const merchant = parts.slice(2).join(" ");
        return merchant;
      }
    }

    // Special formatting for VIR (transfer) transactions
    if (name.toUpperCase().startsWith("VIR")) {
      const parts = name.split(" ");
      // Format: "VIR INST MLLE PERSON NAME"
      if (parts.length >= 3) {
        // Try to extract person name
        return parts.slice(1).join(" ");
      }
    }

    // Special formatting for TH (authorization) transactions
    if (name.toUpperCase().startsWith("TH")) {
      const parts = name.split(" ");
      // Format: "TH MERCHANT LOCATION"
      if (parts.length >= 2) {
        return parts.slice(1).join(" ");
      }
    }

    return name;
  };

  // Get transaction subtitle (category or type)
  const getTransactionSubtitle = () => {
    // For card transactions, show the format "CARTE DD/MM/YY"
    if (
      transaction.name &&
      transaction.name.toUpperCase().startsWith("CARTE")
    ) {
      const parts = transaction.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
      }
    }

    // For transfers, show "Virements reçus"
    if (transaction.name && transaction.name.toUpperCase().includes("VIR")) {
      return "Virements reçus";
    }

    // For authorizations, show the appropriate text
    if (transaction.name && transaction.name.toUpperCase().includes("TH")) {
      return "Autorisation paiement en cours CB*9376";
    }

    // Default: show category if available
    if (transaction.category) {
      if (Array.isArray(transaction.category)) {
        // Return the first category as main category
        return transaction.category[0];
      }
      return transaction.category;
    }

    return "Non catégorisé";
  };

  // Get detailed subcategory if available
  const getDetailedSubcategory = () => {
    // If we have category array with multiple levels, display the subcategories
    if (
      Array.isArray(transaction.category) &&
      transaction.category.length > 1
    ) {
      // Return everything except the first category (which is shown in the subtitle)
      return transaction.category.slice(1).join(" > ");
    }

    return "";
  };

  // Determine if it's a debit or credit transaction
  const isDebit = transaction.amount > 0;

  // Get category info for this transaction
  const { IconComponent, backgroundColor } = getCategoryInfo();

  // Get title and subtitles
  const title = formatTransactionTitle();
  const subtitle = getTransactionSubtitle();
  const detailedSubcategory = getDetailedSubcategory();

  return (
    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors">
      {/* Show checkbox if needed */}
      {showCheckbox && (
        <div className="flex-shrink-0 mr-3">
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
        </div>
      )}

      {/* Category Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ${backgroundColor} text-white rounded-full mr-4`}
      >
        <IconComponent size={20} />
      </div>

      {/* Transaction Details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {detailedSubcategory && (
          <p className="text-xs text-gray-500">{detailedSubcategory}</p>
        )}
      </div>

      {/* Amount */}
      <div
        className={`flex-shrink-0 text-right font-medium ${
          isDebit ? "text-gray-800" : "text-green-600"
        }`}
      >
        {isDebit ? "− " : ""}
        {formatAmount(Math.abs(transaction.amount))}
      </div>
    </div>
  );
}
