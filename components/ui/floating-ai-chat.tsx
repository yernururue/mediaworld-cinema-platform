"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Film, X, Send } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant"
  content: string
}

// ─── Helpers ─────────────────────────────────────────────────
function formatMessage(content: string) {
  let html = content.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="text-foreground font-semibold">$1</strong>'
  )
  html = html.replace(/\n/g, "<br />")
  html = html.replace(
    /<br \/>\s*---\s*<br \/>/g,
    '<hr class="my-3 border-border/30" />'
  )
  return html
}

// ─── Typing Indicator ────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "oklch(0.75 0.18 200)",
            animation: "floatingChatPulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // ─── Send Message ────────────────────────────────────────
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
          history: messages.slice(-10),
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
          content:
            "Cinema intelligence is temporarily unavailable. Please try again.",
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
    "Recommend a dark sci-fi movie",
    "Something like Interstellar?",
    "Best emotional dramas",
    "Top Nolan films",
  ]

  return (
    <>
      {/* ── Global Keyframes ─────────────────────────────── */}
      <style jsx global>{`
        @keyframes floatingChatPulse {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes floatingBtnGlow {
          0%,
          100% {
            box-shadow: 0 0 15px 2px oklch(0.75 0.18 200 / 0.25),
              0 0 30px 4px oklch(0.75 0.18 200 / 0.1);
          }
          50% {
            box-shadow: 0 0 20px 4px oklch(0.75 0.18 200 / 0.4),
              0 0 40px 8px oklch(0.75 0.18 200 / 0.15);
          }
        }
        @keyframes floatingMsgSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* ── Floating Button ──────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8" ref={chatRef}>
        {/* Tooltip */}
        <div
          className={cn(
            "absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none transition-all duration-200",
            isHovered && !isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          )}
          style={{
            background: "oklch(0.18 0.02 260)",
            color: "oklch(0.85 0.01 260)",
            border: "1px solid oklch(0.30 0.02 260)",
          }}
        >
          AI Cinema Assistant
          <div
            className="absolute top-full right-5 w-2 h-2 rotate-45 -mt-1"
            style={{
              background: "oklch(0.18 0.02 260)",
              borderRight: "1px solid oklch(0.30 0.02 260)",
              borderBottom: "1px solid oklch(0.30 0.02 260)",
            }}
          />
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
            "w-12 h-12 md:w-14 md:h-14",
            isOpen && "scale-0 opacity-0 pointer-events-none"
          )}
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)",
            border: "1px solid oklch(0.75 0.18 200 / 0.3)",
            animation: "floatingBtnGlow 3s ease-in-out infinite",
            transform: isHovered && !isOpen ? "scale(1.05)" : undefined,
          }}
          aria-label="Open AI Cinema Assistant"
          id="floating-chat-btn"
        >
          <Film
            className="w-5 h-5 md:w-6 md:h-6"
            style={{ color: "oklch(0.75 0.18 200)" }}
          />
        </button>

        {/* ── Chat Window ──────────────────────────────── */}
        <div
          className={cn(
            "absolute bottom-0 right-0 flex flex-col overflow-hidden transition-all duration-300",
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[0.8] pointer-events-none"
          )}
          style={{
            width: "min(380px, 92vw)",
            height: "min(520px, 70vh)",
            background: "oklch(0.10 0.02 260 / 0.85)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid oklch(0.75 0.18 200 / 0.15)",
            borderRadius: "20px",
            boxShadow: `
              0 0 40px 8px oklch(0.75 0.18 200 / 0.08),
              0 25px 50px -12px oklch(0 0 0 / 0.5)
            `,
            transformOrigin: "bottom right",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* ─ Header ──────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-5 py-4 shrink-0"
            style={{
              borderBottom: "1px solid oklch(0.75 0.18 200 / 0.1)",
              background: "oklch(0.10 0.02 260 / 0.5)",
            }}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(0.20 0.03 200) 0%, oklch(0.15 0.02 260) 100%)",
                border: "1px solid oklch(0.75 0.18 200 / 0.2)",
              }}
            >
              <Film className="w-4 h-4" style={{ color: "oklch(0.75 0.18 200)" }} />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground leading-tight">
                Cinema AI Assistant
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#22c55e" }}
                />
                Online
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label="Close chat"
              id="floating-chat-close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ─ Messages ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.20 0.03 200) 0%, oklch(0.15 0.02 260) 100%)",
                    border: "1px solid oklch(0.75 0.18 200 / 0.15)",
                  }}
                >
                  <Film className="w-7 h-7" style={{ color: "oklch(0.75 0.18 200)" }} />
                </div>
                <p className="text-muted-foreground text-sm mb-5 max-w-[240px] leading-relaxed">
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
                      className="text-[11px] px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
                      style={{
                        border: "1px solid oklch(0.30 0.02 260)",
                        background: "oklch(0.15 0.02 260 / 0.5)",
                      }}
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
                style={{ animation: "floatingMsgSlide 0.3s ease-out forwards" }}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed",
                    msg.role === "user" ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"
                  )}
                  style={
                    msg.role === "user"
                      ? {
                          background: "oklch(0.75 0.18 200 / 0.15)",
                          border: "1px solid oklch(0.75 0.18 200 / 0.25)",
                          color: "oklch(0.92 0.01 260)",
                        }
                      : {
                          background: "oklch(0.16 0.02 260 / 0.8)",
                          border: "1px solid oklch(0.28 0.02 260)",
                          color: "oklch(0.85 0.01 260)",
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <div
                      className="prose-sm [&_strong]:text-foreground [&_hr]:border-border/30"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.content),
                      }}
                    />
                  ) : (
                    msg.content
                  )}

                  {/* Timestamp */}
                  <div
                    className={cn(
                      "text-[10px] mt-1.5 opacity-50",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-md"
                  style={{
                    background: "oklch(0.16 0.02 260 / 0.8)",
                    border: "1px solid oklch(0.28 0.02 260)",
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ─ Input Footer ────────────────────────────── */}
          <div
            className="shrink-0 px-4 py-3"
            style={{
              borderTop: "1px solid oklch(0.75 0.18 200 / 0.1)",
              background: "oklch(0.10 0.02 260 / 0.5)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full"
              style={{
                background: "oklch(0.14 0.02 260 / 0.8)",
                border: "1px solid oklch(0.28 0.02 260)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about movies..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none disabled:opacity-50"
                id="floating-chat-input"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-2 rounded-full transition-all duration-200 cursor-pointer",
                  input.trim() && !isLoading
                    ? "hover:bg-white/5"
                    : "opacity-30 cursor-not-allowed"
                )}
                style={{
                  color: input.trim() && !isLoading
                    ? "oklch(0.75 0.18 200)"
                    : "oklch(0.45 0.01 260)",
                }}
                aria-label="Send message"
                id="floating-chat-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
