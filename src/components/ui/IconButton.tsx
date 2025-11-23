// src/components/ui/IconButton.tsx
"use client";
import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  label?: string;
  onClick?: () => void;
  variant?: "ghost" | "primary";
  size?: "sm" | "md";
  className?: string;
};

export default function IconButton({
  children,
  label,
  onClick,
  variant = "ghost",
  size = "md",
  className,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full focus:outline-none transition-transform transform";
  const sizeCls = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base";
  const variantCls =
    variant === "primary"
      ? "bg-[#2b5cff] text-white shadow hover:brightness-105 active:scale-95"
      : "bg-[rgba(255,255,255,0.02)] text-[var(--muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white active:scale-95";

  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        base,
        sizeCls,
        variantCls,
        "focus:ring-2 focus:ring-accent focus:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}
