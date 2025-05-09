// components/CategoryPieChart.js
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { getCategoryInfo } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { filterTransactionsByDate } from "@/utils/dateUtils";
import { TRANSACTION_TYPES } from "@/hooks/useTransactionTypeFilter";

// Enregistrer les composants ECharts nécessaires
echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

// Composant de légende personnalisé sans défilement
function CustomLegend({ data, onItemClick, currentLevel }) {
  if (!data || data.length === 0) return null;

  // Trier les données par valeur (montant) en ordre décroissant et limiter à 7 éléments
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 7);

  return (
    <div className="flex flex-col space-y-2 pr-2">
      {sortedData.map((item, index) => {
        // Obtenir les informations de catégorie
        const IconComponent = item.IconComponent;
        const isClickable = currentLevel === "main" && item.categoryId;

        return (
          <div
            key={index}
            className={`flex items-center ${
              isClickable ? "cursor-pointer hover:bg-gray-50 rounded-md" : ""
            }`}
            onClick={() => isClickable && onItemClick(item.categoryId)}
            title={isClickable ? `Voir le détail de ${item.name}` : ""}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
              style={{ backgroundColor: item.itemStyle.color }}
            >
              <IconComponent size={14} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{item.name}</span>
              <span className="text-gray-600 text-xs">
                {item.value.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CategoryPieChart({
  transactions = [],
  selectedMonth = "",
  selectedYear = "",
  transactionType = TRANSACTION_TYPES.EXPENSES,
}) {
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const resizeObserver = useRef(null);
  const [currentLevel, setCurrentLevel] = useState("main");
  const [currentCategory, setCurrentCategory] = useState(null);

  // Filtrer les transactions par date
  const dateFilteredTransactions = filterTransactionsByDate(
    transactions,
    selectedMonth,
    selectedYear
  );

  // Fonction pour basculer vers le drill-down
  const handleDrillDown = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentLevel("subcategory");
  };

  // Filtrer par type de transaction (dépenses ou revenus)
  const filteredByType = useMemo(() => {
    return dateFilteredTransactions.filter((tx) => {
      if (transactionType === TRANSACTION_TYPES.EXPENSES) {
        return tx.amount > 0;
      } else if (transactionType === TRANSACTION_TYPES.INCOME) {
        return tx.amount < 0;
      }
      return true;
    });
  }, [dateFilteredTransactions, transactionType]);

  // Calculer la somme totale en fonction du niveau actuel
  const totalAmount = useMemo(() => {
    if (currentLevel === "main") {
      // Afficher le total de toutes les transactions
      return filteredByType.reduce(
        (total, tx) => total + Math.abs(tx.amount),
        0
      );
    } else {
      // Afficher uniquement le total de la catégorie sélectionnée
      return filteredByType
        .filter((tx) => tx.category?.id === currentCategory)
        .reduce((total, tx) => total + Math.abs(tx.amount), 0);
    }
  }, [filteredByType, currentLevel, currentCategory]);

  // Utiliser useMemo pour calculer les données du graphique
  const chartData = useMemo(() => {
    if (currentLevel === "main") {
      // Premier niveau : catégories principales
      const categoriesMap = {};

      // Grouper par catégorie
      filteredByType.forEach((tx) => {
        const categoryId = tx.category?.id || "other";
        if (!categoriesMap[categoryId]) {
          categoriesMap[categoryId] = 0;
        }
        categoriesMap[categoryId] += Math.abs(tx.amount);
      });

      // Convertir en format pour ECharts et notre légende personnalisée
      return Object.keys(categoriesMap).map((categoryId) => {
        const { name, color, IconComponent } = getCategoryInfo(categoryId);
        return {
          value: categoriesMap[categoryId],
          name: name,
          itemStyle: { color },
          categoryId,
          IconComponent, // Pour notre légende personnalisée
        };
      });
    } else {
      // Second niveau : sous-catégories
      const subcategoriesMap = {};

      // Filtrer les transactions de la catégorie sélectionnée
      const categoryTransactions = filteredByType.filter(
        (tx) => tx.category?.id === currentCategory
      );

      // Grouper par sous-catégorie
      categoryTransactions.forEach((tx) => {
        const subcategoryId = tx.category?.subcategory?.id || "unknown";
        if (!subcategoriesMap[subcategoryId]) {
          subcategoriesMap[subcategoryId] = 0;
        }
        subcategoriesMap[subcategoryId] += Math.abs(tx.amount);
      });

      // Convertir en format pour ECharts et notre légende personnalisée
      return Object.keys(subcategoriesMap).map((subcategoryId) => {
        const { name, color, IconComponent } = getCategoryInfo(
          currentCategory,
          subcategoryId
        );
        return {
          value: subcategoriesMap[subcategoryId],
          name: name,
          itemStyle: { color },
          subcategoryId,
          IconComponent, // Pour notre légende personnalisée
        };
      });
    }
  }, [filteredByType, currentLevel, currentCategory]);

  // Fonction pour revenir aux catégories principales
  const handleBackClick = () => {
    setCurrentLevel("main");
    setCurrentCategory(null);
  };

  // Initialiser et mettre à jour le graphique
  useEffect(() => {
    if (!chartRef.current) return;

    // Créer l'instance du graphique si elle n'existe pas
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Vérifier si nous avons des données après filtrage et préparation
    if (
      dateFilteredTransactions.length === 0 ||
      transactions.length === 0 ||
      chartData.length === 0
    ) {
      // Si aucune donnée disponible
      chartInstance.current.setOption({
        title: { show: false },
        tooltip: { show: false },
        legend: { show: false },
        series: [{ type: "pie", data: [], radius: ["40%", "70%"] }],
      });
      return;
    }

    // Configuration du graphique
    const option = {
      title: { show: false },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} € ({d}%)",
      },
      legend: {
        show: false, // Cacher la légende native d'ECharts
      },
      series: [
        {
          type: "pie",
          radius: ["30%", "75%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          labelLine: { show: false },
          data: chartData,
        },
      ],
    };

    // Mettre à jour le graphique
    chartInstance.current.setOption(option, true);

    // Ajouter l'événement de clic pour le drill-down
    chartInstance.current.off("click"); // Supprimer les anciens gestionnaires d'événements

    if (currentLevel === "main") {
      chartInstance.current.on("click", (params) => {
        if (params.data && params.data.categoryId) {
          handleDrillDown(params.data.categoryId);
        }
      });
    }

    // Nettoyer l'événement lorsque le composant est démonté
    return () => {
      if (chartInstance.current) {
        chartInstance.current.off("click");
      }
    };
  }, [chartData, dateFilteredTransactions, currentLevel, transactions]);

  // Configurer le ResizeObserver pour détecter les changements de taille du conteneur
  useEffect(() => {
    if (!chartContainerRef.current || !chartInstance.current) return;

    // Créer un ResizeObserver pour surveiller les changements de taille
    resizeObserver.current = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });

    // Observer le conteneur parent
    resizeObserver.current.observe(chartContainerRef.current);

    // Nettoyer l'observateur lors du démontage
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  // Redimensionner le graphique lorsque la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Déterminer le texte du titre
  const titleText =
    currentLevel === "main"
      ? `Total des ${
          transactionType === TRANSACTION_TYPES.EXPENSES
            ? "dépenses"
            : "revenus"
        }`
      : `${getCategoryInfo(currentCategory).name}`;

  return (
    <div ref={chartContainerRef} className="w-full">
      {/* Bouton de retour uniquement en mode sous-catégorie */}
      {currentLevel === "subcategory" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="flex items-center mb-2 bg-gray-100 hover:bg-gray-200"
        >
          <ChevronLeft className="mr-1" size={16} />
          Retour
        </Button>
      )}

      {/* Disposition du graphique et de la légende côte à côte */}
      <div className="flex flex-row">
        {/* Légende à gauche */}
        <div className="flex items-center">
          <CustomLegend
            data={chartData}
            onItemClick={handleDrillDown}
            currentLevel={currentLevel}
          />
        </div>

        {/* Graphique circulaire à droite avec titre aligné */}
        <div className="w-2/3">
          {/* Titre et montant alignés avec le graphique */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              {titleText}
            </h2>
            <p className="text-2xl font-bold text-center">
              {totalAmount.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            {/* Graphique */}
            <div
              ref={chartRef}
              style={{ height: "300px", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
