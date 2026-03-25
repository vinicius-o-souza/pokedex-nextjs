import { drupalFetch } from "./client";
import type {
  Pokemon,
  PokemonListItem,
  PokemonType,
  PaginatedResponse,
} from "@/types/pokemon";

/**
 * Drupal REST endpoint conventions used by this module
 * -------------------------------------------------------
 * All endpoints live under /api/pokemon (adjust to match your Drupal
 * Views REST Export or custom REST resource paths).
 *
 * GET /api/pokemon
 *   Query params:
 *     page       – 0-based page index (default 0)
 *     page_size  – items per page    (default 20)
 *     type       – filter by type name, e.g. "fire"
 *     search     – partial name search string
 *   Returns: PaginatedResponse<PokemonListItem>
 *     {
 *       data: [ { id, name, image, types[] }, ... ],
 *       total: 151,
 *       page: 0,
 *       pageSize: 20
 *     }
 *
 * GET /api/pokemon/:id
 *   Returns: full Pokemon entity matching the Pokemon interface.
 *
 * GET /api/pokemon/types
 *   Returns: PokemonType[]  e.g. [ { id: 1, name: "normal" }, ... ]
 */

export interface GetPokemonListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  search?: string;
}

/**
 * Fetch a paginated list of Pokémon, optionally filtered by type and/or name.
 *
 * @param token  - Bearer access token obtained via fetchAccessToken.
 * @param params - Pagination and filter options.
 */
export async function getPokemonList(
  token: string,
  { page = 0, pageSize = 20, type, search }: GetPokemonListParams = {},
): Promise<PaginatedResponse<PokemonListItem>> {
  const query = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (type) query.set("type", type);
  if (search) query.set("search", search);

  return drupalFetch<PaginatedResponse<PokemonListItem>>(
    `/api/pokemon?${query.toString()}`,
    { token },
  );
}

/**
 * Fetch the full detail record for a single Pokémon by its ID.
 *
 * @param token - Bearer access token.
 * @param id    - The Pokémon's numeric or UUID identifier as a string.
 */
export async function getPokemonById(
  token: string,
  id: string,
): Promise<Pokemon> {
  return drupalFetch<Pokemon>(`/api/pokemon/${id}`, { token });
}

/**
 * Fetch all available Pokémon types for use in the filter UI.
 *
 * The list is relatively static (18 canonical types), so the caller may
 * want to cache this response at the React Query layer with a long staleTime.
 *
 * @param token - Bearer access token.
 */
export async function getPokemonTypes(token: string): Promise<PokemonType[]> {
  return drupalFetch<PokemonType[]>("/api/pokemon/types", { token });
}
