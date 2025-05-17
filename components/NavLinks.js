"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  PieChart,
  Settings,
  Goal,
  LayoutDashboard,
  LogOut,
  HelpCircle,
  ChartNoAxesCombined,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoModeStore } from "@/stores/useDemoModeStore";
import { useRouter } from "next/navigation";

// Définition des liens de navigation principaux
const mainLinks = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Analyse",
    href: "/dashboard/analyse",
    icon: ChartNoAxesCombined,
  },
  { name: "Budgets", href: "/dashboard/budgets", icon: PieChart },
  { name: "Objectifs", href: "/dashboard/goals", icon: Goal },
];

export default function NavLinks({ isCollapsed = false }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);
  const router = useRouter();

  // Fonction de déconnexion
  const handleLogout = async () => {
    await logout();
  };

  // Liens utilitaires (en bas du menu)
  const utilityLinks = [
    { name: "Aide", href: "/help", icon: HelpCircle },
    { name: "Paramètres", href: "/dashboard/account", icon: Settings },
    // Pour la déconnexion, on utilise une fonction au lieu d'un lien
    {
      name: "Déconnexion",
      onClick: handleLogout,
      icon: LogOut,
    },
  ];

  // Fonction pour rendre un lien individuel
  const renderNavLink = (link, index) => {
    const LinkIcon = link.icon;
    const isActive = link.href && pathname === link.href;

    // Propriétés communes pour tous les éléments de navigation
    const commonProps = {
      className: cn(
        "flex items-center gap-2 rounded-lg p-2.5 transition-all duration-300 hover:bg-[#ebe0ff] hover:text-[#151A2D]",
        isActive && "bg-[#ebe0ff]",
        isCollapsed && "justify-center"
      ),
    };

    return (
      <li key={link.name + index} className="relative group">
        {link.href ? (
          // Pour les liens de navigation normaux
          <Link href={link.href} {...commonProps}>
            <LinkIcon size={20} />
            <span
              className={cn(
                "transition-opacity duration-300 whitespace-nowrap text-sm",
                isCollapsed && "opacity-0 pointer-events-none hidden"
              )}
            >
              {link.name}
            </span>
          </Link>
        ) : (
          // Pour les actions (comme la déconnexion)
          <button onClick={link.onClick} {...commonProps}>
            <LinkIcon size={20} />
            <span
              className={cn(
                "transition-opacity duration-300 whitespace-nowrap text-left text-sm",
                isCollapsed && "opacity-0 pointer-events-none hidden"
              )}
            >
              {link.name}
            </span>
          </button>
        )}

        {/* Tooltip pour l'état replié */}
        {isCollapsed && (
          <div className="absolute top-0 left-full ml-6 bg-white text-[#151A2D] rounded-lg py-1.5 px-3 text-xs opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 whitespace-nowrap shadow-md z-10">
            {link.name}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Liens principaux en haut */}
      <ul className="flex flex-col gap-1">
        {mainLinks.map((link, index) => renderNavLink(link, index))}
      </ul>

      {/* Liens utilitaires en bas */}
      <ul className="flex flex-col gap-1 mt-auto">
        {utilityLinks.map((link, index) => renderNavLink(link, index))}
      </ul>
    </div>
  );
}
