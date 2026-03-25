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
    "min-w-[2.25rem] h-9 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";
  const btnActive = "bg-red-500 text-white shadow-sm";
  const btnInactive =
    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700";
  const btnDisabled = "opacity-40 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 flex-wrap"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} px-3 gap-1 ${currentPage === 1 ? btnDisabled + " text-gray-400 dark:text-gray-600" : btnInactive}`}
      >
        <span aria-hidden>←</span> Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="min-w-[2.25rem] h-9 flex items-center justify-center text-gray-400 text-sm"
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
        className={`${btnBase} px-3 gap-1 ${currentPage === totalPages ? btnDisabled + " text-gray-400 dark:text-gray-600" : btnInactive}`}
      >
        Next <span aria-hidden>→</span>
      </button>
    </nav>
  );
}
