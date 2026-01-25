import Link from "next/link";
import { Header } from "@/components/studentpenny/header";
import { Footer } from "@/components/studentpenny/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About StudentPenny
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-powered financial guidance built specifically for college students.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground">
                StudentPenny was created with a simple mission: to help college students take control of their finances during one of the most formative periods of their lives. We understand that managing money as a student comes with unique challenges—irregular income, tuition payments, textbook costs, and the constant temptation of late-night food delivery.
              </p>
              <p className="text-muted-foreground">
                Our AI-powered platform is designed to understand these challenges and provide personalized, actionable guidance that actually makes sense for student life.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">What We Stand For</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Student-First Design</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every feature is built with the unique financial situation of students in mind—from semester-based planning to textbook budgeting.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">AI That Explains</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our AI doesn&apos;t just give you numbers—it explains the reasoning behind every recommendation in plain language.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">No Judgment</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We&apos;re not here to lecture you about that coffee purchase. We&apos;re here to help you make informed decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Community Focus</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We partner with local businesses to bring you exclusive student deals, supporting both your wallet and your community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Built at ConuHacks 2026</h2>
            <p className="text-muted-foreground">
              StudentPenny was created during ConuHacks 2026, a hackathon focused on building innovative solutions for real-world problems. Our team came together with a shared passion for making financial literacy accessible to students everywhere.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
