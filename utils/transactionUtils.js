// utils/transactionUtils.js
import { TRANSACTION_TYPES } from "@/utils/constants";

/**
 * Determines if a transaction is an expense
 *
 * @param {Object} transaction - Transaction object with amount property
 * @returns {boolean} - True if transaction is an expense
 */
export function isExpense(transaction) {
  return transaction.amount > 0;
}

/**
 * Determines if a transaction is income
 *
 * @param {Object} transaction - Transaction object with amount property
 * @returns {boolean} - True if transaction is income
 */
export function isIncome(transaction) {
  return transaction.amount < 0;
}

/**
 * Filters transactions by type (expenses or income)
 *
 * @param {Array} transactions - List of transactions to filter
 * @param {string} type - Transaction type to filter by (from TRANSACTION_TYPES)
 * @returns {Array} - Filtered transactions
 */
export function filterTransactionsByType(transactions, type) {
  if (!transactions || !transactions.length) return [];

  return transactions.filter((transaction) => {
    if (type === TRANSACTION_TYPES.EXPENSES) {
      return isExpense(transaction);
    } else if (type === TRANSACTION_TYPES.INCOME) {
      return isIncome(transaction);
    }
    return true; // Return all if no valid type specified
  });
}

/**
 * Groups transactions by category and calculates totals
 *
 * @param {Array} transactions - List of transactions to group
 * @returns {Object} - Mapped categories with totals
 */
export function groupTransactionsByCategory(transactions) {
  if (!transactions || !transactions.length) return {};

  const categoriesMap = {};

  // Group by category
  transactions.forEach((tx) => {
    const categoryId = tx.category?.id || "other";
    if (!categoriesMap[categoryId]) {
      categoriesMap[categoryId] = 0;
    }
    categoriesMap[categoryId] += Math.abs(tx.amount);
  });

  return categoriesMap;
}

/**
 * Groups transactions by subcategory within a specific category
 *
 * @param {Array} transactions - List of transactions
 * @param {string} categoryId - Category ID to filter by
 * @returns {Object} - Mapped subcategories with totals
 */
export function groupTransactionsBySubcategory(transactions, categoryId) {
  if (!transactions || !transactions.length || !categoryId) return {};

  const subcategoriesMap = {};

  // Filter transactions of the selected category
  const categoryTransactions = transactions.filter(
    (tx) => tx.category?.id === categoryId
  );

  // Group by subcategory
  categoryTransactions.forEach((tx) => {
    const subcategoryId = tx.category?.subcategory?.id || "unknown";
    if (!subcategoriesMap[subcategoryId]) {
      subcategoriesMap[subcategoryId] = 0;
    }
    subcategoriesMap[subcategoryId] += Math.abs(tx.amount);
  });

  return subcategoriesMap;
}

/**
 * Calculates the total amount of transactions
 *
 * @param {Array} transactions - List of transactions
 * @returns {number} - Total amount
 */
export function calculateTotalAmount(transactions) {
  if (!transactions || !transactions.length) return 0;

  return transactions.reduce((total, tx) => total + Math.abs(tx.amount), 0);
}
