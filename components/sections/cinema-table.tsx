"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  year: number
}

const INITIAL_MOVIES: Movie[] = [
  { id: 1, title: "Blade Runner 2049", genre: "Sci-Fi / Drama", rating: 8.0, year: 2017 },
  { id: 2, title: "Parasite", genre: "Thriller / Drama", rating: 8.5, year: 2019 },
  { id: 3, title: "The Grand Budapest Hotel", genre: "Comedy / Drama", rating: 8.1, year: 2014 },
  { id: 4, title: "Interstellar", genre: "Sci-Fi / Adventure", rating: 8.7, year: 2014 },
  { id: 5, title: "Arrival", genre: "Sci-Fi / Drama", rating: 7.9, year: 2016 },
  { id: 6, title: "The Dark Knight", genre: "Action / Crime", rating: 9.0, year: 2008 },
  { id: 7, title: "Whiplash", genre: "Drama / Music", rating: 8.5, year: 2014 },
  { id: 8, title: "Mad Max: Fury Road", genre: "Action / Sci-Fi", rating: 8.1, year: 2015 },
]

const EXTRA_MOVIES: Movie[] = [
  { id: 100, title: "Ex Machina", genre: "Sci-Fi / Thriller", rating: 7.7, year: 2014 },
  { id: 101, title: "The Lighthouse", genre: "Horror / Drama", rating: 7.4, year: 2019 },
  { id: 102, title: "Sicario", genre: "Action / Thriller", rating: 7.6, year: 2015 },
  { id: 103, title: "Drive", genre: "Crime / Drama", rating: 7.8, year: 2011 },
  { id: 104, title: "Her", genre: "Romance / Sci-Fi", rating: 8.0, year: 2013 },
  { id: 105, title: "Moonlight", genre: "Drama", rating: 7.4, year: 2016 },
  { id: 106, title: "No Country for Old Men", genre: "Crime / Thriller", rating: 8.2, year: 2007 },
  { id: 107, title: "The Revenant", genre: "Adventure / Drama", rating: 8.0, year: 2015 },
  { id: 108, title: "There Will Be Blood", genre: "Drama", rating: 8.2, year: 2007 },
  { id: 109, title: "Hereditary", genre: "Horror / Drama", rating: 7.3, year: 2018 },
  { id: 110, title: "1917", genre: "War / Drama", rating: 8.3, year: 2019 },
  { id: 111, title: "The Social Network", genre: "Biography / Drama", rating: 7.8, year: 2010 },
  { id: 112, title: "Prisoners", genre: "Crime / Thriller", rating: 8.1, year: 2013 },
  { id: 113, title: "La La Land", genre: "Romance / Musical", rating: 8.0, year: 2016 },
  { id: 114, title: "Gone Girl", genre: "Mystery / Thriller", rating: 8.1, year: 2014 },
]

type SortKey = "rating" | "year"
type SortDir = "asc" | "desc"

export function CinemaInsightsTable() {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES)
  const [sortKey, setSortKey] = useState<SortKey>("rating")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [newRowIds, setNewRowIds] = useState<Set<number>>(new Set())

  const handleSort = useCallback((key: SortKey) => {
    setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "desc"))
    setSortKey(key)
  }, [sortKey])

  const addRandomMovie = useCallback(() => {
    const existingIds = new Set(movies.map((m) => m.id))
    const available = EXTRA_MOVIES.filter((m) => !existingIds.has(m.id))
    if (available.length === 0) return
    const random = available[Math.floor(Math.random() * available.length)]
    setNewRowIds(new Set([random.id]))
    setMovies((prev) => [...prev, random])
    setTimeout(() => setNewRowIds(new Set()), 800)
  }, [movies])

  const sortedMovies = [...movies].sort((a, b) => {
    const mult = sortDir === "asc" ? 1 : -1
    return (a[sortKey] - b[sortKey]) * mult
  })

  const SortIndicator = ({ active, dir }: { active: boolean; dir: SortDir }) => (
    <span className={cn("ml-1.5 inline-block transition-all duration-300", active ? "opacity-100" : "opacity-0")}>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  )

  const allAdded = EXTRA_MOVIES.every((m) => movies.some((e) => e.id === m.id))

  return (
    <div className="mt-20 md:mt-32">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2">Cinema Insights</h3>
          <p className="text-sm text-muted-foreground">Curated data on acclaimed films — sort, explore, discover.</p>
        </div>
        <button
          type="button"
          onClick={addRandomMovie}
          disabled={allAdded}
          className={cn(
            "group inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300",
            "border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Film
        </button>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-border/30 bg-background/30 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/20 bg-background/20">
            <div className="col-span-5"><span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">Movie</span></div>
            <div className="col-span-3"><span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">Genre</span></div>
            <div className="col-span-2">
              <button type="button" onClick={() => handleSort("rating")} className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium hover:text-foreground transition-colors duration-200 cursor-pointer">
                IMDb Rating<SortIndicator active={sortKey === "rating"} dir={sortDir} />
              </button>
            </div>
            <div className="col-span-2">
              <button type="button" onClick={() => handleSort("year")} className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium hover:text-foreground transition-colors duration-200 cursor-pointer">
                Year<SortIndicator active={sortKey === "year"} dir={sortDir} />
              </button>
            </div>
          </div>
          {sortedMovies.map((movie) => (
            <div key={movie.id} className={cn("grid grid-cols-12 gap-4 px-6 py-5 border-b border-border/10 transition-all duration-500 ease-out hover:bg-primary/[0.04]", newRowIds.has(movie.id) && "animate-in slide-in-from-bottom-2 fade-in duration-500")}>
              <div className="col-span-5"><span className="font-serif text-base text-foreground">{movie.title}</span></div>
              <div className="col-span-3 flex items-center"><span className="text-sm text-muted-foreground">{movie.genre}</span></div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-sm font-mono text-primary">{movie.rating.toFixed(1)}</span>
                <div className="flex-1 max-w-[60px] h-1 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full transition-all duration-700 ease-out" style={{ width: `${(movie.rating / 10) * 100}%` }} />
                </div>
              </div>
              <div className="col-span-2 flex items-center"><span className="text-sm font-mono text-muted-foreground">{movie.year}</span></div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-border/10">
          {sortedMovies.map((movie) => (
            <div key={movie.id} className={cn("p-5 transition-all duration-300 hover:bg-primary/[0.04]", newRowIds.has(movie.id) && "animate-in slide-in-from-bottom-2 fade-in duration-500")}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-serif text-base text-foreground leading-tight">{movie.title}</h4>
                <span className="shrink-0 font-mono text-sm text-primary font-medium">{movie.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{movie.genre}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="font-mono">{movie.year}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="flex md:hidden items-center gap-3 mt-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Sort by:</span>
        <button type="button" onClick={() => handleSort("rating")} className={cn("text-xs px-3 py-1.5 border transition-all duration-200", sortKey === "rating" ? "border-primary/50 text-primary bg-primary/5" : "border-border/30 text-muted-foreground hover:text-foreground")}>
          Rating {sortKey === "rating" && (sortDir === "asc" ? "↑" : "↓")}
        </button>
        <button type="button" onClick={() => handleSort("year")} className={cn("text-xs px-3 py-1.5 border transition-all duration-200", sortKey === "year" ? "border-primary/50 text-primary bg-primary/5" : "border-border/30 text-muted-foreground hover:text-foreground")}>
          Year {sortKey === "year" && (sortDir === "asc" ? "↑" : "↓")}
        </button>
      </div>
    </div>
  )
}
