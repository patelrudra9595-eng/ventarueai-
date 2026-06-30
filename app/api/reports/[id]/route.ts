import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ValidationReport } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reports/:id — full report payload for the detail page.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const row = await prisma.report.findUnique({ where: { id: params.id } });
    if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const report = JSON.parse(row.payload) as ValidationReport;
    return NextResponse.json({ ...report, id: row.id, createdAt: row.createdAt });
  } catch {
    return NextResponse.json({ error: "Could not load report." }, { status: 500 });
  }
}
