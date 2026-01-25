"use client";
import React, { useEffect, useState } from "react";
import { 
  ComposedChart, 
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

import { createClient } from "@supabase/supabase-js";

// Supabase credentials
const supabaseUrl = "https://xiwhvyqsxsittqfnvgdf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2h2eXFzeHNpdHRxZm52Z2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzQxOTYsImV4cCI6MjA4NDg1MDE5Nn0.BbVIJx1zfHEpC5i9a07nDyVRSvJDiU4OpyV2K9Izn4g";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ...other imports and setup remain unchanged

type Transaction = {
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
};

function getMonthLabel(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export function IncomeExpenseChart() {
  type ChartData = {
    month: string;
    income: number;
    expenses: number;
  };

  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, type, transaction_date");
      if (error) {
        console.error(error);
        return;
      }
      const grouped: { [month: string]: ChartData } = {};
      transactions.forEach((t: Transaction) => {
        const month = getMonthLabel(t.transaction_date);
        if (!grouped[month]) {
          grouped[month] = { month, income: 0, expenses: 0 };
        }
        if (t.type === "income") {
          grouped[month].income += t.amount;
        } else if (t.type === "expense") {
          grouped[month].expenses += t.amount;
        }
      });
      const sorted = Object.values(grouped).sort(
        (a, b) =>
          new Date("20" + a.month.split(" ")[1] + "-" + a.month.split(" ")[0] + "-01").getTime() -
          new Date("20" + b.month.split(" ")[1] + "-" + b.month.split(" ")[0] + "-01").getTime()
      );
      setData(sorted);
    }
    fetchData();
  }, []);

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