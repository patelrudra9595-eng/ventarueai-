"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IntakeSchema, type Intake } from "@/lib/types";
import { Button, Card } from "@/components/ui/primitives";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

const fields = [
  {
    name: "idea",
    label: "Business idea",
    placeholder: "A scheduling tool that lets indie clinics fill last-minute cancellations automatically.",
    textarea: true,
  },
  { name: "region", label: "Target country / region", placeholder: "India" },
  { name: "industry", label: "Industry", placeholder: "Healthcare / SaaS" },
  {
    name: "customer",
    label: "Target customer",
    placeholder: "Solo and small-clinic practitioners",
  },
  {
    name: "budget",
    label: "Budget / key constraint",
    placeholder: "Bootstrapped, under $15k to first revenue",
  },
] as const;

const stages = [
  { value: "idea", label: "Just an idea" },
  { value: "prototype", label: "Prototype" },
  { value: "launched", label: "Launched" },
] as const;

const demo: Intake = {
  idea: "A scheduling tool that lets indie clinics fill last-minute cancellations automatically via a waitlist.",
  region: "India",
  industry: "Healthcare SaaS",
  customer: "Solo and small-clinic practitioners",
  budget: "Bootstrapped, under $15k to first revenue",
  stage: "prototype",
};

export default function NewReportPage() {
  const router = useRouter();
  const [form, setForm] = useState<Intake>({
    idea: "",
    region: "",
    industry: "",
    customer: "",
    budget: "",
    stage: "idea",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof Intake, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setServerError(null);
    const parsed = IntakeSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(
        parsed.error.flatten().fieldErrors
      )) {
        if (v?.[0]) fieldErrors[k] = v[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Analysis failed.");
      const report = await res.json();
      if (report.id) router.push(`/report/${report.id}`);
      else {
        sessionStorage.setItem("vai-last-report", JSON.stringify(report));
        router.push("/report/local");
      }
    } catch {
      setServerError("Something went wrong running the analysis. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-700">Validate an idea</h1>
        <p className="text-dim mt-1 text-sm">
          Six quick fields. The more specific you are, the sharper the report.
        </p>
        <button
          onClick={() => setForm(demo)}
          className="text-signal-dim mt-2 text-xs underline-offset-4 hover:underline"
        >
          Fill with a demo idea
        </button>
      </div>

      <Card className="space-y-5 p-6">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-1.5 block text-sm font-500">{f.label}</label>
            {"textarea" in f && f.textarea ? (
              <textarea
                value={form[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="surface-2 border-token w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-signal/50"
              />
            ) : (
              <input
                value={form[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="surface-2 border-token w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-signal/50"
              />
            )}
            {errors[f.name] && (
              <p className="text-verdict-avoid mt-1 text-xs">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm font-500">Stage</label>
          <div className="grid grid-cols-3 gap-2">
            {stages.map((s) => (
              <button
                key={s.value}
                onClick={() => set("stage", s.value)}
                className={`rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  form.stage === s.value
                    ? "border-signal/50 bg-signal/10 text-signal-dim font-600"
                    : "border-token surface-2 text-dim hover:border-signal/30"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {serverError && (
          <div className="border-verdict-avoid/30 bg-verdict-avoid/10 text-verdict-avoid flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm">
            <AlertCircle className="h-4 w-4" />
            {serverError}
          </div>
        )}

        <Button
          onClick={submit}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing — sizing market, scanning competitors…
            </>
          ) : (
            <>
              Generate report
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </Card>

      {submitting && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-dim mt-3 text-center text-xs"
        >
          This usually takes a few seconds.
        </motion.p>
      )}
    </main>
  );
}
