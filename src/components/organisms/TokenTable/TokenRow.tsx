// // src/components/organisms/TokenTable/TokenRow.tsx
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { Token } from "@/services/api";
// import { useAppSelector } from "@/hooks/useReduxHooks";
// import Sparkline from "@/components/ui/Sparkline";

// type Props = { token: Token };

// function formatPrice(price: number) {
//   if (price < 0.0001) return price.toFixed(8);
//   if (price < 1) return price.toFixed(6);
//   if (price < 100) return price.toFixed(4);
//   return price.toFixed(2);
// }

// export default React.memo(function TokenRow({ token }: Props) {
//   const deltas = useAppSelector((s) => s.websocket.deltas);
//   const delta = deltas[token.pair];
//   const [flash, setFlash] = useState<"up" | "down" | null>(null);
//   const prevPriceRef = useRef<number | null>(token.price);

//   useEffect(() => {
//     const newPrice = delta?.price ?? token.price;
//     const prev = prevPriceRef.current ?? token.price;
//     if (newPrice > prev) setFlash("up");
//     else if (newPrice < prev) setFlash("down");
//     prevPriceRef.current = newPrice;
//     const t = setTimeout(() => setFlash(null), 700);
//     return () => clearTimeout(t);
//   }, [delta, token.price]);

//   const displayPrice = delta?.price ?? token.price;

//   return (
//     // Use same grid template as header for perfect alignment
//     <div
//       className={`token-row grid grid-cols-[1fr_160px_120px_120px] items-center gap-4 transition-colors duration-200 ${
//         flash === "up"
//           ? "bg-green-600/8"
//           : flash === "down"
//           ? "bg-red-600/8"
//           : ""
//       }`}
//       role="row"
//       aria-label={`${token.pair} row`}
//     >
//       {/* 1st column: logo + pair + meta (left aligned) */}
//       <div className="flex items-center gap-3">
//         <img
//           src={token.logo ?? "/logo1.png"}
//           alt={`${token.pair} logo`}
//           className="w-10 h-10 rounded-md object-cover shrink-0"
//         />
//         <div className="min-w-0">
//           <div className="font-semibold text-sm truncate">{token.pair}</div>
//           <div className="text-muted text-xs truncate">
//             Liquidity • Marketcap (stub)
//           </div>
//         </div>
//         <div className="pl-2">
//           <Sparkline
//             points={token.sparkline ?? []}
//             width={120}
//             height={28}
//             color={token.change24h >= 0 ? "#6ee7b7" : "#f87171"}
//           />
//         </div>
//       </div>

//       {/* 2nd column: Price (right aligned) */}
//       <div className="flex justify-end items-center">
//         <div className="font-mono text-sm">{formatPrice(displayPrice)}</div>
//       </div>

//       {/* 3rd column: 24h change (right aligned) */}
//       <div className="flex justify-end items-center">
//         <div
//           className={`text-sm ${
//             token.change24h >= 0 ? "text-green-400" : "text-red-400"
//           }`}
//         >
//           {token.change24h >= 0
//             ? `+${token.change24h}%`
//             : `${token.change24h}%`}
//         </div>
//       </div>

//       {/* 4th column: Volume (right aligned) */}
//       <div className="flex justify-end items-center">
//         <div className="text-xs text-muted">{token.volume}</div>
//       </div>
//     </div>
//   );
// });

// src/components/organisms/TokenTable/TokenRow.tsx
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
  const deltas = useAppSelector((s) => s.websocket.deltas);
  const delta = deltas[token.pair];
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPriceRef = useRef<number | null>(token.price);

  useEffect(() => {
    const newPrice = delta?.price ?? token.price;
    const prev = prevPriceRef.current ?? token.price;
    if (newPrice > prev) setFlash("up");
    else if (newPrice < prev) setFlash("down");
    prevPriceRef.current = newPrice;
    const t = setTimeout(() => setFlash(null), 700);
    return () => clearTimeout(t);
  }, [delta, token.price]);

  const displayPrice = delta?.price ?? token.price;

  // small randomization for token-info to feel alive (based on token name so stable)
  const rand = token.pair.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const holders = token.tokenInfo?.holders ?? (rand % 1000) + 20;
  const owners = token.tokenInfo?.owners ?? (rand % 200) + 5;
  const paid = token.tokenInfo?.paid ?? rand % 2 === 0;

  return (
    <div
      className={clsx(
        "token-row grid grid-cols-[1fr_160px_120px_120px_200px_96px] items-center gap-4 transition-colors duration-200",
        flash === "up"
          ? "bg-green-600/6"
          : flash === "down"
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
            color={token.change24h >= 0 ? "#6ee7b7" : "#f87171"}
          />
        </div>
      </div>

      {/* 2: price */}
      <div className="flex justify-end items-center">
        <div className="font-mono text-sm font-semibold">
          $ {formatPrice(displayPrice)}
        </div>
      </div>

      {/* 3: change24h */}
      <div className="flex justify-end items-center">
        <div
          className={`text-sm ${
            token.change24h >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {token.change24h >= 0
            ? `+${token.change24h}%`
            : `${token.change24h}%`}
        </div>
      </div>

      {/* 4: volume */}
      <div className="flex justify-end items-center">
        <div className="text-blue-300 font-extrabold ">{token.volume}</div>
      </div>

      {/* 5: Token Info (chips) */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <InfoChip tone={token.change24h >= 0 ? "success" : "danger"}>
              <span className="text-xs">
                {Math.abs(token.change24h).toFixed(2)}%
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
