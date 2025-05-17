// components/TestModeToggle.js
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

export default function TestModeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Utiliser le store Zustand
  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);
  const toggleDemoMode = useDemoModeStore((state) => state.toggleDemoMode);
  const loading = useDemoModeStore((state) => state.loading);
  const error = useDemoModeStore((state) => state.error);

  // S'assurer que le composant est monté côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Afficher toute erreur qui pourrait survenir
  useEffect(() => {
    if (error) {
      console.error("Erreur du mode démo:", error);
    }
  }, [error]);

  const handleToggle = async () => {
    if (!userId) return;

    try {
      await toggleDemoMode(userId);
    } catch (error) {
      console.error("Erreur lors du changement de mode:", error);
    }
  };

  // Ne rien rendre pendant l'hydratation
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm text-gray-700 mr-2 ml-8">Test mode</span>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          "relative flex items-center w-10 h-5 rounded-full transition-colors duration-300",
          isDemoMode ? "bg-[var(--primary)]" : "bg-gray-300"
        )}
        aria-label="Toggle demo mode"
      >
        {/* Cercle de l'interrupteur */}
        <span
          className={cn(
            "absolute w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300",
            isDemoMode ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>

      {loading && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        </div>
      )}
    </div>
  );
}
