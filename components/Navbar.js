"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/contexts/DemoContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isDemoMode, deactivateDemoMode } = useDemoMode();

  // Gestion de la déconnexion du mode démo
  const handleExitDemo = () => {
    deactivateDemoMode();
    // Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et nom de l'application */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl flex items-center">
              <Image
                src="/logo-cashSense.png"
                alt="cashsense logo"
                width={50}
                height={12}
                priority
              />
              <span className="ml-2 font-semibold">Cash Sense</span>
            </Link>
          </div>

          {/* Indicateur mode démo ou boutons de connexion */}
          {isDemoMode ? (
            <div className="flex items-center">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
                Mode Démo
              </div>
              <Button
                onClick={handleExitDemo}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Quitter le mode démo
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                asChild
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-full"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-full"
              >
                <Link href="/login">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
