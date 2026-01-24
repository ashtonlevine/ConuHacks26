import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 sm:px-12 sm:py-20">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to streamline your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-primary-foreground/80">
              Join thousands of teams who have already transformed how they work. 
              Start your free trial today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto bg-transparent"
              >
                Talk to sales
              </Button>
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 -z-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" className="text-primary-foreground" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
