"use client";

import { useState, useEffect } from "react";
import { useDemoMode } from "@/contexts/DemoContext";

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
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium text-gray-700">Test mode</span>
      <div className="relative inline-block w-12 align-middle select-none">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`absolute block w-6 h-6 rounded-full transition-transform duration-200 ease-in ${
            isDemoMode
              ? "bg-white transform translate-x-6 shadow-md"
              : "bg-white shadow-md"
          }`}
          style={{ top: "2px", left: "2px" }}
        />
        <span
          className={`block h-10 w-16 rounded-full transition-colors duration-200 ease-in ${
            isDemoMode ? "bg-red-500" : "bg-gray-300"
          }`}
        />
      </div>
      {isLoading && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        </div>
      )}
    </div>
  );
}
