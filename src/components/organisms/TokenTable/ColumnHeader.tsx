"use client";
import React from "react";
import { useSort } from "@/hooks/useSort";
import clsx from "clsx";

type Props = {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
};

export default function ColumnHeader({
  id,
  label,
  align = "left",
  width,
}: Props) {
  const { sortBy, sortDir, setColumnSort } = useSort();

  const active = sortBy === id;
  const ariaSort = active
    ? sortDir === "asc"
      ? "ascending"
      : sortDir === "desc"
      ? "descending"
      : "none"
    : "none";

  return (
    <button
      onClick={() => setColumnSort(id)}
      aria-sort={ariaSort}
      aria-label={`Sort by ${label}`}
      className={clsx(
        "flex items-center gap-2 text-sm font-medium focus:outline-none select-none transition-colors",
        {
          "justify-end": align === "right",
          "justify-center": align === "center",
          "text-white": active,
          "text-slate-300": !active,
        }
      )}
      style={width ? { width } : undefined}
      title={`Sort by ${label}`}
    >
      <span className="truncate">{label}</span>

      {/* chevron - visible but subdued when inactive */}
      <span
        className={clsx(
          "w-4 h-4 inline-flex items-center justify-center transition-transform",
          active
            ? sortDir === "asc"
              ? "rotate-180 opacity-100"
              : "opacity-100"
            : "opacity-40"
        )}
        aria-hidden
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
