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
