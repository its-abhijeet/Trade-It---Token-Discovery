"use client";
import React, { useEffect, useRef, useState } from "react";
import { Token } from "@/services/api";
import { useAppSelector } from "@/hooks/useReduxHooks";
import Sparkline from "@/components/ui/Sparkline";
import ActionMenu from "@/components/ui/ActionMenu";
import clsx from "clsx";

type Props = { token: Token };

function formatPrice(price: number) {
  if (price < 0.0001) return price.toFixed(8);
  if (price < 1) return price.toFixed(6);
  if (price < 100) return price.toFixed(4);
  return price.toFixed(2);
}

function InfoChip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "success" | "danger";
}) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold border",
        tone === "muted" &&
          "bg-[rgba(255,255,255,0.02)] text-muted border-[rgba(255,255,255,0.03)]",
        tone === "success" &&
          "bg-[rgba(110,231,183,0.06)] text-[#6EE7B7] border-[#154731]",
        tone === "danger" &&
          "bg-[rgba(248,113,113,0.06)] text-[#f87171] border-[#3b1414]"
      )}
    >
      {children}
    </div>
  );
}

export default React.memo(function TokenRow({ token }: Props) {
  // websocket deltas store (may include price, change24h, volume)
  const deltas = useAppSelector((s) => s.websocket.deltas);
  const delta = deltas[token.pair];

  // price flash
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef<number | null>(token.price);

  // change flash
  const [changeFlash, setChangeFlash] = useState<"up" | "down" | null>(null);
  const prevChangeRef = useRef<number | null>(token.change24h);

  // volume flash
  const [volFlash, setVolFlash] = useState<"up" | "down" | null>(null);
  const prevVolRef = useRef<number | null>(token.volume);

  // display states (use websocket if provided, otherwise local simulated)
  const [displayPrice, setDisplayPrice] = useState<number>(token.price);
  const [displayChange, setDisplayChange] = useState<number>(token.change24h);
  const [displayVolume, setDisplayVolume] = useState<number>(token.volume);

  // simulation interval refs
  const simIntervalRef = useRef<number | null>(null);

  // init or update whenever token or delta changes
  useEffect(() => {
    // Price - prefer websocket delta.price, else keep current simulation
    const newPrice = delta?.price ?? displayPrice;
    // Change - prefer websocket delta.change24h if exists, otherwise derive from relative price change
    const newChange =
      typeof delta?.change24h === "number"
        ? delta.change24h
        : prevPriceRef.current && newPrice
        ? ((newPrice - prevPriceRef.current) /
            Math.max(prevPriceRef.current, 1e-9)) *
          100
        : token.change24h ?? 0;
    // Volume - prefer websocket delta.volume, otherwise small jitter around previous
    const newVolume =
      typeof delta?.volume === "number" ? delta.volume : displayVolume;

    // Price flash
    const prevP = prevPriceRef.current ?? token.price;
    if (newPrice > prevP) setPriceFlash("up");
    else if (newPrice < prevP) setPriceFlash("down");
    if (newPrice !== displayPrice) setDisplayPrice(newPrice);
    prevPriceRef.current = newPrice;
    const t1 = setTimeout(() => setPriceFlash(null), 700);

    // Change flash
    const prevC = prevChangeRef.current ?? token.change24h ?? 0;
    if (newChange > prevC) setChangeFlash("up");
    else if (newChange < prevC) setChangeFlash("down");
    if (newChange !== displayChange) setDisplayChange(Number(newChange));
    prevChangeRef.current = newChange;
    const t2 = setTimeout(() => setChangeFlash(null), 700);

    // Volume flash
    const prevV = prevVolRef.current ?? token.volume;
    if (newVolume > prevV) setVolFlash("up");
    else if (newVolume < prevV) setVolFlash("down");
    if (newVolume !== displayVolume) setDisplayVolume(Number(newVolume));
    prevVolRef.current = newVolume;
    const t3 = setTimeout(() => setVolFlash(null), 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delta, token.pair]);

  // If websocket does not provide change24h/volume, run a lightweight local simulation
  useEffect(() => {
    // If deltas provide both change24h and volume, no simulation needed
    const hasRemoteChange = typeof delta?.change24h === "number";
    const hasRemoteVol = typeof delta?.volume === "number";

    // Only simulate when either not provided
    if (hasRemoteChange && hasRemoteVol) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
      return;
    }

    // Simulate with small jitter every 700ms
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }

    simIntervalRef.current = window.setInterval(() => {
      // simulate price jitter if websocket didn't provide price
      if (!delta?.price) {
        setDisplayPrice((prev) => {
          // small percent change random between -0.4% and +0.4%
          const pct = (Math.random() * 0.8 - 0.4) / 100;
          const next = +Math.max(prev * (1 + pct), 0.00000001).toFixed(6);
          // flash handled in effect that watches delta - to fire flash, we update prev refs here manually
          const prevP = prevPriceRef.current ?? prev;
          if (next > prevP) setPriceFlash("up");
          else if (next < prevP) setPriceFlash("down");
          prevPriceRef.current = next;
          setTimeout(() => setPriceFlash(null), 700);
          return next;
        });
      }

      // simulate change if not provided
      if (!hasRemoteChange) {
        setDisplayChange((prev) => {
          // derive from last two prices: small random walk around current value
          const jitter = Math.random() * 0.6 - 0.3;
          const next = +(prev + jitter).toFixed(2);
          if (next > prev) setChangeFlash("up");
          else if (next < prev) setChangeFlash("down");
          setTimeout(() => setChangeFlash(null), 700);
          return next;
        });
      }

      // simulate volume if not provided
      if (!hasRemoteVol) {
        setDisplayVolume((prev) => {
          // small random +/- up to 6%
          const change = Math.floor(prev * (Math.random() * 0.12 - 0.06));
          const next = Math.max(0, prev + change);
          if (next > prev) setVolFlash("up");
          else if (next < prev) setVolFlash("down");
          setTimeout(() => setVolFlash(null), 700);
          return next;
        });
      }
    }, 700);

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delta?.price, delta?.change24h, delta?.volume]);

  // small randomization for token-info to feel alive (based on token name so stable)
  const rand = token.pair.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const holders = token.tokenInfo?.holders ?? (rand % 1000) + 20;
  const owners = token.tokenInfo?.owners ?? (rand % 200) + 5;
  const paid = token.tokenInfo?.paid ?? rand % 2 === 0;

  return (
    <div
      className={clsx(
        "token-row grid grid-cols-[1fr_160px_120px_120px_200px_96px] items-center gap-4 transition-colors duration-200",
        priceFlash === "up"
          ? "bg-green-600/6"
          : priceFlash === "down"
          ? "bg-red-600/6"
          : "bg-transparent"
      )}
      role="row"
      aria-label={`${token.pair} row`}
    >
      {/* 1: left meta */}
      <div className="flex items-center gap-3">
        <img
          src={token.logo ?? "/logo1.png"}
          alt={`${token.pair} logo`}
          className="w-10 h-10 rounded-md object-cover shrink-0"
        />
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{token.pair}</div>
          <div className="text-muted text-xs truncate">
            Liquidity • Marketcap (stub)
          </div>
        </div>
        {/* sparkline sits visually close to the left block */}
        <div className="pl-2">
          <Sparkline
            points={token.sparkline ?? []}
            width={120}
            height={28}
            color={token.change24h >= 0 ? "#6EE7B7" : "#F87171"}
            speed={600}
            variance={0.06}
          />
        </div>
      </div>

      {/* 2: price */}
      <div className="flex justify-end items-center">
        <div className="font-mono text-sm font-semibold">
          $ {formatPrice(displayPrice)}
        </div>
      </div>

      {/* 3: change24h - animated and fluctuating */}
      <div className="flex justify-end items-center">
        <div
          className={clsx(
            "text-sm transition-colors duration-300 font-medium px-2 py-1 rounded",
            {
              "text-green-400 bg-green-800/10":
                displayChange >= 0 && changeFlash === "up",
              "text-green-300": displayChange >= 0 && changeFlash !== "up",
              "text-red-400 bg-red-800/10":
                displayChange < 0 && changeFlash === "down",
              "text-red-300": displayChange < 0 && changeFlash !== "down",
            }
          )}
          aria-live="polite"
        >
          {displayChange >= 0
            ? `+${Number(displayChange).toFixed(2)}%`
            : `${Number(displayChange).toFixed(2)}%`}
        </div>
      </div>

      {/* 4: volume - animated and fluctuating */}
      <div className="flex justify-end items-center">
        <div
          className={clsx(
            "text-xs font-extrabold px-2 py-1 rounded transition-transform duration-200",
            {
              "scale-105 bg-green-900/6 text-green-300": volFlash === "up",
              "scale-95 bg-red-900/6 text-red-300": volFlash === "down",
            }
          )}
        >
          {displayVolume.toLocaleString()}
        </div>
      </div>

      {/* 5: Token Info (chips) */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <InfoChip tone={displayChange >= 0 ? "success" : "danger"}>
              <span className="text-xs">
                {Math.abs(displayChange).toFixed(2)}%
              </span>
            </InfoChip>
            <InfoChip tone="muted">
              <span className="text-xs">H {holders}</span>
            </InfoChip>
            <InfoChip tone="muted">
              <span className="text-xs">O {owners}</span>
            </InfoChip>
          </div>

          <div className="flex gap-2 items-center">
            <InfoChip tone="muted">
              <span className="text-xs">
                {token.marketCap
                  ? `$${(token.marketCap / 1000).toFixed(1)}K`
                  : "--"}
              </span>
            </InfoChip>
            <InfoChip tone={paid ? "success" : "danger"}>
              <span className="text-xs">{paid ? "Paid" : "Unpaid"}</span>
            </InfoChip>
          </div>
        </div>
      </div>

      {/* 6: Action (right aligned) */}
      <div className="flex justify-end items-center">
        <ActionMenu
          onBuy={() => {
            // placeholder actions; replace with modal or route
            alert(`Buy ${token.pair}`);
          }}
          onSell={() => {
            alert(`Sell ${token.pair}`);
          }}
          onView={() => {
            alert(`View ${token.pair}`);
          }}
        />
      </div>
    </div>
  );
});
