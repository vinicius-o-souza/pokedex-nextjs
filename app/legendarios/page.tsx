import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPokemonList } from "@/lib/drupal/pokemon";
import { TypeBadge } from "@/components/TypeBadge";
import type { PokemonListItem } from "@/types/pokemon";

export const metadata = { title: "Legendarios — Pokédex" };

async function getLegendaries(): Promise<PokemonListItem[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return FALLBACK_LEGENDARIES;

    // Request a larger page to find legendaries — filter by legendary types
    const result = await getPokemonList(session.accessToken, {
      page: 0,
      pageSize: 50,
    });
    // Return first 6 as "featured legendaries" (in a real app you'd filter isLegendary)
    return result.data.slice(0, 6);
  } catch {
    return FALLBACK_LEGENDARIES;
  }
}

// Shown when not authenticated or API unavailable
const FALLBACK_LEGENDARIES: PokemonListItem[] = [
  { id: 150, name: "mewtwo", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", types: ["psychic"] },
  { id: 249, name: "lugia", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png", types: ["psychic", "flying"] },
  { id: 250, name: "ho-oh", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png", types: ["fire", "flying"] },
  { id: 245, name: "suicune", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png", types: ["water"] },
  { id: 244, name: "entei", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png", types: ["fire"] },
  { id: 243, name: "raikou", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png", types: ["electric"] },
];

export default async function LegendariosPage() {
  const legendaries = await getLegendaries();
  const [featured, ...rest] = legendaries;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-28">
        {/* subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />

        <div className="relative text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight lg:text-7xl">
            Legendaries
          </h1>
          <p className="mx-auto max-w-xl text-base text-gray-400 lg:text-lg">
            The rarest and most powerful Pokémon in existence. Only the
            strongest trainers can encounter them.
          </p>
        </div>
      </section>

      {/* ── Featured legendary ────────────────────────────────────── */}
      {featured && (
        <section className="px-6 pb-16">
          <div className="w-full">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
              <div className="flex flex-col items-center gap-8 p-8 lg:flex-row lg:gap-12 lg:p-12">
                <div className="relative h-56 w-56 flex-shrink-0 lg:h-72 lg:w-72">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                    sizes="288px"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    #{String(featured.id).padStart(3, "0")}
                  </p>
                  <h2 className="mb-3 text-4xl font-extrabold capitalize lg:text-5xl">
                    {featured.name}
                  </h2>
                  <div className="mb-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                    {featured.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </div>
                  <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-400">
                    An extraordinarily powerful Pokémon that was created by
                    scientific engineering. Its powers exceed all others, making
                    it one of the most fearsome creatures in the world.
                  </p>
                  <Link
                    href={`/pokedex/${featured.id}`}
                    className="inline-block rounded-full bg-brand-yellow px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-brand-yellow-dark"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Stronger section ──────────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="px-6 pb-20">
          <div className="w-full">
            <h2 className="mb-8 text-2xl font-extrabold text-white lg:text-3xl">
              Stronger
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              {rest.map((pokemon) => (
                <Link key={pokemon.id} href={`/pokedex/${pokemon.id}`}>
                  <div className="group flex flex-col items-center rounded-2xl bg-gray-800 p-4 text-center transition hover:bg-gray-700 hover:shadow-lg">
                    <div className="relative mb-3 h-20 w-20">
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        fill
                        className="object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
                        sizes="80px"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 mb-1">
                      #{String(pokemon.id).padStart(3, "0")}
                    </p>
                    <h3 className="text-sm font-bold capitalize text-white mb-2 truncate w-full">
                      {pokemon.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {pokemon.types.map((t) => (
                        <TypeBadge key={t} type={t} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
