import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { DemoProvider } from "@/contexts/DemoContext";

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
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
