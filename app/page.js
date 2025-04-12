import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={24}
            priority
          />
          <h1 className="text-2xl font-bold">Cash Sense</h1>
        </div>

        <div className="text-center sm:text-left max-w-lg">
          <h2 className="text-xl font-semibold mb-3">
            Bienvenue sur Cash Sense
          </h2>
          <p className="mb-6 text-gray-600">
            Votre application de gestion de finances personnelles. Connectez
            votre compte bancaire pour voir vos transactions et gérer votre
            budget plus efficacement.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="/transactions"
            >
              Voir mes transactions
            </Link>

            <Link
              className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="/budgets"
            >
              Gérer mon budget
            </Link>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/votre-utilisateur/cash-sense-frontend"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Code source
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/votre-utilisateur/cash-sense-backend"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          API Backend
        </a>
      </footer>
    </div>
  );
}
