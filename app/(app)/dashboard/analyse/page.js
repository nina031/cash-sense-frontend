"use client";

import { useState, useCallback } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import TransactionList from "@/components/TransactionList";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const [transactions, setTransactions] = useState([]);
  const [isToggling, setIsToggling] = useState(false);

  // Callback pour recevoir les transactions chargées
  const handleTransactionsLoaded = useCallback((loadedTransactions) => {
    console.log(
      `${loadedTransactions.length} transactions loaded in parent component`
    );
    setTransactions(loadedTransactions);
  }, []);

  // Fonction pour gérer le clic sur le bouton de mode démo
  const handleToggleDemoMode = async () => {
    try {
      setIsToggling(true);
      await toggleDemoMode();
      // Réinitialiser les transactions lors du changement de mode
      setTransactions([]);
    } catch (error) {
      console.error("Error toggling demo mode:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div>
      {/* Bouton pour activer/désactiver le mode test */}

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <TransactionList onTransactionsLoaded={handleTransactionsLoaded} />
      </div>
    </div>
  );
}
