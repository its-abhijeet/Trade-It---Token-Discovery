// src/components/ui/BalancePill.tsx
"use client";
import React from "react";
import IconButton from "./IconButton";

export default function BalancePill() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
      <div className="text-sm font-extrabold">SOL</div>
      <div className="text-xs text-muted">▾</div>
    </div>
  );
}
