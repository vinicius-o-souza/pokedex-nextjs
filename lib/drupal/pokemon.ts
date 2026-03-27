import { drupalFetch } from "./client";
import type {
  Pokemon,
  PokemonListItem,
  PokemonType,
  PaginatedResponse,
  JsonApiListResponse,
  JsonApiResourceAttributes,
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

type PokemonListApiResponse = JsonApiListResponse<PokemonNodeAttributes>;

function mapToPokemonListItem(
  resource: JsonApiListResponse<PokemonNodeAttributes>["data"][number],
  typeNames: Map<number, string>,
): PokemonListItem {
  const typeRefs = resource.relationships?.field_pokemon_types?.data;
  const typeArray = Array.isArray(typeRefs) ? typeRefs : [];
  const types = typeArray.map((r) => {
    const tid = r.meta?.drupal_internal__target_id ?? 0;
    return {
      drupal_internal__tid: tid,
      name: typeNames.get(tid) ?? "",
    };
  });

  return {
    uuid: resource.id,
    drupal_internal__nid: resource.attributes.drupal_internal__nid,
    id: resource.attributes.field_pokeapi_id,
    name: resource.attributes.title,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${resource.attributes.field_pokeapi_id}.png`,
    types,
  };
}

/**
 * Fetch a paginated list of Pokémon from the Drupal JSON:API.
 * Type names are resolved via ?filter[field_pokemon_types.meta.drupal_internal__target_id]=TID.
 */
export async function getPokemonList(
  token: string,
  { page = 0, pageSize = 20, type }: GetPokemonListParams = {},
): Promise<PaginatedResponse<PokemonListItem>> {
  const query = new URLSearchParams({
    "page[limit]": String(pageSize),
    "page[offset]": String(page * pageSize),
  });

  if (type) {
    query.set("filter[field_pokemon_types.meta.drupal_internal__target_id]", type);
  }

  const [response, types] = await Promise.all([
    drupalFetch<PokemonListApiResponse>(`/jsonapi/node/pokemon?${query.toString()}`, { token }),
    getPokemonTypes(token),
  ]);

  const typeNames = new Map(types.map((t) => [t.drupal_internal__tid, t.name]));

  return {
    data: response.data.map((r) => mapToPokemonListItem(r, typeNames)),
    total: response.meta.count,
    page,
    pageSize,
  };
}

/**
 * Fetch the full detail record for a single Pokémon by its UUID.
 */
export async function getPokemonByUuid(
  token: string,
  uuid: string,
): Promise<Pokemon> {
  return drupalFetch<Pokemon>(`/jsonapi/node/pokemon/${uuid}`, { token });
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
    drupal_internal__tid: term.attributes.drupal_internal__tid,
    name: term.attributes.name,
  }));
}
