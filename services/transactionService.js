// services/transactionService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Activer ou désactiver le mode démo
export async function toggleDemoMode(userId, enableDemo = true) {
  if (!userId) throw new Error("ID utilisateur manquant");

  try {
    const response = await fetch(`${API_URL}/api/toggle_demo_mode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable_demo: enableDemo,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Échec de la modification du mode démo: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling demo mode:", error);
    throw error;
  }
}

// Récupérer les transactions
export async function fetchTransactions(userId, days = 90) {
  if (!userId) return [];

  try {
    console.log("Fetching transactions for user ID:", userId);
    const response = await fetch(`${API_URL}/api/get_transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        days: days,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Échec de la récupération des transactions: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Received transactions:", data.transactions?.length || 0);
    return data.transactions || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// Ajouter une transaction manuelle
export async function addTransaction(userId, transactionData) {
  if (!userId) throw new Error("Identifiant utilisateur requis");

  try {
    console.log("Adding transaction:", transactionData);
    const response = await fetch(`${API_URL}/api/add_transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        transaction: transactionData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Échec de l'ajout de la transaction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}
