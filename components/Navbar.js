"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();

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

          {/* Boutons de connexion et inscription (pour écrans moyens et grands) */}
          <div className="hidden sm:flex items-center space-x-4">
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
        </div>
      </div>

      {/* Boutons de connexion et inscription (pour petits écrans) */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around py-3">
          <Button asChild>
            <Link
              href="/login"
              className="text-gray-800 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
          </Button>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
