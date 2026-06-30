import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui/primitives";
import { ArrowRight, Sparkles, ShieldCheck, Gauge } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Hero — the thesis: a raw idea becomes a verdict. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--text)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--text)) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
          }}
        />
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-16 md:pt-24">
          <Badge tone="signal" className="mb-5">
            <Sparkles className="h-3 w-3" />
            Idea → investor-grade report
          </Badge>
          <h1 className="font-display max-w-3xl text-4xl font-700 leading-[1.05] tracking-tight md:text-6xl">
            Pressure-test a business idea
            <span className="text-signal-dim"> before</span> you build it.
          </h1>
          <p className="text-dim mt-5 max-w-xl text-lg leading-relaxed">
            VentureAI turns a one-line idea into a scored validation report —
            market sizing, competitors, SWOT, and a 90-day go-to-market plan.
            Every number shows where it came from.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/new">
              <Button>
                Validate an idea
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/report/demo">
              <Button variant="outline">See a sample report</Button>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: Gauge, text: "Single 0–100 verdict, not a wall of text" },
              { icon: ShieldCheck, text: "Sources, estimates & assumptions labeled" },
              { icon: Sparkles, text: "Live LLM + web data when keys are set" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2">
                <f.icon className="text-signal-dim h-4 w-4" />
                <span className="text-dim text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample output preview */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="border-token mb-6 flex items-center gap-3 border-t pt-8">
          <span className="text-dim font-mono text-xs uppercase tracking-widest">
            What you get
          </span>
          <span className="border-token flex-1 border-t" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Verdict score",
              body: "An honest go / improve / avoid call with the reasoning that drove it — surfaced first, before any detail.",
            },
            {
              title: "Market & competition",
              body: "TAM/SAM/SOM with the math shown, a competitor table, and the soft spots you can attack.",
            },
            {
              title: "90-day GTM",
              body: "Prioritized channels and a 30/60/90 plan you can start executing the same afternoon.",
            },
          ].map((c) => (
            <Card key={c.title} className="p-5">
              <h3 className="font-display font-600">{c.title}</h3>
              <p className="text-dim mt-2 text-sm leading-relaxed">{c.body}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 flex flex-col items-center gap-3 p-8 text-center">
          <h2 className="font-display text-2xl font-600">
            Got an idea? Get a verdict in two minutes.
          </h2>
          <p className="text-dim max-w-md text-sm">
            No account needed to try. Runs on built-in data until you add your
            own API keys.
          </p>
          <Link href="/new" className="mt-2">
            <Button>
              Start now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  );
}
