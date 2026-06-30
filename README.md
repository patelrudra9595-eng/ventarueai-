# VentureAI

Turn a raw business idea into an investor-grade validation report: a single
0–100 verdict, market sizing with its math shown, a competitor table, SWOT, and
a 90-day go-to-market plan. Every nontrivial claim is labeled as a **source**,
an **LLM estimate**, or an **assumption**.

The app runs **fully on a built-in mock engine with zero keys**. Add API keys to
switch the report engine from mock → live LLM + web data. Mock output is always
clearly labeled.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Set up env (defaults work out of the box with SQLite + mock mode)
cp .env.example .env

# 3. Create the database and seed sample reports
npm run db:push
npm run db:seed

# 4. Run
npm run dev
# → http://localhost:3000
```

That's it. With no keys set you get a complete, polished app running on the
deterministic mock report engine.

---

## What's where

```
app/
  page.tsx              Landing page (hero, sample preview, CTA)
  new/page.tsx          Idea intake form (validation, loading, error states)
  report/[id]/page.tsx  Report view — handles demo / local / saved ids
  history/page.tsx      Saved report history
  api/
    validate/route.ts   POST: run analysis, persist, return report
    reports/route.ts     GET: history list
    reports/[id]/route.ts GET: single report payload

lib/
  types.ts              Shared types + Zod intake schema (the contract)
  analysis/
    engine.ts           Orchestrator: live → mock fallback, never throws
    mock.ts             Deterministic mock report engine (verified)
    llm.ts              Anthropic LLM seam (returns null without a key)
  data/web.ts           Web-search seam for live signals (null without a key)
  prisma.ts             Prisma client singleton
  utils.ts              cn(), usd(), fmtDate()

components/
  report/               Verdict gauge (signature), market sizing, competitors,
                        SWOT, GTM, demand/segments/models, full report view
  ui/                   Primitives (Card, Badge, Button, Stat) + provenance
  site-header.tsx       Nav + theme toggle
  theme-provider.tsx    Dark/light, no external dep

prisma/
  schema.prisma         Report model (SQLite default; Postgres one line away)
  seed.ts               Three sample reports
```

## How live mode works

`lib/analysis/engine.ts` is the only place that decides live vs mock:

1. `fetchMarketSignals()` pulls real web results — **null** if no
   `TAVILY_API_KEY` or on any failure.
2. `generateLlmReport()` asks Claude for a strict-JSON report grounded by those
   signals — **null** if no `ANTHROPIC_API_KEY` or on any failure.
3. If either returns null, the **mock engine** runs. The report carries
   `mock: true`, which surfaces a banner and a badge in history.

Because each seam fails soft, the app is always runnable. You can wire up one
key at a time.

## Switching to Postgres

In `prisma/schema.prisma`, change the datasource provider to `postgresql`, set a
Postgres `DATABASE_URL` in `.env`, then `npm run db:push`.

## Export / share

The report view is print-optimized — "Export / print" opens the browser print
dialog with chrome hidden, giving a clean PDF or hard copy to share.

---

## Keys you still need to add (and where each is used)

The app is complete and runs without these. Add them to go live:

| Key | Used in | Effect when set | Effect when missing |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `lib/analysis/llm.ts` | Real LLM-generated reports | Mock engine (labeled) |
| `ANTHROPIC_MODEL` | `lib/analysis/llm.ts` | Override model string | Defaults to a current Claude model |
| `TAVILY_API_KEY` | `lib/data/web.ts` | Real web/market signals with sources | Sourced mock signals (labeled) |
| `DATABASE_URL` | `prisma/schema.prisma` | Persists report history | SQLite file by default; if unreachable, reports still render via session storage |
| `NEXT_PUBLIC_FORCE_MOCK` | both seams | `"true"` forces mock even with keys (demos) | Live mode when keys present |

### Remaining checklist once keys are in
- [ ] Drop `ANTHROPIC_API_KEY` into `.env`, restart, run a report — banner disappears, `mock` badge gone.
- [ ] Add `TAVILY_API_KEY` to see real source badges in Competitors and Demand signals.
- [ ] (Optional) Point `DATABASE_URL` at Postgres and `npm run db:push` for durable history.
- [ ] (Optional) Add auth if you want per-user history — currently history is shared/local.
- [ ] Review the LLM JSON contract in `lib/analysis/llm.ts` if you change the report shape in `lib/types.ts`.
