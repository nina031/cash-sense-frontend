/**
 * Service for handling transaction-related API calls
 */

// Use environment variables from .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Fetches transactions for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of transactions
 */
export async function getTransactions(userId) {
  try {
    console.log("Calling API to get transactions for user:", userId);

    const response = await fetch(`${API_URL}/api/get_transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error fetching transactions: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Received transactions data:", data);

    return data.transactions || [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
}

/**
 * Adds a manual transaction
 * @param {string} userId - User ID
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} - The added transaction
 */
export async function addTransaction(userId, transactionData) {
  try {
    console.log("Adding transaction for user:", userId);

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
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error adding transaction: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Transaction added successfully:", data);
    return data.transaction;
  } catch (error) {
    console.error("Failed to add transaction:", error);
    throw error;
  }
}

/**
 * Toggles the demo mode
 * @param {boolean} enableDemo - Whether to enable or disable demo mode
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Result of the operation
 */
export async function toggleDemoMode(enableDemo, userId) {
  try {
    console.log(
      `${enableDemo ? "Enabling" : "Disabling"} demo mode for user:`,
      userId
    );

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
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error toggling demo mode: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Demo mode toggled successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to toggle demo mode:", error);
    throw error;
  }
}
