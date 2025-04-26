"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Création du contexte avec des valeurs par défaut
const SidebarContext = createContext({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useSidebar = () => useContext(SidebarContext);

// Fournisseur du contexte qui encapsulera notre application
export function SidebarProvider({ children }) {
  // État pour suivre si la sidebar est repliée ou dépliée
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialisation après le montage (pour éviter les erreurs d'hydratation)
  useEffect(() => {
    setIsMounted(true);

    // Vérifier si l'état est stocké dans localStorage (optionnel)
    const storedState = localStorage.getItem("sidebar_collapsed");
    if (storedState) {
      setIsCollapsed(storedState === "true");
    }
  }, []);

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Stocker l'état dans localStorage (optionnel)
    localStorage.setItem("sidebar_collapsed", String(newState));
  };

  // Valeur du contexte qui sera partagée
  const value = {
    isCollapsed,
    toggleSidebar,
    isMounted,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
