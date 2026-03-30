import { drupalFetch } from "./client";
import type {
  Pokemon,
  PokemonListItem,
  PokemonType,
  PokemonGeneration,
  PaginatedResponse,
  JsonApiListResponse,
  JsonApiRelationshipRef,
  JsonApiResourceAttributes,
} from "@/types/pokemon";

export interface PokemonDetailIncluded {
  type: string;
  id: string;
  attributes: {
    name?: string;
    title?: string;
    field_pokeapi_id?: number;
    /** paragraph--pokemon_stats: the numeric base stat value */
    field_pokemon_base_stat?: number;
    [key: string]: unknown;
  };
  relationships?: {
    /** paragraph--pokemon_stats → single taxonomy_term--pokemon_stat */
    field_pokemon_stat?: { data: JsonApiRelationshipRef };
    /** node--pokemon evolutions → their type terms */
    field_pokemon_types?: { data: JsonApiRelationshipRef[] };
    [key: string]: unknown;
  };
}

export interface PokemonDetailApiResponse {
  data: {
    type: string;
    id: string;
    attributes: PokemonNodeAttributes;
    relationships: {
      field_pokemon_types?: { data: JsonApiRelationshipRef[] };
      field_pokemon_abilities?: { data: JsonApiRelationshipRef[] };
      field_pokemon_stats?: { data: JsonApiRelationshipRef[] };
      field_pokemon_evolutions?: { data: JsonApiRelationshipRef[] };
    };
  };
  included?: PokemonDetailIncluded[];
}

interface PokemonTypeAttributes extends JsonApiResourceAttributes {
  drupal_internal__tid: number;
  name: string;
}

export interface GetPokemonListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  generation?: string;
  search?: string;
  legendary?: boolean;
  mythical?: boolean;
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
  { page = 0, pageSize = 20, type, generation, search, legendary, mythical }: GetPokemonListParams = {},
): Promise<PaginatedResponse<PokemonListItem>> {
  const query = new URLSearchParams({
    "page[limit]": String(pageSize),
    "page[offset]": String(page * pageSize),
  });

  if (type) {
    query.set("filter[field_pokemon_types.meta.drupal_internal__target_id]", type);
  }

  if (generation) {
    query.set("filter[field_pokemon_generation.meta.drupal_internal__target_id]", generation);
  }

  if (search) {
    query.set("filter[title-filter][condition][path]", "title");
    query.set("filter[title-filter][condition][operator]", "CONTAINS");
    query.set("filter[title-filter][condition][value]", search);
  }

  if (legendary) {
    query.set("filter[legendary-filter][condition][path]", "field_pokemon_legendary");
    query.set("filter[legendary-filter][condition][value]", "1");
  }

  if (mythical) {
    query.set("filter[mythical-filter][condition][path]", "field_pokemon_mythical");
    query.set("filter[mythical-filter][condition][value]", "1");
  }

  const [response, types] = await Promise.all([
    drupalFetch<PokemonListApiResponse>(`/api/node/pokemon?${query.toString()}`, { token }),
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
 * Fetch detailed Pokémon data with all relevant includes.
 */
export async function getPokemonDetail(
  token: string,
  uuid: string,
): Promise<PokemonDetailApiResponse> {
  return drupalFetch<PokemonDetailApiResponse>(
    `/api/node/pokemon/${uuid}?include=field_pokemon_types,field_pokemon_abilities,field_pokemon_stats.field_pokemon_stat,field_pokemon_evolutions`,
    { token },
  );
}

/**
 * Find a Pokémon UUID by its PokeAPI numeric ID (used for prev/next navigation).
 */
export async function getPokemonUuidByPokeApiId(
  token: string,
  pokeApiId: number,
): Promise<string | null> {
  try {
    const response = await drupalFetch<JsonApiListResponse<PokemonNodeAttributes>>(
      `/api/node/pokemon?filter[field_pokeapi_id]=${pokeApiId}&page[limit]=1&fields[node--pokemon]=id`,
      { token },
    );
    return response.data[0]?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch all available Pokémon types.
 */
export async function getPokemonTypes(token: string): Promise<PokemonType[]> {
  const response = await drupalFetch<JsonApiListResponse<PokemonTypeAttributes>>(
    "/api/taxonomy_term/pokemon_type",
    { token },
  );

  return response.data.map((term) => ({
    drupal_internal__tid: term.attributes.drupal_internal__tid,
    name: term.attributes.name,
  }));
}

interface PokemonGenerationAttributes extends JsonApiResourceAttributes {
  drupal_internal__tid: number;
  name: string;
}

/**
 * Fetch all available Pokémon generations.
 */
export async function getPokemonGenerations(token: string): Promise<PokemonGeneration[]> {
  const response = await drupalFetch<JsonApiListResponse<PokemonGenerationAttributes>>(
    "/api/taxonomy_term/pokemon_generation",
    { token },
  );

  return response.data.map((term) => ({
    drupal_internal__tid: term.attributes.drupal_internal__tid,
    name: term.attributes.name,
  }));
}
