// stores/useDemoModeStore.js
import { create } from "zustand";
import { toggleDemoMode as toggleDemoModeService } from "@/services/transactionService";
import { useTransactionsStore } from "./useTransactionsStore";

export const useDemoModeStore = create((set, get) => ({
  // État
  isDemoMode: false,
  shouldActivateDemo: false,
  error: null,
  loading: false,

  // Initialiser l'état depuis le sessionStorage
  initialize: () => {
    if (typeof window !== "undefined") {
      const storedDemoMode = sessionStorage.getItem("demo_mode") === "true";
      const storedShouldActivate =
        sessionStorage.getItem("should_activate_demo") === "true";
      set({
        isDemoMode: storedDemoMode,
        shouldActivateDemo: storedShouldActivate,
      });
    }
  },

  // Actions
  setShouldActivateDemo: (value) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("should_activate_demo", value.toString());
    }
    set({ shouldActivateDemo: value });
  },

  // Activer le mode démo
  activateDemoMode: async (userId) => {
    if (!userId) {
      set({ error: "Vous devez être connecté pour activer le mode démo" });
      return false;
    }

    set({ loading: true });
    try {
      // Utiliser le service plutôt que de faire l'appel API directement
      await toggleDemoModeService(userId, true);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("demo_mode", "true");
      }
      set({ isDemoMode: true, error: null, loading: false });

      // Rafraîchir les transactions
      const refreshTransactions =
        useTransactionsStore.getState().fetchTransactions;
      if (refreshTransactions) {
        refreshTransactions(userId);
      }

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // Désactiver le mode démo
  deactivateDemoMode: async (userId) => {
    if (!userId) {
      set({ error: "Vous devez être connecté pour désactiver le mode démo" });
      return false;
    }

    set({ loading: true });
    try {
      // Utiliser le service plutôt que de faire l'appel API directement
      await toggleDemoModeService(userId, false);

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("demo_mode");
        sessionStorage.removeItem("should_activate_demo");
      }

      set({
        isDemoMode: false,
        shouldActivateDemo: false,
        error: null,
        loading: false,
      });

      // Rafraîchir les transactions
      const refreshTransactions =
        useTransactionsStore.getState().fetchTransactions;
      if (refreshTransactions) {
        refreshTransactions(userId);
      }

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  // Basculer le mode démo
  toggleDemoMode: async (userId) => {
    const shouldEnable = !get().isDemoMode;

    if (shouldEnable) {
      return get().activateDemoMode(userId);
    } else {
      return get().deactivateDemoMode(userId);
    }
  },
}));
