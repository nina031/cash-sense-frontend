"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SideNav() {
  // Déplacer l'état initial à undefined pour éviter les erreurs d'hydratation
  const [isCollapsed, setIsCollapsed] = useState(undefined);
  const [isMounted, setIsMounted] = useState(false);

  // N'initialiser l'état qu'après le montage côté client
  useEffect(() => {
    setIsCollapsed(false);
    setIsMounted(true);
  }, []);

  // Toggle SideNav's collapsed state
  const toggleSideNav = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Ne rien rendre pendant l'hydratation
  if (!isMounted) {
    return <div className="fixed w-[270px] h-[calc(100vh-2rem)] m-4"></div>;
  }

  return (
    <div
      className={cn(
        "fixed transition-all duration-300 bg-white rounded-2xl m-4 shadow-lg border border-gray-100 flex flex-col",
        isCollapsed ? "w-[85px]" : "w-[270px]",
        "h-[calc(100vh-2rem)]"
      )}
    >
      {/* SideNav Header */}
      <div
        className={cn(
          "p-5 border-b border-gray-100",
          isCollapsed
            ? "flex justify-center"
            : "flex items-center justify-between"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}
        >
          <div className="relative">
            <Image
              src="/logo_chart.png"
              alt="Cash Sense"
              width={46}
              height={46}
              className="object-contain rounded-full"
            />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-gray-800">Cash Sense</span>
          )}
        </Link>

        {/* Toggle button - Only visible when not collapsed */}
        {!isCollapsed && (
          <button
            onClick={toggleSideNav}
            className="h-[35px] w-[35px] flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-200"
            aria-label="Replier le menu"
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Toggle button - Only visible when collapsed, positioned below header */}
      {isCollapsed && (
        <div className="flex justify-center mt-4 mb-2">
          <button
            onClick={toggleSideNav}
            className="h-[35px] w-[35px] flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg transition-all duration-300 hover:bg-gray-200"
            aria-label="Déplier le menu"
          >
            <Menu size={18} />
          </button>
        </div>
      )}

      {/* Navigation - maintenant avec flex-1 pour qu'il prenne toute la hauteur disponible */}
      <div className="px-4 py-2 mt-4 flex-1 flex flex-col">
        <NavLinks isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
