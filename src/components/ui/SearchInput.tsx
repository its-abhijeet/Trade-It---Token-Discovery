// src/components/ui/SearchInput.tsx
"use client";
import React from "react";

type Props = {
  placeholder?: string;
  onChange?: (v: string) => void;
  value?: string;
};

export default function SearchInput({
  placeholder = "      Search token or CA...",
  onChange,
  value = "",
}: Props) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tokens"
        className="w-full max-w-[360px] md:max-w-[420px] px-3 py-2 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition text-sm min-w-0"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
        🔎
      </div>
    </div>
  );
}
