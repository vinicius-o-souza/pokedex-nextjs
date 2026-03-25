"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PaginatedResponse,
  PokemonListItem,
  PokemonType,
} from "@/types/pokemon";
import { SearchBar } from "@/components/SearchBar";
import { TypeFilter } from "@/components/TypeFilter";
import { PokemonCard } from "@/components/PokemonCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Pagination } from "@/components/Pagination";

interface PokedexClientProps {
  initialData: PaginatedResponse<PokemonListItem>;
  types: PokemonType[];
}

const PAGE_SIZE = 20;

export function PokedexClient({ initialData, types }: PokedexClientProps) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Skip the initial effect run — we already have SSR data for default filters.
  const isFirstRender = useRef(true);

  const fetchPokemon = useCallback(async (page: number, type: string, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page - 1), // API uses 0-based index
        pageSize: String(PAGE_SIZE),
      });
      if (query) params.set("search", query);
      if (type) params.set("type", type);

      const res = await fetch(`/api/pokemon?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expired. Please log in again.");
        throw new Error("Failed to load Pokémon.");
      }
      const json: PaginatedResponse<PokemonListItem> = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchPokemon(currentPage, selectedType, search);
  }, [currentPage, selectedType, search, fetchPokemon]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(data.total / data.pageSize);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pokédex
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data.total} Pokémon
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
          <TypeFilter
            types={types}
            selected={selectedType}
            onSelect={handleTypeSelect}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton count={PAGE_SIZE} />
        ) : data.data.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">No Pokémon found</p>
            <p className="text-sm mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.data.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
