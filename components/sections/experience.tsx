"use client"

import { useEffect, useRef, useState } from "react"
import { ImageReveal } from "@/components/ui/image-reveal"

export function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
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

  const steps = [
    {
      course: "Discover",
      timing: "Step 1",
      title: "Tell Us Your Mood",
      description: "Simply describe what you're in the mood for—whether it's a thrilling mystery, a heartwarming romance, or an edge-of-your-seat action flick. Our AI understands natural language.",
      details: ["Voice or text input", "Mood detection", "Genre preferences", "Watch history analysis"]
    },
    {
      course: "Analyze",
      timing: "Step 2", 
      title: "AI Processing",
      description: "Our advanced algorithms analyze your request against millions of titles, cross-referencing ratings, themes, pacing, and cinematography to find your perfect match.",
      details: ["Machine learning", "Sentiment analysis", "Pattern recognition", "Real-time processing"]
    },
    {
      course: "Curate",
      timing: "Step 3",
      title: "Personalized Selection",
      description: "Receive a hand-picked selection of films tailored specifically to your taste. Each recommendation includes why we think you'll love it and similar titles to explore.",
      details: ["Top 10 matches", "Match percentage", "Detailed explanations", "Alternative suggestions"]
    },
    {
      course: "Enjoy",
      timing: "Step 4",
      title: "Watch & Refine",
      description: "Start streaming instantly in stunning 4K HDR. Rate what you watch and our AI learns, making future recommendations even more accurate and personal.",
      details: ["Instant streaming", "4K HDR quality", "Continuous learning", "Watchlist sync"]
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="ai-assistant"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-12 lg:gap-20">
          {/* Section Label */}
          <div className="lg:col-span-2">
            <div 
              className="flex items-center gap-4 lg:sticky lg:top-32"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">(03)</span>
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">AI Assistant</span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-10">
            {/* Section Header */}
            <div className="mb-20 md:mb-32 max-w-3xl">
              <h2 
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground mb-8 text-pretty"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.1s"
              }}
              >
                Your personal AI film curator in four simple steps
              </h2>
              <p 
                className="text-lg text-muted-foreground leading-relaxed"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.2s"
              }}
              >
                Our AI-powered recommendation engine learns your unique taste profile and suggests films you&apos;ll love. The more you watch, the smarter it gets.
              </p>
            </div>

            {/* Experience Image */}
            <div 
              className="relative aspect-[16/9] mb-20 md:mb-32 overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.25s"
              }}
            >
              <ImageReveal
                src="/images/plating-1.jpg"
                alt="AI-powered streaming interface with movie recommendations"
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                delay={250}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            {/* Experience Steps */}
            <div className="space-y-0">
              {steps.map((step, index) => (
                <div 
                  key={step.course}
                  className="group border-t border-border"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transitionProperty: "all",
                    transitionDuration: "0.8s",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${0.3 + index * 0.1}s`
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                    className="w-full py-8 md:py-12 text-left"
                    aria-expanded={activeStep === index}
                  >
                    <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                      {/* Course Number & Name */}
                      <div className="md:col-span-3 flex items-center gap-4">
                        <span className="font-mono text-xs tracking-wider text-muted-foreground">
                          0{index + 1}
                        </span>
                        <span className="font-serif text-xl md:text-2xl text-foreground group-hover:text-accent transition-colors duration-300">
                          {step.course}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="md:col-span-6">
                        <h3 className="text-lg md:text-xl text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                          {step.title}
                        </h3>
                      </div>

                      {/* Timing & Toggle */}
                      <div className="md:col-span-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {step.timing}
                        </span>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <span 
                            className="text-lg text-muted-foreground transition-transform duration-300"
                            style={{ transform: activeStep === index ? "rotate(45deg)" : "rotate(0)" }}
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <div 
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{ 
                      maxHeight: activeStep === index ? "400px" : "0",
                      opacity: activeStep === index ? 1 : 0
                    }}
                  >
                    <div className="pb-12 md:pb-16 grid md:grid-cols-12 gap-8">
                      <div className="md:col-span-3" />
                      <div className="md:col-span-6 space-y-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <ul className="grid grid-cols-2 gap-3">
                          {step.details.map((detail) => (
                            <li key={detail} className="flex items-center gap-2 text-sm text-foreground/70">
                              <span className="w-1 h-1 bg-accent" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-border" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
