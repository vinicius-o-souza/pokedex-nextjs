import Link from "next/link";

// ---------------------------------------------------------------------------
// Tech stack data
// ---------------------------------------------------------------------------

const techStack = [
  {
    name: "Next.js 14",
    icon: "▲",
    description: "App Router, SSR, Server Components",
    color: "bg-black text-white dark:bg-white dark:text-black",
  },
  {
    name: "Drupal",
    icon: "💧",
    description: "Headless CMS · REST & OAuth 2.0",
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
    name: "OAuth 2.0",
    icon: "🔐",
    description: "NextAuth · token refresh flow",
    color: "bg-yellow-500 text-black",
  },
] as const;

// ---------------------------------------------------------------------------
// Feature list data
// ---------------------------------------------------------------------------

const features = [
  {
    icon: "🔗",
    title: "Decoupled CMS",
    description:
      "Drupal acts as a pure data source, exposing Pokémon content via JSON REST endpoints consumed by Next.js.",
  },
  {
    icon: "🔑",
    title: "OAuth 2.0 Authentication",
    description:
      "Full password-grant OAuth flow against Drupal's Simple OAuth module, with silent JWT refresh handled server-side.",
  },
  {
    icon: "⚡",
    title: "Server-Side Rendering",
    description:
      "Pages are rendered on the server for fast initial loads and SEO-friendly markup out of the box.",
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
      "Mobile-first Tailwind CSS layout with dark mode support and Pokémon-themed colour palette.",
  },
  {
    icon: "🔄",
    title: "Token Refresh Flow",
    description:
      "Access tokens are transparently refreshed via NextAuth callbacks so sessions stay alive without user interruption.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-yellow-400 px-6 py-28 text-white dark:from-red-800 dark:via-red-700 dark:to-yellow-600 sm:py-40">
        {/* decorative pokéball rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[48px] border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full border-[56px] border-white/10"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest backdrop-blur">
            Portfolio Project
          </span>

          <h1 className="mb-4 text-5xl font-extrabold leading-tight drop-shadow-lg sm:text-7xl">
            Pokédex
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-white/90 sm:text-xl">
            A full-stack portfolio project built with{" "}
            <span className="font-bold text-white">Next.js</span> &{" "}
            <span className="font-bold text-white">Drupal</span> — showcasing
            decoupled CMS architecture, OAuth 2.0 authentication, and
            server-side rendering.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="rounded-full bg-white px-8 py-3 text-base font-bold text-red-600 shadow-lg transition hover:bg-red-50 active:scale-95"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full border-2 border-white px-8 py-3 text-base font-bold text-white transition hover:bg-white/10 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Built with
          </h2>
          <p className="mb-12 text-center text-gray-500 dark:text-gray-400">
            Modern tools chosen for real-world, production-grade patterns.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold ${tech.color}`}
                >
                  {tech.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {tech.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-6 py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            What this project demonstrates
          </h2>
          <p className="mb-12 text-center text-gray-500 dark:text-gray-400">
            A showcase of full-stack engineering patterns across the entire
            request lifecycle.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built as a portfolio project ·{" "}
          <a
            href="https://github.com/your-username/pokedex-nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
          >
            View on GitHub ↗
          </a>
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
          Pokémon and all related names are trademarks of Nintendo / Game Freak.
          This project is not affiliated with or endorsed by Nintendo.
        </p>
      </footer>
    </div>
  );
}
