import type { ValidationReport } from "@/lib/types";
import { Card, CardHeader, Badge } from "@/components/ui/primitives";

export function GtmPlan({ gtm }: { gtm: ValidationReport["gtm"] }) {
  const priorityTone = { P0: "go", P1: "improve", P2: "muted" } as const;

  return (
    <Card>
      <CardHeader
        title="Go-to-market"
        hint="Channels by priority, then a 90-day plan"
      />

      <div className="px-5 pt-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {gtm.channels.map((ch) => (
            <div
              key={ch.name}
              className="surface-2 flex items-start gap-3 rounded-xl p-3"
            >
              <Badge tone={priorityTone[ch.priority]}>{ch.priority}</Badge>
              <div>
                <div className="text-sm font-600">{ch.name}</div>
                <div className="text-dim text-xs">{ch.rationale}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30/60/90 — a real sequence, so numbered structure is earned. */}
      <div className="px-5 pb-5 pt-4">
        <ol className="relative space-y-4 border-l border-[rgb(var(--border))] pl-5">
          {gtm.phases.map((p, i) => (
            <li key={p.window} className="relative">
              <span className="bg-signal text-ink-950 absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] font-700">
                {i + 1}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-sm font-600">
                  {p.window}
                </span>
                <span className="text-dim text-xs">· {p.focus}</span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {p.steps.map((s) => (
                  <li key={s} className="text-dim flex gap-2 text-sm">
                    <span className="text-signal-dim">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
