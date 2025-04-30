// components/TransactionsPieChart.js
"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getCategoryColor } from "@/utils/categoryUtils";

export default function TransactionsPieChart({
  transactions,
  onCategoryClick,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentCategoryPath, setCurrentCategoryPath] = useState([]);

  /**
   * Normalizes a category into array format
   * @param {string|array|null} category - The category to normalize
   * @returns {array} - Normalized category array
   */
  const normalizeCategory = (category) => {
    if (!category) return ["Non catégorisé"];
    if (typeof category === "string") {
      if (category === "Non catégorisé") return ["Non catégorisé"];
      return category.split(",").map((cat) => cat.trim());
    }
    if (Array.isArray(category)) return category;
    return ["Non catégorisé"];
  };

  // Fonction pour extraire le niveau de catégorie approprié d'une transaction
  const getCategoryAtLevel = (transaction, level = 0) => {
    if (!transaction.category) return "Non catégorisé";

    // Normaliser la catégorie en format tableau
    const categoryArray = normalizeCategory(transaction.category);

    // Si le niveau demandé n'existe pas, renvoyer le niveau le plus profond
    if (level >= categoryArray.length) {
      return categoryArray[categoryArray.length - 1];
    }

    return categoryArray[level];
  };

  // Fonction pour vérifier si une transaction appartient à un chemin de catégorie
  const transactionMatchesCategoryPath = (transaction) => {
    if (currentCategoryPath.length === 0) return true;

    // Normaliser la catégorie en format tableau
    const categoryArray = normalizeCategory(transaction.category);

    // Vérifier si la catégorie correspond au chemin actuel
    for (let i = 0; i < currentCategoryPath.length; i++) {
      if (
        i >= categoryArray.length ||
        currentCategoryPath[i] !== categoryArray[i]
      ) {
        return false;
      }
    }

    return true;
  };

  // Cette fonction regroupe les transactions par catégorie selon le niveau actuel
  const processTransactionsData = (transactions) => {
    // Filtrer les transactions selon le chemin de catégorie actuel
    const filteredTransactions = transactions.filter((transaction) => {
      return (
        transaction.amount > 0 && transactionMatchesCategoryPath(transaction)
      );
    });

    // Déterminer le niveau actuel de la catégorie à afficher
    const currentLevel = currentCategoryPath.length;

    // Créer un objet pour accumuler les montants par catégorie
    const categoryTotals = {};

    filteredTransactions.forEach((transaction) => {
      // Extraire la catégorie au niveau actuel
      const category = getCategoryAtLevel(transaction, currentLevel);

      // Si la catégorie n'existe pas encore, l'initialiser à 0
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      // Ajouter le montant à la catégorie
      categoryTotals[category] += transaction.amount;
    });

    // Convertir l'objet en tableau pour ECharts avec les couleurs appropriées
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)), // Arrondir à 2 décimales
      itemStyle: {
        color: getCategoryColor(name), // Utiliser la couleur définie dans notre configuration
      },
    }));
  };

  // Gérer le clic sur une catégorie
  const handleCategoryClick = (category) => {
    // Mettre à jour le chemin de la catégorie
    const newPath = [...currentCategoryPath, category];
    setCurrentCategoryPath(newPath);

    // Notifier le composant parent
    if (onCategoryClick) {
      onCategoryClick(category, newPath);
    }
  };

  // Fonction pour revenir au niveau précédent
  const handleBackClick = () => {
    if (currentCategoryPath.length > 0) {
      const newPath = currentCategoryPath.slice(0, -1);
      setCurrentCategoryPath(newPath);

      // Notifier le composant parent avec la catégorie du niveau précédent
      if (onCategoryClick) {
        const lastCategory =
          newPath.length > 0 ? newPath[newPath.length - 1] : "";
        onCategoryClick(lastCategory, newPath);
      }
    }
  };

  useEffect(() => {
    // Si aucune transaction n'est disponible, ne rien faire
    if (!transactions || transactions.length === 0) return;

    // Initialiser le graphique si ce n'est pas déjà fait
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Préparer les données pour le graphique
    const pieData = processTransactionsData(transactions);

    // Configuration de l'option pour le pie chart
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}€ ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        type: "scroll",
      },
      series: [
        {
          name: "Dépenses",
          type: "pie",
          radius: ["40%", "70%"], // Graphique en forme d'anneau
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData,
        },
      ],
    };

    // Appliquer les options au graphique
    chartInstance.current.setOption(option);

    // Ajouter un événement de clic pour filtrer la liste des transactions
    chartInstance.current.on("click", (params) => {
      if (params.data) {
        handleCategoryClick(params.data.name);
      }
    });

    // Nettoyer le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [transactions, currentCategoryPath, onCategoryClick]);

  // Redimensionner le graphique lorsque la fenêtre change de taille
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg mb-6">
      {/* Bouton de retour si nous sommes dans une sous-catégorie */}
      {currentCategoryPath.length > 0 && (
        <button
          onClick={handleBackClick}
          className="mb-4 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded border border-blue-200 text-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>
      )}

      <div ref={chartRef} style={{ height: "400px" }}></div>
    </div>
  );
}
