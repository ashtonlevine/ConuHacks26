"use client"

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react"

export type TimePeriod = "weekly" | "monthly"

interface DateRange {
  startDate: string
  endDate: string
}

interface TimePeriodContextType {
  period: TimePeriod
  setPeriod: (period: TimePeriod) => void
  dateRange: DateRange
  periodLabel: string
  refreshKey: number
  triggerRefresh: () => void
}

const TimePeriodContext = createContext<TimePeriodContextType | undefined>(undefined)

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day // Sunday as start of week
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getEndOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() + (6 - day) // Saturday as end of week
  d.setDate(diff)
  d.setHours(23, 59, 59, 999)
  return d
}

function getStartOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d
}

function getEndOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

function formatDateForAPI(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function calculateDateRange(period: TimePeriod): DateRange {
  const now = new Date()
  
  if (period === "weekly") {
    return {
      startDate: formatDateForAPI(getStartOfWeek(now)),
      endDate: formatDateForAPI(getEndOfWeek(now)),
    }
  } else {
    return {
      startDate: formatDateForAPI(getStartOfMonth(now)),
      endDate: formatDateForAPI(getEndOfMonth(now)),
    }
  }
}

// Calculate date range for historical data (for charts)
export function calculateHistoricalDateRange(period: TimePeriod, count: number = 6): DateRange {
  const now = new Date()
  
  if (period === "weekly") {
    // Get last N weeks
    const endOfWeek = getEndOfWeek(now)
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - (count * 7))
    const startOfFirstWeek = getStartOfWeek(startDate)
    
    return {
      startDate: formatDateForAPI(startOfFirstWeek),
      endDate: formatDateForAPI(endOfWeek),
    }
  } else {
    // Get last N months
    const endOfMonth = getEndOfMonth(now)
    const startDate = new Date(now.getFullYear(), now.getMonth() - count + 1, 1)
    
    return {
      startDate: formatDateForAPI(startDate),
      endDate: formatDateForAPI(endOfMonth),
    }
  }
}

// Helper to get week number label
export function getWeekLabel(date: Date): string {
  const startOfWeek = getStartOfWeek(date)
  const month = startOfWeek.toLocaleString("default", { month: "short" })
  const day = startOfWeek.getDate()
  return `${month} ${day}`
}

// Helper to get month label
export function getMonthLabel(date: Date): string {
  return date.toLocaleString("default", { month: "short", year: "2-digit" })
}

// Average weeks per month for budget calculations
export const WEEKS_PER_MONTH = 4.33

interface TimePeriodProviderProps {
  children: ReactNode
}

export function TimePeriodProvider({ children }: TimePeriodProviderProps) {
  const [period, setPeriod] = useState<TimePeriod>("monthly")
  const [refreshKey, setRefreshKey] = useState(0)
  
  const dateRange = useMemo(() => calculateDateRange(period), [period])
  
  const periodLabel = period === "weekly" ? "This Week" : "This Month"
  
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])
  
  const value = useMemo(
    () => ({
      period,
      setPeriod,
      dateRange,
      periodLabel,
      refreshKey,
      triggerRefresh,
    }),
    [period, dateRange, periodLabel, refreshKey, triggerRefresh]
  )
  
  return (
    <TimePeriodContext.Provider value={value}>
      {children}
    </TimePeriodContext.Provider>
  )
}

export function useTimePeriod() {
  const context = useContext(TimePeriodContext)
  if (context === undefined) {
    throw new Error("useTimePeriod must be used within a TimePeriodProvider")
  }
  return context
}
