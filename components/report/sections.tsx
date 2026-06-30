import type { ValidationReport } from "@/lib/types";
import { Card, CardHeader, Badge } from "@/components/ui/primitives";
import { ProvenanceBadge } from "@/components/ui/provenance";
import { TrendingUp, Minus, TrendingDown, Check } from "lucide-react";

const trendIcon = {
  rising: <TrendingUp className="text-verdict-go h-4 w-4" />,
  flat: <Minus className="text-dim h-4 w-4" />,
  cooling: <TrendingDown className="text-verdict-avoid h-4 w-4" />,
};

export function DemandSignals({
  demand,
}: {
  demand: ValidationReport["demand"];
}) {
  return (
    <Card>
      <CardHeader title="Demand signals" hint="Directional, with sources" />
      <div className="space-y-px px-2 pb-3 pt-2">
        {demand.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:surface-2"
          >
            <div className="flex items-center gap-3">
              {trendIcon[d.trend]}
              <div>
                <div className="text-sm font-500">{d.label}</div>
                <div className="text-dim text-xs">{d.detail}</div>
              </div>
            </div>
            <ProvenanceBadge p={d.provenance} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Segments({
  segments,
}: {
  segments: ValidationReport["segments"];
}) {
  return (
    <Card>
      <CardHeader title="Audience segments" hint="Where to start, what's next" />
      <div className="space-y-2 px-5 pb-5 pt-3">
        {segments.map((s, i) => (
          <div key={s.name} className="surface-2 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-dim font-mono text-xs">0{i + 1}</span>
              <span className="text-sm font-600">{s.name}</span>
            </div>
            <p className="text-dim mt-1 text-sm">{s.description}</p>
            <p className="text-signal-dim mt-1 text-xs">{s.sizeNote}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BusinessModels({
  models,
}: {
  models: ValidationReport["businessModels"];
}) {
  return (
    <Card>
      <CardHeader title="Business model" hint="Recommended path highlighted" />
      <div className="space-y-2 px-5 pb-5 pt-3">
        {models.map((m) => (
          <div
            key={m.name}
            className={`rounded-xl border p-3 ${
              m.recommended
                ? "border-signal/40 bg-signal/5"
                : "border-token surface-2"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-600">{m.name}</span>
              {m.recommended && (
                <Badge tone="signal">
                  <Check className="h-3 w-3" />
                  Recommended
                </Badge>
              )}
            </div>
            <p className="text-dim mt-1 text-sm">{m.howItWorks}</p>
            <p className="text-dim mt-0.5 text-xs italic">{m.fitNote}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RisksOpportunities({
  risks,
  opportunities,
}: {
  risks: ValidationReport["risks"];
  opportunities: ValidationReport["opportunities"];
}) {
  const sevTone = { high: "avoid", med: "improve", low: "muted" } as const;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader title="Key risks" hint="Ranked by severity" />
        <div className="space-y-2 px-5 pb-5 pt-3">
          {risks.map((r) => (
            <div key={r.title} className="surface-2 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-600">{r.title}</span>
                <Badge tone={sevTone[r.severity]}>{r.severity}</Badge>
              </div>
              <p className="text-dim mt-1 text-sm">{r.detail}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Key opportunities" hint="Where the upside is" />
        <div className="space-y-2 px-5 pb-5 pt-3">
          {opportunities.map((o) => (
            <div key={o.title} className="surface-2 rounded-xl p-3">
              <span className="text-sm font-600">{o.title}</span>
              <p className="text-dim mt-1 text-sm">{o.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
