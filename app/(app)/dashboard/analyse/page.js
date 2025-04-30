"use client";

import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import TransactionList from "@/components/TransactionList";
import TransactionsPieChart from "@/components/TransactionsPieChart";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tableau des mois en français
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function TransactionsPage() {
  const { isDemoMode, demoAccessToken } = useDemoMode();

  // États pour le filtrage
  const [transactionType, setTransactionType] = useState("Dépenses"); // "Dépenses" ou "Revenus"
  const [selectedMonth, setSelectedMonth] = useState(""); // Mois sélectionné
  const [selectedYear, setSelectedYear] = useState(""); // Année sélectionnée
  const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie sélectionnée
  const [categoryPath, setCategoryPath] = useState([]); // Chemin de catégorie hiérarchique
  const [isMonthOpen, setIsMonthOpen] = useState(false); // État pour le dropdown des mois
  const [isYearOpen, setIsYearOpen] = useState(false); // État pour le dropdown des années
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]); // Toutes les transactions

  // Générer les années (de l'année actuelle à 5 ans en arrière)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, index) => currentYear - index);

  // Initialiser les filtres aux valeurs par défaut (mois et année actuels)
  useEffect(() => {
    const currentDate = new Date();
    setSelectedMonth(MONTHS[currentDate.getMonth()]);
    setSelectedYear(currentDate.getFullYear());
  }, []);

  // Gestionnaires d'événements
  const handleTypeChange = (type) => {
    setTransactionType(type);
    // Réinitialiser la catégorie sélectionnée lors du changement de type
    setSelectedCategory("");
    setCategoryPath([]);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    // Réinitialiser la catégorie sélectionnée lors du changement de mois
    setSelectedCategory("");
    setCategoryPath([]);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    // Réinitialiser la catégorie sélectionnée lors du changement d'année
    setSelectedCategory("");
    setCategoryPath([]);
  };

  // Gestionnaire pour le clic sur une catégorie dans le pie chart
  const handleCategoryClick = (category, path) => {
    if (path) {
      // Si nous recevons un chemin complet, l'utiliser
      setCategoryPath(path);
      setSelectedCategory(path.length > 0 ? path[path.length - 1] : "");
    } else {
      // Sinon, ajouter la catégorie au chemin actuel (pour compatibilité)
      setSelectedCategory(category);
      if (category) {
        setCategoryPath([category]);
      } else {
        setCategoryPath([]);
      }
    }
  };

  // Formater la date pour le composant TransactionList
  const formattedDate =
    selectedMonth && selectedYear ? `${selectedMonth} ${selectedYear}` : "";

  // Callback pour recevoir toutes les transactions chargées
  const handleTransactionsLoaded = (transactions) => {
    setAllTransactions(transactions);
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

      {/* Filtres Mois et Année */}
      <div className="flex justify-center gap-4 py-6">
        {/* Filtre Mois - Style shadcn mais avec design personnalisé */}
        <div className="w-48">
          <DropdownMenu open={isMonthOpen} onOpenChange={setIsMonthOpen}>
            <DropdownMenuTrigger className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center justify-between hover:border-gray-300 focus:outline-none">
              <span className="text-gray-700">{selectedMonth || "Mois"}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-0">
              {MONTHS.map((month) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className={`px-4 py-2 cursor-pointer focus:bg-gray-100 focus:text-gray-900 ${
                    selectedMonth === month
                      ? "bg-gray-100 flex items-center justify-between"
                      : ""
                  }`}
                >
                  <span>{month}</span>
                  {selectedMonth === month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filtre Année - Style shadcn mais avec design personnalisé */}
        <div className="w-36">
          <DropdownMenu open={isYearOpen} onOpenChange={setIsYearOpen}>
            <DropdownMenuTrigger className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex items-center justify-between hover:border-gray-300 focus:outline-none">
              <span className="text-gray-700">{selectedYear || "Année"}</span>
              <ChevronDown size={16} className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-0">
              {years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-4 py-2 cursor-pointer focus:bg-gray-100 focus:text-gray-900 ${
                    selectedYear === year
                      ? "bg-gray-100 flex items-center justify-between"
                      : ""
                  }`}
                >
                  <span>{year}</span>
                  {selectedYear === year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Layout en deux colonnes pour le pie chart et la liste des transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(86vh-180px)]">
        {/* Colonne de gauche - Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 ">
          {formattedDate && (
            <TransactionsPieChart
              transactions={allTransactions}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </div>

        {/* Colonne de droite - Liste des transactions avec défilement */}
        <div className="bg-white rounded-lg p-6 overflow-hidden shadow-lg border border-gray-100">
          <div className="h-full overflow-y-auto pr-2">
            {formattedDate && (
              <TransactionList
                accessToken={isDemoMode ? demoAccessToken : null}
                filter={{
                  type: transactionType,
                  month: formattedDate,
                  category: selectedCategory,
                  categoryPath: categoryPath,
                }}
                onTransactionsLoaded={handleTransactionsLoaded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
