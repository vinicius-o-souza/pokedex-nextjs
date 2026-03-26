export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonStat {
  name: string;
  base_stat: number;
}

export interface PokemonAbility {
  name: string;
  is_hidden: boolean;
}

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  order: number;
  weight: number;
  height: number;
  evolutionChain: EvolutionStage[];
  baseExperience: number;
  isLegendary: boolean;
  isMythical: boolean;
  generation: string;
  description: string;
}

export interface PokemonType {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Drupal JSON:API response types
export interface JsonApiRelationshipRef {
  type: string;
  id: string; // UUID
  meta?: { drupal_internal__target_id?: number };
}

export interface JsonApiResourceAttributes {
  title: string;
  drupal_internal__nid: number;
  [key: string]: unknown;
}

export interface JsonApiResource<A extends JsonApiResourceAttributes = JsonApiResourceAttributes> {
  type: string;
  id: string; // UUID
  attributes: A;
  relationships?: Record<string, { data: JsonApiRelationshipRef | JsonApiRelationshipRef[] | null }>;
}

export interface JsonApiListResponse<A extends JsonApiResourceAttributes = JsonApiResourceAttributes> {
  data: JsonApiResource<A>[];
  meta: { count: number };
  links?: {
    next?: { href: string };
    prev?: { href: string };
    last?: { href: string };
  };
}

// Included resource (e.g. taxonomy_term--pokemon_type from ?include=field_pokemon_types)
export interface JsonApiIncludedTerm {
  type: string;
  id: string;
  attributes: { name: string; [key: string]: unknown };
}
