"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setCategory } from "@/features/table/tableSlice";
import clsx from "clsx";

const categories: {
  key: "all" | "new" | "final" | "migrated";
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New Pairs" },
  { key: "final", label: "Final Stretch" },
  { key: "migrated", label: "Migrated" },
];

export default function CategoryTabs() {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((s) => s.table);

  return (
    <div className="flex gap-2 items-center mb-3 flex-wrap">
      {categories.map((c) => {
        const active = category === c.key;
        return (
          <button
            key={c.key}
            onClick={() => dispatch(setCategory(c.key))}
            className={clsx(
              "px-3 py-1 rounded-md text-sm font-medium focus:outline-none transition-colors whitespace-nowrap",
              {
                // Active: subtle filled dark panel with slight border
                "bg-[rgba(255,255,255,0.03)] text-white border border-[rgba(255,255,255,0.04)]":
                  active,
                // Inactive: muted text, light hover
                "bg-transparent text-slate-300 hover:bg-[rgba(255,255,255,0.02)] hover:text-white":
                  !active,
              }
            )}
            aria-pressed={active}
            title={c.label}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
