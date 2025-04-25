"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoContext";

export default function UserMenu() {
  const { session, logout } = useAuth();
  const { isDemoMode, deactivateDemoMode } = useDemoMode();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Get user initials from name or email
  const getUserInitials = () => {
    if (isDemoMode) return "DM"; // Demo Mode

    if (!session?.user) return "??";

    if (session.user.name) {
      // Split name and get first letter of each part
      return session.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    } else if (session.user.email) {
      // Get first letter of email
      return session.user.email[0].toUpperCase();
    }

    return "??";
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    if (isDemoMode) {
      deactivateDemoMode();
      router.push("/");
    } else {
      await logout();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar circle with initials */}
      <button
        className="flex items-center gap-2 outline-none focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="user-menu"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            {getUserInitials()}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id="user-menu"
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
        >
          {/* User info section */}
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {isDemoMode
                ? "Mode Démo"
                : session?.user?.name || session?.user?.email || "Utilisateur"}
            </p>
            {session?.user?.email && !isDemoMode && (
              <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/dashboard/account"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </Link>

            <Link
              href="/help"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <HelpCircle className="w-4 h-4" />
              Aide
            </Link>

            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleLogout}
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              {isDemoMode ? "Quitter le mode démo" : "Déconnexion"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
