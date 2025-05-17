// app/(app)/demo/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

export default function DemoPage() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Utiliser le store Zustand
  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);
  const activateDemoMode = useDemoModeStore((state) => state.activateDemoMode);

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
        if (!userId) {
          throw new Error("Vous devez être connecté pour activer le mode démo");
        }

        // Activer le mode démo
        const success = await activateDemoMode(userId);

        if (!success) {
          throw new Error("Échec de l'activation du mode démo");
        }

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
  }, [activateDemoMode, isDemoMode, router, userId]);

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
