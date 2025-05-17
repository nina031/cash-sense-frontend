// app/providers.js
"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from "@/components/ui/sonner";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

export function Providers({ children }) {
  // Initialiser les stores
  const initializeDemoMode = useDemoModeStore((state) => state.initialize);

  useEffect(() => {
    // Initialiser le mode démo au chargement
    initializeDemoMode();
  }, [initializeDemoMode]);

  return (
    <SessionProvider>
      <AuthProvider>
        <SidebarProvider>
          {children}
          <Toaster position="bottom-right" />
        </SidebarProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
