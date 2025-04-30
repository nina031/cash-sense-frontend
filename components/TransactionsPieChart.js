// components/TransactionsPieChart.js
"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

export default function TransactionsPieChart({
  transactions,
  onCategoryClick,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentCategoryPath, setCurrentCategoryPath] = useState([]);
  const [chartTitle, setChartTitle] = useState(
    "Répartition des dépenses par catégorie"
  );

  // Fonction pour extraire le niveau de catégorie approprié d'une transaction
  const getCategoryAtLevel = (transaction, level = 0) => {
    if (!transaction.category) return "Non catégorisé";

    // Si la catégorie est une chaîne, la traiter comme une catégorie unique
    if (typeof transaction.category === "string") {
      return transaction.category;
    }

    // Si la catégorie est un tableau, extraire le niveau approprié
    if (Array.isArray(transaction.category)) {
      // Si le niveau demandé n'existe pas, renvoyer le niveau le plus profond
      if (level >= transaction.category.length) {
        return transaction.category[transaction.category.length - 1];
      }
      return transaction.category[level];
    }

    return "Non catégorisé";
  };

  // Fonction pour vérifier si une transaction appartient à un chemin de catégorie
  const transactionMatchesCategoryPath = (transaction) => {
    if (currentCategoryPath.length === 0) return true;

    if (!transaction.category) return false;

    // Si la catégorie est une chaîne, vérifier si elle correspond à la première partie du chemin
    if (typeof transaction.category === "string") {
      return currentCategoryPath[0] === transaction.category;
    }

    // Si la catégorie est un tableau, vérifier si elle correspond au chemin
    if (Array.isArray(transaction.category)) {
      for (let i = 0; i < currentCategoryPath.length; i++) {
        if (
          i >= transaction.category.length ||
          currentCategoryPath[i] !== transaction.category[i]
        ) {
          return false;
        }
      }
      return true;
    }

    return false;
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

    // Convertir l'objet en tableau pour ECharts
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)), // Arrondir à 2 décimales
    }));
  };

  // Gérer le clic sur une catégorie
  const handleCategoryClick = (category) => {
    // Mettre à jour le chemin de la catégorie
    const newPath = [...currentCategoryPath, category];
    setCurrentCategoryPath(newPath);

    // Mettre à jour le titre du graphique
    setChartTitle(`Dépenses: ${newPath.join(" > ")}`);

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

      // Mettre à jour le titre du graphique
      if (newPath.length === 0) {
        setChartTitle("Répartition des dépenses par catégorie");
      } else {
        setChartTitle(`Dépenses: ${newPath.join(" > ")}`);
      }

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
      title: {
        text: chartTitle,
        left: "center",
      },
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
  }, [transactions, currentCategoryPath, chartTitle, onCategoryClick]);

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
