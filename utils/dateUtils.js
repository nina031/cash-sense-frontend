// utils/dateUtils.js

// Tableau des mois en français
export const MONTHS = [
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

/**
 * Génère un tableau d'années allant de l'année courante à X années en arrière
 * @param {number} count - Nombre d'années à générer
 * @returns {Array<number>} Tableau d'années
 */
export function generateYears(count = 6) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, index) => currentYear - index);
}

/**
 * Obtient le mois et l'année courants
 * @returns {Object} { month: string, year: number }
 */
export function getCurrentMonthAndYear() {
  const currentDate = new Date();
  return {
    month: MONTHS[currentDate.getMonth()],
    year: currentDate.getFullYear(),
  };
}

/**
 * Formate une date pour l'affichage
 * @param {string} month - Le mois en français
 * @param {number} year - L'année
 * @returns {string} Date formatée
 */
export function formatDate(month, year) {
  return month && year ? `${month} ${year}` : "";
}

/**
 * Convertit un nom de mois français en indice de mois (0-11)
 * @param {string} month - Le mois en français
 * @returns {number} L'indice du mois (0-11) ou -1 si non trouvé
 */
export function getMonthIndex(month) {
  if (!month) return -1;
  return MONTHS.findIndex((m) => m.toLowerCase() === month.toLowerCase());
}

/**
 * Filtre les transactions par mois et année
 * @param {Array} transactions - Liste des transactions à filtrer
 * @param {string} month - Le mois en français
 * @param {number|string} year - L'année
 * @returns {Array} Transactions filtrées
 */
export function filterTransactionsByDate(transactions, month, year) {
  if (!month || !year || !transactions || !transactions.length) {
    return transactions || [];
  }

  const monthIndex = getMonthIndex(month);
  if (monthIndex === -1) return transactions;

  const yearNumber = parseInt(year);

  return transactions.filter((transaction) => {
    if (!transaction.date) return false;

    const txDate = new Date(transaction.date);
    return (
      txDate.getFullYear() === yearNumber && txDate.getMonth() === monthIndex
    );
  });
}
