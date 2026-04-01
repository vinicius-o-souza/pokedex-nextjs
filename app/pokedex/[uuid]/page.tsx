import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/authOptions";
import { TypeBadge } from "@/components/TypeBadge";
import { TYPE_COLORS, TYPE_HEX_COLORS } from "@/constants/typeColors";
import {
  getPokemonDetail,
  getPokemonUuidByPokeApiId,
} from "@/lib/drupal/pokemon";
import { DrupalApiError } from "@/lib/drupal/client";
import type { PokemonDetailIncluded } from "@/lib/drupal/pokemon";
import type { JsonApiRelationshipRef } from "@/types/pokemon";

const STAT_CONFIG: Record<string, { label: string; color: string }> = {
  hp: { label: "HP", color: "bg-red-500" },
  attack: { label: "ATK", color: "bg-orange-400" },
  defense: { label: "DEF", color: "bg-yellow-400" },
  "special-attack": { label: "SATK", color: "bg-blue-500" },
  "special-defense": { label: "SDEF", color: "bg-teal-500" },
  speed: { label: "SPD", color: "bg-red-400" },
};

function normalizeStatKey(name: string): string {
  const lower = name.toLowerCase().trim();
  const map: Record<string, string> = {
    hp: "hp",
    attack: "attack",
    defense: "defense",
    "special attack": "special-attack",
    "special-attack": "special-attack",
    "special defense": "special-defense",
    "special-defense": "special-defense",
    speed: "speed",
  };
  return map[lower] ?? lower;
}

function resolveIncluded(
  refs: JsonApiRelationshipRef[],
  included: PokemonDetailIncluded[],
  type?: string,
): PokemonDetailIncluded[] {
  return refs
    .map((ref) =>
      included.find((t) => t.id === ref.id && (!type || t.type === type))
    )
    .filter((t): t is PokemonDetailIncluded => t !== undefined);
}

export default async function PokemonDetailPage({
  params,
}: {
  params: { uuid: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let detail;
  try {
    detail = await getPokemonDetail(session.accessToken, params.uuid);
  } catch (e) {
    if (e instanceof DrupalApiError && e.status === 404) notFound();
    throw e;
  }

  const { attributes, relationships } = detail.data;
  const included = detail.included ?? [];

  // Parse types
  const typeTerms = resolveIncluded(
    relationships?.field_pokemon_types?.data ?? [],
    included,
    "taxonomy_term--pokemon_type",
  );
  const types = typeTerms.map((t) => (t.attributes.name ?? "").toLowerCase()).filter(Boolean);

  // Parse abilities
  const abilityTerms = resolveIncluded(
    relationships?.field_pokemon_abilities?.data ?? [],
    included,
    "taxonomy_term--pokemon_ability",
  );
  const abilities = abilityTerms.map((t) => t.attributes.name ?? "").filter(Boolean);

  // Parse stats: each ref points to a paragraph--pokemon_stats entity which
  // holds the numeric value AND a single-ref relationship to the stat name term.
  const statParagraphs = resolveIncluded(
    relationships?.field_pokemon_stats?.data ?? [],
    included,
    "paragraph--pokemon_stats",
  );
  const stats = statParagraphs
    .map((para) => {
      const value = para.attributes.field_pokemon_base_stat;
      if (typeof value !== "number") return null;
      // Single-ref relationship → taxonomy_term--pokemon_stat
      const statTermRef = para.relationships?.field_pokemon_stat?.data;
      if (!statTermRef) return null;
      const statTerm = included.find(
        (t) => t.id === statTermRef.id && t.type === "taxonomy_term--pokemon_stat",
      );
      const key = normalizeStatKey(statTerm?.attributes.name ?? "");
      if (!(key in STAT_CONFIG)) return null; // skip Accuracy, Evasion, etc.
      return { key, value };
    })
    .filter((s): s is { key: string; value: number } => s !== null);

  // Parse evolutions
  const evolutionNodes = resolveIncluded(
    relationships?.field_pokemon_evolutions?.data ?? [],
    included,
    "node--pokemon",
  );
  const evolutions = evolutionNodes
    .map((node) => {
      const evoId = node.attributes.field_pokeapi_id;
      if (!evoId) return null;
      const evoTypeRefs = (node.relationships?.field_pokemon_types?.data ?? []) as JsonApiRelationshipRef[];
      const evoTypes = resolveIncluded(evoTypeRefs, included, "taxonomy_term--pokemon_type")
        .map((t) => (t.attributes.name ?? "").toLowerCase())
        .filter(Boolean);
      return {
        uuid: node.id,
        id: evoId,
        name: node.attributes.title ?? "",
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`,
        types: evoTypes,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const pokeApiId = attributes.field_pokeapi_id;
  const primaryType = types[0] ?? "normal";
  const typeColor = TYPE_COLORS[primaryType] ?? { bg: "bg-stone-400", text: "text-white" };
  const bgClass = typeColor.bg;
  const typeHex = TYPE_HEX_COLORS[primaryType] ?? "#6b7280";
  const pokedexNumber = `#${String(pokeApiId).padStart(3, "0")}`;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeApiId}.png`;

  // Get adjacent pokemon UUIDs for navigation
  const [prevUuid, nextUuid] = await Promise.all([
    pokeApiId > 1
      ? getPokemonUuidByPokeApiId(session.accessToken, pokeApiId - 1)
      : Promise.resolve(null),
    getPokemonUuidByPokeApiId(session.accessToken, pokeApiId + 1),
  ]);

  return (
    <div className="container mx-auto max-w-3xl min-h-screen lg:rounded-b-3xl lg:mt-6">
      {/* ── Colored header section ── */}
      <div className={`relative ${bgClass} overflow-hidden lg:rounded-t-3xl`}>
        {/* Pokeball watermark */}
        <div className="absolute -right-4 -bottom-4 w-56 h-56 opacity-10 pointer-events-none select-none">
          <Image src="/pokeball.svg" alt="" fill className="object-contain" />
        </div>

        {/* Back arrow + Pokédex number */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-1">
          <Link
            href="/pokedex"
            className="flex items-center gap-1 text-white font-semibold hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>
          <span className="text-white/60 font-bold text-sm">{pokedexNumber}</span>
        </div>

        {/* Pokémon name */}
        <h1 className="relative text-white text-center text-3xl font-extrabold capitalize px-6 mt-1 mb-3">
          {attributes.title}
        </h1>

        {/* Navigation arrows + Pokémon image */}
        <div className="relative flex items-center justify-between px-3 pb-8">
          {prevUuid ? (
            <Link
              href={`/pokedex/${prevUuid}`}
              aria-label="Previous Pokémon"
              className="text-white/60 hover:text-white transition-colors p-2 flex-shrink-0"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          ) : (
            <div className="w-11 flex-shrink-0" />
          )}

          <div className="relative w-52 h-52 drop-shadow-2xl flex-shrink-0">
            <Image
              src={imageUrl}
              alt={attributes.title}
              fill
              className="object-contain"
              sizes="208px"
              priority
            />
          </div>

          {nextUuid ? (
            <Link
              href={`/pokedex/${nextUuid}`}
              aria-label="Next Pokémon"
              className="text-white/60 hover:text-white transition-colors p-2 flex-shrink-0"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div className="w-11 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* ── White info card ── */}
      <div className="relative -mt-5 bg-white rounded-3xl px-6 pt-6 pb-12 shadow-sm">
        {/* Type badges */}
        <div className="flex justify-center gap-3 mb-6">
          {types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>

        {/* About */}
        <h2 className="text-center text-base font-bold mb-4" style={{ color: typeHex }}>
          About
        </h2>

        {/* Weight / Height / Moves */}
        <div className="flex items-stretch justify-around mb-2 pb-5 border-b border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              {attributes.field_pokemon_weight} kg
            </div>
            <span className="text-xs text-gray-400">Weight</span>
          </div>

          <div className="w-px bg-gray-100" />

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
              {attributes.field_pokemon_height} m
            </div>
            <span className="text-xs text-gray-400">Height</span>
          </div>

          <div className="w-px bg-gray-100" />

          <div className="flex flex-col items-center gap-1 min-w-[90px]">
            <div className="text-sm font-semibold text-gray-800 text-center leading-snug">
              {abilities.length > 0 ? (
                abilities.map((a, i) => (
                  <div key={i} className="capitalize">
                    {a}
                  </div>
                ))
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            <span className="text-xs text-gray-400">Moves</span>
          </div>
        </div>

        {/* Description */}
        {attributes.field_description && (
          <p className="text-sm text-gray-500 text-center leading-relaxed mt-4 mb-6">
            {attributes.field_description}
          </p>
        )}

        {/* Base Stats */}
        {stats.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-bold mb-4" style={{ color: typeHex }}>
              Base Stats
            </h2>
            <div className="space-y-3">
              {stats.map((stat) => {
                const config = STAT_CONFIG[stat.key] ?? {
                  label: stat.key.slice(0, 4).toUpperCase(),
                  color: "bg-gray-400",
                };
                const pct = Math.round(Math.min(100, (stat.value / 255) * 100));
                return (
                  <div key={stat.key} className="flex items-center gap-3">
                    <span
                      className="w-10 text-right text-xs font-bold shrink-0"
                      style={{ color: typeHex }}
                    >
                      {config.label}
                    </span>
                    <div className="w-px h-4 bg-gray-200 shrink-0" />
                    <span className="w-8 text-xs font-semibold text-gray-700 shrink-0">
                      {String(stat.value).padStart(3, "0")}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${config.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── Evolution Chain (full-width, outside the white card) ── */}
      {evolutions.length > 0 && (
        <div className="bg-gray-50 px-6 py-8">
          <h2 className="text-center text-3xl font-bold mb-6" style={{ color: typeHex }}>
            Evolution
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
            {evolutions.map((evo, idx) => (
              <div key={evo.uuid} className="flex flex-col lg:flex-row items-center gap-4">
                {idx > 0 && (
                  <svg
                    className="w-6 h-6 text-gray-400 shrink-0 rotate-90 lg:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                <Link
                  href={`/pokedex/${evo.uuid}`}
                  className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div
                    className={`relative w-48 h-48 rounded-full ${
                      TYPE_COLORS[(evo.types[0] ?? "normal")]?.bg ?? "bg-stone-200"
                    } bg-opacity-20`}
                  >
                    <Image
                      src={evo.image}
                      alt={evo.name}
                      fill
                      className="object-contain p-2"
                      sizes="256"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-700 capitalize">{evo.name}</p>
                    <p className="text-md text-gray-400 mb-1.5">
                      #{String(evo.id).padStart(3, "0")}
                    </p>
                    <div className="flex gap-1 justify-center">
                      {evo.types.map((t) => (
                        <TypeBadge key={t} type={t} />
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
