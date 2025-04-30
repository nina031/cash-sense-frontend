/**
 * Service for handling transaction-related API calls
 */

// Use environment variables from .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ENV_MODE = process.env.NEXT_PUBLIC_ENV_MODE;

/**
 * Transforms transaction categories from string format to array format
 * @param {Object} transaction - The transaction object to transform
 * @returns {Object} - Transformed transaction object
 */
function transformTransaction(transaction) {
  // Create a copy of the transaction to avoid mutating the original
  const transformedTransaction = { ...transaction };

  // Transform category if it's a string
  if (
    typeof transaction.category === "string" &&
    transaction.category !== "Non catégorisé"
  ) {
    // Split by comma and trim whitespace
    transformedTransaction.category = transaction.category
      .split(",")
      .map((cat) => cat.trim());
  }

  return transformedTransaction;
}

/**
 * Fetches transactions using the provided access token
 * @param {string} accessToken - The Plaid access token
 * @returns {Promise<Array>} - Array of transactions with transformed categories
 */
export async function getTransactions(accessToken) {
  try {
    console.log("Calling API with URL:", `${API_URL}/api/get_transactions`);
    console.log("Using access token:", accessToken);

    const response = await fetch(`${API_URL}/api/get_transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error fetching transactions: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Received transactions data:", data);

    // Transform transactions to have proper category arrays
    const transformedTransactions = (data.transactions || []).map(
      transformTransaction
    );

    return transformedTransactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
}

/**
 * Creates a sandbox test token
 * @param {string} institutionId - Institution ID (default: 'ins_1')
 * @returns {Promise<Object>} - Object containing the public token
 */
export async function createSandboxToken(institutionId = "ins_1") {
  try {
    console.log("Creating sandbox token for institution:", institutionId);

    const response = await fetch(`${API_URL}/api/create_sandbox_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ institution_id: institutionId }),
    });

    console.log("Sandbox token response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error creating sandbox token: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Received sandbox token data:", data);
    return data;
  } catch (error) {
    console.error("Failed to create sandbox token:", error);
    throw error;
  }
}

/**
 * Exchanges a public token for an access token
 * @param {string} publicToken - The public token to exchange
 * @returns {Promise<Object>} - Object containing the access token
 */
export async function exchangeToken(publicToken) {
  try {
    console.log("Exchanging public token:", publicToken);

    const response = await fetch(`${API_URL}/api/exchange_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: publicToken }),
    });

    console.log("Exchange token response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Error exchanging token: ${response.status}. Details: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Received exchange token data:", data);
    return data;
  } catch (error) {
    console.error("Failed to exchange token:", error);
    throw error;
  }
}
