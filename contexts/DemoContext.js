"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Création du contexte avec des valeurs par défaut
const DemoContext = createContext({
  isDemoMode: false,
  activateDemoMode: () => {},
  deactivateDemoMode: () => {},
  toggleDemoMode: () => {},
  shouldActivateDemo: false,
  setShouldActivateDemo: () => {},
  error: null,
});

// Hook personnalisé pour utiliser le contexte
export const useDemoMode = () => useContext(DemoContext);

// Fournisseur du contexte qui encapsulera notre application
export function DemoProvider({ children }) {
  // Accéder à la session utilisateur et aux fonctions d'authentification
  const { session, loading } = useAuth();
  const router = useRouter();

  // État pour suivre si l'utilisateur est en mode démo
  const [isDemoMode, setIsDemoMode] = useState(false);
  // État pour indiquer si le mode demo doit être activé après connexion
  const [shouldActivateDemo, setShouldActivateDemo] = useState(false);
  // État pour enregistrer tout message d'erreur
  const [error, setError] = useState(null);

  // Au chargement, vérifier si le mode démo était activé
  useEffect(() => {
    if (!loading) {
      const storedDemoMode = sessionStorage.getItem("demo_mode") === "true";
      const storedShouldActivate =
        sessionStorage.getItem("should_activate_demo") === "true";

      if (storedDemoMode && session?.user?.id) {
        setIsDemoMode(true);
      } else if (storedDemoMode && !session?.user?.id) {
        // Si le mode démo était activé mais l'utilisateur n'est plus connecté, désactiver le mode démo
        sessionStorage.removeItem("demo_mode");
      }

      if (storedShouldActivate) {
        setShouldActivateDemo(true);
      }
    }
  }, [loading, session]);

  // Fonction pour activer le mode démo
  const activateDemoMode = () => {
    if (!session?.user?.id) {
      setError("Vous devez être connecté pour activer le mode démo");
      return false;
    }

    // Stocker l'état dans le sessionStorage
    sessionStorage.setItem("demo_mode", "true");
    // Mettre à jour l'état
    setIsDemoMode(true);
    return true;
  };

  // Fonction pour désactiver le mode démo
  const deactivateDemoMode = () => {
    // Supprimer du sessionStorage
    sessionStorage.removeItem("demo_mode");
    sessionStorage.removeItem("should_activate_demo");
    // Réinitialiser l'état
    setIsDemoMode(false);
    setShouldActivateDemo(false);
    return true;
  };

  // Fonction pour basculer le mode démo
  const toggleDemoMode = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!session?.user?.id) {
        setError("Vous devez être connecté pour changer le mode démo");
        router.push("/login");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const userId = session.user.id;
      const shouldEnable = !isDemoMode; // Inverse de l'état actuel

      // Appeler l'API pour changer le mode démo côté serveur
      console.log(`Changing demo mode to: ${shouldEnable}`);
      const response = await fetch(`${API_URL}/api/toggle_demo_mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable_demo: shouldEnable,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Échec de la modification du mode démo: ${response.status}`
        );
      }

      // Mettre à jour l'état côté client
      if (shouldEnable) {
        sessionStorage.setItem("demo_mode", "true");
        setIsDemoMode(true);
      } else {
        sessionStorage.removeItem("demo_mode");
        setIsDemoMode(false);
      }

      setError(null);
    } catch (err) {
      console.error("Erreur lors du changement de mode:", err);
      setError(err.message);
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
    activateDemoMode,
    deactivateDemoMode,
    toggleDemoMode,
    shouldActivateDemo,
    setShouldActivateDemo,
    error,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
