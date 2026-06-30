import { z } from "zod";

/** Provenance for any nontrivial claim: where did this come from? */
export type Provenance =
  | { kind: "source"; label: string; url: string; retrievedAt: string }
  | { kind: "estimate" } // model-reasoned estimate, not a hard fact
  | { kind: "assumption" }; // user/analyst assumption

export type Confidence = "high" | "medium" | "low";
export type Verdict = "go" | "improve" | "avoid";

/* ----------------------------- Intake ----------------------------- */

export const IntakeSchema = z.object({
  idea: z.string().min(12, "Describe the idea in a sentence or two."),
  region: z.string().min(2, "Add a target country or region."),
  industry: z.string().min(2, "Add an industry."),
  customer: z.string().min(2, "Describe the target customer."),
  budget: z.string().min(1, "Add a budget or key constraint."),
  stage: z.enum(["idea", "prototype", "launched"]),
});
export type Intake = z.infer<typeof IntakeSchema>;

/* ------------------------- Report sections ------------------------ */

export interface Competitor {
  name: string;
  positioning: string;
  pricing: string;
  strength: string;
  weakness: string;
  provenance: Provenance;
}

export interface MarketSegment {
  name: string;
  description: string;
  sizeNote: string;
}

export interface MarketSizing {
  tam: number; // USD
  sam: number;
  som: number;
  unit: string; // e.g. "USD / year"
  assumptions: { label: string; value: string }[];
  confidence: Confidence;
  provenance: Provenance;
}

export interface DemandSignal {
  label: string;
  trend: "rising" | "flat" | "cooling";
  detail: string;
  provenance: Provenance;
}

export interface Swot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface GtmPhase {
  window: "0–30 days" | "31–60 days" | "61–90 days";
  focus: string;
  steps: string[];
}

export interface BusinessModelOption {
  name: string;
  howItWorks: string;
  fitNote: string;
  recommended: boolean;
}

export interface ValidationReport {
  id?: string;
  createdAt?: string;
  mock: boolean;
  intake: Intake;

  score: number; // 0–100
  verdict: Verdict;
  summary: string;
  confidence: Confidence;

  risks: { title: string; detail: string; severity: "high" | "med" | "low" }[];
  opportunities: { title: string; detail: string }[];

  competitors: Competitor[];
  differentiators: string[];

  segments: MarketSegment[];
  sizing: MarketSizing;
  demand: DemandSignal[];

  swot: Swot;

  gtm: {
    channels: { name: string; rationale: string; priority: "P0" | "P1" | "P2" }[];
    phases: GtmPhase[];
  };

  businessModels: BusinessModelOption[];
}

/* --------------------------- Helpers ------------------------------ */

export const verdictFromScore = (score: number): Verdict =>
  score >= 70 ? "go" : score >= 45 ? "improve" : "avoid";

export const verdictLabel: Record<Verdict, string> = {
  go: "Go",
  improve: "Improve first",
  avoid: "Avoid",
};
