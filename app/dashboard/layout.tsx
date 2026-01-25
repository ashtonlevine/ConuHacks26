"use client";

import { AIChatProvider } from "@/components/studentpenny/ai-chat-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AIChatProvider>{children}</AIChatProvider>;
}
