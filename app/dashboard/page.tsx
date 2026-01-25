"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/studentpenny/dashboard-header";
import { Footer } from "@/components/studentpenny/footer";
import { AIChatSidebar } from "@/components/studentpenny/ai-chat-sidebar";
import { useAIChat } from "@/components/studentpenny/ai-chat-context";
import { BudgetFormModal, Budget } from "@/components/studentpenny/budget-form-modal";
import { GoalFormModal, Goal } from "@/components/studentpenny/goal-form-modal";
import { TransactionFormModal, Transaction } from "@/components/studentpenny/transaction-form-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  MapPin,
  PiggyBank,
  Target,
  Star,
  Utensils,
  Fuel,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Pencil,
  Plus,
  Plane,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { ChartTabs } from "@/components/studentpenny/chart-tabs";

// Summary type
interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  categoryBreakdown: Record<string, number>;
}

// Sample deals for preview
const previewDeals = [
  { name: "Campus Grill", deal: "$5 Student Lunch Special", distance: "0.2 mi", rating: 4.5, sponsored: true },
  { name: "Pho House", deal: "15% off with student ID", distance: "0.3 mi", rating: 4.7, sponsored: false },
  { name: "The Daily Grind", deal: "$2 Coffee before 9am", distance: "0.1 mi", rating: 4.8, sponsored: false },
  { name: "Pizza Palace", deal: "$8 Large Pizza Mondays", distance: "0.1 mi", rating: 4.2, sponsored: true },
  { name: "Sushi Station", deal: "$12 All-You-Can-Eat Tuesdays", distance: "0.5 mi", rating: 4.6, sponsored: true },
  { name: "Bagel Barn", deal: "BOGO Bagels Thursdays", distance: "0.2 mi", rating: 4.6, sponsored: false },
];

// Budget category display configuration
const budgetCategories = [
  { key: "restaurant_expenses" as const, label: "Restaurants", icon: Utensils },
  { key: "gas" as const, label: "Gas", icon: Fuel },
  { key: "grocery_shopping" as const, label: "Groceries", icon: ShoppingCart },
  { key: "leisure" as const, label: "Leisure", icon: Gamepad2 },
  { key: "school_fees" as const, label: "School Fees", icon: GraduationCap },
];

// Goal category icons mapping
const goalCategoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  emergency_fund: PiggyBank,
  trip: Plane,
  purchase: ShoppingBag,
  education: GraduationCap,
  general: Target,
};

export default function DashboardPage() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  
  // AI Chat context
  const { sendMessage, isThinking } = useAIChat();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);
  
  // Goals state
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Transaction state
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Fetch existing budget, goals, and transactions on mount
  useEffect(() => {
    async function fetchBudget() {
      try {
        const response = await fetch("/api/budget");
        if (response.ok) {
          const data = await response.json();
          setBudget(data.budget);
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setIsLoadingBudget(false);
      }
    }

    async function fetchGoals() {
      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          setGoals(data.goals);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setIsLoadingGoals(false);
      }
    }

    async function fetchTransactionSummary() {
      try {
        const response = await fetch("/api/transactions/summary");
        if (response.ok) {
          const data = await response.json();
          setFinancialSummary(data.summary);
        }
      } catch (error) {
        console.error("Error fetching transaction summary:", error);
      } finally {
        setIsLoadingSummary(false);
      }
    }

    async function fetchRecentTransactions() {
      try {
        const response = await fetch("/api/transactions?limit=5");
        if (response.ok) {
          const data = await response.json();
          setRecentTransactions(data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchBudget();
    fetchGoals();
    fetchTransactionSummary();
    fetchRecentTransactions();
  }, []);

  const handleBudgetSaved = (savedBudget: Budget) => {
    setBudget(savedBudget);
  };

  const handleGoalSaved = (savedGoal: Goal) => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === savedGoal.id ? savedGoal : g));
      setEditingGoal(null);
    } else {
      setGoals([savedGoal, ...goals]);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGoals(goals.filter(g => g.id !== goalId));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleOpenNewGoalModal = () => {
    setEditingGoal(null);
    setGoalModalOpen(true);
  };

  const handleTransactionSaved = async (transaction: Transaction) => {
    // Refresh summary and recent transactions
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        fetch("/api/transactions/summary"),
        fetch("/api/transactions?limit=5"),
      ]);
      
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setFinancialSummary(data.summary);
      }
      
      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setRecentTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const totalBudget = budget
    ? budgetCategories.reduce((sum, cat) => sum + (budget[cat.key] || 0), 0)
    : 0;

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
              Here&apos;s your financial picture for this semester.
            </p>
          </div>
        </section>

        {/* Overview cards */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Overview</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTransactionModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    Available balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSummary ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      ${(financialSummary?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
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
                  {isLoadingSummary ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      ${(financialSummary?.monthlyIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
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
                  {isLoadingSummary ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      ${(financialSummary?.monthlyExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.slice(0, 2).map((t) => (
                      <p key={t.id} className="text-foreground truncate">
                        {t.type === 'expense' ? '-' : '+'}${Number(t.amount).toFixed(2)} · {t.description || t.category}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No recent transactions</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section id="analytics" className="py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Analytics
                </h2>
                <p className="mt-2 text-muted-foreground">
                  A visual representation of your income and expenses
                </p>
              </div>
              <div className="mt-6">
                <ChartTabs />
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
                <Link href="/dashboard/deals">
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

        {/* Budget Section */}
        <section id="budget" className="scroll-mt-24 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Budget
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {budget
                    ? "Your monthly budget allocation by category"
                    : "Set up your budget to track spending by category"}
                </p>
              </div>
              {budget && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBudgetModalOpen(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Budget
                </Button>
              )}
            </div>

            {isLoadingBudget ? (
              <Card className="mt-4 border border-border">
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">Loading budget...</p>
                </CardContent>
              </Card>
            ) : budget ? (
              <div className="mt-4 space-y-4">
                {/* Total Budget Card */}
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Wallet className="h-4 w-4" />
                      Total Monthly Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </CardContent>
                </Card>

                {/* Budget Categories Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {budgetCategories.map((category) => {
                    const Icon = category.icon;
                    const amount = budget[category.key] || 0;
                    const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
                    return (
                      <Card key={category.key} className="border-border bg-card">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Icon className="h-4 w-4 text-primary" />
                            {category.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-bold text-foreground">
                            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                            <div
                              className="h-1.5 rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {percentage.toFixed(1)}% of total
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="mt-4 border border-dashed border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Set up your budget to track spending across different categories.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setBudgetModalOpen(true)}
                  >
                    Set up budget
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Goals Section */}
        <section id="goals" className="scroll-mt-24 border-t border-border py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Savings goals
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Emergency fund, trips, or big purchases.
                </p>
              </div>
              {goals.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenNewGoalModal}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              )}
            </div>

            {isLoadingGoals ? (
              <Card className="mt-4 border border-border">
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">Loading goals...</p>
                </CardContent>
              </Card>
            ) : goals.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                  const Icon = goalCategoryIcons[goal.category] || Target;
                  const progress = goal.target_amount > 0 
                    ? (goal.current_amount / goal.target_amount) * 100 
                    : 0;
                  const remaining = goal.target_amount - goal.current_amount;
                  
                  // Calculate monthly savings needed if target date exists
                  let monthlySavings = null;
                  if (goal.target_date && remaining > 0) {
                    const targetDate = new Date(goal.target_date);
                    const today = new Date();
                    const monthsRemaining = Math.max(
                      (targetDate.getFullYear() - today.getFullYear()) * 12 +
                        (targetDate.getMonth() - today.getMonth()),
                      1
                    );
                    monthlySavings = remaining / monthsRemaining;
                  }

                  return (
                    <Card key={goal.id} className="border-border bg-card">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                            <Icon className="h-4 w-4 text-primary" />
                            {goal.name}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditGoal(goal)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => goal.id && handleDeleteGoal(goal.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold text-foreground">
                                ${goal.current_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                of ${goal.target_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {progress.toFixed(0)}% complete
                            </p>
                          </div>
                          
                          {goal.target_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Target: {new Date(goal.target_date).toLocaleDateString()}
                            </div>
                          )}
                          
                          {monthlySavings && monthlySavings > 0 && (
                            <div className="rounded-lg bg-muted/50 p-2">
                              <p className="text-xs text-muted-foreground">
                                Save <span className="font-semibold text-primary">${monthlySavings.toFixed(2)}/month</span> to reach your goal
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="mt-4 border border-dashed border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a goal and we&apos;ll suggest a micro-saving plan.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleOpenNewGoalModal}
                  >
                    Add goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AIChatSidebar />

      {/* Budget Form Modal */}
      <BudgetFormModal
        open={budgetModalOpen}
        onOpenChange={setBudgetModalOpen}
        existingBudget={budget}
        onBudgetSaved={handleBudgetSaved}
      />

      {/* Goal Form Modal */}
      <GoalFormModal
        open={goalModalOpen}
        onOpenChange={(open) => {
          setGoalModalOpen(open);
          if (!open) setEditingGoal(null);
        }}
        existingGoal={editingGoal}
        onGoalSaved={handleGoalSaved}
      />

      {/* Transaction Form Modal */}
      <TransactionFormModal
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        onTransactionSaved={handleTransactionSaved}
      />
    </div>
  );
}
