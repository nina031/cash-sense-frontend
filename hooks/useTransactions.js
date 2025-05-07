// hooks/useTransactions.js
import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import {
  fetchTransactions,
  enableDemoMode,
} from "@/services/transactionService";

export function useTransactions(userId) {
  const { isDemoMode } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isDemoMode || !userId) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    const loadTransactions = async () => {
      try {
        // Activer le mode démo puis récupérer les transactions
        await enableDemoMode(userId);
        const data = await fetchTransactions(userId);
        setTransactions(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError(err.message || "Impossible de charger les transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [isDemoMode, userId]);

  return { transactions, loading, error };
}
