"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, PieChart } from "lucide-react";
import { IncomeExpenseChart } from "./income-expense-chart";
import { ExpensePieChart } from "./expense-pie-chart";

type ChartTab = "income-expense" | "expense-breakdown";

export function ChartTabs() {
  const [activeTab, setActiveTab] = useState<ChartTab>("income-expense");

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "income-expense" ? "default" : "outline"}
          onClick={() => setActiveTab("income-expense")}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Income & Expenses
        </Button>
        <Button
          variant={activeTab === "expense-breakdown" ? "default" : "outline"}
          onClick={() => setActiveTab("expense-breakdown")}
          className="flex items-center gap-2"
        >
          <PieChart className="h-4 w-4" />
          Expense Breakdown
        </Button>
      </div>

      {/* Sliding Chart Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: activeTab === "income-expense" ? "translateX(0)" : "translateX(-50%)",
            width: "200%",
          }}
        >
          {/* Income & Expenses Chart - slides from left */}
          <div className="w-1/2 flex-shrink-0">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Income vs. Expenses
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compare your income and expenses over time.
                </p>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart />
              </CardContent>
            </Card>
          </div>

          {/* Expense Breakdown Chart - slides from right */}
          <div className="w-1/2 flex-shrink-0">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <PieChart className="h-5 w-5 text-primary" />
                  Expense Breakdown
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  See how your expenses are distributed across different categories.
                </p>
              </CardHeader>
              <CardContent>
                <ExpensePieChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
