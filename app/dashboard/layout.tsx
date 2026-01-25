"use client";

import { AIChatProvider } from "@/components/studentpenny/ai-chat-context";
import { TimePeriodProvider } from "@/components/studentpenny/time-period-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimePeriodProvider>
      <AIChatProvider>{children}</AIChatProvider>
    </TimePeriodProvider>
  );
}
