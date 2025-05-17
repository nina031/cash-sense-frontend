// components/TransactionList.js
import TransactionItem from "./TransactionItem";
import { useTransactionsStore } from "@/stores/useTransactionsStore";

export default function TransactionList({ transactions }) {
  // Obtenir l'état de chargement et les erreurs directement du store
  const loading = useTransactionsStore((state) => state.loading);
  const error = useTransactionsStore((state) => state.error);

  // Affichage du chargement
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des transactions...</p>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Aucune transaction
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Aucune transaction trouvée.</p>
      </div>
    );
  }

  // Affichage des transactions
  return (
    <div className="divide-y divide-gray-100">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
