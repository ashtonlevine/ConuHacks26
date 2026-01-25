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
import { useTimePeriod, calculateHistoricalDateRange, getWeekLabel, getMonthLabel } from "./time-period-context";

type Transaction = {
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
};

type ChartData = {
  label: string;
  income: number;
  expenses: number;
  sortKey: number;
};

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr);
  const startOfWeek = getStartOfWeek(date);
  return startOfWeek.toISOString().split("T")[0];
}

function getMonthKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function IncomeExpenseChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { period } = useTimePeriod();
  
  // Get historical date range based on period (6 weeks or 6 months)
  const historicalRange = calculateHistoricalDateRange(period, 6);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          startDate: historicalRange.startDate,
          endDate: historicalRange.endDate,
        });
        const response = await fetch(`/api/transactions?${params}`);

        if (!response.ok) {
          if (response.status === 401) {
            setError("Please log in to view your data");
            return;
          }
          throw new Error("Failed to fetch transactions");
        }

        const { transactions } = await response.json();

        // Group by week or month based on period
        const grouped: { [key: string]: ChartData } = {};
        
        transactions.forEach((t: Transaction) => {
          let key: string;
          let label: string;
          let sortKey: number;
          
          if (period === "weekly") {
            key = getWeekKey(t.transaction_date);
            const weekStart = new Date(key);
            label = getWeekLabel(weekStart);
            sortKey = weekStart.getTime();
          } else {
            key = getMonthKey(t.transaction_date);
            const date = new Date(t.transaction_date);
            label = getMonthLabel(date);
            sortKey = new Date(key + "-01").getTime();
          }
          
          if (!grouped[key]) {
            grouped[key] = { label, income: 0, expenses: 0, sortKey };
          }
          
          if (t.type === "income") {
            grouped[key].income += Number(t.amount);
          } else if (t.type === "expense") {
            grouped[key].expenses += Number(t.amount);
          }
        });

        // Sort by date
        const sorted = Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey);
        setData(sorted);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period, historicalRange.startDate, historicalRange.endDate]);

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
            dataKey="label" 
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
            labelStyle={{ 
              color: '#1e293b', 
              fontWeight: 'bold', 
              marginBottom: '4px' 
            }}
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