import type { Provenance } from "@/lib/types";

/**
 * Real-time web/market data seam.
 *
 * When TAVILY_API_KEY is set, fetchMarketSignals() performs a real search and
 * returns sourced results with provenance. Otherwise it returns null so the
 * caller falls back to the (clearly-labeled) mock engine.
 *
 * Kept provider-agnostic: swap the fetch block for any search API you prefer.
 */

export interface WebSignal {
  title: string;
  snippet: string;
  provenance: Provenance;
}

export async function fetchMarketSignals(
  query: string
): Promise<WebSignal[] | null> {
  const key = process.env.TAVILY_API_KEY?.trim();
  if (!key || process.env.NEXT_PUBLIC_FORCE_MOCK === "true") return null;

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        query,
        max_results: 6,
        search_depth: "advanced",
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { title: string; content: string; url: string }[];
    };
    const now = new Date().toISOString();
    return (data.results ?? []).map((r) => ({
      title: r.title,
      snippet: r.content,
      provenance: {
        kind: "source",
        label: new URL(r.url).hostname.replace("www.", ""),
        url: r.url,
        retrievedAt: now,
      },
    }));
  } catch {
    return null;
  }
}
