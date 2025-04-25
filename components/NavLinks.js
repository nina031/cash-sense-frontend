"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, PieChart, Settings, Goal } from "lucide-react";
import { cn } from "@/lib/utils";

// Définition des liens de navigation
const links = [
  { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Budgets", href: "/dashboard/budgets", icon: PieChart },
  { name: "Objectifs", href: "/dashboard/goals", icon: Goal },
];

export default function NavLinks({ isCollapsed = false }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <li key={link.name} className="relative group">
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-sky-100 hover:text-[#151A2D]",
                pathname === link.href && "bg-sky-100 text-blue-600",
                isCollapsed && "justify-center"
              )}
            >
              <LinkIcon size={22} />
              <span
                className={cn(
                  "transition-opacity duration-300 whitespace-nowrap",
                  isCollapsed && "opacity-0 pointer-events-none hidden"
                )}
              >
                {link.name}
              </span>
            </Link>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute top-0 left-full ml-6 bg-white text-[#151A2D] rounded-lg py-1.5 px-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 whitespace-nowrap shadow-md z-10">
                {link.name}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
