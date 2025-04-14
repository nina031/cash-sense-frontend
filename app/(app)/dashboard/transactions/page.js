// Fichier à créer: app/(app)/dashboard/transactions/page.js
"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import { useDemoMode } from "@/contexts/DemoContext";

export default function TransactionsPage() {
  const { isDemoMode, demoAccessToken } = useDemoMode();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes Transactions</h1>

      {isDemoMode && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            <strong>Mode Démo :</strong> Vous consultez une version de
            démonstration de Cash Sense. Les données affichées sont fictives et
            servent uniquement à illustrer les fonctionnalités de l'application.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TransactionList accessToken={isDemoMode ? demoAccessToken : null} />
      </div>
    </div>
  );
}
