"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Nous allons créer ce composant juste après
import NavLinks from "@/components/NavLinks";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-50">
      <Link
        className="mb-2 flex h-16 items-center justify-start rounded-md bg-blue-600 p-4"
        href="/"
      >
        <div className="flex items-center text-white">
          <Image
            src="/logo-cashSense.png"
            alt="Cash Sense"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="font-semibold">Cash Sense</span>
        </div>
      </Link>

      <div className="flex grow flex-col space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>

        <Button variant="ghost" className="justify-start">
          <LogOut className="mr-2 h-5 w-5" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
