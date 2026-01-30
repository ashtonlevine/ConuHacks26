'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button 
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-sm bg-muted/50 transition-all",
          className
        )} 
        aria-label="Toggle theme"
      >
        <span className="h-5 w-5" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        "group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm transition-[transform,box-shadow,background-color] duration-300",
        "hover:scale-110 active:scale-95",
        "motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDark 
          ? "bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 shadow-lg shadow-slate-900/50" 
          : "bg-sky-100 hover:bg-sky-200 text-amber-500 shadow-md shadow-sky-200/50",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-sm opacity-0 blur-sm transition-all duration-300",
          "group-hover:opacity-100 group-hover:scale-105",
          isDark ? "bg-amber-400/30" : "bg-sky-400/30"
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-500",
          "group-active:opacity-80 group-active:scale-[6]",
          isDark ? "bg-amber-300/40" : "bg-sky-300/50"
        )}
      />
      <span className={cn(
        "absolute inset-0 rounded-sm transition-opacity duration-300",
        isDark ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-sky-50 to-sky-100"
      )} />
      
      <span className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
        ) : (
          <Moon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
        )}
      </span>
    </button>
  )
}
