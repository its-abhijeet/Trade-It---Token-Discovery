// src/components/ui/ActionMenu.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

type Props = {
  onBuy?: () => void;
  onSell?: () => void;
  onView?: () => void;
};

export default function ActionMenu({ onBuy, onSell, onView }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        className="px-3 py-1 rounded-full bg-[#2b5cff] text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        onClick={() => setOpen((s) => !s)}
      >
        Buy
      </button>

      {open && (
        <div
          role="menu"
          aria-label="action menu"
          className="absolute right-0 mt-2 w-40 bg-[rgba(10,12,14,0.98)] border border-[rgba(255,255,255,0.04)] rounded shadow-lg py-1 z-40"
        >
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.02)]"
            onClick={() => {
              setOpen(false);
              onBuy?.();
            }}
          >
            Buy
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.02)]"
            onClick={() => {
              setOpen(false);
              onSell?.();
            }}
          >
            Sell
          </button>
          <button
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.02)]"
            onClick={() => {
              setOpen(false);
              onView?.();
            }}
          >
            View
          </button>
        </div>
      )}
    </div>
  );
}
