"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Check if a link is active
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl">
                <Image
                  src="/logo-cashSense.png"
                  alt="cashsense logo"
                  width={50}
                  height={12}
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive("/")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                }`}
              >
                Accueil
              </Link>
              <Link
                href="/transactions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive("/transactions")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                }`}
              >
                Transactions
              </Link>
              <Link
                href="/budgets"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                  isActive("/budgets")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300"
                }`}
              >
                Budget
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - visible on small screens */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around pt-2 pb-3">
          <Link
            href="/"
            className={`flex flex-col items-center px-1 pt-1 text-sm font-medium ${
              isActive("/") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <span>Accueil</span>
          </Link>
          <Link
            href="/transactions"
            className={`flex flex-col items-center px-1 pt-1 text-sm font-medium ${
              isActive("/transactions") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <span>Transactions</span>
          </Link>
          <Link
            href="/budgets"
            className={`flex flex-col items-center px-1 pt-1 text-sm font-medium ${
              isActive("/budgets") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <span>Budget</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
