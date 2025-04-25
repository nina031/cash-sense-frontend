"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(name, email, password);

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirection vers le tableau de bord après inscription réussie
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Côté gauche - Partie violette avec graphiques */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#8367c7] p-10 text-white overflow-hidden">
        {/* SVG des vagues */}
        <div className="absolute inset-0 z-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-64"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(255, 255, 255, 0.1)"
              fillOpacity="0.5"
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,149.3C672,160,768,224,864,218.7C960,213,1056,139,1152,122.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-full h-64"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(255, 255, 255, 0.2)"
              fillOpacity="0.5"
              d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* Texte d'accueil */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Rejoignez Cash Sense</h1>
          <p className="text-lg opacity-90 mb-6">
            Découvrez une nouvelle façon de gérer vos finances personnelles
          </p>

          {/* Badges fonctionnalités */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Analyses Financières
            </div>
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Gestion Budgétaire
            </div>
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Suivi en Temps Réel
            </div>
          </div>

          {/* Images superposées */}
          <div className="relative mt-6 w-full max-w-md">
            <div className="relative z-10 shadow-xl rounded-2xl overflow-hidden border border-white/20">
              <Image
                src="/chart.jpeg"
                alt="Financial analytics dashboard"
                width={500}
                height={300}
                className="object-cover w-full rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-600/20 rounded-2xl"></div>
            </div>

            <div className="absolute top-40 -right-50 w-100 shadow-2xl rounded-2xl overflow-hidden border border-white/20 transform rotate-6 z-15">
              <Image
                src="/spendingsChart.png"
                alt="Mobile financial dashboard"
                width={250}
                height={400}
                className="object-cover w-full h-full rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-indigo-600/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Côté droit - Formulaire d'inscription */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Créer un compte
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ nom */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                placeholder="Votre nom"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Champ email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Votre email"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Champ mot de passe */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder="Créez un mot de passe sécurisé"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {/* Champ confirmation mot de passe */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {/* Bouton d'inscription */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 bg-[#613dc1] hover:bg-purple-700 text-white rounded-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Inscription en cours...
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </div>

            {/* Lien vers la page de connexion */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Déjà un compte?{" "}
                <Link
                  href="/login"
                  className="text-[#613dc1] hover:text-purple-600 font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
