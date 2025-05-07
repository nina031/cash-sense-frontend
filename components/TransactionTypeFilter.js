// components/TransactionTypeFilter.js
import { TRANSACTION_TYPES } from "@/hooks/useTransactionTypeFilter";

export default function TransactionTypeFilter({
  transactionType,
  setTransactionType,
}) {
  return (
    <div>
      <div className="flex justify-center">
        <button
          className={`pb-4 px-6 relative ${
            transactionType === TRANSACTION_TYPES.EXPENSES
              ? "text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTransactionType(TRANSACTION_TYPES.EXPENSES)}
        >
          {TRANSACTION_TYPES.EXPENSES}
          {transactionType === TRANSACTION_TYPES.EXPENSES && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
          )}
        </button>
        <button
          className={`pb-4 px-6 relative ${
            transactionType === TRANSACTION_TYPES.INCOME
              ? "text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTransactionType(TRANSACTION_TYPES.INCOME)}
        >
          {TRANSACTION_TYPES.INCOME}
          {transactionType === TRANSACTION_TYPES.INCOME && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>
          )}
        </button>
      </div>
    </div>
  );
}
