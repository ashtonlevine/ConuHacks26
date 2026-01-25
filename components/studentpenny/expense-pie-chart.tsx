"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Rent & Utilities", value: 750 },
  { name: "Food & Groceries", value: 450 },
  { name: "Entertainment", value: 200 },
  { name: "Transport", value: 120 },
  { name: "Books", value: 80 },
];

const COLORS = ["#1C8F99", "#63AB9A", "#BCDEF6", "#0D4F55", "#94C1B7"];

export function ExpensePieChart() {
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