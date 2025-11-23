// src/components/ui/NavItem.tsx
"use client";
import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function NavItem({ children, active = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded text-sm font-medium focus:outline-none transition",
        {
          "text-white": active,
          "text-muted hover:text-white": !active,
        }
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}
