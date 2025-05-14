// hooks/useTransactions.js
import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import {
  fetchTransactions,
  enableDemoMode,
} from "@/services/transactionService";

/**
 * Hook to load and manage transactions data
 *
 * @param {string} userId - User ID to fetch transactions for
 * @returns {Object} Transactions data, loading state, and error
 */
export function useTransactions(userId) {
  const { isDemoMode } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Do nothing if conditions aren't met
    if (!userId || !isDemoMode) {
      setTransactions([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        await enableDemoMode(userId);
        const data = await fetchTransactions(userId);

        if (isMounted) {
          setTransactions(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
        if (isMounted) {
          setError(err.message || "Failed to load transactions");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [userId, isDemoMode]);

  return { transactions, loading, error };
}
