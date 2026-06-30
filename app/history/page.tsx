"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { fmtDate } from "@/lib/utils";
import type { Verdict } from "@/lib/types";
import { verdictLabel } from "@/lib/types";
import { FileText, Plus } from "lucide-react";

interface Row {
  id: string;
  createdAt: string;
  idea: string;
  industry: string;
  region: string;
  score: number;
  verdict: Verdict;
  mock: boolean;
}

const tone = { go: "go", improve: "improve", avoid: "avoid" } as const;

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700">Report history</h1>
          <p className="text-dim mt-1 text-sm">
            Every idea you&apos;ve validated, most recent first.
          </p>
        </div>
        <Link href="/new">
          <Button>
            <Plus className="h-4 w-4" />
            New
          </Button>
        </Link>
      </div>

      {rows === null ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-2 h-20 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <FileText className="text-dim h-8 w-8" />
          <h2 className="font-display font-600">No reports yet</h2>
          <p className="text-dim max-w-xs text-sm">
            Validate your first idea and it&apos;ll show up here for later
            reference.
          </p>
          <Link href="/new" className="mt-1">
            <Button>Validate an idea</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/report/${r.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-colors hover:border-signal/40">
                <div className="font-display w-12 shrink-0 text-center text-2xl font-700 tabular-nums">
                  {r.score}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-500">{r.idea}</p>
                  <p className="text-dim mt-0.5 text-xs">
                    {r.industry} · {r.region} · {fmtDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.mock && <Badge tone="muted">mock</Badge>}
                  <Badge tone={tone[r.verdict]}>{verdictLabel[r.verdict]}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
