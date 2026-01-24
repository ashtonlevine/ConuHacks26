"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/stusavvy/dashboard-header";
import { Footer } from "@/components/stusavvy/footer";
import { AIChatSidebar } from "@/components/stusavvy/ai-chat-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  MapPin,
  PiggyBank,
  Target,
  Star,
} from "lucide-react";

// Mock overview data
const overview = {
  balance: 1247,
  income: 1850,
  spending: 603,
  tuitionDue: { date: "Sep 5", amount: 3200 },
  rentDue: { date: "Sep 1", amount: 750 },
};

// Sample deals for preview
const previewDeals = [
  { name: "Campus Grill", deal: "$5 Student Lunch Special", distance: "0.2 mi", rating: 4.5, sponsored: true },
  { name: "Pho House", deal: "15% off with student ID", distance: "0.3 mi", rating: 4.7, sponsored: false },
  { name: "The Daily Grind", deal: "$2 Coffee before 9am", distance: "0.1 mi", rating: 4.8, sponsored: false },
  { name: "Pizza Palace", deal: "$8 Large Pizza Mondays", distance: "0.1 mi", rating: 4.2, sponsored: true },
  { name: "Sushi Station", deal: "$12 All-You-Can-Eat Tuesdays", distance: "0.5 mi", rating: 4.6, sponsored: true },
  { name: "Bagel Barn", deal: "BOGO Bagels Thursdays", distance: "0.2 mi", rating: 4.6, sponsored: false },
];

export default function DashboardPage() {
  const [aiPrompt, setAiPrompt] = useState("");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1">
        {/* Welcome */}
        <section className="border-b border-border bg-muted/30 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here’s your financial picture for this semester.
            </p>
          </div>
        </section>

        {/* Overview cards */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    Available balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    ${overview.balance.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    This month — Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    ${overview.income.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    This month — Spending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    ${overview.spending.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-foreground">
                    Tuition due {overview.tuitionDue.date} · ${overview.tuitionDue.amount.toLocaleString()}
                  </p>
                  <p className="text-foreground">
                    Rent due {overview.rentDue.date} · ${overview.rentDue.amount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI What-If + Quick actions */}
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* AI What-If */}
              <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI &quot;What-If&quot; Simulator
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ask anything: &quot;Can I afford this trip?&quot; or &quot;What if I cut dining out by 20%?&quot;
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Can I afford a $50 concert ticket?"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button>Ask</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Link
                    href="/dashboard#budget"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Wallet className="h-4 w-4 text-primary" />
                      Budget
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/dashboard#deals"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      Deals
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/dashboard#goals"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Target className="h-4 w-4 text-primary" />
                      Goals
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/dashboard#savings"
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <PiggyBank className="h-4 w-4 text-primary" />
                      Emergency fund
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Deals preview */}
        <section id="deals" className="scroll-mt-24 border-t border-border bg-muted/20 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Nearby student deals
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Budget-friendly eats near campus
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/#deals">
                  View all deals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {previewDeals.map((d) => (
                <Card
                  key={d.name}
                  className="group border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {d.name}
                      </CardTitle>
                      {d.sponsored && (
                        <Badge variant="secondary" className="text-xs">
                          Sponsored
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span>{d.rating}</span>
                      <span className="mx-1">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {d.distance}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm font-medium text-primary">{d.deal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Budget & Goals placeholders (anchor sections for nav) */}
        <section id="budget" className="scroll-mt-24 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Budget
            </h2>
            <p className="mt-2 text-muted-foreground">
              Semester-aware budget and spending by category. (Coming soon.)
            </p>
            <Card className="mt-4 border border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Connect your accounts or add manual entries to see your budget.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Set up budget
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="goals" className="scroll-mt-24 border-t border-border py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Savings goals
            </h2>
            <p className="mt-2 text-muted-foreground">
              Emergency fund, trips, or big purchases. (Coming soon.)
            </p>
            <Card className="mt-4 border border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a goal and we’ll suggest a micro-saving plan.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Add goal
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <AIChatSidebar />
    </div>
  );
}
