/**
 * Component to display a list of transactions
 * Handles filtering by transaction type and month
 */
import { useState, useEffect } from "react";
import TransactionItem from "./TransactionItem";
import { useDemoMode } from "@/contexts/DemoContext";

export default function TransactionList({ accessToken, filter }) {
  const { isDemoMode, demoAccessToken } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastTokenChange, setLastTokenChange] = useState(Date.now());

  // Use the appropriate token (demo mode token or the one passed in props)
  const effectiveToken = isDemoMode ? demoAccessToken : accessToken;

  useEffect(() => {
    // Reset states and track token change timestamp when token changes
    if (effectiveToken) {
      setLastTokenChange(Date.now());
      setRetryCount(0);
    }
  }, [effectiveToken]);

  // Fetch transactions from API
  useEffect(() => {
    // Only try to fetch transactions if we have an access token
    if (!effectiveToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Function to fetch transactions
    async function fetchTransactions() {
      try {
        // If this is a fresh token (less than 5 seconds old), add initial delay
        const timeSinceTokenChange = Date.now() - lastTokenChange;
        if (retryCount === 0 && timeSinceTokenChange < 5000) {
          // Add small initial delay for demo mode to allow Plaid to process
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }/api/get_transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: effectiveToken, days: 90 }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch transactions");
        }

        const data = await response.json();

        // Sort transactions by date (most recent first)
        const sortedTransactions = data.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        console.log("test", sortedTransactions.length);

        setTransactions(sortedTransactions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);

        // Check if error contains "PRODUCT_NOT_READY" and retry with delay
        if (
          err.message &&
          err.message.includes("PRODUCT_NOT_READY") &&
          retryCount < 3
        ) {
          setRetryCount((prevCount) => prevCount + 1);

          // Retry after increasing delay (exponential backoff)
          const delay = 2000 * Math.pow(2, retryCount);
          console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/3)`);

          setError(
            `Préparation des données... Nouvelle tentative dans ${
              delay / 1000
            } secondes`
          );

          setTimeout(() => {
            fetchTransactions();
          }, delay);
        } else {
          setError(
            "Impossible de récupérer les transactions. Veuillez réessayer plus tard."
          );
          setLoading(false);
        }
      }
    }

    fetchTransactions();
  }, [effectiveToken, retryCount, lastTokenChange]);

  // Apply filters whenever transactions or filter props change
  useEffect(() => {
    if (!transactions.length) {
      setFilteredTransactions([]);
      return;
    }

    let result = [...transactions];

    // Filter by transaction type (expenses or income)
    if (filter?.type) {
      // In Plaid, positive amounts are expenses and negative are income
      if (filter.type === "Dépenses") {
        result = result.filter((t) => t.amount > 0);
      } else if (filter.type === "Revenus") {
        result = result.filter((t) => t.amount < 0);
      }
    }

    // Filter by month
    if (filter?.month) {
      // Extract month and year from filter.month (e.g., "Avril 2025")
      const parts = filter.month.split(" ");
      let monthName = parts[0];
      const year =
        parts.length > 1 ? parseInt(parts[1]) : new Date().getFullYear();

      // Map French month names to numbers (0-11)
      const monthMap = {
        Janvier: 0,
        Février: 1,
        Mars: 2,
        Avril: 3,
        Mai: 4,
        Juin: 5,
        Juillet: 6,
        Août: 7,
        Septembre: 8,
        Octobre: 9,
        Novembre: 10,
        Décembre: 11,
      };

      const monthNumber = monthMap[monthName];

      if (monthNumber !== undefined) {
        result = result.filter((t) => {
          const date = new Date(t.date);
          return date.getMonth() === monthNumber && date.getFullYear() === year;
        });
      }
    }

    setFilteredTransactions(result);
  }, [transactions, filter]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des transactions...</p>
        {retryCount > 0 && (
          <p className="mt-2 text-amber-600">
            Les données sont en cours de préparation. Tentative {retryCount}
            /3...
          </p>
        )}
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Show message when no access token is provided
  if (!effectiveToken) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>
          Veuillez vous connecter à votre compte bancaire pour voir vos
          transactions.
        </p>
      </div>
    );
  }

  // Show message when no transactions are found
  if (filteredTransactions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Aucune transaction trouvée pour les critères sélectionnés.</p>
      </div>
    );
  }

  // Render the list of transactions
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">
        {filter?.type || "Transactions"} - {filter?.month || "Tous les mois"}
      </h2>
      <div className="divide-y divide-gray-200">
        {filteredTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
