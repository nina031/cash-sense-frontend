"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/contexts/DemoContext";

export default function AccountSettingsPage() {
  const { session } = useAuth();
  const { isDemoMode } = useDemoMode();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the user's information
    // For now, we'll just toggle back to viewing mode
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        {isDemoMode ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
            <p className="text-yellow-800">
              En mode démo, les paramètres du compte ne sont pas disponibles.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Informations personnelles
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit">Enregistrer</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                  <p className="mt-1 text-gray-900">
                    {session?.user?.name || "Non défini"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-900">{session?.user?.email}</p>
                </div>

                <div className="pt-2">
                  <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                </div>
              </div>
            )}

            <hr className="my-6" />

            <h2 className="text-lg font-semibold mb-4">Sécurité</h2>
            <div className="space-y-4">
              <Button variant="outline">Changer de mot de passe</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
