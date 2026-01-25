"use client";

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

const data = [
  { month: "Apr", income: 1200, expenses: 900},
  { month: "May", income: 1500, expenses: 1100},
  { month: "Jun", income: 1100, expenses: 1300},
  { month: "Jul", income: 1800, expenses: 1000},
  { month: "Aug", income: 2000, expenses: 1200},
  { month: "Sep", income: 1850, expenses: 603},
];

export function IncomeExpenseChart() {
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