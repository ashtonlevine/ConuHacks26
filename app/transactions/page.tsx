"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { DashboardHeader } from "@/components/studentpenny/dashboard-header";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("transactions")
        .select("id, description, amount, type, date")
        .order("date", { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setTransactions(data || []);
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-foreground">All Transactions</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Date</th>
              <th className="border-b p-2 text-left">Description</th>
              <th className="border-b p-2 text-left">Type</th>
              <th className="border-b p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="border-b p-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="border-b p-2">{tx.description}</td>
                <td className="border-b p-2 capitalize">{tx.type}</td>
                <td className={`border-b p-2 text-right ${tx.type === "expense" ? "text-red-500" : "text-green-600"}`}>
                  {tx.type === "expense" ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {(!loading && transactions.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-muted-foreground">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
