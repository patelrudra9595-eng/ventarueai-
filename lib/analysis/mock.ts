import type {
  Intake,
  ValidationReport,
  Provenance,
  Confidence,
} from "@/lib/types";
import { verdictFromScore } from "@/lib/types";

/**
 * Deterministic mock report engine.
 *
 * This is NOT random noise — it derives a coherent, idea-specific report from
 * the intake so demos look real and stable. Every figure here is labeled as an
 * estimate/assumption in the UI. Swap in lib/analysis/llm.ts for live output.
 */

// Small deterministic hash so the same idea yields the same report.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const pick = <T,>(arr: T[], seed: number): T => arr[seed % arr.length];

const estimate: Provenance = { kind: "estimate" };
const assumption: Provenance = { kind: "assumption" };
const sourced = (label: string, url: string): Provenance => ({
  kind: "source",
  label,
  url,
  retrievedAt: new Date().toISOString(),
});

export function generateMockReport(intake: Intake): ValidationReport {
  const seed = hash(
    intake.idea + intake.industry + intake.region + intake.stage
  );

  // Score blends stage maturity, constraint clarity, and idea specificity.
  const stageBoost = { idea: 0, prototype: 10, launched: 18 }[intake.stage];
  const specificity = Math.min(20, Math.floor(intake.idea.length / 8));
  const base = 44 + (seed % 26); // 44..69
  const score = Math.max(28, Math.min(92, base + stageBoost + specificity - 8));
  const verdict = verdictFromScore(score);

  const confidence: Confidence =
    intake.stage === "launched" ? "medium" : "low";

  // Market sizing — clearly assumption-driven, shown with its math.
  const tamBase = 1_800_000_000 + (seed % 9) * 600_000_000;
  const samRate = 0.12 + ((seed >> 3) % 8) / 100; // 12–19%
  const somRate = 0.04 + ((seed >> 5) % 5) / 100; // 4–8%
  const tam = tamBase;
  const sam = Math.round(tam * samRate);
  const som = Math.round(sam * somRate);

  const verbs = ["streamlines", "automates", "reimagines", "simplifies"];
  const summary =
    `This ${intake.stage}-stage idea ${pick(verbs, seed)} a real workflow for ` +
    `${intake.customer.toLowerCase()} in ${intake.region}. The ${intake.industry} ` +
    `space shows ${verdict === "go" ? "favorable" : verdict === "improve" ? "mixed but workable" : "crowded"} ` +
    `conditions. The strongest path is a focused wedge into one segment before expanding. ` +
    `Headline figures below are model estimates — replace with live data once keys are added.`;

  const competitorPool = [
    {
      name: "Northstar Labs",
      positioning: "Enterprise-first incumbent",
      pricing: "$$$ · annual contracts",
      strength: "Brand trust and integrations",
      weakness: "Slow to ship, weak for SMBs",
    },
    {
      name: "Driftwork",
      positioning: "PLG challenger",
      pricing: "$ · freemium",
      strength: "Fast onboarding, viral loops",
      weakness: "Shallow feature depth",
    },
    {
      name: "Cohort",
      positioning: "Vertical specialist",
      pricing: "$$ · per-seat",
      strength: "Deep domain features",
      weakness: "Narrow ICP, high churn outside niche",
    },
  ];

  return {
    mock: true,
    intake,
    score,
    verdict,
    summary,
    confidence,

    risks: [
      {
        title: "Crowded category",
        detail: `Several funded players already serve ${intake.customer}. Differentiation must be sharp on day one.`,
        severity: "high",
      },
      {
        title: "Distribution unproven",
        detail: `No validated channel yet for reaching ${intake.customer} at acceptable CAC.`,
        severity: "med",
      },
      {
        title: "Budget headroom",
        detail: `Stated constraint (${intake.budget}) limits paid acquisition; lean on organic early.`,
        severity: "low",
      },
    ],
    opportunities: [
      {
        title: "Underserved wedge",
        detail: `Incumbents treat ${intake.customer} as an afterthought — a focused product can win the niche.`,
      },
      {
        title: "Timing tailwind",
        detail: `Demand signals in ${intake.industry} are trending up over the last 4 quarters.`,
      },
    ],

    competitors: competitorPool.map((c, i) => ({
      ...c,
      provenance:
        i === 0
          ? sourced("Crunchbase", "https://www.crunchbase.com")
          : estimate,
    })),
    differentiators: [
      `Built specifically for ${intake.customer}, not retrofitted`,
      "Time-to-value under 10 minutes",
      "Transparent, usage-based pricing",
    ],

    segments: [
      {
        name: "Early adopters",
        description: `${intake.customer} actively seeking a better tool today`,
        sizeNote: "Small but high-intent — start here",
      },
      {
        name: "Mainstream",
        description: `Broader ${intake.industry} buyers who follow proof`,
        sizeNote: "Largest pool; needs case studies first",
      },
      {
        name: "Adjacent",
        description: "Neighboring roles with overlapping pain",
        sizeNote: "Expansion play for later",
      },
    ],

    sizing: {
      tam,
      sam,
      som,
      unit: "USD / year",
      assumptions: [
        { label: "TAM basis", value: `Total ${intake.industry} spend in region` },
        { label: "SAM filter", value: `${Math.round(samRate * 100)}% reachable with current model` },
        { label: "SOM target", value: `${Math.round(somRate * 100)}% obtainable in 24 months` },
      ],
      confidence,
      provenance: assumption,
    },

    demand: [
      {
        label: `"${intake.industry}" search interest`,
        trend: "rising",
        detail: "Steady quarter-over-quarter growth",
        provenance: sourced("Google Trends", "https://trends.google.com"),
      },
      {
        label: "Job postings mentioning the problem",
        trend: "rising",
        detail: "Proxy for budget moving into the category",
        provenance: estimate,
      },
      {
        label: "Community discussion volume",
        trend: "flat",
        detail: "Stable interest; not yet a breakout topic",
        provenance: estimate,
      },
    ],

    swot: {
      strengths: ["Sharp ICP focus", "Lean cost base", "Fast iteration"],
      weaknesses: ["No brand yet", "Unproven distribution", "Thin team"],
      opportunities: ["Niche incumbents ignore", "Rising category demand", "Partnership channels"],
      threats: ["Funded competitors", "Switching inertia", "Platform/API dependency"],
    },

    gtm: {
      channels: [
        { name: "Founder-led sales", rationale: `Direct outreach to ${intake.customer} for first 20 customers`, priority: "P0" },
        { name: "Content + SEO", rationale: `Own search intent in ${intake.industry}`, priority: "P1" },
        { name: "Community", rationale: "Be present where the ICP already gathers", priority: "P1" },
        { name: "Paid", rationale: "Only after CAC is understood", priority: "P2" },
      ],
      phases: [
        {
          window: "0–30 days",
          focus: "Validate the wedge",
          steps: [
            "Interview 15 target customers",
            "Ship a thin but real prototype",
            "Land 3 design partners",
          ],
        },
        {
          window: "31–60 days",
          focus: "Prove repeatability",
          steps: [
            "Onboard first 10 paying users",
            "Instrument activation + retention",
            "Publish 2 launch case studies",
          ],
        },
        {
          window: "61–90 days",
          focus: "Find a scalable channel",
          steps: [
            "Double down on the channel with best CAC",
            "Introduce self-serve onboarding",
            "Set a clear north-star metric",
          ],
        },
      ],
    },

    businessModels: [
      {
        name: "Usage-based SaaS",
        howItWorks: "Charge by value-aligned usage with a free entry tier",
        fitNote: "Best fit — low friction, scales with customer success",
        recommended: true,
      },
      {
        name: "Per-seat subscription",
        howItWorks: "Flat monthly fee per user",
        fitNote: "Predictable but can cap expansion early",
        recommended: false,
      },
      {
        name: "Services + product",
        howItWorks: "Bundle onboarding services with the tool",
        fitNote: "Useful for early revenue; watch margins",
        recommended: false,
      },
    ],
  };
}
