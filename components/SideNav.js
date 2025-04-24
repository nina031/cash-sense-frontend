"use client";

import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/contexts/DemoContext";

export default function SideNav() {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* En-tête avec logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden">
            <Image
              src="/logo_chart.png"
              alt="Cash Sense"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-gray-800 text-lg">
            Cash Sense
          </span>
        </Link>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:block"></div>
        <Button
          variant="ghost"
          className={`flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium ${
            isDemoMode
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-sky-100 hover:text-blue-600"
          } md:flex-none md:justify-start md:p-2 md:px-3`}
          disabled={isDemoMode}
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:block">Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
