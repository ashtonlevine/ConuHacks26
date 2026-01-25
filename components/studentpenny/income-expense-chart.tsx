"use client";
import React, { useEffect, useState } from "react";
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

type Transaction = {
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
};

type ChartData = {
  month: string;
  income: number;
  expenses: number;
};

function getMonthLabel(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export function IncomeExpenseChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Use secure API route instead of direct Supabase access
        const response = await fetch("/api/transactions");

        if (!response.ok) {
          if (response.status === 401) {
            setError("Please log in to view your data");
            return;
          }
          throw new Error("Failed to fetch transactions");
        }

        const { transactions } = await response.json();

        // Group by month
        const grouped: { [month: string]: ChartData } = {};
        transactions.forEach((t: Transaction) => {
          const month = getMonthLabel(t.transaction_date);
          if (!grouped[month]) {
            grouped[month] = { month, income: 0, expenses: 0 };
          }
          if (t.type === "income") {
            grouped[month].income += Number(t.amount);
          } else if (t.type === "expense") {
            grouped[month].expenses += Number(t.amount);
          }
        });

        // Sort by date
        const sorted = Object.values(grouped).sort(
          (a, b) =>
            new Date("20" + a.month.split(" ")[1] + "-" + a.month.split(" ")[0] + "-01").getTime() -
            new Date("20" + b.month.split(" ")[1] + "-" + b.month.split(" ")[0] + "-01").getTime()
        );
        setData(sorted);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No transaction data available.</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
          <Legend verticalAlign="top" align="right" height={36}/>
          
          {/* The Bars */}
          <Bar name="Income" dataKey="income" fill="#63AB9A" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar name="Expenses" dataKey="expenses" fill="#1C8F99" radius={[4, 4, 0, 0]} barSize={20} />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}