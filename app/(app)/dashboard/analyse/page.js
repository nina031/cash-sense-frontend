"use client";

import { useState, useEffect, useRef } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import TransactionList from "@/components/TransactionList";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const monthsContainerRef = useRef(null);

  // États pour le filtrage
  const [transactionType, setTransactionType] = useState("Dépenses"); // "Dépenses" ou "Revenus"

  // État pour le mois sélectionné
  const [selectedMonth, setSelectedMonth] = useState("");

  // État pour le mois central (autour duquel on affiche les autres mois)
  const [centerMonth, setCenterMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  // Limites des transactions (mois le plus ancien et le plus récent)
  const [dateRange, setDateRange] = useState({
    oldest: null,
    newest: null,
  });

  // État pour les transactions (pour déterminer la plage de dates)
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer toutes les transactions pour déterminer la plage de dates
  useEffect(() => {
    const effectiveToken = isDemoMode ? demoAccessToken : null;

    if (!effectiveToken) {
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
          }/api/get_transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: effectiveToken }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setAllTransactions(data.transactions || []);

        // Déterminer la plage de dates des transactions
        if (data.transactions && data.transactions.length > 0) {
          const dates = data.transactions.map((t) => new Date(t.date));
          const oldestDate = new Date(Math.min(...dates));
          const newestDate = new Date(Math.max(...dates));

          setDateRange({
            oldest: {
              month: oldestDate.getMonth(),
              year: oldestDate.getFullYear(),
            },
            newest: {
              month: newestDate.getMonth(),
              year: newestDate.getFullYear(),
            },
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [isDemoMode, demoAccessToken]);

  // Initialiser le mois sélectionné au mois courant lors du chargement
  useEffect(() => {
    const currentDate = new Date();
    const currentMonthName = MONTHS[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    setSelectedMonth(`${currentMonthName} ${currentYear}`);
  }, []);

  // Gestionnaires d'événements
  const handleTypeChange = (type) => {
    setTransactionType(type);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Fonction pour vérifier si on peut défiler plus loin
  const canScrollLeft = () => {
    if (!dateRange.oldest) return false;

    // Calculer le mois le plus à gauche actuellement affiché
    const leftmostDate = new Date(centerMonth.year, centerMonth.month, 1);
    leftmostDate.setMonth(leftmostDate.getMonth() - 3);

    // Vérifier si on peut encore aller plus loin à gauche
    return (
      leftmostDate.getFullYear() > dateRange.oldest.year ||
      (leftmostDate.getFullYear() === dateRange.oldest.year &&
        leftmostDate.getMonth() > dateRange.oldest.month)
    );
  };

  const canScrollRight = () => {
    if (!dateRange.newest) return false;

    // Calculer le mois le plus à droite actuellement affiché
    const rightmostDate = new Date(centerMonth.year, centerMonth.month, 1);
    rightmostDate.setMonth(rightmostDate.getMonth() + 3);

    // Vérifier si on peut encore aller plus loin à droite
    return (
      rightmostDate.getFullYear() < dateRange.newest.year ||
      (rightmostDate.getFullYear() === dateRange.newest.year &&
        rightmostDate.getMonth() < dateRange.newest.month)
    );
  };

  // Fonction pour faire défiler les mois horizontalement
  const scrollMonths = (direction) => {
    // 1. Faire défiler visuellement
    if (monthsContainerRef.current) {
      const scrollAmount = 200;
      const container = monthsContainerRef.current;

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }

    // 2. Mettre à jour le mois central pour générer de nouveaux mois
    setCenterMonth((prev) => {
      let newMonth = prev.month;
      let newYear = prev.year;

      if (direction === "left" && canScrollLeft()) {
        // Reculer de 2 mois
        newMonth -= 2;
        // Ajuster l'année si nécessaire
        if (newMonth < 0) {
          newMonth += 12;
          newYear -= 1;
        }
      } else if (direction === "right" && canScrollRight()) {
        // Avancer de 2 mois
        newMonth += 2;
        // Ajuster l'année si nécessaire
        if (newMonth > 11) {
          newMonth -= 12;
          newYear += 1;
        }
      }

      return { month: newMonth, year: newYear };
    });
  };

  // Générer un tableau de mois à afficher (limité aux transactions disponibles)
  const generateMonthsToDisplay = () => {
    if (!dateRange.oldest || !dateRange.newest) {
      // Si nous n'avons pas encore de plage de dates, afficher uniquement le mois courant
      const today = new Date();
      return [`${MONTHS[today.getMonth()]} ${today.getFullYear()}`];
    }

    const months = [];

    // Commencer 3 mois avant le mois central (ou au mois le plus ancien si plus récent)
    const startDate = new Date(centerMonth.year, centerMonth.month, 1);
    startDate.setMonth(startDate.getMonth() - 3);

    // Ajuster la date de début si elle est antérieure au mois le plus ancien
    const oldestDate = new Date(
      dateRange.oldest.year,
      dateRange.oldest.month,
      1
    );
    if (startDate < oldestDate) {
      startDate.setTime(oldestDate.getTime());
    }

    // Calculer le mois de fin (limité au mois le plus récent)
    const endDate = new Date(centerMonth.year, centerMonth.month, 1);
    endDate.setMonth(endDate.getMonth() + 3);

    const newestDate = new Date(
      dateRange.newest.year,
      dateRange.newest.month,
      1
    );
    const currentDate = new Date();
    currentDate.setDate(1); // Premier jour du mois courant

    // Utiliser la date la plus récente entre le mois actuel et le mois de la transaction la plus récente
    const maxDate = new Date(
      Math.min(
        Math.max(newestDate.getTime(), currentDate.getTime()),
        endDate.getTime()
      )
    );

    // Générer les mois entre la date de début et la date de fin
    const currentDateStr = startDate.toISOString();
    while (startDate <= maxDate) {
      const monthName = MONTHS[startDate.getMonth()];
      const year = startDate.getFullYear();
      months.push(`${monthName} ${year}`);
      startDate.setMonth(startDate.getMonth() + 1);
    }

    return months;
  };

  const monthsToDisplay = generateMonthsToDisplay();

  // Vérifier si les boutons de navigation doivent être désactivés
  const disableLeftButton = !canScrollLeft();
  const disableRightButton = !canScrollRight();

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

      {/* Sélecteur de mois avec boutons de navigation */}
      <div className="flex justify-center items-center py-4 mb-4">
        <div className="flex items-center max-w-3xl">
          {/* Bouton précédent - recule dans le temps */}
          <button
            onClick={() => scrollMonths("left")}
            disabled={disableLeftButton}
            className={`h-8 w-8 rounded-full flex items-center justify-center mx-2 ${
              disableLeftButton
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label="Mois précédents"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Liste des mois scrollable */}
          <div
            ref={monthsContainerRef}
            className="flex overflow-x-auto py-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <div className="flex justify-center items-center px-4">
                <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
                <span className="ml-2 text-gray-600">Chargement...</span>
              </div>
            ) : (
              <div className="flex space-x-3">
                {monthsToDisplay.map((month) => {
                  const isSelected = selectedMonth === month;

                  return (
                    <button
                      key={month}
                      className={`whitespace-nowrap px-4 py-2 rounded-full flex-shrink-0 ${
                        isSelected
                          ? "bg-[#8367c7] text-white"
                          : "bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                      onClick={() => handleMonthChange(month)}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bouton suivant - avance dans le temps */}
          <button
            onClick={() => scrollMonths("right")}
            disabled={disableRightButton}
            className={`h-8 w-8 rounded-full flex items-center justify-center mx-2 ${
              disableRightButton
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            aria-label="Mois suivants"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Liste des transactions filtrées */}
      <div className="bg-white rounded-lg p-6">
        {selectedMonth && (
          <TransactionList
            accessToken={isDemoMode ? demoAccessToken : null}
            filter={{
              type: transactionType,
              month: selectedMonth,
            }}
          />
        )}
      </div>

      {/* Style pour masquer la scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
