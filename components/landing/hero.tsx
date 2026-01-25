import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-sm bg-accent" />
            <span className="text-muted-foreground">Now with AI-powered automation</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            The complete platform to streamline your workflow
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Stop wasting time on repetitive tasks. StreamLine helps your team automate workflows, 
            collaborate seamlessly, and ship faster than ever before.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              View demo
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4 sm:gap-8">
          {[
            { stat: "10k+", label: "Active teams" },
            { stat: "99.9%", label: "Uptime SLA" },
            { stat: "50%", label: "Time saved" },
            { stat: "4.9/5", label: "Customer rating" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{item.stat}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
