"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Utensils,
  Fuel,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Home,
  MoreHorizontal,
} from "lucide-react";
import { useTimePeriod } from "./time-period-context";

interface Budget {
  restaurant_expenses: number;
  gas: number;
  grocery_shopping: number;
  leisure: number;
  school_fees: number;
  rent: number;
  other: number;
}

// Category configuration with icons and display names
const categories = [
  { key: "restaurant_expenses", label: "Restaurant", icon: Utensils },
  { key: "gas", label: "Gas", icon: Fuel },
  { key: "grocery_shopping", label: "Groceries", icon: ShoppingCart },
  { key: "leisure", label: "Leisure/Entertainment", icon: Gamepad2 },
  { key: "school_fees", label: "School", icon: GraduationCap },
  { key: "rent", label: "Rent", icon: Home },
  { key: "other", label: "Other", icon: MoreHorizontal },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

// Currency formatter for CAD
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);

export function CategoryBreakdown() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categorySpending, setCategorySpending] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const { period, dateRange, periodLabel } = useTimePeriod();

  // Fetch budget when period changes (weekly and monthly budgets are separate)
  useEffect(() => {
    async function fetchBudget() {
      try {
        const budgetRes = await fetch(`/api/budget?periodType=${period}`);
        if (budgetRes.ok) {
          const { budget: budgetData } = await budgetRes.json();
          setBudget(budgetData);
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    }
    fetchBudget();
  }, [period]);

  // Fetch spending data when date range changes
  useEffect(() => {
    async function fetchSpending() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        const summaryRes = await fetch(`/api/transactions/summary?${params}`);

        if (summaryRes.ok) {
          const { summary } = await summaryRes.json();
          setCategorySpending(summary?.categoryBreakdown || {});
        }
      } catch (error) {
        console.error("Error fetching category breakdown data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpending();
  }, [dateRange.startDate, dateRange.endDate]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.key} className="border-border bg-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full bg-muted rounded mb-3" />
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-3 w-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const budgetLabel = period === "weekly" ? "Weekly Budget" : "Monthly Budget";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const budgetAmount = budget?.[category.key as keyof Budget] || 0;
        const spent = categorySpending[category.key] || 0;
        const remaining = budgetAmount - spent;
        const isOverspent = remaining < 0;
        const overspentAmount = Math.abs(remaining);
        const remainingDisplay = Math.max(remaining, 0);
        
        // Calculate progress percentage (capped at 100% for display)
        const percent = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
        const hasBudget = budgetAmount > 0;

        return (
          <Card key={category.key} className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {category.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isOverspent ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Status text */}
              <div className="mt-3">
                {!hasBudget ? (
                  <>
                    <p className="text-sm font-medium text-muted-foreground">
                      No budget set
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {periodLabel}: {formatCurrency(spent)}
                    </p>
                  </>
                ) : isOverspent ? (
                  <>
                    <p className="text-sm font-medium text-destructive">
                      Overspent by {formatCurrency(overspentAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Spent: {formatCurrency(spent)} / {budgetLabel}: {formatCurrency(budgetAmount)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(remainingDisplay)} remaining of {formatCurrency(budgetAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {periodLabel}: {formatCurrency(spent)}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
