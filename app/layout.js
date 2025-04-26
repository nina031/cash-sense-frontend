"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { DemoProvider } from "@/contexts/DemoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AuthProvider>
            <DemoProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </DemoProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
