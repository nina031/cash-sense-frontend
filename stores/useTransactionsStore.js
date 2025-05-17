// stores/useTransactionsStore.js
import { create } from "zustand";
import {
  fetchTransactions,
  addTransaction,
} from "@/services/transactionService";

export const useTransactionsStore = create((set, get) => ({
  // État
  transactions: [],
  loading: false,
  error: null,
  lastRefresh: Date.now(),

  // Actions
  fetchTransactions: async (userId, days = 90) => {
    if (!userId) {
      set({ transactions: [], error: null });
      return;
    }

    set({ loading: true });
    try {
      const data = await fetchTransactions(userId, days);
      set({ transactions: data, error: null, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Ajouter une transaction à l'état sans rechargement complet
  addLocalTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  // Ajouter une transaction via API et mettre à jour l'état local
  addNewTransaction: async (userId, transactionData) => {
    set({ loading: true });
    try {
      const result = await addTransaction(userId, transactionData);

      // Ajouter à l'état local
      get().addLocalTransaction(result.transaction);

      set({ loading: false, error: null });
      return result;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Forcer un rafraîchissement complet
  refreshTransactions: () => {
    set({ lastRefresh: Date.now() });
  },

  // Réinitialiser le store
  reset: () => {
    set({
      transactions: [],
      loading: false,
      error: null,
      lastRefresh: Date.now(),
    });
  },
}));
