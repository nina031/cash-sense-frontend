"use client";

import { useState, useEffect } from "react";
import TransactionList from "@/components/TransactionList";

export default function TransactionsPage() {
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForData, setWaitingForData] = useState(false);
  const [waitProgress, setWaitProgress] = useState(0);
  const [error, setError] = useState("");
  const [apiTestResult, setApiTestResult] = useState("");

  useEffect(() => {
    let interval;

    if (waitingForData && waitProgress < 100) {
      interval = setInterval(() => {
        setWaitProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setWaitingForData(false);
            setWaitProgress(0);
            return 100;
          }
          return newProgress;
        });
      }, 200); // Avance la barre de progression toutes les 200ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [waitingForData, waitProgress]);

  // Function to connect to a sandbox account for testing
  async function connectSandboxAccount() {
    setIsLoading(true);
    setError("");
    setApiTestResult("");

    try {
      // Dynamically import the service
      const { createSandboxToken, exchangeToken } = await import(
        "@/services/transactionService"
      );

      // 1. Create a sandbox token
      const { public_token } = await createSandboxToken();

      // 2. Exchange it for an access token
      const { access_token } = await exchangeToken(public_token);

      // 3. Attendre que les données soient prêtes
      setIsLoading(false);
      setWaitingForData(true);

      // Attendre que la barre de progression atteigne 100%
      setTimeout(() => {
        // 4. Save the access token
        setAccessToken(access_token);
      }, 5000); // 5 secondes de délai
    } catch (err) {
      console.error("Error connecting to sandbox account:", err);
      setError(
        "Une erreur est survenue lors de la connexion au compte de test: " +
          err.message
      );
      setIsLoading(false);
    }
  }

  // Function to test API health
  async function testApiHealth() {
    setApiTestResult("Test en cours...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      const data = await response.json();
      setApiTestResult(`API en ligne! Réponse: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error("Error testing API:", err);
      setApiTestResult(`Erreur: ${err.message}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes transactions</h1>

      {!accessToken && (
        <div className="mb-6 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connecter un compte</h2>
          <p className="mb-4">
            Pour voir vos transactions, vous devez d'abord connecter un compte
            bancaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={connectSandboxAccount}
              disabled={isLoading || waitingForData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading
                ? "Connexion en cours..."
                : waitingForData
                ? "Préparation des données..."
                : "Connecter un compte test (Sandbox)"}
            </button>

            <button
              onClick={testApiHealth}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
            >
              Tester l'API
            </button>
          </div>

          {waitingForData && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${waitProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Préparation des données de transactions... Veuillez patienter.
              </p>
            </div>
          )}

          {error && <p className="mt-2 text-red-600">{error}</p>}
          {apiTestResult && (
            <div className="mt-2 p-3 bg-gray-200 rounded">
              <p className="font-mono text-sm">{apiTestResult}</p>
            </div>
          )}
        </div>
      )}

      <TransactionList accessToken={accessToken} />
    </div>
  );
}
