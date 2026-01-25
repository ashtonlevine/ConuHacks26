"use client"

import { useTimePeriod, TimePeriod } from "./time-period-context"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDays } from "lucide-react"

export function TimePeriodToggle() {
  const { period, setPeriod } = useTimePeriod()

  return (
    <div className="inline-flex items-center rounded-lg border bg-muted p-1">
      <Button
        variant={period === "weekly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setPeriod("weekly")}
        className="gap-2"
      >
        <CalendarDays className="h-4 w-4" />
        Weekly
      </Button>
      <Button
        variant={period === "monthly" ? "default" : "ghost"}
        size="sm"
        onClick={() => setPeriod("monthly")}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Monthly
      </Button>
    </div>
  )
}
