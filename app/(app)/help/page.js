"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Centre d'aide</h1>
        <p className="text-gray-600 mt-2">
          Comment pouvons-nous vous aider aujourd'hui ?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-3">Premiers pas</h2>
          <p className="text-gray-600 mb-4">
            Apprenez à utiliser Cash Sense pour gérer vos finances personnelles.
          </p>
          <ul className="space-y-2 text-indigo-600">
            <li>
              <a href="#" className="hover:underline">
                Comment connecter mon compte bancaire
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Configurer mon premier budget
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Comprendre mes transactions
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-3">Fonctionnalités</h2>
          <p className="text-gray-600 mb-4">
            Découvrez toutes les fonctionnalités de Cash Sense.
          </p>
          <ul className="space-y-2 text-indigo-600">
            <li>
              <a href="#" className="hover:underline">
                Analyses financières
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Gestion des objectifs d'épargne
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Catégorisation automatique
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-10">
        <h2 className="text-lg font-semibold mb-4">Questions fréquentes</h2>

        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Comment mes données sont-elles protégées ?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
              Cash Sense utilise le chiffrement de bout en bout pour protéger
              vos informations financières. Nous ne stockons jamais vos
              identifiants bancaires et nous utilisons des technologies de
              sécurité avancées pour garantir la protection de vos données.
            </p>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Comment puis-je supprimer mon compte ?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
              Vous pouvez supprimer votre compte en allant dans les paramètres
              de votre compte. Toutes vos données seront définitivement
              supprimées de nos serveurs.
            </p>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Cash Sense est-il gratuit ?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
              Cash Sense propose une version gratuite avec des fonctionnalités
              de base et une version premium avec des fonctionnalités avancées.
              Consultez notre page de tarification pour plus de détails.
            </p>
          </details>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-lg font-semibold mb-3">
          Besoin d'aide supplémentaire ?
        </h2>
        <p className="text-gray-700 mb-4">
          Notre équipe d'assistance est là pour vous aider. N'hésitez pas à nous
          contacter.
        </p>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Contacter le support
        </Button>
      </div>
    </div>
  );
}
