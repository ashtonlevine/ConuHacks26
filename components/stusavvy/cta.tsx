import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-primary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Start Planning Your Semester Smarter
          </h2>

          <p className="mt-6 text-lg text-primary-foreground/80">
            Join thousands of students taking control of their finances with AI-powered guidance.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-base"
              asChild
            >
              <Link href="#">
                Get Started with StuSavvy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/70">
            Built by students, for students.
          </p>
        </div>
      </div>
    </section>
  );
}
