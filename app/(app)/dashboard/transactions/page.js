"use client";

import { useDemoMode } from "@/contexts/DemoContext";
import Link from "next/link";

export default function DashboardPage() {
  const { isDemoMode } = useDemoMode();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      {isDemoMode && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            <strong>Mode Démo :</strong> Vous consultez une version de
            démonstration de Cash Sense. Les données affichées sont fictives et
            servent uniquement à illustrer les fonctionnalités de l'application.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Aperçu des finances</h2>
          <p className="text-gray-600 mb-4">
            Accédez rapidement à vos données financières et suivez votre
            activité bancaire.
          </p>
          <Link
            href="/dashboard/transactions"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Voir mes transactions →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Gestion de budget</h2>
          <p className="text-gray-600 mb-4">
            Créez et gérez vos budgets pour mieux contrôler vos dépenses.
          </p>
          <Link
            href="/dashboard/budgets"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Gérer mes budgets →
          </Link>
        </div>
      </div>
    </div>
  );
}
