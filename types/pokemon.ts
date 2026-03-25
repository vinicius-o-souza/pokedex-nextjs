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
