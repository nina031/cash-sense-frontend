"use client";

import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";

export default function TestModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleDemoMode();
    } catch (error) {
      console.error("Erreur lors du changement de mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ne rien rendre pendant l'hydratation
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm text-gray-700 mr-2">Test mode</span>

      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "relative flex items-center w-10 h-5 rounded-full transition-colors duration-300",
          isDemoMode ? "bg-yellow-400" : "bg-gray-300"
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

      {isLoading && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        </div>
      )}
    </div>
  );
}
