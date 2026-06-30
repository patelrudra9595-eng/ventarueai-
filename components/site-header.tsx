"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Activity } from "lucide-react";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="border-token sticky top-0 z-40 border-b bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal text-ink-950">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-700 tracking-tight">
            Venture<span className="text-signal-dim">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/new"
            className="text-dim hover:text-[rgb(var(--text))] rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            New report
          </Link>
          <Link
            href="/history"
            className="text-dim hover:text-[rgb(var(--text))] rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            History
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="text-dim hover:text-[rgb(var(--text))] ml-1 grid h-9 w-9 place-items-center rounded-lg transition-colors hover:surface-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
