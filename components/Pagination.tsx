"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase =
    "min-w-[3rem] h-12 px-3 flex items-center justify-center rounded-lg text-base font-medium transition-colors";
  const btnActive = "bg-brand-yellow text-gray-900 font-bold shadow-sm";
  const btnInactive = "text-gray-600 hover:bg-gray-100";
  const btnDisabled = "opacity-40 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 flex-wrap"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} px-4 gap-1 ${currentPage === 1 ? btnDisabled + " text-gray-400" : btnInactive}`}
      >
        <span aria-hidden>←</span> Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="min-w-[3rem] h-12 flex items-center justify-center text-gray-400 text-base"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-current={currentPage === p ? "page" : undefined}
            className={`${btnBase} ${currentPage === p ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} px-4 gap-1 ${currentPage === totalPages ? btnDisabled + " text-gray-400" : btnInactive}`}
      >
        Next <span aria-hidden>→</span>
      </button>
    </nav>
  );
}
