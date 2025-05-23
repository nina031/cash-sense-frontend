// components/SideNav.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

export default function SideNav({ isDemoMode = false }) {
  const { isCollapsed, toggleSidebar, isMounted } = useSidebar();

  // Ne rien rendre pendant l'hydratation
  if (!isMounted) {
    return <div className="fixed w-[270px] h-[calc(100vh-2rem)] m-4"></div>;
  }

  // Ajustement de la classe de hauteur en fonction du mode démo
  const heightClass = isDemoMode
    ? "h-[calc(100vh-2rem-32px)]" // Soustraire la hauteur de la bannière (32px environ pour py-2)
    : "h-[calc(100vh-2rem)]";

  return (
    <div
      data-sidebar
      className={cn(
        "fixed transition-all duration-300 bg-white rounded-2xl m-4 shadow-lg border border-gray-100 flex flex-col",
        isCollapsed ? "w-[85px]" : "w-[270px]",
        heightClass // Utiliser la classe de hauteur dynamique
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
            onClick={toggleSidebar}
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
            onClick={toggleSidebar}
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
