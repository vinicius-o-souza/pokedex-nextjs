"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home", protected: false },
  { href: "/pokedex", label: "Pokedex", protected: true },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated" && !!session;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex max-w-8xl flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Pokédex" width={120} height={44} priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.filter((l) => !l.protected || isAuthenticated).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-5 py-2 text-md font-bold transition text-gray-900 hover:bg-brand-yellow ${
                pathname === link.href
                  ? "bg-brand-yellow"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full bg-brand-yellow px-5 py-2 text-md font-bold text-gray-900 transition hover:bg-brand-yellow-dark"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={`rounded-full px-5 py-2 text-md font-bold transition text-gray-900 hover:bg-brand-yellow ${
                  pathname === "/login"
                    ? "bg-brand-yellow"
                    : ""
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`rounded-full px-5 py-2 text-md font-bold transition text-gray-900 hover:bg-brand-yellow ${
                  pathname === "/register"
                    ? "bg-brand-yellow"
                    : ""
                }`}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.filter((l) => !l.protected || isAuthenticated).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition hover:bg-gray-50 ${
                  pathname === link.href ? "text-brand-yellow-dark" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-gray-100 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full rounded-full bg-brand-yellow px-5 py-3 text-md font-bold text-gray-900 transition hover:bg-brand-yellow-dark"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-brand-yellow px-5 py-3 text-center text-md font-bold text-gray-900 transition hover:bg-brand-yellow-dark"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
