import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-brand-red px-6 py-16 text-white">
      <div className="flex flex-col items-center text-center">
        {/* Team Rocket illustration */}
        <div className="mb-6 w-48 sm:w-64">
          <Image
            src="/team-rocket.svg"
            alt="Team Rocket"
            width={256}
            height={256}
            className="drop-shadow-xl"
          />
        </div>

        {/* 404 */}
        <h1 className="mb-3 text-8xl font-extrabold tracking-tight sm:text-9xl">
          404
        </h1>

        <p className="mb-8 max-w-xs text-lg font-medium text-white/90 sm:text-xl">
          The rocket team has won this time.
        </p>

        <Link
          href="/"
          className="rounded-full bg-white px-8 py-3 text-base font-bold text-brand-red transition hover:bg-gray-100 active:scale-95"
        >
          Return
        </Link>
      </div>
    </div>
  );
}
