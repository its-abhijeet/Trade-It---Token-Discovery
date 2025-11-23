// src/components/ui/Sparkline.tsx
"use client";
import React from "react";

type Props = {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
};

export default function Sparkline({
  points,
  width = 80,
  height = 28,
  color = "#22c55e",
}: Props) {
  if (!points || points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = Math.round(i * step);
      const y = Math.round(((max - p) / range) * height);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
    </svg>
  );
}
