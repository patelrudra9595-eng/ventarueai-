import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/reports — history list (lightweight fields only).
export async function GET() {
  try {
    const rows = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        idea: true,
        industry: true,
        region: true,
        score: true,
        verdict: true,
        mock: true,
      },
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}
