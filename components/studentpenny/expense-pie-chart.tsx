"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

const COLORS = ["#1C8F99", "#63AB9A", "#BCDEF6", "#0D4F55", "#94C1B7"];

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Expense = {
  id: number;
  category: string;
  amount: number;
};

export function ExpensePieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      setError(null);
      const { data: expenses, error } = await supabase
        .from("transactions")
        .select("category, amount");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Group by category and sum amounts
      const grouped: Record<string, number> = {};
      const validExpenses: Expense[] = expenses as Expense[]; // Type assertion to include id

      validExpenses.forEach((exp) => {
        grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount;
      });

      // Convert to array and sort by value descending
      const chartData = Object.entries(grouped)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setData(chartData);
      setLoading(false);
    }

    fetchExpenses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No expenses found.</div>;

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