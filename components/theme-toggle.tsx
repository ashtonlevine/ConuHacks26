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
        "relative flex h-10 w-10 items-center justify-center rounded-sm transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDark 
          ? "bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 shadow-lg shadow-slate-900/50" 
          : "bg-sky-100 hover:bg-sky-200 text-amber-500 shadow-md shadow-sky-200/50",
        className
      )}
    >
      <span className={cn(
        "absolute inset-0 rounded-sm transition-opacity duration-300",
        isDark ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-sky-50 to-sky-100"
      )} />
      
      <span className="relative z-10 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </span>
    </button>
  )
}
