// utils/categoryUtils.js
import * as icons from "lucide-react";
import categoriesData from "./categories.json";

// Fonction qui convertit le nom de l'icône en composant React
function getIconComponent(iconName) {
  if (!iconName) return icons.HelpCircle;
  return icons[iconName] || icons.HelpCircle;
}

// Ajoute les composants d'icônes aux données des catégories et structure les données pour un accès facile
export const categories = Object.entries(categoriesData).reduce(
  (acc, [key, category]) => {
    // Ajouter le composant d'icône à la catégorie principale
    const categoryWithIcon = {
      ...category,
      icon: category.iconName
        ? getIconComponent(category.iconName)
        : icons.HelpCircle,
    };

    // Traiter les sous-catégories si elles existent
    if (category.subcategories) {
      categoryWithIcon.subcategories = Object.entries(
        category.subcategories
      ).reduce((subAcc, [subKey, subCategory]) => {
        subAcc[subKey] = {
          ...subCategory,
          icon: subCategory.iconName
            ? getIconComponent(subCategory.iconName)
            : categoryWithIcon.icon || icons.HelpCircle,
          parentCategoryId: key, // Référence à la catégorie parente
          parentCategory: categoryWithIcon, // Pour faciliter l'accès
        };
        return subAcc;
      }, {});
    }

    acc[key] = categoryWithIcon;
    return acc;
  },
  {}
);

// Création d'un index plat pour faciliter les recherches par nom
export const categoryIndex = {};
export const subcategoryIndex = {};

// Remplir les index avec les catégories et sous-catégories
Object.entries(categories).forEach(([key, category]) => {
  // Ajouter la catégorie principale à l'index
  categoryIndex[category.name.toLowerCase()] = key;
  categoryIndex[category.nameFr.toLowerCase()] = key;

  // Ajouter les sous-catégories à l'index si elles existent
  if (category.subcategories) {
    Object.entries(category.subcategories).forEach(([subKey, subCategory]) => {
      subcategoryIndex[subCategory.name.toLowerCase()] = {
        parentKey: key,
        subKey: subKey,
      };
      subcategoryIndex[subCategory.nameFr.toLowerCase()] = {
        parentKey: key,
        subKey: subKey,
      };
    });
  }
});

/**
 * Table de correspondance entre les catégories du backend et notre configuration
 * Ceci permet de faire des correspondances même quand les noms ne sont pas exactement les mêmes
 */
const categoryMappings = {
  // Mappings pour les catégories de Plaid/autres APIs
  "Food and Drink": "foodAndDrink",
  Restaurants: "foodAndDrink.restaurants",
  "Fast Food": "foodAndDrink.fastFood",
  Bars: "foodAndDrink.bars",
  Shopping: "shopping",
  Shops: "shopping",
  Clothing: "shopping.clothing",
  Electronics: "shopping.electronics",
  "Sporting Goods": "shopping.sportingGoods",
  Transport: "transport",
  Transportation: "transport",
  "Public Transport": "transport.publicTransport",
  Taxi: "transport.taxi",
  Travel: "travel",
  "Airlines and Aviation Services": "travel.flights",
  Hotels: "travel.hotels",
  Train: "travel.trainTickets",
  Payment: "payment",
  Payments: "payment",
  "Credit Card": "payment.creditCard",
  "Bills & Utilities": "payment.bills",
  Subscription: "payment.subscription",
  Transfer: "transfer",
  Transfers: "transfer",
  "Bank Transfer": "transfer.bankTransfer",
  Health: "health",
  Healthcare: "health",
  Medical: "health.medical",
  Pharmacy: "health.pharmacy",
  Optical: "health.optical",
};

/**
 * Normalise une catégorie dans un format de tableau
 * @param {string|array|null} category - La catégorie à normaliser
 * @returns {array} - Catégorie normalisée
 */
export function normalizeCategory(category) {
  if (!category) return ["Non catégorisé"];
  if (typeof category === "string") {
    if (category === "Non catégorisé") return ["Non catégorisé"];
    return category.split(",").map((cat) => cat.trim());
  }
  if (Array.isArray(category)) return category;
  return ["Non catégorisé"];
}

/**
 * Fait correspondre une catégorie du backend à notre configuration
 * @param {string} categoryName - Nom de la catégorie provenant du backend
 * @returns {Object} - Information sur la catégorie correspondante (avec clé de catégorie et sous-catégorie si applicable)
 */
export function mapBackendCategory(categoryName) {
  if (!categoryName) return { categoryKey: "other" };

  // Vérifier les correspondances directes dans la table de mapping
  if (categoryMappings[categoryName]) {
    const mapping = categoryMappings[categoryName];
    const parts = mapping.split(".");

    if (parts.length === 1) {
      // C'est une catégorie principale
      return { categoryKey: parts[0] };
    } else if (parts.length === 2) {
      // C'est une sous-catégorie
      return {
        categoryKey: parts[0],
        subcategoryKey: parts[1],
      };
    }
  }

  // Recherche dans nos index
  const lowerCaseName = categoryName.toLowerCase();

  // Vérifier dans l'index des catégories principales
  if (categoryIndex[lowerCaseName]) {
    return { categoryKey: categoryIndex[lowerCaseName] };
  }

  // Vérifier dans l'index des sous-catégories
  if (subcategoryIndex[lowerCaseName]) {
    const { parentKey, subKey } = subcategoryIndex[lowerCaseName];
    return {
      categoryKey: parentKey,
      subcategoryKey: subKey,
    };
  }

  // Recherche par mots-clés dans nos catégories
  for (const [key, category] of Object.entries(categories)) {
    if (category.keywords) {
      for (const keyword of category.keywords) {
        if (lowerCaseName.includes(keyword.toLowerCase())) {
          return { categoryKey: key };
        }
      }
    }
  }

  return { categoryKey: "other" };
}

/**
 * Trouve une catégorie basée sur le nom de la transaction ou la description
 * @param {string} transactionName - Nom ou description de la transaction
 * @param {Array|string} existingCategory - Catégorie existante si disponible
 * @returns {Object} Catégorie trouvée ou catégorie "autres" par défaut
 */
export function findCategoryByTransaction(
  transactionName,
  existingCategory = null
) {
  // Si on a déjà une catégorie, on essaie de la trouver dans notre configuration
  if (existingCategory) {
    const existingCategoryArray = normalizeCategory(existingCategory);
    const mainCategoryName = existingCategoryArray[0];

    // Mapper la catégorie principale à notre configuration
    const { categoryKey, subcategoryKey } =
      mapBackendCategory(mainCategoryName);

    // Si on a une catégorie correspondante
    if (categories[categoryKey]) {
      // Si on a aussi trouvé une sous-catégorie
      if (
        subcategoryKey &&
        categories[categoryKey].subcategories &&
        categories[categoryKey].subcategories[subcategoryKey]
      ) {
        return categories[categoryKey].subcategories[subcategoryKey];
      }

      // Si la catégorie du backend a plus d'un niveau et qu'on n'a pas trouvé de correspondance précise
      if (existingCategoryArray.length > 1) {
        // Chercher parmi les sous-catégories disponibles
        const subCategoryName = existingCategoryArray[1];
        if (categories[categoryKey].subcategories) {
          for (const [subKey, subCat] of Object.entries(
            categories[categoryKey].subcategories
          )) {
            if (
              subCat.name === subCategoryName ||
              subCat.nameFr === subCategoryName
            ) {
              return subCat;
            }
          }
        }
      }

      // Retourner la catégorie principale
      return categories[categoryKey];
    }
  }

  // Normaliser le nom de la transaction pour la recherche par mots-clés
  const normalizedName = transactionName.toLowerCase();

  // Cas spéciaux basés sur l'expérience
  if (normalizedName.startsWith("carte")) {
    // Pour les transactions de carte, vérifier s'il y a des indices sur le type
    if (
      normalizedName.includes("restaurant") ||
      normalizedName.includes("bar") ||
      normalizedName.includes("cafe")
    ) {
      const subcat = normalizedName.includes("bar") ? "bars" : "restaurants";
      return (
        categories.foodAndDrink.subcategories[subcat] || categories.foodAndDrink
      );
    }

    if (normalizedName.includes("optique")) {
      return categories.health.subcategories.optical || categories.health;
    }

    if (
      normalizedName.includes("pharmacie") ||
      normalizedName.includes("pharmacy")
    ) {
      return categories.health.subcategories.pharmacy || categories.health;
    }

    // Par défaut, considérer comme un paiement par carte de crédit
    return categories.payment.subcategories.creditCard || categories.payment;
  }

  if (normalizedName.startsWith("vir") || normalizedName.includes("virement")) {
    return (
      categories.transfer.subcategories.bankTransfer || categories.transfer
    );
  }

  if (
    normalizedName.startsWith("th") ||
    normalizedName.includes("autorisation")
  ) {
    return categories.payment.subcategories.creditCard || categories.payment;
  }

  // Recherche par mots-clés dans notre configuration
  for (const [key, category] of Object.entries(categories)) {
    if (category.keywords) {
      // Vérifier si un mot-clé correspond
      for (const keyword of category.keywords) {
        if (normalizedName.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
  }

  // Catégorie par défaut
  return categories.other;
}

/**
 * Obtient la couleur hexadécimale pour une catégorie
 * @param {string|Object} category - Nom de la catégorie ou objet catégorie
 * @returns {string} Code couleur hexadécimal
 */
export function getCategoryColor(category) {
  if (!category) return categories.other.color;

  // Si on a un objet catégorie, retourner sa couleur
  if (typeof category === "object") {
    return category.color || categories.other.color;
  }

  // Si on a un nom de catégorie, essayer de le mapper à notre configuration
  const { categoryKey, subcategoryKey } = mapBackendCategory(category);

  // Si on a trouvé une sous-catégorie
  if (
    subcategoryKey &&
    categories[categoryKey] &&
    categories[categoryKey].subcategories &&
    categories[categoryKey].subcategories[subcategoryKey]
  ) {
    return categories[categoryKey].subcategories[subcategoryKey].color;
  }

  // Sinon utiliser la couleur de la catégorie principale
  if (categories[categoryKey]) {
    return categories[categoryKey].color;
  }

  return categories.other.color;
}

/**
 * Obtient le composant d'icône pour une catégorie
 * @param {string|Object} category - Nom de la catégorie ou objet catégorie
 * @returns {React.Component} Composant d'icône
 */
export function getCategoryIcon(category) {
  if (!category) return icons.HelpCircle;

  // Si on a un objet catégorie, retourner son icône
  if (typeof category === "object" && category.icon) {
    return category.icon;
  }

  // Si on a un nom de catégorie, essayer de le mapper à notre configuration
  const { categoryKey, subcategoryKey } = mapBackendCategory(category);

  // Si on a trouvé une sous-catégorie avec une icône
  if (
    subcategoryKey &&
    categories[categoryKey] &&
    categories[categoryKey].subcategories &&
    categories[categoryKey].subcategories[subcategoryKey] &&
    categories[categoryKey].subcategories[subcategoryKey].icon
  ) {
    return categories[categoryKey].subcategories[subcategoryKey].icon;
  }

  // Sinon utiliser l'icône de la catégorie principale
  if (categories[categoryKey] && categories[categoryKey].icon) {
    return categories[categoryKey].icon;
  }

  return icons.HelpCircle;
}

/**
 * Obtient la classe de couleur de fond pour une catégorie
 * @param {string|Object} category - Nom de la catégorie ou objet catégorie
 * @returns {string} Classe CSS pour la couleur de fond
 */
export function getCategoryBackgroundColor(category) {
  if (!category) return categories.other.backgroundColor;

  // Si on a un objet catégorie, retourner sa couleur de fond
  if (typeof category === "object") {
    return category.backgroundColor || categories.other.backgroundColor;
  }

  // Si on a un nom de catégorie, essayer de le mapper à notre configuration
  const { categoryKey, subcategoryKey } = mapBackendCategory(category);

  // Si on a trouvé une sous-catégorie
  if (
    subcategoryKey &&
    categories[categoryKey] &&
    categories[categoryKey].subcategories &&
    categories[categoryKey].subcategories[subcategoryKey]
  ) {
    return categories[categoryKey].subcategories[subcategoryKey]
      .backgroundColor;
  }

  // Sinon utiliser la couleur de fond de la catégorie principale
  if (categories[categoryKey]) {
    return categories[categoryKey].backgroundColor;
  }

  return categories.other.backgroundColor;
}

/**
 * Récupère une catégorie complète à partir de son chemin hiérarchique
 * @param {Array} categoryPath - Chemin de la catégorie (ex: ["Food and Drink", "Restaurants"])
 * @returns {Object} Objet de catégorie ou sous-catégorie
 */
export function getCategoryFromPath(categoryPath) {
  if (
    !categoryPath ||
    !Array.isArray(categoryPath) ||
    categoryPath.length === 0
  ) {
    return categories.other;
  }

  // Mapper la catégorie principale
  const { categoryKey, subcategoryKey } = mapBackendCategory(categoryPath[0]);

  // Si on n'a qu'un niveau, retourner la catégorie principale
  if (categoryPath.length === 1) {
    return categories[categoryKey] || categories.other;
  }

  // Si on a plus d'un niveau, essayer de trouver la sous-catégorie
  if (categories[categoryKey] && categories[categoryKey].subcategories) {
    // D'abord, vérifier si on a déjà trouvé la sous-catégorie dans le mapping
    if (
      subcategoryKey &&
      categories[categoryKey].subcategories[subcategoryKey]
    ) {
      return categories[categoryKey].subcategories[subcategoryKey];
    }

    // Sinon, chercher une correspondance pour le deuxième niveau
    const subCategoryName = categoryPath[1];
    for (const [subKey, subCat] of Object.entries(
      categories[categoryKey].subcategories
    )) {
      if (
        subCat.name === subCategoryName ||
        subCat.nameFr === subCategoryName
      ) {
        return subCat;
      }
    }
  }

  // Si on n'a pas trouvé de sous-catégorie, retourner la catégorie principale
  return categories[categoryKey] || categories.other;
}

// Exporte l'ensemble des catégories pour être utilisé dans toute l'application
export default categories;
