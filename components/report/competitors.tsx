import type { Competitor } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/primitives";
import { ProvenanceBadge } from "@/components/ui/provenance";

export function CompetitorTable({
  competitors,
  differentiators,
}: {
  competitors: Competitor[];
  differentiators: string[];
}) {
  return (
    <Card>
      <CardHeader
        title="Competitor landscape"
        hint="Positioning, pricing, and where each is soft"
      />
      <div className="overflow-x-auto px-2 pb-2 pt-3">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-dim font-mono text-[11px] uppercase tracking-wider">
              <th className="px-3 py-2 text-left font-500">Company</th>
              <th className="px-3 py-2 text-left font-500">Positioning</th>
              <th className="px-3 py-2 text-left font-500">Pricing</th>
              <th className="px-3 py-2 text-left font-500">Soft spot</th>
              <th className="px-3 py-2 text-left font-500">Source</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr
                key={c.name}
                className="border-token border-t align-top"
              >
                <td className="px-3 py-3 font-600">{c.name}</td>
                <td className="text-dim px-3 py-3">{c.positioning}</td>
                <td className="px-3 py-3 font-mono text-xs">{c.pricing}</td>
                <td className="text-dim px-3 py-3">{c.weakness}</td>
                <td className="px-3 py-3">
                  <ProvenanceBadge p={c.provenance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-token border-t px-5 py-4">
        <div className="text-dim font-mono text-[11px] uppercase tracking-wider">
          Your differentiators
        </div>
        <ul className="mt-2 flex flex-wrap gap-2">
          {differentiators.map((d) => (
            <li
              key={d}
              className="bg-signal/10 border-signal/25 text-signal-dim rounded-lg border px-2.5 py-1 text-xs"
            >
              {d}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
