"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ImageReveal } from "@/components/ui/image-reveal"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY)
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-end overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <ImageReveal
          src="/images/hero.jpg"
          alt="Dramatic cinema hall with red velvet seats and cinematic lighting"
          priority
          className="object-cover object-center"
          sizes="100vw"
          delay={300}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
      </div>

      {/* Architectural Grid Lines */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div 
          className="absolute left-[10%] top-0 w-px h-full bg-foreground/5"
          style={{
            transform: `translateY(${-scrollY * 0.1}px)`,
          }}
        />
        <div 
          className="absolute left-[30%] top-0 w-px h-full bg-foreground/5"
          style={{
            transform: `translateY(${-scrollY * 0.15}px)`,
          }}
        />
        <div 
          className="absolute right-[20%] top-0 w-px h-full bg-foreground/5"
          style={{
            transform: `translateY(${-scrollY * 0.08}px)`,
          }}
        />
        <div 
          className="absolute top-[40%] left-0 w-full h-px bg-foreground/5"
          style={{
            transform: `translateX(${scrollY * 0.05}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 pb-16 md:pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Main Headline */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              <h1 
                className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold leading-[0.9] tracking-[-0.02em] text-foreground"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                  opacity: isLoaded ? 1 : 0,
                  transitionProperty: "all",
                  transitionDuration: "1s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "0.3s"
                }}
              >
                <span className="block text-pretty">Experience cinema</span>
                <span className="block text-pretty">like never</span>
                <span className="block text-primary italic">before</span>
              </h1>
            </div>
          </div>

          {/* Supporting Text */}
          <div className="lg:col-span-4 lg:pb-4">
            <div 
              className="space-y-6"
              style={{
                transform: isLoaded ? "translateY(0)" : "translateY(40px)",
                opacity: isLoaded ? 1 : 0,
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.6s"
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-primary" />
                <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Est. 2024</span>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-md">
                Your gateway to blockbuster hits, indie gems, and AI-powered recommendations tailored to your taste.
              </p>
              <div className="pt-2">
                <Link 
                  href="#featured"
                  className="inline-flex items-center gap-3 group text-sm tracking-[0.1em] uppercase text-foreground"
                >
                  <span className="bg-primary my-0 py-3 text-primary-foreground px-4 rounded-sm hover:bg-primary/90 transition-colors">Browse Collection</span>
                  
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
          style={{
            opacity: isLoaded ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: "1s",
            transitionTimingFunction: "ease",
            transitionDelay: "1.2s"
          }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/40 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 w-full bg-accent animate-pulse" style={{ animation: "scrollPulse 2s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Corner Decorative Element */}
      <div 
        className="absolute top-32 right-6 md:right-12 lg:right-20 z-20 hidden md:block"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateX(0)" : "translateX(20px)",
          transitionProperty: "all",
          transitionDuration: "0.8s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: "0.9s"
        }}
      >
        <div className="flex items-center gap-4 text-xs tracking-[0.2em] uppercase text-muted-foreground">
          <span>4K Ultra HD</span>
          <div className="w-8 h-px bg-border" />
          <span>Dolby Atmos</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  )
}
