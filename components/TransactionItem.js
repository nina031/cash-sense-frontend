// components/TransactionItem.js
import React from "react";
import {
  formatDate,
  formatAmount,
  transactionPropsAreEqual,
} from "@/utils/categoryUtils";
import { useTransactionCategory } from "@/hooks/useTransactionCategory";

function TransactionItem({ transaction }) {
  // Utiliser notre hook personnalisé
  const { color, IconComponent, name } = useTransactionCategory(transaction);

  // Extraire des valeurs pour une meilleure lisibilité
  const { merchant_name, date, amount } = transaction;
  const isDebit = amount > 0;

  return (
    <div className="py-3 flex items-center gap-4">
      {/* Icône de catégorie */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <IconComponent size={20} />
      </div>

      {/* Détails de la transaction */}
      <div className="flex-grow overflow-hidden">
        <p className="font-medium truncate">{merchant_name || "Transaction"}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{formatDate(date)}</span>
          {name && (
            <>
              <span className="mx-1">•</span>
              <span className="truncate">{name}</span>
            </>
          )}
        </div>
      </div>

      {/* Montant */}
      <div
        className={`flex-shrink-0 font-medium ${
          isDebit ? "text-red-600" : "text-green-600"
        }`}
      >
        {isDebit ? "-" : "+"} {formatAmount(amount)}
      </div>
    </div>
  );
}

export default React.memo(TransactionItem, transactionPropsAreEqual);
