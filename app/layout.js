import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cash Sense - Gestion de finances personnelles",
  description:
    "Suivez vos transactions, gérez votre budget et prenez le contrôle de vos finances personnelles avec Cash Sense.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-4">{children}</main>
        <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Cash Sense. Tous droits réservés.
            </p>
            <p className="mt-2">
              Application de démonstration pour la gestion de finances
              personnelles.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
