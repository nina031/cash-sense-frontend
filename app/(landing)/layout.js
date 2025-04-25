import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export default function LoginLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-4">{children}</main>
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Cash Sense. Tous droits réservés.</p>
          <p className="mt-2">
            Application de démonstration pour la gestion de finances
            personnelles.
          </p>
        </div>
      </footer>
    </>
  );
}
