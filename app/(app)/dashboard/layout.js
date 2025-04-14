"use client";

import SideNav from "@/components/SideNav";
import { useDemoMode } from "@/contexts/DemoContext";

export default function DashboardLayout({ children }) {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="flex h-screen">
      <div className="w-64 hidden md:block">
        <SideNav />
      </div>
      <main className="flex-1 p-6 overflow-y-auto">
        {isDemoMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              <strong>Mode Démo :</strong> Vous consultez une version de
              démonstration de Cash Sense. Les données affichées sont fictives
              et servent uniquement à illustrer les fonctionnalités de
              l'application.
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
