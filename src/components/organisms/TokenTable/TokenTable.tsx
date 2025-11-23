// src/components/organisms/TokenTable/TokenTable.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens, Token } from "@/services/api";
import TokenRow from "./TokenRow";
import ColumnHeader from "./ColumnHeader";
import CategoryTabs from "./CategoryTabs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setItems, setLoading } from "@/features/table/tableSlice";
import { usePriceStream } from "@/hooks/usePriceStream";
import { stableSort, makeSortFn } from "@/utils/sort";
import DashboardOverview from "../DashboarOverview";

export default function TokenTable() {
  const dispatch = useAppDispatch();
  const { category, items, sortBy, sortDir } = useAppSelector((s) => s.table);

  // mswReady: wait for the ClientWorker to set window.__MSW_STARTED__ = true
  const [mswReady, setMswReady] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? Boolean((window as any).__MSW_STARTED__)
      : false
  );

  useEffect(() => {
    if (mswReady) return;
    if (typeof window === "undefined") return;

    // poll until MSW sets the flag (small interval)
    const id = window.setInterval(() => {
      if ((window as any).__MSW_STARTED__) {
        setMswReady(true);
        clearInterval(id);
      }
    }, 50);

    // safety timeout in case MSW never starts (avoid infinite polling)
    const timeout = window.setTimeout(() => {
      clearInterval(id);
      // if MSW never started, allow queries anyway after 2s (optional; adjust as needed)
      setMswReady(true);
    }, 2000);

    return () => {
      clearInterval(id);
      clearTimeout(timeout);
    };
  }, [mswReady]);

  // Only enable the query after MSW is ready
  const { data, isLoading, error } = useQuery({
    queryKey: ["tokens", category],
    queryFn: () => fetchTokens(category),
    staleTime: 5000,
    enabled: mswReady,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (data) dispatch(setItems(data));
  }, [data, isLoading, dispatch]);

  // start mock price stream only after mswReady to avoid race
  usePriceStream(mswReady);

  // prepare sortedItems using memo to avoid unnecessary re-renders
  const sortedItems: Token[] = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!sortBy || !sortDir) return items;
    // build key extractor
    const key: any = (t: Token) => (t as any)[sortBy];
    return stableSort(items.slice(), makeSortFn<Token>(key, sortDir));
  }, [items, sortBy, sortDir]);

  if (isLoading || !mswReady) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 rounded-md bg-slate-700 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-400">Failed to load</div>;

  return (
    <div className="w-full">
      <DashboardOverview />
      <CategoryTabs />

      <div className="grid grid-cols-[1fr_160px_120px_120px_180px_96px] gap-3 items-center font-medium text-sm mb-2">
        <ColumnHeader id="pair" label="Pair" />
        <ColumnHeader id="price" label="Price" align="right" />
        <ColumnHeader id="change24h" label="24h" align="right" />
        <ColumnHeader id="volume" label="Volume" align="right" />
        {/* New header columns */}
        <div className="text-right pr-16 text-white font-semibold text-sm">
          Token Info
        </div>
        <div className="text-right pr-8 text-white font-semibold text-sm">
          Action
        </div>
      </div>

      <div className="space-y-2">
        {sortedItems.map((item) => (
          <TokenRow key={item.pair} token={item} />
        ))}
      </div>
    </div>
  );
}
