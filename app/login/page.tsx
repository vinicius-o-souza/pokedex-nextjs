"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (registered) {
      // Clear the query param from the URL without a full navigation
      window.history.replaceState(null, "", "/login");
    }
  }, [registered]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/pokedex");
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      {/* decorative pokéball rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-32 -top-32 h-96 w-96 rounded-full border-[56px] border-red-100 dark:border-red-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full border-[64px] border-yellow-100 dark:border-yellow-950"
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:p-10">
          {/* Logo / heading */}
          <div className="mb-8 text-center">
            <span className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-3xl shadow-lg">
              🔴
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Welcome back, Trainer
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sign in to access your Pokédex
            </p>
          </div>

          {/* Success banner (after registration) */}
          {registered && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
              <span>✔</span>
              <span>Account created! Please log in.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainer@pokemon.com"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500 dark:focus:ring-red-900"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-500 dark:focus:ring-red-900"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950 dark:text-red-400">
                <span aria-hidden="true">✖</span>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:from-red-700 hover:to-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            New trainer?{" "}
            <Link
              href="/register"
              className="font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
