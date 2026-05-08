"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ImageReveal } from "@/components/ui/image-reveal"
import { CinemaInsightsTable } from "@/components/sections/cinema-table"
import { MovieFilter } from "@/components/movie-filter"

import { TmdbMovie } from "@/lib/tmdb"

export function DishesSection({ movies = [] }: { movies?: TmdbMovie[] }) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeDish, setActiveDish] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Reset active dish when movies change
  useEffect(() => {
    setActiveDish(0)
  }, [movies])

  // Map TMDB movies to the internal display format
  const displayMovies = movies.length > 0 
    ? movies.slice(0, 3).map(m => ({
        id: m.id,
        name: m.title,
        subtitle: `Rating: ${m.vote_average.toFixed(1)}/10`,
        season: m.release_date.split('-')[0],
        description: m.overview,
        technique: "Featured Selection",
        image: m.poster_path ? `https://image.tmdb.org/t/p/original/${m.poster_path}` : "/placeholder.svg",
        awards: m.vote_average > 8 ? ["Top Rated Selection"] : []
      }))
    : [
        {
          id: "dune2",
          name: "Dune: Part Two",
          subtitle: "Directed by Denis Villeneuve",
          season: "2024",
          description: "Paul Atreides unites with the Fremen to wage war against House Harkonnen. An epic sci-fi masterpiece with breathtaking visuals, Hans Zimmer's thunderous score, and stellar performances.",
          technique: "Action, Adventure, Sci-Fi",
          image: "/images/dish-2.jpg",
          awards: ["Critics Choice 2024"]
        },
        {
          id: "oppenheimer",
          name: "Oppenheimer",
          subtitle: "Directed by Christopher Nolan",
          season: "2023",
          description: "The story of J. Robert Oppenheimer and the Manhattan Project. A gripping historical drama that explores the moral complexities of creating the atomic bomb. Oscar winner for Best Picture.",
          technique: "Biography, Drama, History",
          image: "/images/dish-1.jpg",
          awards: ["Academy Award Winner"]
        },
        {
          id: "everything",
          name: "Everything Everywhere All at Once",
          subtitle: "Directed by the Daniels",
          season: "2022",
          description: "A laundromat owner discovers she can access parallel universe versions of herself. A wildly inventive multiverse adventure that blends action, comedy, and heart in equal measure.",
          technique: "Action, Comedy, Fantasy",
          image: "/images/dish-3.jpg",
          awards: []
        }
      ]

  return (
    <section 
      ref={sectionRef}
      id="featured"
      className="relative py-32 md:py-48 overflow-hidden bg-secondary"
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 mb-20 md:mb-32">
          <div className="lg:col-span-2">
            <div 
              className="flex items-center gap-4"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">(04)</span>
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Featured Films</span>
            </div>
          </div>

          <div className="lg:col-span-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground max-w-2xl text-pretty"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.1s"
              }}
            >
              Must-watch films everyone is talking about
            </h2>
            <div 
              className="pb-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
              }}
            >
              <MovieFilter />
            </div>
          </div>
        </div>

        {/* Dishes Showcase */}
        <motion.div 
          key={movies.map(m => m.id).join(',')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Main Image */}
          <div className="lg:col-span-8 relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-background">
              {displayMovies.map((dish, index) => (
                <div
                  key={dish.id}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: activeDish === index ? 1 : 0 }}
                >
                  {activeDish === index ? (
                    <ImageReveal
                      src={dish.image || "/placeholder.svg"}
                      alt={dish.name}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                      priority={index === 0}
                      delay={300}
                    />
                  ) : (
                    <Image
                      src={dish.image || "/placeholder.svg"}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                      priority={index === 0}
                    />
                  )}
                </div>
              ))}
              
              {/* Year Badge */}
              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm px-4 py-2">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Released {displayMovies[activeDish].season}
                </span>
              </div>
            </div>
          </div>

          {/* Dish Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            {displayMovies.map((dish, index) => (
              <button
                key={dish.id}
                type="button"
                onClick={() => setActiveDish(index)}
                className={`w-full text-left p-6 md:p-8 transition-all duration-500 ${
                  activeDish === index 
                    ? "bg-background" 
                    : "bg-background/50 hover:bg-background/70"
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transitionProperty: "all",
                  transitionDuration: "0.8s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${0.2 + index * 0.1}s`
                }}
              >
                <div className="space-y-4">
                  {/* Dish Name */}
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-1">
                      {dish.name}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      {dish.subtitle}
                    </p>
                  </div>

                  {/* Description - Only show for active dish */}
                  <div 
                    className="overflow-hidden transition-all duration-500"
                    style={{ 
                      maxHeight: activeDish === index ? "300px" : "0",
                      opacity: activeDish === index ? 1 : 0
                    }}
                  >
                    <div className="space-y-4 pt-2">
                      <p className="text-sm leading-relaxed text-foreground/70">
                        {dish.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground uppercase tracking-wider">Genre:</span>
                        <span className="text-foreground/60">{dish.technique}</span>
                      </div>

                      {dish.awards.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-accent">{dish.awards[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <div 
                      className={`w-2 h-2 transition-all duration-500 ${
                        activeDish === index ? "bg-accent scale-125" : "bg-border"
                      }`} 
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Note */}
        <div 
          className="mt-16 md:mt-24 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionProperty: "all",
            transitionDuration: "0.8s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: "0.6s"
          }}
        >
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
            Our featured selection updates weekly. These films represent our curators&apos; picks, 
            but explore our full library to discover your next favorite.
          </p>
        </div>

        {/* Cinema Insights Table */}
        <CinemaInsightsTable />
      </div>
    </section>
  )
}
