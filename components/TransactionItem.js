/**
 * Displays a single transaction with icon, details and amount
 */
import {
  CreditCard,
  ShoppingCart,
  Utensils,
  Plane,
  Train,
  Bus,
  HelpCircle,
  Beer,
  PiggyBank,
  Building,
  MessageCircle,
} from "lucide-react";

export default function TransactionItem({ transaction, showCheckbox = false }) {
  // Format the amount (negative for expenses, positive for income)
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Get icon and color based on category or transaction type
  const getCategoryIconAndColor = () => {
    // Get main category or transaction name
    const mainCategory = Array.isArray(transaction.category)
      ? transaction.category[0]
      : transaction.category || "";
    const name = transaction.name || "";

    // Check transaction name first for specific keywords
    if (
      name.toLowerCase().includes("vir") ||
      name.toLowerCase().includes("virement")
    ) {
      return { icon: <PiggyBank size={20} />, color: "bg-green-500" };
    }
    if (name.toLowerCase().includes("carte")) {
      // Check subcategories for card transactions
      if (
        mainCategory.toLowerCase().includes("restaurant") ||
        mainCategory.toLowerCase().includes("food") ||
        name.toLowerCase().includes("restaurant") ||
        name.toLowerCase().includes("amazone") ||
        name.toLowerCase().includes("bar")
      ) {
        return { icon: <Utensils size={20} />, color: "bg-rose-500" };
      } else if (
        mainCategory.toLowerCase().includes("health") ||
        mainCategory.toLowerCase().includes("santé") ||
        mainCategory.toLowerCase().includes("optique") ||
        name.toLowerCase().includes("optique")
      ) {
        return { icon: <MessageCircle size={20} />, color: "bg-lime-500" };
      } else {
        return { icon: <CreditCard size={20} />, color: "bg-gray-500" };
      }
    }

    // Then check category
    if (
      mainCategory.toLowerCase().includes("restaurant") ||
      mainCategory.toLowerCase().includes("food")
    ) {
      return { icon: <Utensils size={20} />, color: "bg-rose-500" };
    } else if (
      mainCategory.toLowerCase().includes("shop") ||
      mainCategory.toLowerCase().includes("store")
    ) {
      return { icon: <ShoppingCart size={20} />, color: "bg-orange-500" };
    } else if (mainCategory.toLowerCase().includes("transport")) {
      return { icon: <Bus size={20} />, color: "bg-blue-500" };
    } else if (
      mainCategory.toLowerCase().includes("train") ||
      name.toLowerCase().includes("sncf")
    ) {
      return { icon: <Train size={20} />, color: "bg-amber-500" };
    } else if (
      mainCategory.toLowerCase().includes("air") ||
      name.toLowerCase().includes("flight")
    ) {
      return { icon: <Plane size={20} />, color: "bg-purple-500" };
    } else if (
      mainCategory.toLowerCase().includes("bar") ||
      name.toLowerCase().includes("bar")
    ) {
      return { icon: <Beer size={20} />, color: "bg-rose-400" };
    } else if (
      mainCategory.toLowerCase().includes("auth") ||
      name.toLowerCase().includes("authorisation")
    ) {
      return { icon: <Building size={20} />, color: "bg-gray-400" };
    }

    // Default icon
    return { icon: <HelpCircle size={20} />, color: "bg-gray-500" };
  };

  // Format transaction title based on name patterns
  const formatTransactionTitle = () => {
    const name = transaction.name || "Transaction";

    // Special formatting for CARTE transactions
    if (name.toUpperCase().startsWith("CARTE")) {
      const parts = name.split(" ");
      // Format: "CARTE DD/MM/YY MERCHANT"
      if (parts.length >= 3) {
        const date = parts[1];
        const merchant = parts.slice(2).join(" ");
        return merchant;
      }
    }

    // Special formatting for VIR (transfer) transactions
    if (name.toUpperCase().startsWith("VIR")) {
      const parts = name.split(" ");
      // Format: "VIR INST MLLE PERSON NAME"
      if (parts.length >= 3) {
        // Try to extract person name
        return parts.slice(1).join(" ");
      }
    }

    // Special formatting for TH (authorization) transactions
    if (name.toUpperCase().startsWith("TH")) {
      const parts = name.split(" ");
      // Format: "TH MERCHANT LOCATION"
      if (parts.length >= 2) {
        return parts.slice(1).join(" ");
      }
    }

    return name;
  };

  // Get transaction subtitle (category or type)
  const getTransactionSubtitle = () => {
    // For card transactions, show the format "CARTE DD/MM/YY"
    if (
      transaction.name &&
      transaction.name.toUpperCase().startsWith("CARTE")
    ) {
      const parts = transaction.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
      }
    }

    // For transfers, show "Virements reçus"
    if (transaction.name && transaction.name.toUpperCase().includes("VIR")) {
      return "Virements reçus";
    }

    // For authorizations, show the appropriate text
    if (transaction.name && transaction.name.toUpperCase().includes("TH")) {
      return "Autorisation paiement en cours CB*9376";
    }

    // Default: show category if available
    if (transaction.category) {
      if (Array.isArray(transaction.category)) {
        // Format the first part of category array for display
        return transaction.category[0];
      }
      return transaction.category;
    }

    return "Non catégorisé";
  };

  // Get detailed subcategory if available
  const getDetailedSubcategory = () => {
    // For CARTE transactions with certain categories
    if (
      transaction.name &&
      transaction.name.toUpperCase().startsWith("CARTE")
    ) {
      // Check for restaurant category
      if (
        transaction.category &&
        (transaction.category.toString().toLowerCase().includes("restaurant") ||
          transaction.category.toString().toLowerCase().includes("bar"))
      ) {
        return "Restaurants, bars, discothèques...";
      }

      // Check for health/optical category
      if (
        transaction.name.toLowerCase().includes("jimmy fairly") ||
        transaction.name.toLowerCase().includes("optique")
      ) {
        return "Optique, audition...";
      }
    }

    return "";
  };

  // Determine if it's a debit or credit transaction
  const isDebit = transaction.amount > 0;

  // Get icon and color for this transaction
  const { icon, color } = getCategoryIconAndColor();

  // Get title and subtitles
  const title = formatTransactionTitle();
  const subtitle = getTransactionSubtitle();
  const detailedSubcategory = getDetailedSubcategory();

  return (
    <div className="flex items-center py-3 hover:bg-gray-50 transition-colors">
      {/* Show checkbox if needed */}
      {showCheckbox && (
        <div className="flex-shrink-0 mr-3">
          <input type="checkbox" className="h-5 w-5 rounded border-gray-300" />
        </div>
      )}

      {/* Category Icon */}
      <div
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center ${color} text-white rounded-full mr-4`}
      >
        {icon}
      </div>

      {/* Transaction Details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {detailedSubcategory && (
          <p className="text-xs text-gray-500">{detailedSubcategory}</p>
        )}
      </div>

      {/* Amount */}
      <div
        className={`flex-shrink-0 text-right font-medium ${
          isDebit ? "text-gray-800" : "text-green-600"
        }`}
      >
        {isDebit ? "− " : ""}
        {formatAmount(Math.abs(transaction.amount))}
      </div>
    </div>
  );
}
