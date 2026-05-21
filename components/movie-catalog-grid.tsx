"use client"

import { useState } from "react"
import { motion, Variants } from "framer-motion"
import { ImageReveal } from "@/components/ui/image-reveal"
import { TmdbMovie, getTmdbImageUrl } from "@/lib/tmdb"
import { Star, Play } from "lucide-react"

interface MovieCatalogGridProps {
  movies: TmdbMovie[]
}

export function MovieCatalogGrid({ movies }: MovieCatalogGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10"
    >
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={item}
          onMouseEnter={() => setHoveredId(movie.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative"
        >
          {/* Card Container */}
          <div className="relative aspect-[2/3] overflow-hidden bg-secondary/50 border border-border/10">
            <ImageReveal
              src={getTmdbImageUrl(movie.poster_path)}
              alt={movie.title}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* Overlay */}
            <div 
              className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 flex flex-col justify-end p-6 ${
                hoveredId === movie.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  <span className="text-xs font-mono text-accent">{movie.vote_average.toFixed(1)}</span>
                </div>
                
                <h3 className="font-serif text-lg leading-tight text-white line-clamp-2">
                  {movie.title}
                </h3>
                
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">
                  {movie.release_date.split('-')[0]}
                </p>

                <button className="w-full py-2.5 mt-2 bg-white text-black text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-2">
                  <Play className="w-3 h-3 fill-current" />
                  Details
                </button>
              </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
          </div>

          {/* Simple Title (Visible when not hovered) */}
          <div className="mt-4 transition-opacity duration-300 group-hover:opacity-0">
            <h4 className="text-sm font-medium text-foreground line-clamp-1 truncate">{movie.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground font-mono">{movie.release_date.split('-')[0]}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] text-primary/80 font-mono">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
