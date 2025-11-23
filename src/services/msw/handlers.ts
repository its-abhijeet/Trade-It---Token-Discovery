// src/services/msw/handlers.ts
import { http, HttpResponse } from "msw";

// larger sample data for UI testing — includes marketCap, liquidity, txns, sparkline points
const sampleTokens = [
  {
    pair: "ABC/USDT",
    price: 19.5076,
    change24h: 2.3,
    volume: 12345,
    category: "new",
    logo: "/logo1.png",
    marketCap: 52700,
    liquidity: 22000,
    txns: 455,
    tokenInfo: { holders: 485, owners: 282, paid: true },
    sparkline: [1, 1.3, 1.15, 1.2, 1.4, 1.37, 1.42],
  },
  {
    pair: "GHI/USDT",
    price: 0.416462,
    change24h: 5.4,
    volume: 9999,
    category: "final",
    logo: "/logo1.png",
    marketCap: 177000,
    liquidity: 41700,
    txns: 415,
    tokenInfo: { holders: 1155, owners: 346, paid: false },
    sparkline: [0.9, 0.95, 0.88, 0.92, 0.96, 0.98, 1.0],
  },
  {
    pair: "DEF/USDT",
    price: 11.3277,
    change24h: -1.2,
    volume: 4321,
    category: "migrated",
    logo: "/logo1.png",
    marketCap: 78000,
    liquidity: 16700,
    txns: 146,
    tokenInfo: { holders: 102, owners: 59, paid: false },
    sparkline: [12, 11.7, 11.8, 11.5, 11.6, 11.27, 11.32],
  },

  // add many more rows for visual density (copy patterns with varied values)
  ...Array.from({ length: 12 }).map((_, i) => ({
    pair: `TOK${i + 1}/USDT`,
    price: +(Math.random() * 50).toFixed(6),
    change24h: +(Math.random() * 20 - 10).toFixed(2),
    volume: Math.floor(Math.random() * 30000),
    category: ["new", "final", "migrated"][i % 3],
    logo: "/logo1.png",
    marketCap: Math.floor(Math.random() * 200000),
    liquidity: Math.floor(Math.random() * 50000),
    txns: Math.floor(Math.random() * 800),
    tokenInfo: {
      holders: Math.floor(Math.random() * 2000),
      owners: Math.floor(Math.random() * 1000),
      paid: Math.random() > 0.5,
    },
    sparkline: Array.from({ length: 7 }).map(
      () => +(Math.random() * 1.5 + 0.5).toFixed(3)
    ),
  })),
];

export const handlers = [
  http.get("/api/tokens", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category") || "all";
    const q = url.searchParams.get("q") || "";
    const data = sampleTokens
      .filter((t) => category === "all" || t.category === category)
      .filter((t) => !q || t.pair.toLowerCase().includes(q.toLowerCase()));
    return HttpResponse.json({ data });
  }),
];
