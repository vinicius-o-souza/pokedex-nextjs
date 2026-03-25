"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PaginatedResponse,
  PokemonListItem,
  PokemonType,
} from "@/types/pokemon";
import { SearchBar } from "@/components/SearchBar";
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const isFirstRender = useRef(true);

  const selectedType = selectedTypes[0] ?? "";

  const fetchPokemon = useCallback(async (page: number, type: string, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
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

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName) ? prev.filter((t) => t !== typeName) : [typeName]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(data.total / data.pageSize);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
            <span className="text-brand-yellow-dark">{data.total}</span> Pokémons for you to choose your favorite
          </h1>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ── Filter sidebar (desktop) ────────────────────────────── */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <FilterPanel
              types={types}
              selectedTypes={selectedTypes}
              onTypeToggle={handleTypeToggle}
              onClear={clearFilters}
            />
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Search + mobile filter toggle */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <button
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M10 12h4" />
                </svg>
                Filters
                {selectedTypes.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-gray-900">
                    {selectedTypes.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active type filter indicator */}
            {selectedType && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Filtering by:</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold capitalize text-gray-900">
                  {selectedType}
                  <button onClick={clearFilters} className="hover:text-red-600">×</button>
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <LoadingSkeleton count={PAGE_SIZE} />
            ) : data.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium">No Pokémon found</p>
                <p className="text-sm mt-1">Try a different search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {data.data.map((pokemon) => (
                  <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
              </div>
            )}

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile filter overlay ────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative ml-auto flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                types={types}
                selectedTypes={selectedTypes}
                onTypeToggle={(t) => { handleTypeToggle(t); }}
                onClear={clearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ── Filter panel ────────────────────────────────────────────────────────────
interface FilterPanelProps {
  types: PokemonType[];
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClear: () => void;
}

function FilterPanel({ types, selectedTypes, onTypeToggle, onClear }: FilterPanelProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Type</h3>
        {selectedTypes.length > 0 && (
          <button onClick={onClear} className="text-xs text-brand-yellow-dark hover:underline font-medium">
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        {types.map((type) => {
          const checked = selectedTypes.includes(type.name);
          return (
            <label key={type.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onTypeToggle(type.name)}
                className="h-3.5 w-3.5 rounded accent-brand-yellow cursor-pointer"
              />
              <span className="text-xs capitalize text-gray-700">{type.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
