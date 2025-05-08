// components/CategoryPieChart.js
"use client";

import { useEffect, useRef, useState } from "react";
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

// Enregistrer les composants ECharts nécessaires
echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

export default function CategoryPieChart({
  transactions = [],
  selectedMonth = "",
  selectedYear = "",
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [currentLevel, setCurrentLevel] = useState("main");
  const [currentCategory, setCurrentCategory] = useState(null);

  // Filtrer les transactions en fonction du mois et de l'année sélectionnés
  const filteredTransactions = filterTransactionsByDate(
    transactions,
    selectedMonth,
    selectedYear
  );

  // Fonction pour préparer les données du graphique
  const prepareChartData = () => {
    // Ne prendre que les dépenses (montant positif)
    const expenses = filteredTransactions.filter((tx) => tx.amount > 0);

    if (currentLevel === "main") {
      // Premier niveau : catégories principales
      const categoriesMap = {};

      // Grouper par catégorie
      expenses.forEach((tx) => {
        const categoryId = tx.category?.id || "other";
        if (!categoriesMap[categoryId]) {
          categoriesMap[categoryId] = 0;
        }
        categoriesMap[categoryId] += tx.amount;
      });

      // Convertir en format pour ECharts
      return Object.keys(categoriesMap).map((categoryId) => {
        const { name, color } = getCategoryInfo(categoryId);
        return {
          value: categoriesMap[categoryId],
          name: name,
          itemStyle: { color },
          categoryId,
        };
      });
    } else {
      // Second niveau : sous-catégories
      const subcategoriesMap = {};

      // Filtrer les transactions de la catégorie sélectionnée
      const categoryTransactions = expenses.filter(
        (tx) => tx.category?.id === currentCategory
      );

      // Grouper par sous-catégorie
      categoryTransactions.forEach((tx) => {
        const subcategoryId = tx.category?.subcategory?.id || "unknown";
        if (!subcategoriesMap[subcategoryId]) {
          subcategoriesMap[subcategoryId] = 0;
        }
        subcategoriesMap[subcategoryId] += tx.amount;
      });

      // Convertir en format pour ECharts
      return Object.keys(subcategoriesMap).map((subcategoryId) => {
        const { name, color } = getCategoryInfo(currentCategory, subcategoryId);
        return {
          value: subcategoriesMap[subcategoryId],
          name: name,
          itemStyle: { color },
          subcategoryId,
        };
      });
    }
  };

  // Fonction pour revenir aux catégories principales
  const handleBackClick = () => {
    setCurrentLevel("main");
    setCurrentCategory(null);
  };

  // Fonction pour obtenir le titre du graphique
  const getChartTitle = () => {
    let title =
      currentLevel === "main"
        ? "Dépenses par catégorie"
        : `Dépenses - ${getCategoryInfo(currentCategory).name}`;

    // Ajouter le mois et l'année au titre si filtrés
    if (selectedMonth && selectedYear) {
      title += ` - ${selectedMonth} ${selectedYear}`;
    } else if (selectedMonth) {
      title += ` - ${selectedMonth}`;
    } else if (selectedYear) {
      title += ` - ${selectedYear}`;
    }

    return title;
  };

  // Initialiser et mettre à jour le graphique
  useEffect(() => {
    if (!chartRef.current) return;

    // Créer l'instance du graphique si elle n'existe pas
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Vérifier si nous avons des transactions filtrées
    if (filteredTransactions.length === 0 && (selectedMonth || selectedYear)) {
      // Si aucune transaction pour la période sélectionnée, afficher un message
      chartInstance.current.setOption({
        title: {
          text: `Aucune dépense${selectedMonth ? ` en ${selectedMonth}` : ""}${
            selectedYear ? ` ${selectedYear}` : ""
          }`,
          left: "center",
          top: "5%",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            color: "#888",
          },
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            data: [],
            radius: ["40%", "70%"],
          },
        ],
      });
      return;
    }

    // Si aucune transaction disponible du tout
    if (transactions.length === 0) {
      chartInstance.current.setOption({
        title: {
          text: "Aucune donnée disponible",
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            color: "#888",
          },
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            data: [],
            radius: ["40%", "70%"],
          },
        ],
      });
      return;
    }

    // Préparer les données pour le graphique
    const data = prepareChartData();

    // Vérifier si nous avons des données après filtrage et préparation
    if (data.length === 0) {
      // Si aucune dépense après filtrage (même avec des transactions)
      chartInstance.current.setOption({
        title: {
          text: `Aucune dépense${selectedMonth ? ` en ${selectedMonth}` : ""}${
            selectedYear ? ` ${selectedYear}` : ""
          }`,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            color: "#888",
          },
        },
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            data: [],
            radius: ["40%", "70%"],
          },
        ],
      });
      return;
    }

    // Configuration du graphique
    const option = {
      title: {
        text: getChartTitle(),
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} € ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        type: "scroll",
        pageIconSize: 12,
        pageTextStyle: {
          color: "#888",
        },
      },
      series: [
        {
          name: getChartTitle(),
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderWidth: 2,
            borderColor: "#fff",
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };

    // Mettre à jour le graphique
    chartInstance.current.setOption(option, true);

    // Ajouter l'événement de clic pour le drill-down
    if (currentLevel === "main") {
      chartInstance.current.on("click", (params) => {
        const categoryId = params.data.categoryId;
        setCurrentCategory(categoryId);
        setCurrentLevel("subcategory");
      });
    } else {
      // Retirer l'événement de clic si on est au niveau des sous-catégories
      chartInstance.current.off("click");
    }

    // Nettoyer l'événement lorsque le composant est démonté
    return () => {
      chartInstance.current.off("click");
    };
  }, [
    filteredTransactions,
    currentLevel,
    currentCategory,
    selectedMonth,
    selectedYear,
    transactions,
  ]);

  // Redimensionner le graphique lorsque la fenêtre est redimensionnée
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
      {/* Afficher le bouton de retour au-dessus du graphique si on est au niveau des sous-catégories */}
      {currentLevel === "subcategory" && (
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1" size={16} />
            Retour
          </Button>
        </div>
      )}
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </div>
  );
}
