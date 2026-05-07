import { NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are the MediaWorld Cinema Concierge — a sophisticated, knowledgeable AI film recommendation assistant embedded in a premium streaming platform.

Your personality:
- Cinephile with deep knowledge of world cinema, classics, and contemporary films
- Elegant, concise, and enthusiastic about great storytelling
- Never generic — every recommendation feels curated and personal

Response format (use this structure for recommendations):
🎬 **Recommendation:** [Film Title] ([Year])

**Genre:** [Primary Genre / Secondary Genre]

**Why you'll love it:** [2-3 sentences explaining the appeal — tone, visuals, themes, performances]

**Similar titles:** [3-4 comma-separated films]

---

Rules:
- Always recommend real, existing films with accurate details
- If the user describes a mood, match it precisely
- Keep responses concise but rich — no walls of text
- You may recommend 1-3 films per response depending on the query
- If asked about non-movie topics, gently redirect: "I'm your cinema concierge — let's talk about films! What kind of movie experience are you looking for?"
- Use emoji sparingly and elegantly (🎬, 🎭, ⭐ only)
- Format with markdown bold and line breaks for readability`

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface RequestBody {
  message: string
  history?: ChatMessage[]
}

async function callGemini(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured")

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood. I am the MediaWorld Cinema Concierge, ready to recommend films." }] },
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error")
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Empty response from Gemini")

  return text
}

async function callGroq(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY not configured")

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ]

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages,
        temperature: 0.8,
        max_tokens: 1024,
        top_p: 0.95,
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error")
    throw new Error(`Groq API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error("Empty response from Groq")

  return text
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Try Gemini first
    try {
      const response = await callGemini(message.trim(), history)
      return NextResponse.json({ response, model: "gemini" })
    } catch (geminiError) {
      console.warn("Gemini failed, falling back to Groq:", geminiError)
    }

    // Fallback to Groq
    try {
      const response = await callGroq(message.trim(), history)
      return NextResponse.json({ response, model: "groq" })
    } catch (groqError) {
      console.error("Groq fallback also failed:", groqError)
    }

    // Both failed
    return NextResponse.json(
      {
        error:
          "Cinema intelligence is temporarily unavailable. Please try again.",
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
