"use client";
import React, { useEffect, useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { useTimePeriod } from "./time-period-context";

type ChartPeriod = 7 | 14 | 30;

type Transaction = {
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
};

type ChartData = {
  label: string;
  fullDate: string;
  income: number;
  expenses: number;
  sortKey: number;
};

function formatDateForAPI(date: Date): string {
  // Use local date to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLabel(date: Date, period: ChartPeriod): string {
  if (period === 7) {
    // Show weekday name for 7 days
    return date.toLocaleDateString("default", { weekday: "short" });
  } else if (period === 14) {
    // Show "Mon 5" format for 14 days
    return date.toLocaleDateString("default", { weekday: "short", day: "numeric" });
  } else {
    // Show "Jan 5" format for 30 days
    return date.toLocaleDateString("default", { month: "short", day: "numeric" });
  }
}

function calculateDateRangeForPeriod(days: ChartPeriod): { startDate: string; endDate: string } {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);
  
  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(now),
  };
}

// Parse a YYYY-MM-DD string as local date (not UTC)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Generate all days in the range so we show empty days too
function generateDaysInRange(startDate: string, endDate: string, period: ChartPeriod): ChartData[] {
  const days: ChartData[] = [];
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    const dateStr = formatDateForAPI(current);
    days.push({
      label: getDayLabel(current, period),
      fullDate: dateStr,
      income: 0,
      expenses: 0,
      sortKey: current.getTime(),
    });
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

export function IncomeExpenseChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(14);
  
  const { refreshKey } = useTimePeriod();
  
  // Calculate date range based on selected chart period
  const dateRange = useMemo(() => calculateDateRangeForPeriod(chartPeriod), [chartPeriod]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
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

        // Generate all days in the range
        const allDays = generateDaysInRange(dateRange.startDate, dateRange.endDate, chartPeriod);
        
        // Create a map for quick lookup
        const dayMap = new Map<string, ChartData>();
        allDays.forEach(day => dayMap.set(day.fullDate, day));
        
        // Add transaction data to the appropriate days
        transactions.forEach((t: Transaction) => {
          const dateKey = t.transaction_date.split("T")[0];
          const dayData = dayMap.get(dateKey);
          
          if (dayData) {
            if (t.type === "income") {
              dayData.income += Number(t.amount);
            } else if (t.type === "expense") {
              dayData.expenses += Number(t.amount);
            }
          }
        });

        // Sort by date
        const sorted = Array.from(dayMap.values()).sort((a, b) => a.sortKey - b.sortKey);
        setData(sorted);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [chartPeriod, dateRange.startDate, dateRange.endDate, refreshKey]);

  // Format date range for display
  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" });
  };

  // Period selector component
  const PeriodSelector = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
      <span className="text-sm text-muted-foreground">
        {formatDisplayDate(dateRange.startDate)} — {formatDisplayDate(dateRange.endDate)}
      </span>
      <div className="inline-flex items-center rounded-lg border bg-muted p-1">
        <Button
          variant={chartPeriod === 7 ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartPeriod(7)}
          className="text-xs px-3"
        >
          7 Days
        </Button>
        <Button
          variant={chartPeriod === 14 ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartPeriod(14)}
          className="text-xs px-3"
        >
          14 Days
        </Button>
        <Button
          variant={chartPeriod === 30 ? "default" : "ghost"}
          size="sm"
          onClick={() => setChartPeriod(30)}
          className="text-xs px-3"
        >
          30 Days
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <PeriodSelector />
        <div className="h-[350px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <PeriodSelector />
        <div className="h-[350px] w-full flex items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  // Check if there's any actual data (income or expenses > 0)
  const hasData = data.some(d => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <div className="w-full">
        <PeriodSelector />
        <div className="h-[350px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">No transaction data for this period.</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic bar size based on number of days
  const barSize = chartPeriod === 7 ? 28 : chartPeriod === 14 ? 16 : 8;

  return (
    <div className="w-full">
      <PeriodSelector />
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
              tick={{ fill: '#64748b', fontSize: chartPeriod === 30 ? 10 : 12 }}
              interval={chartPeriod === 30 ? 2 : 0}
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
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const item = payload[0].payload as ChartData;
                  return new Date(item.fullDate).toLocaleDateString("default", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  });
                }
                return label;
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
            />
            <Legend verticalAlign="top" align="right" height={36}/>
            
            {/* The Bars */}
            <Bar name="Income" dataKey="income" fill="#63AB9A" radius={[4, 4, 0, 0]} barSize={barSize} />
            <Bar name="Expenses" dataKey="expenses" fill="#1C8F99" radius={[4, 4, 0, 0]} barSize={barSize} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}