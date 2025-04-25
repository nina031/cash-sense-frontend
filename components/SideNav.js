"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle SideNav's collapsed state
  const toggleSideNav = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "fixed transition-all duration-300 bg-white rounded-2xl m-4 shadow-md",
        isCollapsed ? "w-[85px]" : "w-[270px]",
        "h-[calc(100vh-2rem)]"
      )}
    >
      {/* SideNav Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Image
              src="/logo_chart.png"
              alt="Cash Sense"
              width={46}
              height={46}
              className="object-contain rounded-full"
            />
          </div>
          <span
            className={cn(
              "font-semibold text-gray-800 transition-opacity duration-300",
              isCollapsed && "opacity-0 pointer-events-none"
            )}
          >
            Cash Sense
          </span>
        </Link>

        {/* Toggle button */}
        <button
          onClick={toggleSideNav}
          className={cn(
            "h-[35px] w-[35px] flex items-center justify-center bg-indigo-600 text-white rounded-lg transition-all duration-300 hover:bg-indigo-700",
            isCollapsed && "transform translate-x-[-4px] translate-y-[65px]"
          )}
        >
          <ChevronLeft
            className={cn(
              "transition-transform duration-300",
              isCollapsed && "transform rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className={cn("px-4 py-4", isCollapsed ? "mt-16" : "mt-2")}>
        <NavLinks isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
