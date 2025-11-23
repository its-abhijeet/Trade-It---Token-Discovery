// src/components/ui/StickyFooter.tsx
"use client";
import React from "react";
import IconButton from "./IconButton";
import clsx from "clsx";

function FooterIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-1">
      <IconButton label={label} size="sm">
        <span aria-hidden className="inline-block">
          {children}
        </span>
      </IconButton>
    </div>
  );
}

export default function StickyFooter() {
  return (
    <div className="sticky-footer-wrapper">
      <div className="sticky-footer app-container flex items-center justify-between gap-3">
        {/* LEFT: preset pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.04)] text-sm font-medium text-white">
            PRESET 1
          </div>
          <div className="px-2 py-1 rounded bg-[rgba(255,255,255,0.02)] text-xs text-muted">
            1 ⎈ 0
          </div>
        </div>

        {/* CENTER: horizontally scrollable icon row (keeps layout on small screens) */}
        <div className="footer-icons-row flex-1 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar px-2">
          <div className="flex items-center gap-2">
            <FooterIcon label="Wallet">👛</FooterIcon>
            <FooterIcon label="Twitter">🐦</FooterIcon>
            <FooterIcon label="Discover">🔍</FooterIcon>
            <FooterIcon label="Pulse">📈</FooterIcon>
            <FooterIcon label="PnL">📊</FooterIcon>
            <div className="mx-2 h-8 w-px bg-[rgba(255,255,255,0.03)]" />
            <div className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] text-sm font-medium">
              $86.9K
            </div>
            <div className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] text-sm font-medium">
              $2806
            </div>
            <div className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.02)] text-sm font-medium text-[#6EE7B7]">
              $132.1
            </div>
          </div>
        </div>

        {/* RIGHT: connection state + quick icons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1 rounded-md bg-red-700 text-xs font-semibold">
            Disconnected
          </div>
          <FooterIcon label="Notifications">🔔</FooterIcon>
          <FooterIcon label="Settings">⚙️</FooterIcon>
          <FooterIcon label="Docs">📘</FooterIcon>
        </div>
      </div>
    </div>
  );
}
