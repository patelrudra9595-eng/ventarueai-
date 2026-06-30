import { PrismaClient } from "@prisma/client";
import { generateMockReport } from "../lib/analysis/mock";
import type { Intake } from "../lib/types";

const prisma = new PrismaClient();

const ideas: Intake[] = [
  {
    idea: "A scheduling tool that fills last-minute clinic cancellations via an automated waitlist.",
    region: "India",
    industry: "Healthcare SaaS",
    customer: "Solo and small-clinic practitioners",
    budget: "Bootstrapped, under $15k to first revenue",
    stage: "prototype",
  },
  {
    idea: "A marketplace connecting indie coffee roasters directly with office pantries on subscription.",
    region: "United States",
    industry: "Food & Beverage / B2B",
    customer: "Office managers at 20–200 person companies",
    budget: "$50k pre-seed",
    stage: "idea",
  },
  {
    idea: "An AI copilot that drafts and files small-business GST returns automatically.",
    region: "India",
    industry: "Fintech / Compliance",
    customer: "Small business owners and their accountants",
    budget: "Seed-funded, $250k",
    stage: "launched",
  },
];

async function main() {
  for (const intake of ideas) {
    const report = generateMockReport(intake);
    await prisma.report.create({
      data: {
        idea: intake.idea,
        region: intake.region,
        industry: intake.industry,
        customer: intake.customer,
        budget: intake.budget,
        stage: intake.stage,
        score: report.score,
        verdict: report.verdict,
        summary: report.summary,
        mock: true,
        payload: JSON.stringify(report),
      },
    });
  }
  console.log(`Seeded ${ideas.length} sample reports.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
