// app/(app)/help/layout.js
import "@/app/globals.css";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";
import Image from "next/image";

export default function HelpLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo and user menu */}
      <header className="border-b border-gray-200 bg-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden">
              <Image
                src="/logo_chart.png"
                alt="Cash Sense"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-gray-800">Cash Sense</span>
          </Link>

          <UserMenu />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Cash Sense. Tous droits réservés.</p>
          <p className="mt-2">
            Application de gestion de finances personnelles.
          </p>
        </div>
      </footer>
    </div>
  );
}
