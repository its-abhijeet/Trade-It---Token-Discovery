export type Token = {
  pair: string;
  price: number;
  change24h: number;
  volume: number;
  category: string;
  logo?: string;
  lastUpdated?: number;
  marketCap?: number;
  txns?: number;
  sparkline?: number[];
  tokenInfo?: {
    holders: number;
    owners: number;
    paid: boolean;
  };
};
// ... existing code ...
export async function fetchTokens(category: string): Promise<Token[]> {
  const res = await fetch(`/api/tokens?category=${category}`);
  if (!res.ok) throw new Error("Failed to fetch tokens");
  const json = await res.json();
  return json.data as Token[];
}
