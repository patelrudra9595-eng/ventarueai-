import { NextResponse } from "next/server";
import { IntakeSchema } from "@/lib/types";
import { runValidation } from "@/lib/analysis/engine";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/validate — run analysis, persist, return the full report.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = IntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const report = await runValidation(parsed.data);

  // Persist history. If the DB isn't reachable, still return the report.
  try {
    const saved = await prisma.report.create({
      data: {
        idea: parsed.data.idea,
        region: parsed.data.region,
        industry: parsed.data.industry,
        customer: parsed.data.customer,
        budget: parsed.data.budget,
        stage: parsed.data.stage,
        score: report.score,
        verdict: report.verdict,
        summary: report.summary,
        mock: report.mock,
        payload: JSON.stringify(report),
      },
    });
    return NextResponse.json({ ...report, id: saved.id, createdAt: saved.createdAt });
  } catch {
    return NextResponse.json(report);
  }
}
