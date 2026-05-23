"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { User } from "@supabase/supabase-js"

import { AuthButton } from "@/components/ui/auth-button"

export function Header({ user }: { user?: User | null }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Movies", href: "/movies" },
    { label: "Top Rated", href: "/#top-rated" },
    { label: "AI Assistant", href: "/#ai-assistant" },
    { label: "Featured", href: "/#featured" },
    { label: "Contact", href: "/#contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link 
            href="/" 
            className="relative group"
          >
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.1em] text-foreground">
              MEDIA<span className="text-primary">WORLD</span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Section: Auth */}
          <div className="hidden lg:flex items-center gap-8">
            <AuthButton user={user} />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span 
                className={cn(
                  "w-6 h-px bg-foreground transition-all duration-300",
                  isMobileMenuOpen && "rotate-45 translate-y-[4px]"
                )} 
              />
              <span 
                className={cn(
                  "w-6 h-px bg-foreground transition-all duration-300",
                  isMobileMenuOpen && "-rotate-45 -translate-y-[3px]"
                )} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-background transition-all duration-500 ease-out",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: isScrolled ? "81px" : "80px" }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 pb-20">
          {navItems.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif tracking-[0.1em] text-foreground hover:text-accent transition-colors duration-300"
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isMobileMenuOpen ? 1 : 0,
                transition: "all 0.5s ease-out"
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-4 text-sm tracking-[0.1em] uppercase text-primary-foreground bg-primary"
            style={{ 
              transitionDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : "0ms",
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: "all 0.5s ease-out"
            }}
          >
            Start Watching
          </Link>
        </nav>
      </div>
    </header>
  )
}
