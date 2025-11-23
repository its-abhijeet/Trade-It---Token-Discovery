// only paste the updated portions of NavBar.tsx or replace the whole file with this
"use client";
import React from "react";
import NavItem from "./NavItem";
import IconButton from "./IconButton";
import SearchInput from "./SearchInput";
import BalancePill from "./BalancePill";

function Logo() {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white font-bold">
        A
      </div>
      <div className="hidden sm:flex flex-col leading-tight min-w-0">
        <div className="text-white font-bold text-sm truncate">TRADE | IT</div>
        <div className="text-xs text-muted truncate">Pro</div>
      </div>
    </div>
  );
}

export default function NavBar() {
  return (
    <header className="app-header">
      <div className="app-container flex items-center gap-4 py-3">
        {/* LEFT: logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Logo />

          {/* icon row under logo (small tools) */}
          <div className="hidden lg:flex items-center gap-2">
            <IconButton label="Settings">⚙️</IconButton>
            <IconButton label="Bookmarks">⭐</IconButton>
            <IconButton label="Analytics">📈</IconButton>
          </div>
        </div>

        {/* CENTER: main nav (centered) — allow shrink & clip */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <nav className="flex gap-4 overflow-hidden whitespace-nowrap min-w-0">
            <NavItem>Discover</NavItem>
            <NavItem active>Pulse</NavItem>
            <NavItem>Trackers</NavItem>
            <NavItem>Perpetuals</NavItem>
            <NavItem>Yield</NavItem>
            <NavItem>Vision</NavItem>
            <NavItem>Portfolio</NavItem>
          </nav>
        </div>

        {/* RIGHT: search + utilities — prevent shrinking but allow internal responsive behavior */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block min-w-0">
            {/* make SearchInput flexible: it must be able to shrink internally */}
            <SearchInput />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <BalancePill />
            <IconButton label="Deposit" variant="primary" size="md">
              +
            </IconButton>
            <IconButton label="Notifications">🔔</IconButton>
            <IconButton label="Wallet">👛</IconButton>
            <IconButton label="Profile">⚙️</IconButton>
          </div>
        </div>
      </div>

      {/* optional secondary bar unchanged */}
      <div className="border-t border-[rgba(255,255,255,0.02)]">
        <div className="app-container py-2 flex items-center gap-3 text-xs text-muted">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded font-extrabold bg-[rgba(255,255,255,0.02)]">
              PRESET 1
            </div>
            <div className="font-extrabold">Wallet</div>
            <div className="font-extrabold">Discover</div>
            <div className="font-extrabold">Pulse</div>
          </div>
          <div className="flex-1" />
          <div className="text-green-500 font-extrabold font-mono">
            Connection is stable
          </div>
        </div>
      </div>
    </header>
  );
}
