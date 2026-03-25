"use client";

import type { PokemonType } from "@/types/pokemon";
import { TYPE_COLORS } from "@/constants/typeColors";

interface TypeFilterProps {
  types: PokemonType[];
  selected: string;
  onSelect: (type: string) => void;
}

export function TypeFilter({ types, selected, onSelect }: TypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          selected === ""
            ? "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 shadow-sm"
            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        All
      </button>
      {types.map((type) => {
        const colors = TYPE_COLORS[type.name] ?? {
          bg: "bg-gray-400",
          text: "text-white",
        };
        const isSelected = selected === type.name;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-all ${
              isSelected
                ? `${colors.bg} ${colors.text} shadow-sm ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-current`
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {type.name}
          </button>
        );
      })}
    </div>
  );
}
