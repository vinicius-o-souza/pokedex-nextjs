export interface TypeColorConfig {
  bg: string;
  text: string;
}

export const TYPE_COLORS: Record<string, TypeColorConfig> = {
  normal: {
    bg: "bg-stone-400",
    text: "text-stone-900",
  },
  fire: {
    bg: "bg-orange-500",
    text: "text-white",
  },
  water: {
    bg: "bg-blue-500",
    text: "text-white",
  },
  electric: {
    bg: "bg-yellow-400",
    text: "text-yellow-900",
  },
  grass: {
    bg: "bg-green-500",
    text: "text-white",
  },
  ice: {
    bg: "bg-cyan-300",
    text: "text-cyan-900",
  },
  fighting: {
    bg: "bg-red-700",
    text: "text-white",
  },
  poison: {
    bg: "bg-purple-500",
    text: "text-white",
  },
  ground: {
    bg: "bg-amber-600",
    text: "text-white",
  },
  flying: {
    bg: "bg-indigo-400",
    text: "text-white",
  },
  psychic: {
    bg: "bg-pink-500",
    text: "text-white",
  },
  bug: {
    bg: "bg-lime-500",
    text: "text-lime-900",
  },
  rock: {
    bg: "bg-yellow-700",
    text: "text-white",
  },
  ghost: {
    bg: "bg-violet-700",
    text: "text-white",
  },
  dragon: {
    bg: "bg-blue-800",
    text: "text-white",
  },
  dark: {
    bg: "bg-neutral-700",
    text: "text-white",
  },
  steel: {
    bg: "bg-slate-400",
    text: "text-slate-900",
  },
  fairy: {
    bg: "bg-pink-300",
    text: "text-pink-900",
  },
} as const;

export const TYPE_HEX_COLORS: Record<string, string> = {
  normal: "#9ca3af",
  fire: "#f97316",
  water: "#3b82f6",
  electric: "#eab308",
  grass: "#22c55e",
  ice: "#67e8f9",
  fighting: "#b91c1c",
  poison: "#a855f7",
  ground: "#d97706",
  flying: "#818cf8",
  psychic: "#ec4899",
  bug: "#84cc16",
  rock: "#a16207",
  ghost: "#7c3aed",
  dragon: "#1e40af",
  dark: "#525252",
  steel: "#94a3b8",
  fairy: "#f472b6",
};
