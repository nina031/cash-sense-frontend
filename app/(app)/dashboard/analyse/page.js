"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";
import { useDemoMode } from "@/contexts/DemoContext";

export default function TransactionsPage() {
  const { isDemoMode, demoAccessToken } = useDemoMode();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes Transactions</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <TransactionList accessToken={isDemoMode ? demoAccessToken : null} />
      </div>
    </div>
  );
}
