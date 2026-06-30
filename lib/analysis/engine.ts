import type { Intake, ValidationReport } from "@/lib/types";
import { fetchMarketSignals } from "@/lib/data/web";
import { generateLlmReport } from "@/lib/analysis/llm";
import { generateMockReport } from "@/lib/analysis/mock";

/**
 * Orchestrator: decides live vs mock and guarantees a coherent report.
 *
 * 1. Try to pull real web signals (null if no key / failure).
 * 2. Try the LLM with those signals (null if no key / failure).
 * 3. Fall back to the deterministic mock engine, always labeled mock:true.
 *
 * The route never throws on missing keys — the app stays runnable end to end.
 */
export async function runValidation(intake: Intake): Promise<ValidationReport> {
  const query = `${intake.idea} ${intake.industry} ${intake.region} market competitors`;

  const signals = await fetchMarketSignals(query);
  const live = await generateLlmReport(intake, signals);
  if (live) return live;

  return generateMockReport(intake);
}
