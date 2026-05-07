"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/60"
          style={{
            animation: "chatPulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes chatPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

function formatMessage(content: string) {
  // Convert **bold** to <strong>
  let html = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
  // Convert line breaks
  html = html.replace(/\n/g, "<br />")
  // Convert --- to styled hr
  html = html.replace(/<br \/>\s*---\s*<br \/>/g, '<hr class="my-3 border-border/30" />')
  return html
}

export function ChatAssistantSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-10), // Keep last 10 for context
        }),
      })

      const data = await res.json()

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Cinema intelligence is temporarily unavailable. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = [
    "I want a dark sci-fi movie",
    "Recommend emotional dramas",
    "Something like Interstellar",
    "Best Nolan movies",
  ]

  return (
    <section
      ref={sectionRef}
      id="assistant-chat"
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
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">(05)</span>
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">AI Chat</span>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-10">
            {/* Header */}
            <div className="mb-12 md:mb-16 max-w-3xl">
              <h2
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground mb-6 text-pretty"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transitionProperty: "all",
                  transitionDuration: "0.8s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "0.1s",
                }}
              >
                Your AI Cinema Concierge
              </h2>
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transitionProperty: "all",
                  transitionDuration: "0.8s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: "0.2s",
                }}
              >
                Describe your mood, name a favorite film, or ask for a genre — our AI will curate the perfect recommendation for you.
              </p>
            </div>

            {/* Chat Container */}
            <div
              className="relative max-w-3xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transitionProperty: "all",
                transitionDuration: "0.8s",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "0.3s",
              }}
            >
              <div className="relative border border-border/40 bg-background/40 backdrop-blur-xl overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Chat Header Bar */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border/20 bg-background/30">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-30" />
                  </div>
                  <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium">
                    Cinema Concierge
                  </span>
                  <span className="text-xs text-muted-foreground/50 ml-auto font-mono">
                    AI-Powered
                  </span>
                </div>

                {/* Messages Area */}
                <div className="h-[400px] overflow-y-auto p-6 space-y-4 scrollbar-thin">
                  {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-4xl mb-4">🎬</div>
                      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                        Ask me anything about movies. I&apos;ll find the perfect film for your mood.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {quickPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => {
                              setInput(prompt)
                              inputRef.current?.focus()
                            }}
                            className="text-xs px-3 py-1.5 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                      style={{
                        animation: "msgSlide 0.3s ease-out forwards",
                      }}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-primary/15 text-foreground border border-primary/20"
                            : "bg-secondary/60 text-foreground/90 border border-border/20"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <div
                            className="prose-sm [&_strong]:text-foreground [&_hr]:border-border/30"
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/60 border border-border/20">
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border/20 bg-background/30 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Describe your mood or favorite movies..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none disabled:opacity-50"
                      id="chat-input"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "p-2.5 transition-all duration-300",
                        input.trim() && !isLoading
                          ? "text-primary hover:bg-primary/10"
                          : "text-muted-foreground/30 cursor-not-allowed"
                      )}
                      aria-label="Send message"
                      id="chat-send-btn"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message animation keyframes */}
      <style jsx global>{`
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
