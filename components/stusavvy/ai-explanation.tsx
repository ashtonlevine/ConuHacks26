import { Calculator, Bot, ShieldCheck } from "lucide-react";

export function AIExplanation() {
  return (
    <section id="about" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powered by AI — Grounded in Real Numbers
          </h2>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Deterministic Math
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Core budgeting uses precise calculations to handle projections and cash flow analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  AI That Explains
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI explains results in plain language, flags potential risks, and suggests actionable next steps.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-muted px-6 py-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              No investing advice. No loans. Just smart financial planning.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
