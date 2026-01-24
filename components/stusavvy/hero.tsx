import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-powered financial guidance</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            AI Financial Guidance Built for Student Life
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Plan your money around semesters, tuition, and part-time income — not generic monthly budgets.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="#">
                Try StuSavvy
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/50 shadow-2xl shadow-primary/10">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                  <div className="h-3 w-3 rounded-full bg-primary/60" />
                  <div className="ml-4 h-5 w-48 rounded bg-muted" />
                </div>
                <div className="flex flex-1 gap-4 p-6">
                  <div className="flex w-1/3 flex-col gap-4">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 h-4 w-20 rounded bg-muted" />
                      <div className="h-8 w-28 rounded bg-primary/20 text-2xl font-bold text-primary" />
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-2 h-4 w-24 rounded bg-muted" />
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-muted" />
                        <div className="h-3 w-3/4 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg border border-border bg-card p-4">
                    <div className="mb-4 h-4 w-32 rounded bg-muted" />
                    <div className="flex h-32 items-end gap-2">
                      <div className="h-1/2 flex-1 rounded-t bg-primary/30" />
                      <div className="h-3/4 flex-1 rounded-t bg-primary/50" />
                      <div className="h-full flex-1 rounded-t bg-primary/70" />
                      <div className="h-2/3 flex-1 rounded-t bg-primary/50" />
                      <div className="h-1/3 flex-1 rounded-t bg-primary/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
