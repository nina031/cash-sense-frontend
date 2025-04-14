"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Création du contexte avec des valeurs par défaut
const DemoContext = createContext({
  isDemoMode: false,
  demoAccessToken: null,
  activateDemoMode: () => {},
  deactivateDemoMode: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useDemoMode = () => useContext(DemoContext);

// Fournisseur du contexte qui encapsulera notre application
export function DemoProvider({ children }) {
  // État pour suivre si l'utilisateur est en mode démo
  const [isDemoMode, setIsDemoMode] = useState(false);
  // État pour stocker le token d'accès pour le mode démo
  const [demoAccessToken, setDemoAccessToken] = useState(null);

  // Au chargement, vérifier si un token de démo existe déjà dans la session
  useEffect(() => {
    const storedToken = sessionStorage.getItem("demo_access_token");
    if (storedToken) {
      setDemoAccessToken(storedToken);
      setIsDemoMode(true);
    }
  }, []);

  // Fonction pour activer le mode démo
  const activateDemoMode = (accessToken) => {
    // Stocker le token dans le sessionStorage pour le conserver après rafraîchissement
    sessionStorage.setItem("demo_access_token", accessToken);
    // Mettre à jour l'état
    setDemoAccessToken(accessToken);
    setIsDemoMode(true);
  };

  // Fonction pour désactiver le mode démo
  const deactivateDemoMode = () => {
    // Supprimer le token du sessionStorage
    sessionStorage.removeItem("demo_access_token");
    // Réinitialiser l'état
    setDemoAccessToken(null);
    setIsDemoMode(false);
  };

  // Valeur du contexte qui sera partagée
  const value = {
    isDemoMode,
    demoAccessToken,
    activateDemoMode,
    deactivateDemoMode,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
