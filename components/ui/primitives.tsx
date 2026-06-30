import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("surface rounded-2xl", className)} {...p} />
  );
}

export function CardHeader({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div>
        <h3 className="font-display text-sm font-600 tracking-wide uppercase">
          {title}
        </h3>
        {hint && <p className="text-dim mt-0.5 text-xs">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

type BadgeTone = "neutral" | "go" | "improve" | "avoid" | "signal" | "muted";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "surface-2 text-dim border-token",
  go: "bg-verdict-go/15 text-verdict-go border-verdict-go/30",
  improve: "bg-verdict-improve/15 text-verdict-improve border-verdict-improve/30",
  avoid: "bg-verdict-avoid/15 text-verdict-avoid border-verdict-avoid/30",
  signal: "bg-signal/15 text-signal-dim border-signal/30",
  muted: "surface-2 text-dim border-token opacity-80",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-500 tracking-wide",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
}) {
  const styles = {
    primary:
      "bg-signal text-ink-950 hover:bg-signal-dim font-600 shadow-[0_1px_0_rgba(0,0,0,0.1)]",
    ghost: "hover:surface-2 text-dim hover:text-[rgb(var(--text))]",
    outline: "surface border-token hover:surface-2",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className
      )}
      {...p}
    />
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-dim font-mono text-[11px] uppercase tracking-wider">
        {label}
      </div>
      <div className="font-display mt-1 text-2xl font-600">{value}</div>
      {sub && <div className="text-dim mt-0.5 text-xs">{sub}</div>}
    </div>
  );
}
