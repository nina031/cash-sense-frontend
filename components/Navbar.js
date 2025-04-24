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
    </nav>
  );
}
