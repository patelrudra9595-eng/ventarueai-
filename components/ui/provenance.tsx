import type { Provenance, Confidence } from "@/lib/types";
import { Badge } from "@/components/ui/primitives";
import { Link2, Sparkles, PencilRuler } from "lucide-react";

/**
 * Renders where a claim came from. This is the trust layer: facts (sources),
 * estimates (model reasoning), and assumptions (sizing math) look different.
 */
export function ProvenanceBadge({ p }: { p: Provenance }) {
  if (p.kind === "source") {
    return (
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`Retrieved ${new Date(p.retrievedAt).toLocaleString()}`}
      >
        <Badge tone="neutral" className="hover:border-signal/40">
          <Link2 className="h-3 w-3" />
          {p.label}
        </Badge>
      </a>
    );
  }
  if (p.kind === "estimate") {
    return (
      <Badge tone="signal">
        <Sparkles className="h-3 w-3" />
        LLM estimate
      </Badge>
    );
  }
  return (
    <Badge tone="muted">
      <PencilRuler className="h-3 w-3" />
      Assumption
    </Badge>
  );
}

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const tone = level === "high" ? "go" : level === "medium" ? "improve" : "avoid";
  return (
    <Badge tone={tone as "go" | "improve" | "avoid"}>
      {level} confidence
    </Badge>
  );
}
