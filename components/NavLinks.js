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
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex h-12 items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
              pathname === link.href
                ? "bg-gray-100 text-blue-600"
                : "text-gray-700"
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
