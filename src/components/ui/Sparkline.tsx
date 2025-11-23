// src/components/ui/Sparkline.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  points: number[]; // base dataset
  width?: number;
  height?: number;
  color?: string; // hex like '#6EE7B7'
  speed?: number; // ms between shifts (default 600)
  variance?: number; // jitter proportion (0..1)
};

export default function Sparkline({
  points,
  width = 120,
  height = 28,
  color = "#22c55e",
  speed = 600,
  variance = 0.06,
}: Props) {
  const visibleCount = Math.max(6, Math.min(28, Math.floor(width / 6)));
  const base = points && points.length > 0 ? points : [1, 1.05, 0.98, 1.02, 1];

  // initial visible buffer (tile base)
  const makeInitial = () => {
    const out: number[] = [];
    for (let i = 0; i < visibleCount; i++) out.push(base[i % base.length]);
    return out;
  };

  const [buf, setBuf] = useState<number[]>(makeInitial);
  const animatingRef = useRef(false);
  const groupRef = useRef<SVGGElement | null>(null);
  const pendingNextRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const stepXRef = useRef(0);

  // sample next value helper
  function sampleNext(prev: number) {
    const fromBase = base[Math.floor(Math.random() * base.length)];
    const jitter = (Math.random() * 2 - 1) * variance * fromBase;
    return +(prev * 0.75 + (fromBase + jitter) * 0.25).toFixed(6);
  }

  // compute path & area from a given array (pure function)
  function buildPaths(arr: number[]) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    const stepX = width / Math.max(arr.length - 1, 1);
    stepXRef.current = stepX;
    const coords = arr.map((p, i) => {
      const x = +(i * stepX).toFixed(2);
      const y = +(((max - p) / range) * height).toFixed(2);
      return { x, y };
    });
    const pathD = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
      .join(" ");
    const areaD = pathD + ` L ${width} ${height} L 0 ${height} Z`;
    return { pathD, areaD };
  }

  const { pathD, areaD } = useMemo(() => buildPaths(buf), [buf, width, height]);

  // step function: schedule a slide; if already animating, ignore this tick
  function scheduleStep() {
    if (animatingRef.current) return;
    const prev = buf[buf.length - 1] ?? base[0];
    const nextVal = sampleNext(prev);
    pendingNextRef.current = nextVal;

    // animate group translateX from 0 to -stepX
    const g = groupRef.current;
    if (!g) return;
    animatingRef.current = true;

    // set transition style and translate
    g.style.transition = `transform ${Math.max(180, speed * 0.8)}ms linear`;
    g.style.transform = `translateX(-${stepXRef.current}px)`;

    // after transition, update buffer and reset transform without animation
    const onEnd = (e?: TransitionEvent) => {
      // ensure the event is for transform property if provided
      if (e && e.propertyName !== "transform") return;
      // remove listener
      g.removeEventListener("transitionend", onEnd as any);
      // temporarily disable transition to reset transform immediately
      g.style.transition = "none";
      g.style.transform = "translateX(0)";
      // update buffer by removing first and appending pendingNext
      setBuf((prevBuf) => {
        const nxt =
          pendingNextRef.current ??
          sampleNext(prevBuf[prevBuf.length - 1] ?? base[0]);
        pendingNextRef.current = null;
        const newBuf = prevBuf.slice(1).concat(nxt);
        return newBuf;
      });
      // small timeout ensures DOM paints the reset transform without transition
      requestAnimationFrame(() => {
        // re-enable transitions for next tick (no-op here)
        animatingRef.current = false;
      });
    };

    g.addEventListener("transitionend", onEnd as any);
  }

  // set up interval ticks
  useEffect(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    tickRef.current = window.setInterval(() => {
      scheduleStep();
    }, speed);
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, speed, variance]);

  // if incoming points change significantly, gently reseed buffer
  useEffect(() => {
    if (!points || points.length === 0) return;
    setBuf((prev) => {
      // blend prev with new base for continuity
      const merged = prev.map((v, i) => {
        const b = base[i % base.length];
        return +(v * 0.7 + b * 0.3).toFixed(6);
      });
      return merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // cleanup
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, []);

  // gradient id
  const gradId = `g-${Math.abs(
    color.split("").reduce((s, c) => s + c.charCodeAt(0), 0)
  )}`;
  const stopTop = hexToRgba(color, 0.24);
  const stopBottom = hexToRgba(color, 0.03);

  if (!buf || buf.length === 0) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className="sparkline-svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stopTop} />
          <stop offset="100%" stopColor={stopBottom} />
        </linearGradient>
      </defs>

      {/* group that is translated left on each tick; it contains the visible path/area */}
      <g
        ref={groupRef}
        style={{ transform: "translateX(0)", willChange: "transform" }}
      >
        <path d={areaD} fill={`url(#${gradId})`} className="sparkline-area" />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sparkline-line"
        />
      </g>
    </svg>
  );
}

// helpers
function hexToRgba(hex: string, a = 0.16) {
  if (!hex) return `rgba(34,197,94,${a})`;
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
