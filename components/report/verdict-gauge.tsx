"use client";

import { motion } from "framer-motion";
import type { Verdict } from "@/lib/types";
import { verdictLabel } from "@/lib/types";

const verdictColor: Record<Verdict, string> = {
  go: "#54d178",
  improve: "#f5b945",
  avoid: "#f0674f",
};

/**
 * The signature element: a 270° score arc that reads as go/improve/avoid at a
 * glance. Animates from 0 on mount; respects reduced-motion via CSS override.
 */
export function VerdictGauge({
  score,
  verdict,
  size = 180,
}: {
  score: number;
  verdict: Verdict;
  size?: number;
}) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135; // sweep 270° clockwise
  const sweep = 270;
  const circumference = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circumference;
  const filled = (score / 100) * arcLen;
  const color = verdictColor[verdict];

  const polar = (angle: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const start = polar(startAngle);
  const end = polar(startAngle + sweep);
  const largeArc = sweep > 180 ? 1 : 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-0">
        {/* track */}
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="rgb(var(--surface-2))"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* fill */}
        <motion.path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-display text-5xl font-700 tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-dim font-mono text-[11px] uppercase tracking-widest">
          / 100
        </span>
        <span
          className="mt-1 font-display text-sm font-600"
          style={{ color }}
        >
          {verdictLabel[verdict]}
        </span>
      </div>
    </div>
  );
}
