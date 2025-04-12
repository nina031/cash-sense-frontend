/**
 * Component to display a single transaction
 */
export default function TransactionItem({ transaction }) {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format the amount (negative for spending, positive for income)
  const formatAmount = (amount) => {
    // Plaid returns positive values for outflows (spending)
    // We convert to negative for better user understanding
    const value = amount > 0 ? -amount : amount;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  // Determine the CSS class for the amount (red for spending, green for income)
  const getAmountClass = (amount) => {
    return amount > 0 ? "text-red-600" : "text-green-600";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {transaction.name || "Transaction inconnue"}
          </h3>
          <p className="text-sm text-gray-500">
            {transaction.merchant_name || transaction.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(transaction.date)}
          </p>
        </div>
        <div className={`font-medium ${getAmountClass(transaction.amount)}`}>
          {formatAmount(transaction.amount)}
        </div>
      </div>
      <div className="mt-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
          {transaction.category || "Non catégorisé"}
        </span>
        {transaction.pending && (
          <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-xs text-yellow-700 ml-2">
            En attente
          </span>
        )}
      </div>
    </div>
  );
}
