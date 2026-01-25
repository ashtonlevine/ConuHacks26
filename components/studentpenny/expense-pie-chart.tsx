"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTimePeriod } from "./time-period-context";

const COLORS = ["#1C8F99", "#63AB9A", "#BCDEF6", "#0D4F55", "#94C1B7"];
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  restaurant_expenses: "Restaurants",
  gas: "Gas",
  grocery_shopping: "Groceries",
  leisure: "Leisure",
  school_fees: "School",
  rent: "Rent",
};

export function ExpensePieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { dateRange, periodLabel, refreshKey } = useTimePeriod();

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/transactions?type=expense");

        if (!response.ok) {
          if (response.status === 401) {
            setError("Please log in to view your expenses");
            return;
          }
          throw new Error("Failed to fetch expenses");
        }

        const { transactions } = await response.json();

        // Group by display category and sum amounts
        const grouped: Record<string, number> = {};
        transactions.forEach((t: { category: string; amount: number }) => {
          // Normalize and map category
          const raw = (t.category || "").toLowerCase().trim();
          const display = CATEGORY_DISPLAY_NAMES[raw] || "Other";
          grouped[display] = (grouped[display] || 0) + Number(t.amount);
        });

        // Convert to array and sort by value descending
        const chartData = Object.entries(grouped)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, [refreshKey]);

  if (loading) return <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="h-[350px] w-full flex items-center justify-center text-destructive">Error: {error}</div>;
  if (data.length === 0) return <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">No expenses found for {periodLabel.toLowerCase()}.</div>;

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `$${value}`}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}