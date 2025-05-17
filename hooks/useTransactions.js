// hooks/useTransactions.js
import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import { fetchTransactions } from "@/services/transactionService";

/**
 * Hook to load and manage transactions data
 *
 * @param {string} userId - User ID to fetch transactions for
 * @param {number} refreshKey - Key to trigger refresh
 * @returns {Object} Transactions data, loading state, and error
 */
export function useTransactions(userId, refreshKey = 0) {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Do nothing if user ID isn't available
    if (!userId) {
      setTransactions([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        // Fetch transactions (fonctionnera en mode démo ou normal en fonction de l'état actuel)
        console.log(
          "Fetching transactions in mode:",
          isDemoMode ? "demo" : "normal"
        );
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
  }, [userId, isDemoMode, refreshKey]); // Ajout de refreshKey comme dépendance

  return { transactions, loading, error };
}
