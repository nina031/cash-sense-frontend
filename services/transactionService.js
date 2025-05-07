// services/transactionService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Activer le mode démo
export async function enableDemoMode(userId) {
  if (!userId) return;

  try {
    const response = await fetch(`${API_URL}/api/toggle_demo_mode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable_demo: true,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Échec de l'activation du mode démo");
    }

    return await response.json();
  } catch (error) {
    console.error("Error enabling demo mode:", error);
    throw error;
  }
}

// Récupérer les transactions
export async function fetchTransactions(userId, days = 90) {
  if (!userId) return [];

  try {
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
      throw new Error("Échec de la récupération des transactions");
    }

    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
