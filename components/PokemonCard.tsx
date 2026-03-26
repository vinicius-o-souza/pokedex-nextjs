import Image from "next/image";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import type { PokemonListItem } from "@/types/pokemon";
import { TYPE_COLORS } from "@/constants/typeColors";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

/** Deterministic HP % (45–100) derived from pokemon id so it looks consistent. */
function hpPercent(id: number): number {
  return 45 + (id * 37) % 56;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const hp = hpPercent(pokemon.id);
  const primaryType = pokemon.types[0] ?? "normal";
  const typeBg = TYPE_COLORS[primaryType]?.bg ?? "bg-stone-400";

  return (
    <Link href={`/pokedex/${pokemon.id}`}>
      <div className="group relative flex h-44 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
        {/* Left: info */}
        <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4 min-w-0">
          <p className="text-sm font-mono text-gray-400">
            #{String(pokemon.id).padStart(3, "0")}
          </p>
          <h3 className="text-xl font-bold capitalize text-gray-800 truncate">
            {pokemon.name}
          </h3>

          {/* Type badges */}
          <div className="flex flex-wrap gap-1.5">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type.toLowerCase()} />
            ))}
          </div>

          {/* HP bar */}
          <div className="mt-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">HP</span>
              <span className="text-xs text-gray-400">{hp}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100">
              <div
                className="h-2.5 rounded-full bg-brand-green transition-all"
                style={{ width: `${hp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: type-tinted panel with Pokemon image */}
        <div className={`relative w-40 flex-shrink-0 ${typeBg} opacity-90`}>
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="object-contain p-2 drop-shadow-md transition-transform duration-200 group-hover:scale-110"
            sizes="160px"
          />
        </div>
      </div>
    </Link>
  );
}
