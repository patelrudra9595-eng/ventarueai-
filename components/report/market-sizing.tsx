"use client";

import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  Tooltip,
} from "recharts";
import type { MarketSizing } from "@/lib/types";
import { usd } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/primitives";
import { ProvenanceBadge, ConfidenceBadge } from "@/components/ui/provenance";

export function MarketSizingCard({ sizing }: { sizing: MarketSizing }) {
  const data = [
    { name: "TAM", value: sizing.tam, fill: "#5f7a18" },
    { name: "SAM", value: sizing.sam, fill: "#9bbf2e" },
    { name: "SOM", value: sizing.som, fill: "#c4f042" },
  ];

  return (
    <Card>
      <CardHeader
        title="Market sizing"
        hint="Top-down estimate — every figure shows its math"
        right={<ConfidenceBadge level={sizing.confidence} />}
      />
      <div className="grid gap-4 px-5 pb-5 pt-3 md:grid-cols-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                formatter={(v) => usd(Number(v))}
                contentStyle={{
                  background: "rgb(var(--surface))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Funnel dataKey="value" data={data} isAnimationActive>
                <LabelList
                  position="right"
                  fill="rgb(var(--text))"
                  stroke="none"
                  dataKey="name"
                  fontSize={12}
                />
                {data.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {data.map((d) => (
              <div key={d.name} className="surface-2 rounded-xl p-3">
                <div className="text-dim font-mono text-[10px] uppercase tracking-wider">
                  {d.name}
                </div>
                <div className="font-display mt-1 text-lg font-600">
                  {usd(d.value)}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {sizing.assumptions.map((a) => (
              <div
                key={a.label}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="text-dim">{a.label}</span>
                <span className="text-right font-mono text-xs">{a.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-dim text-xs">Basis:</span>
            <ProvenanceBadge p={sizing.provenance} />
            <span className="text-dim font-mono text-[11px]">
              {sizing.unit}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
