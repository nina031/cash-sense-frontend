"use client";

import SideNav from "@/components/SideNav";
import UserMenu from "@/components/UserMenu";
import { useDemoMode } from "@/contexts/DemoContext";
import { useAuth } from "@/contexts/AuthContext";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { isDemoMode, deactivateDemoMode } = useDemoMode();
  const { session } = useAuth();
  const router = useRouter();

  const handleExitDemo = () => {
    deactivateDemoMode();
    router.push("/");
  };

  return (
    <div className="flex h-screen relative">
      {/* Bouton de sortie du mode démo en position fixe en haut à droite */}
      {isDemoMode && (
        <button
          onClick={handleExitDemo}
          className="fixed top-4 right-10 z-50 flex items-center gap-2 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-full text-sm font-medium shadow-sm transition-colors"
        >
          <span>Quitter le mode démo</span>
        </button>
      )}

      {/* SideNav */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[270px] transition-all duration-300">
        {/* Header with user menu */}
        <header className="py-2 px-6 flex justify-end items-center">
          <UserMenu />
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Bannière de notification du mode démo */}
          {isDemoMode && (
            <div className="mb-6 max-w-110 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg flex items-center h-4 rounded">
              <Info className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                Vous êtes actuellement en mode démo avec des données simulées.
              </p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
