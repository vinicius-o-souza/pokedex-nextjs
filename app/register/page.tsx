"use client";

import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)]">
      {/* ── Left: yellow panel ─────────────────────────────────────────── */}
      <div className="hidden flex-col items-center justify-center bg-brand-yellow px-12 lg:flex lg:w-1/2">
        <Image
          src="/pokedex.svg"
          alt="Pokedex"
          width={300}
          height={300}
          className="drop-shadow-xl"
        />
        <h2 className="mt-8 max-w-xs text-center text-sm font-medium text-gray-700">
          Create your account and start discovering all your favorite Pokémon.
        </h2>
      </div>

      {/* ── Right: register ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8">
          <Image src="/pokeball.svg" alt="Pokédex" width={130} height={48} />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl text-center font-extrabold text-gray-900 sm:text-3xl">
              Become a Trainer
            </h1>
            <p className="mt-1 text-sm text-center text-gray-500">
              Create an account to access your Pokédex
            </p>
          </div>

          <a
            href="/api/auth/register"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-yellow px-4 py-3 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-brand-yellow-dark active:scale-[0.98]"
          >
            Register with Drupal
          </a>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already a trainer?{" "}
            <a
              href="/login"
              className="font-semibold text-gray-900 underline underline-offset-2 hover:text-brand-yellow-dark"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
