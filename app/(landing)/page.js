// app/(landing)/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

export default function Home() {
  const router = useRouter();

  // Utiliser le store Zustand pour le mode démo
  const setShouldActivateDemo = useDemoModeStore(
    (state) => state.setShouldActivateDemo
  );

  const handleTryDemo = () => {
    // Définir l'état qui indique que le mode démo doit être activé après connexion
    setShouldActivateDemo(true);
    // Rediriger vers la page de connexion
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 sm:p-10">
      <main className="w-full max-w-4xl mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Partie texte - Now includes both the heading and welcome text */}
          <div className="text-center md:text-left md:w-1/2">
            {/* Heading moved here to be closer to Welcome text */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
                Track spendings.
              </span>
              <span className="block bg-gradient-to-r from-purple-500 to-cyan-400 text-transparent bg-clip-text">
                Manage your budget
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
                Save.
              </span>
            </h1>

            <h2 className="text-xl font-semibold mb-10">Welcome!</h2>
            <p className="mb-6 text-gray-600">
              Your personal finance management app. Connect your bank account to
              view your transactions and manage your budget more effectively.
            </p>

            <div className="mb-8">
              <button
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-6 inline-flex items-center justify-center"
                onClick={handleTryDemo}
              >
                Try demo
              </button>
            </div>
          </div>

          {/* Partie images superposées */}
          <div className="relative w-full md:w-1/2 h-80 sm:h-96 md:h-120">
            {/* Image desktop - en arrière-plan */}
            <div className="absolute left-0 top-0 w-11/12 h-5/6 rounded-2xl overflow-hidden shadow-lg border border-white/20 z-10">
              <Image
                src="/chart.jpeg"
                alt="Financial analytics dashboard"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-600/20 rounded-2xl"></div>
            </div>

            {/* Image mobile - au premier plan */}
            <div className="absolute -right-50 bottom-0 w-96 h-96 rounded-2xl overflow-hidden shadow-xl border border-white/20 transform rotate-6 z-100">
              <Image
                src="/spendingsChart.png"
                alt="Mobile financial dashboard"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-600/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 flex gap-4 flex-wrap items-center justify-center text-sm text-gray-500">
        {/* Footer content */}
      </footer>
    </div>
  );
}
