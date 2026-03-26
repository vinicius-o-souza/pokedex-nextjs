import { drupalFetch } from "./client";
import type {
  Pokemon,
  PokemonListItem,
  PokemonType,
  PaginatedResponse,
  JsonApiListResponse,
  JsonApiResourceAttributes,
  JsonApiIncludedTerm,
} from "@/types/pokemon";

interface PokemonTypeAttributes extends JsonApiResourceAttributes {
  drupal_internal__tid: number;
  name: string;
}

export interface GetPokemonListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  search?: string;
}

interface PokemonNodeAttributes extends JsonApiResourceAttributes {
  title: string;
  drupal_internal__nid: number;
  field_pokeapi_id: number;
  field_pokemon_order: number;
  field_pokemon_legendary: boolean;
  field_pokemon_mythical: boolean;
  field_pokemon_experience: number;
  field_pokemon_height: string;
  field_pokemon_weight: string;
  field_description: string | null;
}

// Extends the base list response to include the ?include=field_pokemon_types sideload
interface PokemonListApiResponse extends JsonApiListResponse<PokemonNodeAttributes> {
  included?: JsonApiIncludedTerm[];
}

function mapToPokemonListItem(
  resource: JsonApiListResponse<PokemonNodeAttributes>["data"][number],
  includedTerms: Map<string, string>,
): PokemonListItem {
  const typeRefs = resource.relationships?.field_pokemon_types?.data;
  const typeIds = Array.isArray(typeRefs) ? typeRefs.map((r) => r.id) : [];
  const types = typeIds.map((id) => includedTerms.get(id) ?? id);

  return {
    id: resource.attributes.field_pokeapi_id,
    name: resource.attributes.title,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${resource.attributes.field_pokeapi_id}.png`,
    types,
  };
}

/**
 * Fetch a paginated list of Pokémon from the Drupal JSON:API.
 * Type names are resolved via ?include=field_pokemon_types.
 */
export async function getPokemonList(
  token: string,
  { page = 0, pageSize = 20 }: GetPokemonListParams = {},
): Promise<PaginatedResponse<PokemonListItem>> {
  const query = new URLSearchParams({
    "page[limit]": String(pageSize),
    "page[offset]": String(page * pageSize),
    include: "field_pokemon_types",
  });

  const response = await drupalFetch<PokemonListApiResponse>(
    `/jsonapi/node/pokemon?${query.toString()}`,
    { token },
  );

  // Build a UUID → name map from the included taxonomy terms
  const includedTerms = new Map<string, string>();
  for (const term of response.included ?? []) {
    if (term.type === "taxonomy_term--pokemon_type") {
      includedTerms.set(term.id, term.attributes.name);
    }
  }

  return {
    data: response.data.map((r) => mapToPokemonListItem(r, includedTerms)),
    total: response.meta.count,
    page,
    pageSize,
  };
}

/**
 * Fetch the full detail record for a single Pokémon by its UUID.
 */
export async function getPokemonById(
  token: string,
  id: string,
): Promise<Pokemon> {
  return drupalFetch<Pokemon>(`/jsonapi/node/pokemon/${id}`, { token });
}

/**
 * Fetch all available Pokémon types.
 */
export async function getPokemonTypes(token: string): Promise<PokemonType[]> {
  const response = await drupalFetch<JsonApiListResponse<PokemonTypeAttributes>>(
    "/jsonapi/taxonomy_term/pokemon_type",
    { token },
  );

  return response.data.map((term) => ({
    id: term.attributes.drupal_internal__tid,
    name: term.attributes.name,
  }));
}
