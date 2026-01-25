import { Badge } from "@/components/ui/badge";
import { Utensils, Heart, Tag } from "lucide-react";

export function Trust() {
  return (
    <section className="border-y border-border bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Free for Students. Supported by Local Partners.
          </h2>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Local restaurants can sponsor student-friendly meal deals
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Sponsored deals are designed to help, never to increase student spending
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-sm border border-border bg-card p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Sponsored content is always clearly labeled with transparency
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Example of sponsored content labeling:
            </span>
            <div className="inline-flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                Campus Grill - $5 Student Lunch Special
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
