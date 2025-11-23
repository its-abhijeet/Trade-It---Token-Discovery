// src/utils/sort.ts
export type Order = "asc" | "desc" | null;

/**
 * Try to parse numeric-ish strings like "$52.7K", "11,327", "1.2M" into numbers.
 * If not parseable, returns NaN.
 */
function parseNumericLike(val: unknown): number {
  if (val == null) return NaN;
  if (typeof val === "number") return val;
  if (typeof val !== "string") return NaN;

  // remove currency symbol and spaces
  let s = val.replace(/[\s\$£€]/g, "").toUpperCase();

  // handle shorthand K/M/B
  const suffixMatch = s.match(/^(-?[\d.,]+)([KMB])$/);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1].replace(/,/g, ""));
    const suf = suffixMatch[2];
    if (!isFinite(num)) return NaN;
    if (suf === "K") return num * 1e3;
    if (suf === "M") return num * 1e6;
    if (suf === "B") return num * 1e9;
  }

  // fallback: remove commas and try parse float
  const cleaned = s.replace(/,/g, "");
  const f = parseFloat(cleaned);
  return isFinite(f) ? f : NaN;
}

export function compareValue(a: unknown, b: unknown): number {
  // handle nulls / undefined
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  // try numeric comparison first (for numbers or numeric-like strings)
  const na = parseNumericLike(a);
  const nb = parseNumericLike(b);
  if (!Number.isNaN(na) || !Number.isNaN(nb)) {
    // if either parses as number, compare numeric (NaN treated as -Infinity)
    const va = Number.isNaN(na) ? -Infinity : na;
    const vb = Number.isNaN(nb) ? -Infinity : nb;
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  }

  // fallback to case-insensitive string compare
  const sa = String(a).toLowerCase();
  const sb = String(b).toLowerCase();
  if (sa < sb) return -1;
  if (sa > sb) return 1;
  return 0;
}

/**
 * stableSort - stable stableSort implementation using index as tie-breaker
 */
export function stableSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return array
    .map((item, idx) => ({ item, idx }))
    .sort((x, y) => {
      const res = compareFn(x.item, y.item);
      return res !== 0 ? res : x.idx - y.idx;
    })
    .map((x) => x.item);
}

/**
 * resolveKey - accepts either:
 * - a function accessor (t => t.price)
 * - a dot-path string 'tokenInfo.holders'
 * - a direct key name 'price'
 *
 * returns a function (t => value)
 */
function resolveKey<T>(key: keyof T | string | ((t: T) => unknown)) {
  if (typeof key === "function") return key as (t: T) => unknown;
  if (typeof key === "string") {
    // dot-path support
    if (key.includes(".")) {
      const parts = key.split(".");
      return (t: T) => {
        let cur: any = t as any;
        for (const p of parts) {
          if (cur == null) return undefined;
          cur = cur[p];
        }
        return cur;
      };
    }
    // simple property name
    return (t: T) => (t as any)[key];
  }
  // fallback: treat key as property
  return (t: T) => (t as any)[key as keyof T];
}

/**
 * makeSortFn - helper to create compare function from a key (name or accessor) and order
 *
 * Usage:
 *  makeSortFn<Token>('price', 'desc')
 *  makeSortFn<Token>(t => t.marketCap, 'asc')
 */
export function makeSortFn<T>(
  key: keyof T | string | ((t: T) => unknown),
  order: Order = "asc"
) {
  const accessor = resolveKey<T>(key);
  return (a: T, b: T) => {
    const va = accessor(a);
    const vb = accessor(b);
    const cmp = compareValue(va, vb);
    return order === "desc" ? -cmp : cmp;
  };
}
