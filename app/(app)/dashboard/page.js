"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Aperçu des finances</h2>
          <p className="text-gray-600 mb-4">
            Accédez rapidement à vos données financières et suivez votre
            activité bancaire.
          </p>
          <Link
            href="/dashboard/analyse"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Analyser mes dépenses →
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
