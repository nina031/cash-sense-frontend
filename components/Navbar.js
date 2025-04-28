"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { session, logout } = useAuth();

  // Déterminer si nous sommes sur la landing page
  const isLandingPage = pathname === "/";

  // Déterminer si nous sommes dans la section auth
  const isAuthPage =
    pathname.includes("/login") || pathname.includes("/signup");

  // Si nous sommes dans la section dashboard, ne pas afficher la Navbar standard
  if (!isLandingPage && !isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo et nom de l'application */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={session ? "/dashboard" : "/"}
              className="font-bold text-xl flex items-center"
            >
              <Image
                src="/logo_chart.png"
                alt="cashsense logo"
                width={50}
                height={25}
                priority
              />
              <span className="ml-2 font-semibold">Cash Sense</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Boutons de login/signup toujours affichés sur la landing page */}
            {isLandingPage && (
              <>
                <Button
                  asChild
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-full"
                >
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button
                  asChild
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-full"
                >
                  <Link href="/signup">S&apos;inscrire</Link>
                </Button>
              </>
            )}

            {/* Pour les pages d'authentification, afficher un bouton de retour */}
            {isAuthPage && (
              <Button
                asChild
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full"
              >
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
