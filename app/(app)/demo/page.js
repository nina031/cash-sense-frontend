"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoMode } from "@/contexts/DemoContext";

export default function DemoPage() {
  const router = useRouter();
  const { activateDemoMode, isDemoMode } = useDemoMode();
  const [status, setStatus] = useState("Préparation du mode démo...");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si déjà en mode démo, rediriger directement vers le dashboard
    if (isDemoMode) {
      router.push("/dashboard");
      return;
    }

    async function setupDemoMode() {
      try {
        // Activer le mode démo dans le backend
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/toggle_demo_mode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            enable_demo: true,
            user_id: "demo_user", // Identifiant de l'utilisateur de démo
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Échec de l'activation du mode démo: ${response.status}`
          );
        }

        // Activer le mode démo dans le frontend
        activateDemoMode();

        // Rediriger vers le dashboard
        setStatus("Redirection vers le tableau de bord...");
        router.push("/dashboard");
      } catch (err) {
        console.error("Erreur lors de la configuration du mode démo:", err);
        setError(
          `Une erreur est survenue lors de la configuration du mode démo: ${err.message}`
        );
      }
    }

    setupDemoMode();
  }, [activateDemoMode, isDemoMode, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Mode Démo</h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Retour à l&apos;accueil
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
