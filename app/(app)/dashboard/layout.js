"use client";

import SideNav from "@/components/SideNav";
import UserMenu from "@/components/UserMenu";
import TestModeToggle from "@/components/TestModeToggle";
import { useDemoMode } from "@/contexts/DemoContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";

export default function DashboardLayout({ children }) {
  const { isDemoMode, deactivateDemoMode } = useDemoMode();
  const { session } = useAuth();
  const router = useRouter();
  const { isCollapsed, isMounted } = useSidebar();

  const handleExitDemo = () => {
    deactivateDemoMode();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Bannière de notification du mode démo - pleine largeur */}
      {isDemoMode && (
        <div className="bg-[#9163cb] text-white py-2 w-full">
          <div className="flex items-center">
            <span className="font-medium px-4">Test mode</span>
            <span className="flex-1 text-center">
              Vous utilisez des données de test. Les données réelles ne seront
              pas chargées.
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* SideNav - Passer isDemoMode pour ajuster la hauteur */}
        <SideNav isDemoMode={isDemoMode} />

        {/* Main Content - Ajuster dynamiquement le margin-left */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isMounted
              ? isCollapsed
                ? "ml-[85px]"
                : "ml-[270px]"
              : "ml-[270px]"
          }`}
        >
          {/* Header with user menu */}
          <header className="py-4 px-6 flex justify-between items-center">
            {/* Test Mode Toggle */}
            <TestModeToggle />

            {/* User Menu */}
            <UserMenu />
          </header>

          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
