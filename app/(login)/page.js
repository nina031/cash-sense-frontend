import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/logo-cashSense.png"
            alt="cashsense logo"
            width={80}
            height={20}
            priority
          />
          <h1 className="text-2xl font-bold">Cash Sense</h1>
        </div>

        <div className="text-center sm:text-left max-w-lg">
          <h2 className="text-xl font-semibold mb-3">Bienvenue !</h2>
          <p className="mb-6 text-gray-600">
            Your personal finance management app. Connect your bank account to
            view your transactions and manage your budget more effectively.
          </p>

          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2 rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto flex items-center justify-center"
              href="/transactions"
            >
              Try demo
            </Link>

            <Link
              className="rounded-full bg-white border border-solid border-black/[.2] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="/budgets"
            >
              Synchronize your account
            </Link>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
