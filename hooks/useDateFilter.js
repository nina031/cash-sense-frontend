import { useState, useEffect } from "react";
import {
  MONTHS,
  generateYears,
  getCurrentMonthAndYear,
} from "@/utils/dateUtils";

export function useDateFilter(onMonthChange, onYearChange) {
  // États pour les valeurs sélectionnées
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // États pour les dropdown
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  // Obtenir les années pour le dropdown
  const years = generateYears();

  // Initialiser les filtres aux valeurs par défaut
  useEffect(() => {
    const { month, year } = getCurrentMonthAndYear();

    setSelectedMonth(month);
    setSelectedYear(year);

    // Notifier le parent des valeurs initiales
    if (onMonthChange) onMonthChange(month);
    if (onYearChange) onYearChange(year);
  }, [onMonthChange, onYearChange]);

  // Gestionnaires d'événements
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setIsMonthOpen(false);
    if (onMonthChange) onMonthChange(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsYearOpen(false);
    if (onYearChange) onYearChange(year);
  };

  return {
    selectedMonth,
    selectedYear,
    isMonthOpen,
    isYearOpen,
    years,
    setIsMonthOpen,
    setIsYearOpen,
    handleMonthChange,
    handleYearChange,
  };
}
