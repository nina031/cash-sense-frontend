/**
 * Component to display a list of transactions
 */
import { useState, useEffect } from "react";
import TransactionItem from "./TransactionItem";
import { useDemoMode } from "@/contexts/DemoContext";

export default function TransactionList({ accessToken }) {
  const { isDemoMode, demoAccessToken } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utiliser le token approprié (celui du mode démo ou celui passé en props)
  const effectiveToken = isDemoMode ? demoAccessToken : accessToken;

  useEffect(() => {
    // Only try to fetch transactions if we have an access token
    if (!effectiveToken) {
      setLoading(false);
      return;
    }

    // Function to fetch transactions
    async function fetchTransactions() {
      try {
        // Import the service to avoid issues with Next.js SSR
        const { getTransactions } = await import(
          "@/services/transactionService"
        );

        // Fetch transactions using the service
        const data = await getTransactions(effectiveToken);

        // Sort transactions by date (most recent first)
        const sortedTransactions = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactions(sortedTransactions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(
          "Impossible de récupérer les transactions. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [effectiveToken]); // Re-fetch when effectiveToken changes

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des transactions...</p>
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
  if (transactions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Aucune transaction trouvée pour la période sélectionnée.</p>
      </div>
    );
  }

  // Render the list of transactions
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">Transactions récentes</h2>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
