"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const techStack = [
  {
    name: "Next.js 14",
    icon: "▲",
    description: "App Router · Server & Client Components",
    color: "bg-black text-white",
  },
  {
    name: "Drupal",
    icon: "💧",
    description: "Headless CMS · REST API & JSON:API",
    color: "bg-blue-600 text-white",
  },
  {
    name: "TypeScript",
    icon: "TS",
    description: "End-to-end type safety",
    color: "bg-blue-500 text-white",
  },
  {
    name: "Tailwind CSS",
    icon: "🎨",
    description: "Utility-first responsive styling",
    color: "bg-cyan-500 text-white",
  },
  {
    name: "NextAuth.js",
    icon: "🔐",
    description: "OAuth 2.0 client credentials flow",
    color: "bg-brand-yellow text-gray-900",
  },
  {
    name: "Vercel",
    icon: "⚡",
    description: "Analytics & Speed Insights",
    color: "bg-gray-900 text-white",
  },
] as const;

const features = [
  {
    icon: "🔗",
    title: "Drupal as a Headless CMS",
    description:
      "Consumes Drupal JSON:API for detail pages with relationship includes, keeping the frontend fully decoupled.",
  },
  {
    icon: "🔑",
    title: "OAuth 2.0 Client Credentials",
    description:
      "The Next.js backend exchanges client credentials with Drupal's Simple OAuth server and forwards the bearer token on every API call — secrets never reach the browser.",
  },
  {
    icon: "⚡",
    title: "Hybrid Rendering",
    description:
      "The Pokédex list is server-rendered on first load for instant content, then switches to client-side fetch for pagination and filtering without a full page reload.",
  },
  {
    icon: "📡",
    title: "REST API Integration",
    description:
      "Typed API client fetches and normalises Drupal JSON:API responses into clean TypeScript models.",
  },
  {
    icon: "🎨",
    title: "Responsive Design",
    description:
      "Mobile-first Tailwind CSS layout with Pokémon-themed colour palette.",
  },
  {
    icon: "🔄",
    title: "Token Refresh Flow",
    description:
      "Access tokens are transparently refreshed via NextAuth callbacks so sessions stay alive without user interruption.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!session;

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-yellow">
        <div className="container mx-auto flex flex-col-reverse items-center gap-8 px-6 py-16 lg:flex-row lg:justify-between lg:py-24 lg:px-8">
          {/* Left: text */}
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="mb-4 text-5xl font-medium leading-tight text-gray-900 lg:text-7xl">
              Find all your<br />
              favorite<br />
              <b className="font-extrabold">Pokemon</b>
            </h1>
            <h2 className="mb-8 text-1xl lg:text-2xl text-gray-700">
              You can know the type of Pokemon, its strengths,
              disadvantages and abilities.
            </h2>
            <div className="flex flex-col items-center gap-3 lg:flex-row">
              <Link
                href="/pokedex"
                className="rounded-full bg-brand-green px-8 py-3 text-base font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
              >
                See pokemons
              </Link>
              { !isAuthenticated ?
                <Link
                  href="/register"
                  className="rounded-full border-2 border-gray-900/20 px-8 py-3 text-base font-bold text-gray-900 transition hover:bg-black/10 active:scale-95"
                >
                  Register
                </Link>
              : '' }
            </div>
            { !isAuthenticated ?
              <p className="mt-5 text-lg text-gray-600">
                Already a trainer?{" "}
                <Link href="/login" className="font-semibold underline underline-offset-2 hover:text-gray-900">
                  Sign in here
                </Link>
              </p>
            : '' }
          </div>

          {/* Right: Pokedex */}
          <div className="relative flex-shrink-0">
            <Image
              src="/pokedex.svg"
              alt="POkedex"
              width={480}
              height={480}
              priority
              className="drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ── Team Rocket banner ────────────────────────────────────────────── */}
      <section className="bg-gray-900 px-6 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 lg:flex-row">
          <p className="text-center text-sm font-medium text-gray-400 lg:text-left">
            Beware of Team Rocket — they&apos;re always watching.
          </p>
        </div>
      </section>

      {/* ── Built with ───────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="container mx-auto">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Built with
          </h2>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm transition hover:shadow-md"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold ${tech.color}`}
                >
                  {tech.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{tech.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What this project demonstrates ───────────────────────────────── */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="container mx-auto">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 lg:text-4xl">
            What this project demonstrates
          </h2>

          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 text-base font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-8 text-center">
        <p className="container mx-auto text-sm text-gray-900">
          Built as a portfolio project ·{" "}
          <a
            href="https://github.com/vinicius-o-souza/pokedex-nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-700 underline underline-offset-2 transition hover:text-gray-900"
          >
            View on GitHub ↗
          </a>
        </p>
        <div className="mt-1 text-gray-900 text-center text-sm">
          <p>
            Developed with love by{" "}
            <a
              href="https://www.linkedin.com/in/viniciusosouza/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Vinicius de Oliveira Souza
            </a>{" "}
            &bull;{" "}
            <a
              href="http://deploya.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              deploya.com.br
            </a>
          </p>
        </div>
        <p className="mt-5 text-xs text-gray-900">
          Pokémon and all related names are trademarks of Nintendo / Game Freak.
        </p>
        <p className="mt-1 text-xs text-gray-900">
          This project is not affiliated with or endorsed by Nintendo.
        </p>
      </footer>
    </div>
  );
}
