"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Calendar, Clock, TrendingUp } from "lucide-react"

/**
 * MovieFilter component for switching between different time-based trending views.
 * Features a minimalist, cinematic aesthetic with subtle animations.
 */
export function MovieFilter() {
  const searchParams = useSearchParams()
  const currentTime = searchParams.get("time") || "day"

  const filters = [
    { label: "Today", value: "day", icon: Clock },
    { label: "This Week", value: "week", icon: TrendingUp },
    { label: "This Month", value: "month", icon: Calendar },
  ]

  return (
    <nav className="flex items-center gap-6 md:gap-10" aria-label="Movie filter">
      {filters.map((filter) => {
        const isActive = currentTime === filter.value
        return (
          <Link
            key={filter.value}
            href={`/?time=${filter.value}`}
            scroll={false}
            className={`group relative flex items-center gap-2.5 py-2 text-[10px] md:text-[11px] tracking-[0.3em] uppercase transition-all duration-500 ${
              isActive 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground/40 hover:text-muted-foreground/80"
            }`}
          >
            <filter.icon 
              className={`w-3.5 h-3.5 transition-all duration-500 ${
                isActive 
                  ? "text-accent scale-110 opacity-100" 
                  : "opacity-40 group-hover:opacity-70 group-hover:scale-105"
              }`} 
            />
            <span>{filter.label}</span>
            
            {/* Minimalist Underline Indicator */}
            <span 
              className={`absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? "w-full" : "w-0 group-hover:w-1/3"
              }`}
            />
          </Link>
        )
      })}
    </nav>
  )
}
