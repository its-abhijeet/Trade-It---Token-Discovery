// src/components/organisms/DashboardOverview.tsx
"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/services/api";
import Sparkline from "@/components/ui/Sparkline";

export default function DashboardOverview() {
  const { data } = useQuery({
    queryKey: ["tokens", "all"],
    queryFn: () => fetchTokens("all"),
    staleTime: 5000,
  });

  const totals = useMemo(() => {
    if (!data) return { marketCap: 0, volume: 0 };
    return data.reduce(
      (acc, t) => {
        acc.marketCap += t.marketCap ?? 0;
        acc.volume += t.volume ?? 0;
        return acc;
      },
      { marketCap: 0, volume: 0 }
    );
  }, [data]);

  // quick sparkline using first 7 points of first token as example
  const exampleSpark = data?.[0]?.sparkline ?? [];

  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <div className="p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
        <div className="grid grid-cols-[1fr_96px] items-center gap-3">
          {/* left column: two stacked text rows */}
          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted">Total Market Cap</div>
            <div className="text-2xl font-semibold leading-tight">
              ${(totals.marketCap / 1000).toFixed(1)}K
            </div>
          </div>

          {/* right column: sparkline spanning the two rows visually */}
          <div className="row-span-2 flex items-center justify-end">
            <div className="w-24 h-10">
              <Sparkline
                points={exampleSpark}
                color="#6EE7B7"
                width={96}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
        <div className="grid grid-cols-[1fr_96px] items-center gap-3">
          {/* Left side = Title + Number */}
          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted">24h Volume</div>
            <div className="text-2xl font-semibold leading-tight">
              ${(totals.volume / 1000).toFixed(1)}K
            </div>
          </div>

          {/* Right side = Sparkline */}
          <div className="row-span-2 flex items-center justify-end">
            <div className="w-24 h-10">
              <Sparkline
                points={exampleSpark}
                color="#60A5FA"
                width={96}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
        <div className="grid grid-cols-[1fr_96px] items-center gap-3">
          {/* Left side = Title + Number */}
          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted">Active TXNs</div>
            <div className="text-2xl font-semibold leading-tight">
              {data ? data.reduce((s, t) => s + (t.txns || 0), 0) : 0}
            </div>
          </div>

          {/* Right side = Sparkline */}
          <div className="row-span-2 flex items-center justify-end">
            <div className="w-24 h-10">
              <Sparkline
                points={exampleSpark}
                color="#F472B6"
                width={96}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
