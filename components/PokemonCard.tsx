import Image from "next/image";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import type { PokemonListItem } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokedex/${pokemon.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-500">
        <div className="relative w-full aspect-square mb-3">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-1">
          #{String(pokemon.id).padStart(3, "0")}
        </p>
        <h3 className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-100 mb-2 truncate">
          {pokemon.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </Link>
  );
}
