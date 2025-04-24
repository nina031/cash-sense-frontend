"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dans une application réelle, vous feriez ici une requête d'authentification
    console.log("Login attempt with:", { email, password, rememberMe });

    // Pour l'instant, simulons juste une redirection vers le tableau de bord
    router.push("/dashboard");
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
          <h1 className="text-4xl font-bold mb-4">Welcome to Cash Sense</h1>
          <p className="text-lg opacity-90 mb-6">
            Manage your finances with confidence and clarity
          </p>

          {/* Badges fonctionnalités */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Financial Analytics
            </div>
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Smart Budgeting
            </div>
            <div className="bg-white/10 rounded-full px-4 py-1 text-sm backdrop-blur-sm">
              Real-time Tracking
            </div>
          </div>

          {/* Images superposées comme dans la référence */}
          <div className="relative mt-6 w-full max-w-md">
            {/* Première image - desktop version */}
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

            {/* Deuxième image - mobile version, légèrement décalée */}
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

      {/* Côté droit - Formulaire de connexion */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">Sign In</h2>

          <Form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Champ email */}
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder="Username or email"
                  className="w-full border border-gray-200 rounded-full p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Champ mot de passe */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="w-full border border-gray-200 rounded-full p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Options de connexion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-[#613dc1] hover:text-purple-600"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-[#613dc1] hover:bg-purple-700 text-white rounded-full"
                >
                  Sign In
                </Button>
              </div>

              {/* Lien de création de compte */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  New here?{" "}
                  <Link
                    href="/signup"
                    className="text-[#613dc1] hover:text-purple-600 font-medium"
                  >
                    Create an Account
                  </Link>
                </p>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
