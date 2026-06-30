import type { Swot } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/primitives";

const quadrants = [
  { key: "strengths", label: "Strengths", tone: "text-verdict-go", sign: "+" },
  { key: "weaknesses", label: "Weaknesses", tone: "text-verdict-avoid", sign: "−" },
  { key: "opportunities", label: "Opportunities", tone: "text-verdict-go", sign: "↗" },
  { key: "threats", label: "Threats", tone: "text-verdict-improve", sign: "!" },
] as const;

export function SwotMatrix({ swot }: { swot: Swot }) {
  return (
    <Card>
      <CardHeader title="SWOT" hint="Internal vs external, upside vs risk" />
      <div className="grid gap-px px-5 pb-5 pt-3 sm:grid-cols-2">
        {quadrants.map((q) => (
          <div key={q.key} className="surface-2 m-1 rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className={`font-mono text-sm font-600 ${q.tone}`}>
                {q.sign}
              </span>
              <span className="font-display text-xs font-600 uppercase tracking-wide">
                {q.label}
              </span>
            </div>
            <ul className="space-y-1.5">
              {swot[q.key].map((item) => (
                <li key={item} className="text-dim flex gap-2 text-sm">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[rgb(var(--text-dim))]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
