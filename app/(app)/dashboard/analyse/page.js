"use client";

import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import TransactionList from "@/components/TransactionList";

// Tableau des mois disponibles
const MONTHS = [
  "Novembre",
  "Décembre",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
];

export default function TransactionsPage() {
  const { isDemoMode, demoAccessToken } = useDemoMode();

  // États pour le filtrage
  const [transactionType, setTransactionType] = useState("Dépenses"); // "Dépenses" ou "Revenus"
  const [selectedMonth, setSelectedMonth] = useState("Avril 2025"); // Mois sélectionné par défaut

  // Gestionnaires d'événements
  const handleTypeChange = (type) => {
    setTransactionType(type);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div>
      {/* Sélecteur de type (Dépenses/Revenus) */}
      <div className="border-b border-gray-200">
        <div className="flex justify-center">
          <button
            className={`pb-4 px-6 relative ${
              transactionType === "Dépenses"
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTypeChange("Dépenses")}
          >
            Dépenses
            {transactionType === "Dépenses" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            )}
          </button>
          <button
            className={`pb-4 px-6 relative ${
              transactionType === "Revenus"
                ? "text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTypeChange("Revenus")}
          >
            Revenus
            {transactionType === "Revenus" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Sélecteur de mois */}
      <div className="flex justify-center py-4 mb-4">
        {MONTHS.map((month, index) => {
          const displayMonth = month === "Avril" ? "Avril 2025" : month;
          const isSelected = selectedMonth === displayMonth;

          return (
            <button
              key={month}
              className={`whitespace-nowrap px-4 py-2 rounded-full mr-3 ${
                isSelected
                  ? "bg-[#8367c7] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => handleMonthChange(displayMonth)}
            >
              {displayMonth}
            </button>
          );
        })}
      </div>

      {/* Liste des transactions filtrées */}
      <div className="bg-white rounded-lg p-6">
        <TransactionList
          accessToken={isDemoMode ? demoAccessToken : null}
          filter={{
            type: transactionType,
            month: selectedMonth,
          }}
        />
      </div>
    </div>
  );
}
