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
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
