// utils/transactionUtils.js
import * as icons from "lucide-react";
import categoriesData from "@/utils/categories.json";

/**
 * Convertit un nom d'icône en composant Lucide
 */
export const getIconComponent = (iconName) => {
  if (!iconName) return icons.HelpCircle;
  return icons[iconName] || icons.HelpCircle;
};

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return dateString;
  }
};

/**
 * Formate un montant avec le symbole €
 */
export const formatAmount = (amount) => {
  return Math.abs(amount).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
};

/**
 * Récupère les informations de catégorie à partir de l'ID
 */
export const getCategoryInfo = (categoryId, subcategoryId) => {
  // Catégorie par défaut
  const defaultCategory = {
    color: "#64748b",
    IconComponent: icons.HelpCircle,
    name: "Non catégorisé",
  };

  // Si pas de catégorie, retourner la valeur par défaut
  if (!categoryId) return defaultCategory;

  // Chercher la catégorie dans les données
  const categoryData = categoriesData[categoryId];
  if (!categoryData) return defaultCategory;

  // Chercher la sous-catégorie si elle existe
  if (
    subcategoryId &&
    categoryData.subcategories &&
    categoryData.subcategories[subcategoryId]
  ) {
    const subcategory = categoryData.subcategories[subcategoryId];
    return {
      color: subcategory.color || categoryData.color,
      IconComponent: getIconComponent(
        subcategory.iconName || categoryData.iconName
      ),
      name:
        subcategory.nameFr ||
        subcategory.name ||
        categoryData.nameFr ||
        categoryData.name,
    };
  }

  // Utiliser la catégorie principale
  return {
    color: categoryData.color,
    IconComponent: getIconComponent(categoryData.iconName),
    name: categoryData.nameFr || categoryData.name,
  };
};

/**
 * Fonction de comparaison personnalisée pour React.memo
 */
export const transactionPropsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.amount === nextProps.transaction.amount &&
    prevProps.transaction.merchant_name ===
      nextProps.transaction.merchant_name &&
    prevProps.transaction.date === nextProps.transaction.date &&
    JSON.stringify(prevProps.transaction.category) ===
      JSON.stringify(nextProps.transaction.category)
  );
};
