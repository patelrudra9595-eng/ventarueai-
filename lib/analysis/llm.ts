import type { Intake, ValidationReport } from "@/lib/types";
import { verdictFromScore } from "@/lib/types";
import type { WebSignal } from "@/lib/data/web";

/**
 * LLM analysis seam.
 *
 * When ANTHROPIC_API_KEY is set, generateLlmReport() asks the model to return a
 * strict JSON ValidationReport, grounded by any web signals passed in. On any
 * failure it returns null so the orchestrator falls back to the mock engine.
 *
 * The model is instructed to label every nontrivial claim's provenance, so the
 * UI's facts/estimates/sources separation holds for live output too.
 */

const SYSTEM = `You are a venture analyst. Produce a rigorous, concise business
validation report as STRICT JSON only — no markdown, no prose outside JSON.
The JSON MUST match this TypeScript type exactly:

type Provenance =
  | { kind: "source"; label: string; url: string; retrievedAt: string }
  | { kind: "estimate" }
  | { kind: "assumption" };

ValidationReport {
  mock: false;
  score: number;            // 0-100, honest
  verdict: "go"|"improve"|"avoid";
  summary: string;          // <= 70 words
  confidence: "high"|"medium"|"low";
  risks: {title:string;detail:string;severity:"high"|"med"|"low"}[];
  opportunities: {title:string;detail:string}[];
  competitors: {name:string;positioning:string;pricing:string;strength:string;weakness:string;provenance:Provenance}[];
  differentiators: string[];
  segments: {name:string;description:string;sizeNote:string}[];
  sizing: {tam:number;sam:number;som:number;unit:string;assumptions:{label:string;value:string}[];confidence:"high"|"medium"|"low";provenance:Provenance};
  demand: {label:string;trend:"rising"|"flat"|"cooling";detail:string;provenance:Provenance}[];
  swot: {strengths:string[];weaknesses:string[];opportunities:string[];threats:string[]};
  gtm: {channels:{name:string;rationale:string;priority:"P0"|"P1"|"P2"}[];phases:{window:"0–30 days"|"31–60 days"|"61–90 days";focus:string;steps:string[]}[]};
  businessModels: {name:string;howItWorks:string;fitNote:string;recommended:boolean}[];
}

Rules: ground claims in provided web signals where possible and cite them via
provenance.source. Use {kind:"estimate"} for reasoned numbers and
{kind:"assumption"} for sizing math. Be specific to the idea. Output JSON ONLY.`;

export async function generateLlmReport(
  intake: Intake,
  signals: WebSignal[] | null
): Promise<ValidationReport | null> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key || process.env.NEXT_PUBLIC_FORCE_MOCK === "true") return null;

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const signalBlock = signals?.length
    ? `Web signals (cite these):\n${signals
        .map(
          (s, i) =>
            `[${i + 1}] ${s.title} — ${s.snippet} (${
              s.provenance.kind === "source" ? s.provenance.url : "n/a"
            })`
        )
        .join("\n")}`
    : "No live web signals available; mark figures as estimates/assumptions.";

  const userMsg = `Idea: ${intake.idea}
Region: ${intake.region}
Industry: ${intake.industry}
Target customer: ${intake.customer}
Budget/constraints: ${intake.budget}
Stage: ${intake.stage}

${signalBlock}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: SYSTEM,
        messages: [{ role: "user", content: userMsg }],
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text =
      data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("") ?? "";

    const jsonStr = text.replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(jsonStr) as Partial<ValidationReport>;

    // Minimal integrity guards before trusting model output.
    if (typeof parsed.score !== "number" || !parsed.summary) return null;
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    parsed.verdict = parsed.verdict ?? verdictFromScore(parsed.score);

    return { ...(parsed as ValidationReport), mock: false, intake };
  } catch {
    return null;
  }
}
