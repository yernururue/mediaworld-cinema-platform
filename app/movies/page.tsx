import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCatalogGrid } from "@/components/movie-catalog-grid"
import { getTrendingMovies, getTopRated } from "@/lib/tmdb"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Library | Film Catalog — MediaWorld",
  description: "Browse our hand-picked cinematic library. Discover trending releases, top-rated masterpieces, and exclusive director picks on MediaWorld.",
  openGraph: {
    title: "The Library | Film Catalog — MediaWorld",
    description: "Browse our hand-picked cinematic library. Discover trending releases, top-rated masterpieces, and exclusive director picks on MediaWorld.",
    type: "website",
  },
}

export default async function MoviesPage() {
  const supabase = await createClient()
  const [{ data: { user } }, trending, topRated] = await Promise.all([
    supabase.auth.getUser(),
    getTrendingMovies('week'),
    getTopRated()
  ])

  // Combine and deduplicate
  const allMovies = [...trending, ...topRated.filter(tr => !trending.some(t => t.id === tr.id))].slice(0, 20)

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      {/* Catalog Hero */}
      <section className="relative pt-48 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Catalog</span>
              <div className="w-12 h-px bg-primary" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.02em] leading-none text-foreground">
              THE <span className="text-primary italic">LIBRARY</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              From timeless classics to modern masterpieces, explore a curated world of cinema designed to inspire and provoke.
            </p>
          </div>
        </div>
        
        {/* Decorative background text */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 pointer-events-none select-none opacity-[0.02] hidden xl:block">
          <span className="font-serif text-[40rem] leading-none font-bold italic tracking-tighter">
            FILMS
          </span>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="pb-32 md:pb-48">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <h2 className="text-sm tracking-[0.3em] uppercase text-foreground">Featured Selection</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
              <span>{allMovies.length} Results</span>
            </div>
          </div>
          
          <MovieCatalogGrid movies={allMovies} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
