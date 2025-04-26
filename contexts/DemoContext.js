"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Création du contexte avec des valeurs par défaut
const DemoContext = createContext({
  isDemoMode: false,
  demoAccessToken: null,
  activateDemoMode: () => {},
  deactivateDemoMode: () => {},
  toggleDemoMode: () => {},
  shouldActivateDemo: false,
  setShouldActivateDemo: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useDemoMode = () => useContext(DemoContext);

// Fournisseur du contexte qui encapsulera notre application
export function DemoProvider({ children }) {
  // État pour suivre si l'utilisateur est en mode démo
  const [isDemoMode, setIsDemoMode] = useState(false);
  // État pour stocker le token d'accès pour le mode démo
  const [demoAccessToken, setDemoAccessToken] = useState(null);
  // État pour indiquer si le mode demo doit être activé après connexion
  const [shouldActivateDemo, setShouldActivateDemo] = useState(false);

  // Au chargement, vérifier si un token de démo existe déjà dans la session
  useEffect(() => {
    const storedToken = sessionStorage.getItem("demo_access_token");
    const storedShouldActivate =
      sessionStorage.getItem("should_activate_demo") === "true";

    if (storedToken) {
      setDemoAccessToken(storedToken);
      setIsDemoMode(true);
    }

    if (storedShouldActivate) {
      setShouldActivateDemo(true);
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
    sessionStorage.removeItem("should_activate_demo");
    // Réinitialiser l'état
    setDemoAccessToken(null);
    setIsDemoMode(false);
    setShouldActivateDemo(false);
  };

  // Fonction pour basculer le mode démo
  const toggleDemoMode = async () => {
    if (isDemoMode) {
      deactivateDemoMode();
    } else {
      try {
        // Vérifier si nous avons déjà un token démo dans la session
        if (demoAccessToken) {
          // Si nous avons déjà un token, activer simplement le mode démo
          setIsDemoMode(true);
          return;
        }

        // Obtenez l'URL de l'API depuis l'environnement
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Créer un token sandbox en appelant directement l'API
        console.log("Création d'un token sandbox...");
        const sandboxResponse = await fetch(
          `${API_URL}/api/create_sandbox_token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ institution_id: "ins_1" }),
          }
        );

        if (!sandboxResponse.ok) {
          throw new Error(
            `Échec de création du token sandbox: ${sandboxResponse.status}`
          );
        }

        const sandboxData = await sandboxResponse.json();
        const public_token = sandboxData.public_token;

        if (!public_token) {
          throw new Error("Impossible de créer un token sandbox");
        }

        // 2. Échanger le token public contre un token d'accès
        console.log("Échange du token public...");
        const exchangeResponse = await fetch(`${API_URL}/api/exchange_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_token }),
        });

        if (!exchangeResponse.ok) {
          throw new Error(
            `Échec d'échange du token: ${exchangeResponse.status}`
          );
        }

        const exchangeData = await exchangeResponse.json();
        const access_token = exchangeData.access_token;

        if (!access_token) {
          throw new Error("Impossible d'échanger le token public");
        }

        // 3. Activer le mode démo avec le token
        console.log("Activation du mode démo...");
        activateDemoMode(access_token);
      } catch (err) {
        console.error("Erreur lors de la configuration du mode démo:", err);
        // Informer l'utilisateur de l'erreur
        alert(
          "Une erreur est survenue lors de l'activation du mode test. Veuillez réessayer plus tard."
        );
      }
    }
  };

  // Gestion de l'état shouldActivateDemo
  useEffect(() => {
    if (shouldActivateDemo) {
      sessionStorage.setItem("should_activate_demo", "true");
    } else {
      sessionStorage.removeItem("should_activate_demo");
    }
  }, [shouldActivateDemo]);

  // Valeur du contexte qui sera partagée
  const value = {
    isDemoMode,
    demoAccessToken,
    activateDemoMode,
    deactivateDemoMode,
    toggleDemoMode,
    shouldActivateDemo,
    setShouldActivateDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
