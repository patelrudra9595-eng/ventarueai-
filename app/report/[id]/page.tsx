"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { ValidationReport } from "@/lib/types";
import { generateMockReport } from "@/lib/analysis/mock";
import { ReportView } from "@/components/report/report-view";
import { ReportSkeleton } from "@/components/report/skeleton";
import { Card, Button } from "@/components/ui/primitives";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

// Demo idea used for the public sample report at /report/demo.
const DEMO_REPORT: ValidationReport = generateMockReport({
  idea: "A scheduling tool that lets indie clinics fill last-minute cancellations automatically via a waitlist.",
  region: "India",
  industry: "Healthcare SaaS",
  customer: "Solo and small-clinic practitioners",
  budget: "Bootstrapped, under $15k to first revenue",
  stage: "prototype",
});

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    if (id === "demo") {
      setReport(DEMO_REPORT);
      setStatus("ready");
      return;
    }
    if (id === "local") {
      const raw = sessionStorage.getItem("vai-last-report");
      if (raw) {
        setReport(JSON.parse(raw));
        setStatus("ready");
      } else setStatus("error");
      return;
    }
    fetch(`/api/reports/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setReport(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  if (status === "loading") return <ReportSkeleton />;

  if (status === "error" || !report) {
    return (
      <main className="mx-auto max-w-md px-5 py-20">
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-verdict-avoid h-8 w-8" />
          <h1 className="font-display text-lg font-600">Report not found</h1>
          <p className="text-dim text-sm">
            This report may have expired or never existed. Run a fresh one.
          </p>
          <Link href="/new" className="mt-2">
            <Button>Validate a new idea</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return <ReportView report={report} />;
}
