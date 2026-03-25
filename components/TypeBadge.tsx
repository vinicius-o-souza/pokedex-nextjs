import { TYPE_COLORS } from "@/constants/typeColors";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = TYPE_COLORS[type] ?? { bg: "bg-gray-400", text: "text-white" };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${colors.bg} ${colors.text}`}
    >
      {type}
    </span>
  );
}
